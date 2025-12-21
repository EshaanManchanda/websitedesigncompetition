const express = require('express');
const router = express.Router();
const { createRegistration, checkEmailExists, getAllRegistrations } = require('../controllers/registrationController');
const { validateRegistration, validateEmail } = require('../middleware/validateRequest');
const { uploadSingleFile } = require('../middleware/fileUpload');

/**
 * Registration Routes
 * /api/registrations
 */

/**
 * @route   POST /api/registrations
 * @desc    Create new registration
 * @access  Public
 */
router.post(
  '/',
  uploadSingleFile('submissionFile'),
  validateRegistration,
  createRegistration
);

/**
 * @route   GET /api/registrations/check-email/:email
 * @desc    Check if email already exists
 * @access  Public
 */
router.get(
  '/check-email/:email',
  validateEmail,
  checkEmailExists
);

/**
 * @route   GET /api/registrations
 * @desc    Get all registrations (admin only - for future)
 * @access  Public (should be protected in production)
 */
router.get(
  '/',
  getAllRegistrations
);

module.exports = router;
