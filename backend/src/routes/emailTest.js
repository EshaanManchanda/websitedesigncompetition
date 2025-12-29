const express = require('express');
const router = express.Router();
const { testConnection, sendTestEmail, getEmailConfig } = require('../controllers/emailTestController');
const { body } = require('express-validator');
const { validate } = require('../middleware/validateRequest');

/**
 * Email Test Routes
 * /api/test-email
 *
 * SECURITY WARNING:
 * These endpoints are currently PUBLIC and should be protected before production use.
 *
 * Recommended protections:
 * 1. Implement admin authentication middleware
 * 2. Use API keys for authorized access
 * 3. Disable entirely in production (environment-based)
 * 4. IP whitelist for admin access only
 *
 * Current protection: Rate limiting only (20 requests per 15 min)
 */

/**
 * @route   GET /api/test-email/config
 * @desc    Get email configuration (sanitized - no passwords)
 * @access  Public (should be protected in production)
 */
router.get('/config', getEmailConfig);

/**
 * @route   GET /api/test-email/connection
 * @desc    Test SMTP connection
 * @access  Public (should be protected in production)
 */
router.get('/connection', testConnection);

/**
 * @route   POST /api/test-email/send
 * @desc    Send test email
 * @body    { to: "email@example.com" }
 * @access  Public (should be protected in production)
 */
router.post(
  '/send',
  [
    body('to')
      .trim()
      .isEmail()
      .withMessage('Valid email address is required')
      .normalizeEmail(),
    validate
  ],
  sendTestEmail
);

module.exports = router;
