/**
 * File Validation Utilities
 * Ported from frontend src/lib/storage.ts
 * Validates file size, MIME type, extension, and magic numbers
 */

// Get max file size from environment or default to 50MB
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10);
const MAX_FILE_SIZE_BYTES = parseInt(process.env.MAX_FILE_SIZE_BYTES || '52428800', 10);

// Allowed MIME types for submissions
const ALLOWED_MIME_TYPES = [
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Images
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

// File extension to MIME type mapping
const EXTENSION_TO_MIME = {
  'zip': ['application/zip', 'application/x-zip-compressed'],
  'pdf': ['application/pdf'],
  'doc': ['application/msword'],
  'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'ppt': ['application/vnd.ms-powerpoint'],
  'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  'png': ['image/png'],
  'jpg': ['image/jpeg'],
  'jpeg': ['image/jpeg'],
  'gif': ['image/gif'],
  'webp': ['image/webp'],
  'svg': ['image/svg+xml'],
};

// Magic numbers for file type validation (first few bytes of files)
const MAGIC_NUMBERS = {
  'application/zip': [0x50, 0x4B],
  'application/x-zip-compressed': [0x50, 0x4B],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/jpg': [0xFF, 0xD8, 0xFF],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

/**
 * Validate file size
 */
const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File appears to be empty. Please select a valid file.',
    };
  }

  return { valid: true };
};

/**
 * Validate file type by MIME type
 */
const validateFileType = (file) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'File type not supported. Accepted: ZIP, PDF, PPTX, DOC, DOCX, PNG, JPG, GIF, WebP, SVG',
    };
  }

  return { valid: true };
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Validate file extension matches MIME type
 */
const validateFileExtension = (file) => {
  const extension = getFileExtension(file.originalname);

  if (!extension) {
    return {
      valid: false,
      error: 'File has no extension. Please ensure file has valid extension (e.g., .zip, .pdf).',
    };
  }

  const expectedMimeTypes = EXTENSION_TO_MIME[extension];

  if (!expectedMimeTypes) {
    return {
      valid: false,
      error: `File extension ".${extension}" is not supported.`,
    };
  }

  if (!expectedMimeTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `File extension ".${extension}" doesn't match file type. File may be corrupted.`,
    };
  }

  return { valid: true };
};

/**
 * Validate file by checking magic numbers (file header bytes)
 * This prevents MIME type spoofing
 */
const validateFileMagicNumber = (file) => {
  // Get expected magic numbers for this MIME type
  const expectedMagicNumbers = MAGIC_NUMBERS[file.mimetype];

  if (!expectedMagicNumbers) {
    // If we don't have magic numbers for this type, skip validation
    return { valid: true };
  }

  try {
    // Read the first few bytes from buffer
    const buffer = file.buffer;
    const bytes = buffer.slice(0, 8); // Get first 8 bytes

    // Check if the file starts with expected magic numbers
    const matches = expectedMagicNumbers.every((expectedByte, index) => bytes[index] === expectedByte);

    if (!matches) {
      return {
        valid: false,
        error: 'File content doesn\'t match its type. File may be corrupted or mislabeled.',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating file magic numbers:', error);
    // Don't block upload if we can't read the file
    return { valid: true };
  }
};

/**
 * Sanitize filename to prevent security issues
 * Removes special characters, path traversal attempts, and spaces
 */
const sanitizeFilename = (filename) => {
  // Get extension
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

  // Remove or replace problematic characters
  let sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

  // Ensure filename isn't empty
  if (!sanitized) {
    sanitized = 'file';
  }

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  return extension ? `${sanitized}.${extension}` : sanitized;
};

/**
 * Comprehensive file validation
 * Runs all validation checks
 */
const validateFile = (file) => {
  // Check file size
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  // Check MIME type
  const typeCheck = validateFileType(file);
  if (!typeCheck.valid) return typeCheck;

  // Check extension matches MIME
  const extensionCheck = validateFileExtension(file);
  if (!extensionCheck.valid) return extensionCheck;

  // Check magic numbers
  const magicNumberCheck = validateFileMagicNumber(file);
  if (!magicNumberCheck.valid) return magicNumberCheck;

  return { valid: true };
};

/**
 * Format file size in human-readable format
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

module.exports = {
  ALLOWED_MIME_TYPES,
  EXTENSION_TO_MIME,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  validateFileSize,
  validateFileType,
  validateFileExtension,
  validateFileMagicNumber,
  validateFile,
  sanitizeFilename,
  formatFileSize,
  getFileExtension
};
