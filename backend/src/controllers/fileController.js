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
    const fileType = req.query.type || 'submission'; // 'submission' or 'payment'

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    let fileUrl, fileMetadata;
    if (fileType === 'payment') {
      fileUrl = registration.paymentScreenshotUrl;
      fileMetadata = registration.paymentFileMetadata;
    } else {
      fileUrl = registration.submissionFileUrl;
      fileMetadata = registration.fileMetadata;
    }

    // Check if file exists
    if (!fileUrl) {
      return res.status(404).json({
        success: false,
        error: `No ${fileType} file attached to this registration`
      });
    }

    // Handle backward compatibility for old direct Cloudinary URLs
    if (fileUrl.startsWith('http')) {
      console.log('Redirecting to legacy Cloudinary URL for registration:', registrationId);
      return res.redirect(fileUrl);
    }

    // Prepare object for storage provider (it expects certain fields)
    const fileInfo = {
      ...registration.toObject(),
      fileMetadata: fileMetadata, // Override with correct metadata
      submissionFileName: fileType === 'payment' ? registration.paymentScreenshotName : registration.submissionFileName,
      submissionFileType: fileType === 'payment' ? registration.paymentScreenshotType : registration.submissionFileType,
      // Helper for LocalProvider which might look at name/type directly
      name: fileType === 'payment' ? registration.paymentScreenshotName : registration.submissionFileName,
      type: fileType === 'payment' ? registration.paymentScreenshotType : registration.submissionFileType,
    };

    // Get file from storage provider
    const fileData = await downloadFile(fileInfo);

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
 * Download payment screenshot
 * GET /api/files/:registrationId/payment
 */
const downloadPaymentScreenshot = async (req, res, next) => {
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

    const fileUrl = registration.paymentScreenshotUrl;
    const fileMetadata = registration.paymentFileMetadata;

    // Check if file exists
    if (!fileUrl) {
      return res.status(404).json({
        success: false,
        error: 'No payment screenshot attached to this registration'
      });
    }

    // Handle backward compatibility for old direct Cloudinary URLs
    if (fileUrl.startsWith('http') && !fileUrl.includes('/api/files')) {
      console.log('Redirecting to legacy Cloudinary URL for registration:', registrationId);
      return res.redirect(fileUrl);
    }

    // Prepare object for storage provider
    const fileInfo = {
      ...registration.toObject(),
      fileMetadata: fileMetadata, // Override with correct metadata
      submissionFileName: registration.paymentScreenshotName,
      submissionFileType: registration.paymentScreenshotType,
      name: registration.paymentScreenshotName,
      type: registration.paymentScreenshotType,
    };

    // Get file from storage provider
    const fileData = await downloadFile(fileInfo);

    // Set appropriate headers
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileData.fileName)}"`);

    if (fileData.size) {
      res.setHeader('Content-Length', fileData.size);
    }

    // Cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    res.setHeader('ETag', `"${registrationId}-${registration.paymentUploadedAt}"`);

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
    console.log(`Payment screenshot downloaded: ${fileData.fileName} (${fileData.size} bytes) for registration ${registrationId}`);

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
    const fileType = req.query.type || 'submission'; // 'submission' or 'payment'

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    let fileUrl, fileMetadata;
    if (fileType === 'payment') {
      fileUrl = registration.paymentScreenshotUrl;
      fileMetadata = registration.paymentFileMetadata;
    } else {
      fileUrl = registration.submissionFileUrl;
      fileMetadata = registration.fileMetadata;
    }

    // Check if file exists
    if (!fileUrl) {
      return res.status(404).json({
        success: false,
        error: `No ${fileType} file attached to this registration`
      });
    }

    // Prepare object for storage provider
    const fileInfo = {
      ...registration.toObject(),
      fileMetadata: fileMetadata,
      submissionFileName: fileType === 'payment' ? registration.paymentScreenshotName : registration.submissionFileName,
      submissionFileType: fileType === 'payment' ? registration.paymentScreenshotType : registration.submissionFileType,
      name: fileType === 'payment' ? registration.paymentScreenshotName : registration.submissionFileName,
      type: fileType === 'payment' ? registration.paymentScreenshotType : registration.submissionFileType,
    };

    // Get file from storage provider
    const fileData = await downloadFile(fileInfo);

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
  downloadPaymentScreenshot,
  getFileMetadata
};
