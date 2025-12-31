const express = require('express');
const router = express.Router();
const {
  downloadRegistrationFile,
  downloadAsAttachment,
  getFileMetadata
} = require('../controllers/fileController');

/**
 * File Routes
 * Routes for downloading and accessing uploaded files
 */

/**
 * @route   GET /api/files/:registrationId/download
 * @desc    Download file (inline - opens in browser)
 * @access  Public (can be restricted later with authentication middleware)
 */
router.get('/:registrationId/download', downloadRegistrationFile);

/**
 * @route   GET /api/files/:registrationId/download-attachment
 * @desc    Download file as attachment (forces download)
 * @access  Public (can be restricted later with authentication middleware)
 */
router.get('/:registrationId/download-attachment', downloadAsAttachment);

/**
 * @route   GET /api/files/:registrationId/info
 * @desc    Get file metadata without downloading
 * @access  Public (can be restricted later with authentication middleware)
 */
router.get('/:registrationId/info', getFileMetadata);

module.exports = router;
