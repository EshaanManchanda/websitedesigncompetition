/**
 * CORS Middleware - Pass-through
 * 
 * CORS is handled by nginx in production.
 * This middleware is a no-op to maintain compatibility with the app structure.
 * 
 * Nginx configuration handles:
 * - Access-Control-Allow-Origin (dynamic based on request origin)
 * - Access-Control-Allow-Methods
 * - Access-Control-Allow-Headers
 * - Access-Control-Allow-Credentials
 * - OPTIONS preflight requests
 */

module.exports = (req, res, next) => {
  // Pass through - nginx handles CORS
  next();
};
