const Registration = require('../models/Registration');
const { downloadFile } = require('../services/storageService');

/**
 * File Controller
 * Handles file download operations with proper content-type headers
 */

/**
 * Download file for a registration
 * GET /api/files/:registrationId/download
 */
const downloadRegistrationFile = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    // Check if file exists
    if (!registration.submissionFileUrl) {
      return res.status(404).json({
        success: false,
        error: 'No file attached to this registration'
      });
    }

    // Handle backward compatibility for old direct Cloudinary URLs
    if (registration.submissionFileUrl.startsWith('http')) {
      console.log('Redirecting to legacy Cloudinary URL for registration:', registrationId);
      return res.redirect(registration.submissionFileUrl);
    }

    // Get file from storage provider
    const fileData = await downloadFile(registration);

    // Set appropriate headers
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileData.fileName)}"`);

    if (fileData.size) {
      res.setHeader('Content-Length', fileData.size);
    }

    // Cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    res.setHeader('ETag', `"${registrationId}-${registration.submissionUploadedAt}"`);

    // Stream file to response
    fileData.stream.pipe(res);

    // Handle stream errors
    fileData.stream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to stream file'
        });
      }
    });

    // Log download
    console.log(`File downloaded: ${fileData.fileName} (${fileData.size} bytes) for registration ${registrationId}`);

  } catch (error) {
    console.error('File download error:', error);

    if (error.message === 'File not found') {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    next(error);
  }
};

/**
 * Download file with custom filename (force download instead of inline)
 * GET /api/files/:registrationId/download-attachment
 */
const downloadAsAttachment = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    // Check if file exists
    if (!registration.submissionFileUrl) {
      return res.status(404).json({
        success: false,
        error: 'No file attached to this registration'
      });
    }

    // Get file from storage provider
    const fileData = await downloadFile(registration);

    // Set headers for download (attachment instead of inline)
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileData.fileName)}"`);

    if (fileData.size) {
      res.setHeader('Content-Length', fileData.size);
    }

    // Stream file to response
    fileData.stream.pipe(res);

    // Handle stream errors
    fileData.stream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to stream file'
        });
      }
    });

    // Log download
    console.log(`File downloaded as attachment: ${fileData.fileName} for registration ${registrationId}`);

  } catch (error) {
    console.error('File download error:', error);

    if (error.message === 'File not found') {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    next(error);
  }
};

/**
 * Get file metadata (without downloading)
 * GET /api/files/:registrationId/info
 */
const getFileMetadata = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    // Check if file exists
    if (!registration.submissionFileUrl) {
      return res.status(404).json({
        success: false,
        error: 'No file attached to this registration'
      });
    }

    // Return file metadata
    res.json({
      success: true,
      data: {
        fileName: registration.submissionFileName,
        fileSize: registration.submissionFileSize,
        fileType: registration.submissionFileType,
        uploadedAt: registration.submissionUploadedAt,
        uploadProvider: registration.uploadProvider || 'cloudinary',
        downloadUrl: `/api/files/${registrationId}/download`
      }
    });

  } catch (error) {
    console.error('Get file metadata error:', error);
    next(error);
  }
};

module.exports = {
  downloadRegistrationFile,
  downloadAsAttachment,
  getFileMetadata
};
