const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const config = isDevelopment
    ? {
        // Development (Mailtrap)
        host: process.env.SMTP_HOST_DEV,
        port: parseInt(process.env.SMTP_PORT_DEV || '2525'),
        auth: {
          user: process.env.SMTP_USER_DEV,
          pass: process.env.SMTP_PASSWORD_DEV
        }
      }
    : {
        // Production (Hostinger)
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      };

  const transporter = nodemailer.createTransporter(config);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error(`✗ Email service connection failed (${isDevelopment ? 'development' : 'production'}):`, error.message);
    } else {
      console.log(`✓ Email service ready (${isDevelopment ? 'development' : 'production'})`);
    }
  });

  return transporter;
};

const emailConfig = {
  from: process.env.FROM_EMAIL || 'noreply@kidswebcomp.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@kidswebcomp.com',
  supportEmail: process.env.SUPPORT_EMAIL || 'support@kidswebcomp.com'
};

module.exports = {
  createTransporter,
  emailConfig
};
