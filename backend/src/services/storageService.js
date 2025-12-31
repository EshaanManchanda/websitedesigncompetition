const CloudinaryProvider = require('./storageProviders/CloudinaryProvider');
const LocalProvider = require('./storageProviders/LocalProvider');

/**
 * Storage Service Factory
 * Handles file upload, deletion, and download using configurable storage providers
 */

// Storage provider instance (singleton)
let storageProvider = null;

/**
 * Get storage provider based on environment configuration
 * @returns {BaseStorageProvider} Storage provider instance
 */
const getStorageProvider = () => {
  if (storageProvider) {
    return storageProvider;
  }

  const providerType = process.env.UPLOAD_PROVIDER || 'cloudinary';

  switch (providerType.toLowerCase()) {
    case 'cloudinary':
      console.log('Using Cloudinary storage provider');
      storageProvider = new CloudinaryProvider();
      break;
    case 'local':
      console.log('Using Local file system storage provider');
      storageProvider = new LocalProvider();
      break;
    default:
      console.warn(`Unknown storage provider: ${providerType}, defaulting to Cloudinary`);
      storageProvider = new CloudinaryProvider();
  }

  return storageProvider;
};

/**
 * Upload file using configured storage provider
 * @param {Object} file - Multer file object
 * @param {String} registrationId - Registration ID for folder organization
 * @returns {Promise<Object>} Upload result with URL and metadata
 */
const uploadFile = async (file, registrationId) => {
  const provider = getStorageProvider();
  return await provider.uploadFile(file, registrationId);
};

/**
 * Download file using configured storage provider
 * @param {Object} fileInfo - File metadata from database
 * @returns {Promise<Object>} File stream and metadata
 */
const downloadFile = async (fileInfo) => {
  const provider = getStorageProvider();
  return await provider.downloadFile(fileInfo);
};

/**
 * Delete file using configured storage provider
 * @param {Object} fileInfo - File metadata from database
 * @returns {Promise<Boolean>} Success status
 */
const deleteFile = async (fileInfo) => {
  const provider = getStorageProvider();
  return await provider.deleteFile(fileInfo);
};

/**
 * Get file info using configured storage provider
 * @param {Object} fileInfo - File metadata from database
 * @returns {Promise<Object>} File information
 */
const getFileInfo = async (fileInfo) => {
  const provider = getStorageProvider();
  return await provider.getFileInfo(fileInfo);
};

/**
 * Get current storage provider name
 * @returns {String} Provider name
 */
const getProviderName = () => {
  const provider = getStorageProvider();
  return provider.getProviderName();
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  getFileInfo,
  getProviderName,
  getStorageProvider
};
