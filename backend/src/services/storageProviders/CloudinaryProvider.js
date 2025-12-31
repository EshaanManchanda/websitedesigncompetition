const BaseStorageProvider = require('./BaseStorageProvider');
const { cloudinary } = require('../../config/cloudinary');
const { sanitizeFilename } = require('../../utils/fileValidation');
const https = require('https');

/**
 * Cloudinary Storage Provider
 * Implements file storage using Cloudinary CDN
 */
class CloudinaryProvider extends BaseStorageProvider {
  constructor() {
    super();
    this.cloudinary = cloudinary;
  }

  /**
   * Upload file to Cloudinary
   * @param {Object} file - Multer file object
   * @param {String} registrationId - Registration ID for folder organization
   * @returns {Promise<Object>} File metadata
   */
  async uploadFile(file, registrationId) {
    try {
      const sanitized = sanitizeFilename(file.originalname);
      const timestamp = Date.now();
      const publicId = `${registrationId}/${timestamp}_${sanitized}`;

      // Determine resource type based on MIME type
      let resourceType = 'auto';
      if (file.mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        resourceType = 'video';
      } else {
        resourceType = 'raw'; // For PDFs, ZIPs, documents
      }

      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_FOLDER || 'kids-competition',
            public_id: publicId,
            resource_type: resourceType,
            type: 'upload',                                    // Explicit upload type for public delivery
            access_mode: 'public',                             // Make files publicly accessible
            // Add tags for better organization
            tags: ['competition-submission', `registration-${registrationId}`]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Write buffer to stream
        uploadStream.end(file.buffer);
      });

      return {
        provider: 'cloudinary',
        url: result.secure_url,
        publicId: result.public_id,
        name: sanitized,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString(),
        metadata: {
          assetId: result.asset_id,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes
        }
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Download file from Cloudinary using signed URLs
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File stream and metadata
   */
  async downloadFile(fileInfo) {
    try {
      const publicId = fileInfo.cloudinaryPublicId;

      if (!publicId) {
        throw new Error('No Cloudinary public ID found. Unable to download file.');
      }

      const resourceType = fileInfo.fileMetadata?.resourceType || 'raw';
      const mimeType = fileInfo.submissionFileType || fileInfo.type;
      const fileName = fileInfo.submissionFileName || fileInfo.name;

      console.log(`Downloading file from Cloudinary: ${publicId}`);

      // WORKAROUND: Download via Cloudinary's download API with authentication
      // This uses the Admin API to fetch the file bytes directly
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      // Create download URL using Cloudinary's download endpoint
      // Format: https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/download
      const downloadApiUrl = `https://${apiKey}:${apiSecret}@api.cloudinary.com/v1_1/${cloudName}/${resourceType}/download?public_id=${encodeURIComponent(publicId)}`;

      console.log(`Using Cloudinary download API for authenticated access`);

      return new Promise((resolve, reject) => {
        https.get(downloadApiUrl, (response) => {
          // Handle redirects (Cloudinary may redirect to actual file)
          if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
            const redirectUrl = response.headers.location;
            console.log(`Following redirect to file location...`);

            https.get(redirectUrl, (redirectResponse) => {
              if (redirectResponse.statusCode !== 200) {
                reject(new Error(`Failed to download after redirect: ${redirectResponse.statusCode}`));
                return;
              }

              resolve({
                stream: redirectResponse,
                mimeType: mimeType || 'application/octet-stream',
                fileName: fileName || 'download',
                size: parseInt(redirectResponse.headers['content-length'] || '0', 10)
              });
            }).on('error', reject);

            return;
          }

          if (response.statusCode !== 200) {
            reject(new Error(`Cloudinary download API returned: ${response.statusCode}`));
            return;
          }

          resolve({
            stream: response,
            mimeType: mimeType || 'application/octet-stream',
            fileName: fileName || 'download',
            size: parseInt(response.headers['content-length'] || '0', 10)
          });
        }).on('error', (error) => {
          reject(new Error(`Download failed: ${error.message}`));
        });
      });

    } catch (error) {
      console.error('Cloudinary download error:', error);
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Boolean>} Success status
   */
  async deleteFile(fileInfo) {
    try {
      const publicId = fileInfo.cloudinaryPublicId || fileInfo.publicId;
      const resourceType = fileInfo.metadata?.resourceType || 'raw';

      const result = await this.cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });

      if (result.result === 'ok') {
        console.log(`File deleted from Cloudinary: ${publicId}`);
        return true;
      } else {
        console.warn(`File deletion returned: ${result.result} for ${publicId}`);
        return false;
      }
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Get file info from Cloudinary
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(fileInfo) {
    try {
      const publicId = fileInfo.cloudinaryPublicId || fileInfo.publicId;
      const resourceType = fileInfo.metadata?.resourceType || 'raw';

      const result = await this.cloudinary.api.resource(publicId, {
        resource_type: resourceType
      });

      return {
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
        resourceType: result.resource_type
      };
    } catch (error) {
      console.error('Cloudinary get file info error:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * Generate a temporary download URL (valid for a limited time)
   * @param {String} publicId - Cloudinary public ID
   * @param {Number} expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns {String} Temporary URL
   */
  generateTempURL(publicId, expiresIn = 3600) {
    const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

    return this.cloudinary.url(publicId, {
      type: 'authenticated',
      sign_url: true,
      expires_at: timestamp
    });
  }

  /**
   * Get provider name
   * @returns {String} Provider name
   */
  getProviderName() {
    return 'cloudinary';
  }
}

module.exports = CloudinaryProvider;
