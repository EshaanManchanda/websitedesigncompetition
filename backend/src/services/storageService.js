const { cloudinary } = require('../config/cloudinary');
const { sanitizeFilename, formatFileSize } = require('../utils/fileValidation');

/**
 * Storage Service for Cloudinary
 * Handles file upload, deletion, and URL generation
 */

/**
 * Upload file to Cloudinary
 * @param {Object} file - Multer file object
 * @param {string} registrationId - Registration ID for folder organization
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
const uploadFile = async (file, registrationId) => {
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
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || 'kids-competition',
          public_id: publicId,
          resource_type: resourceType,
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
      url: result.secure_url,
      publicId: result.public_id,
      name: sanitized,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString(),
      cloudinaryData: {
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
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFile = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      console.log(`File deleted from Cloudinary: ${publicId}`);
      return { success: true, result };
    } else {
      console.warn(`File deletion returned: ${result.result} for ${publicId}`);
      return { success: false, result };
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type
 * @returns {Promise<Object>} - File info
 */
const getFileInfo = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
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
};

/**
 * Generate a temporary download URL (valid for a limited time)
 * @param {string} publicId - Cloudinary public ID
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {string} - Temporary URL
 */
const generateTempURL = (publicId, expiresIn = 3600) => {
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

  return cloudinary.url(publicId, {
    type: 'authenticated',
    sign_url: true,
    expires_at: timestamp
  });
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileInfo,
  generateTempURL
};
