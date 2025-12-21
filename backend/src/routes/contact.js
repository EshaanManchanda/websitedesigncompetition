const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validateRequest');

/**
 * Contact Routes
 * /api/contact
 */

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post(
  '/',
  validateContact,
  submitContact
);

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions (admin only - for future)
 * @access  Public (should be protected in production)
 */
router.get(
  '/',
  getAllContacts
);

module.exports = router;
