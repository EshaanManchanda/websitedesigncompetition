/**
 * Input Sanitization Utilities
 * Prevents XSS and other injection attacks
 */

/**
 * Sanitize a string for safe HTML output
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return str;

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.toLowerCase().trim();
};

/**
 * Sanitize text input (remove excessive whitespace, trim)
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize multiline text (preserve line breaks but normalize)
 * @param {string} text - Multiline text
 * @returns {string} - Sanitized text
 */
const sanitizeMultilineText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
    .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive line breaks
};

/**
 * Remove null bytes from string (security)
 * @param {string} str - String to clean
 * @returns {string} - Cleaned string
 */
const removeNullBytes = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/\0/g, '');
};

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @returns {string|null} - Sanitized URL or null if invalid
 */
const sanitizeURL = (url) => {
  if (typeof url !== 'string') return null;

  try {
    const parsedURL = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return null;
    }
    return parsedURL.href;
  } catch (error) {
    return null;
  }
};

module.exports = {
  sanitizeHTML,
  sanitizeEmail,
  sanitizeText,
  sanitizeMultilineText,
  removeNullBytes,
  sanitizeURL
};
