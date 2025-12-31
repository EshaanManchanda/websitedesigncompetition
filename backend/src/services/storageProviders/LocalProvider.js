const BaseStorageProvider = require('./BaseStorageProvider');
const { sanitizeFilename } = require('../../utils/fileValidation');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * Local File System Storage Provider
 * Implements file storage using local file system
 */
class LocalProvider extends BaseStorageProvider {
  constructor() {
    super();
    this.basePath = process.env.LOCAL_STORAGE_PATH || './uploads/submissions';
    this.baseUrl = process.env.LOCAL_STORAGE_URL || 'http://localhost:5050';
  }

  /**
   * Ensure directory exists
   * @param {String} dirPath - Directory path
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Upload file to local storage
   * @param {Object} file - Multer file object
   * @param {String} registrationId - Registration ID for folder organization
   * @returns {Promise<Object>} File metadata
   */
  async uploadFile(file, registrationId) {
    try {
      const sanitized = sanitizeFilename(file.originalname);
      const timestamp = Date.now();
      const fileName = `${timestamp}_${sanitized}`;

      // Create directory for this registration
      const registrationDir = path.join(this.basePath, registrationId);
      await this.ensureDirectory(registrationDir);

      // Full file path
      const filePath = path.join(registrationDir, fileName);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Get file stats
      const stats = await fs.stat(filePath);

      return {
        provider: 'local',
        url: `/api/files/${registrationId}/download`, // Proxy URL (will be stored in submissionFileUrl)
        path: filePath,
        relativePath: path.join(registrationId, fileName),
        name: sanitized,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString(),
        metadata: {
          registrationId,
          fileName,
          fileSize: stats.size,
          created: stats.birthtime,
          path: filePath,                                  // Store actual file path in metadata
          relativePath: path.join(registrationId, fileName) // Relative path for portability
        }
      };
    } catch (error) {
      console.error('Local storage upload error:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Download file from local storage
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File stream and metadata
   */
  async downloadFile(fileInfo) {
    try {
      // Get file path from metadata
      const filePath = fileInfo.fileMetadata?.path ||
                      path.join(this.basePath, fileInfo.fileMetadata?.relativePath);

      const fileName = fileInfo.submissionFileName || fileInfo.name;
      const mimeType = fileInfo.submissionFileType || fileInfo.type;

      // Check if file exists
      await fs.access(filePath);

      // Get file stats
      const stats = await fs.stat(filePath);

      // Create read stream
      const stream = fsSync.createReadStream(filePath);

      return {
        stream,
        mimeType: mimeType || 'application/octet-stream',
        fileName: fileName || 'download',
        size: stats.size
      };
    } catch (error) {
      console.error('Local storage download error:', error);
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  /**
   * Delete file from local storage
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Boolean>} Success status
   */
  async deleteFile(fileInfo) {
    try {
      const filePath = fileInfo.fileMetadata?.path ||
                      path.join(this.basePath, fileInfo.fileMetadata?.relativePath);

      // Delete the file
      await fs.unlink(filePath);

      console.log(`File deleted from local storage: ${filePath}`);

      // Try to delete empty directory (will fail if not empty, which is fine)
      try {
        const dirPath = path.dirname(filePath);
        await fs.rmdir(dirPath);
        console.log(`Empty directory removed: ${dirPath}`);
      } catch (err) {
        // Directory not empty or other error - ignore
      }

      return true;
    } catch (error) {
      console.error('Local storage deletion error:', error);
      if (error.code === 'ENOENT') {
        console.warn('File already deleted or does not exist');
        return true; // Consider it success if file doesn't exist
      }
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Get file info from local storage
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(fileInfo) {
    try {
      const filePath = fileInfo.fileMetadata?.path ||
                      path.join(this.basePath, fileInfo.fileMetadata?.relativePath);

      // Check if file exists and get stats
      const stats = await fs.stat(filePath);

      return {
        path: filePath,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        exists: true
      };
    } catch (error) {
      console.error('Local storage get file info error:', error);
      if (error.code === 'ENOENT') {
        return {
          exists: false,
          error: 'File not found'
        };
      }
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * Get provider name
   * @returns {String} Provider name
   */
  getProviderName() {
    return 'local';
  }
}

module.exports = LocalProvider;
