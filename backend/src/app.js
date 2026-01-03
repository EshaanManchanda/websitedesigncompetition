const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const registrationRoutes = require('./routes/registrations');
const contactRoutes = require('./routes/contact');
const emailTestRoutes = require('./routes/emailTest');
const fileRoutes = require('./routes/files');

/**
 * Express Application Setup
 */

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS (handled by nginx in production, this is a pass-through middleware)
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  }
});

app.use(globalLimiter);

// Stricter rate limiting for registration endpoint
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 registrations per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many registration attempts, please try again later'
  }
});

// Stricter rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 contacts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many contact submissions, please try again later'
  }
});

// Rate limiting for email test endpoints
const emailTestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 test emails per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many email test attempts, please try again later'
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/registrations', registrationLimiter, registrationRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/test-email', emailTestLimiter, emailTestRoutes);
app.use('/api/files', fileRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kids Web Design Competition API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      registrations: '/api/registrations',
      contact: '/api/contact',
      testEmail: '/api/test-email',
      files: '/api/files/:registrationId/download'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
