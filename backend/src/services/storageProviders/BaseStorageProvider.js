/**
 * Base Storage Provider
 * Abstract class defining the interface for all storage providers
 */

class BaseStorageProvider {
  constructor() {
    if (new.target === BaseStorageProvider) {
      throw new TypeError('Cannot construct BaseStorageProvider instances directly');
    }
  }

  /**
   * Upload a file to storage
   * @param {Object} file - Multer file object
   * @param {String} registrationId - Registration ID for organizing files
   * @returns {Promise<Object>} File metadata
   */
  async uploadFile(file, registrationId) {
    throw new Error('uploadFile() must be implemented by subclass');
  }

  /**
   * Download a file from storage
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File stream and metadata
   */
  async downloadFile(fileInfo) {
    throw new Error('downloadFile() must be implemented by subclass');
  }

  /**
   * Delete a file from storage
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Boolean>} Success status
   */
  async deleteFile(fileInfo) {
    throw new Error('deleteFile() must be implemented by subclass');
  }

  /**
   * Get file information
   * @param {Object} fileInfo - File metadata from database
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(fileInfo) {
    throw new Error('getFileInfo() must be implemented by subclass');
  }

  /**
   * Get provider name
   * @returns {String} Provider name
   */
  getProviderName() {
    throw new Error('getProviderName() must be implemented by subclass');
  }
}

module.exports = BaseStorageProvider;
