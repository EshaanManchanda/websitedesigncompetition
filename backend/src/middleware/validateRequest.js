const { body, param, validationResult } = require('express-validator');

/**
 * Request Validation Middleware
 * Uses express-validator for input validation
 */

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * Registration validation rules
 */
const validateRegistration = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 100 }).withMessage('First name too long'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 100 }).withMessage('Last name too long'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('age')
    .notEmpty().withMessage('Age group is required')
    .isIn(['8-10', '11-13', '14-17']).withMessage('Invalid age group'),

  body('school')
    .trim()
    .notEmpty().withMessage('School name is required')
    .isLength({ max: 200 }).withMessage('School name too long'),

  body('parentName')
    .trim()
    .notEmpty().withMessage('Parent/Guardian name is required')
    .isLength({ max: 100 }).withMessage('Parent name too long'),

  body('parentEmail')
    .trim()
    .notEmpty().withMessage('Parent/Guardian email is required')
    .isEmail().withMessage('Invalid parent email address')
    .normalizeEmail(),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['8-10', '11-13', '14-17']).withMessage('Invalid category'),

  body('experience')
    .notEmpty().withMessage('Experience level is required')
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid experience level'),

  body('agreeTerms')
    .isBoolean().withMessage('Terms agreement must be boolean')
    .custom(value => value === true).withMessage('Must agree to terms and conditions'),

  body('agreeNewsletter')
    .optional()
    .isBoolean().withMessage('Newsletter agreement must be boolean'),

  validate
];

/**
 * Contact form validation rules
 */
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 8, max: 17 }).withMessage('Age must be between 8 and 17'),

  body('subject')
    .notEmpty().withMessage('Subject is required')
    .isIn(['competition-rules', 'submission-help', 'technical-support', 'prizes', 'general-question', 'other'])
    .withMessage('Invalid subject'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),

  validate
];

/**
 * Email validation rule (for check-email endpoint)
 */
const validateEmail = [
  param('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateContact,
  validateEmail
};
