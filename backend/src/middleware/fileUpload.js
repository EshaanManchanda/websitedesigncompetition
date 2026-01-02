const multer = require('multer');
const { validateFile, MAX_FILE_SIZE_BYTES } = require('../utils/fileValidation');

/**
 * File Upload Middleware using Multer
 * Handles multipart/form-data with file validation
 */

// Use memory storage to keep files in buffer (needed for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Basic MIME type check (more detailed validation happens after upload)
  const allowedMimes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Accepted: ZIP, PDF, PPTX, DOC, DOCX, PNG, JPG, GIF, WebP, SVG'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 5 // Allow multiple files (submission + payment + etc)
  }
});

/**
 * Middleware to handle single file upload with validation
 */
const uploadSingleFile = (fieldName = 'submissionFile') => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);

    uploadHandler(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // If file was uploaded, perform detailed validation
      if (req.file) {
        const validation = validateFile(req.file);

        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            error: validation.error
          });
        }
      }

      // File is valid or no file uploaded, continue
      next();
    });
  };
};

/**
 * Middleware to handle multiple file fields with validation
 * @param {Array} fields - Array of objects { name: 'fieldname', maxCount: 1 }
 */
const uploadMultipleFields = (fields) => {
  return (req, res, next) => {
    const uploadHandler = upload.fields(fields);

    uploadHandler(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Validate all uploaded files
      if (req.files) {
        const allFiles = Object.values(req.files).flat();

        for (const file of allFiles) {
          const validation = validateFile(file);
          if (!validation.valid) {
            return res.status(400).json({
              success: false,
              error: `File ${file.originalname}: ${validation.error}`
            });
          }
        }
      }

      next();
    });
  };
};

module.exports = {
  upload,
  uploadSingleFile,
  uploadMultipleFields
};
