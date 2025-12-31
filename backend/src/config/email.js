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

  const transporter = nodemailer.createTransport(config);

  // Verify connection
  transporter.verify((error, success) => {
    const envType = isDevelopment ? 'development' : 'production';
    const host = isDevelopment ? process.env.SMTP_HOST_DEV : process.env.SMTP_HOST;
    const port = isDevelopment ? process.env.SMTP_PORT_DEV : process.env.SMTP_PORT;

    if (error) {
      console.error(`\n${'='.repeat(60)}`);
      console.error(`✗ Email service connection FAILED (${envType})`);
      console.error(`Host: ${host}:${port}`);
      console.error(`Error: ${error.message}`);
      console.error(`${'='.repeat(60)}\n`);

      // Provide troubleshooting hints
      if (error.message.includes('EAUTH')) {
        console.error('💡 Hint: Authentication failed. Check SMTP username/password.');
      } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
        console.error('💡 Hint: Connection timeout. Check SMTP host/port and firewall.');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('💡 Hint: Host not found. Check SMTP_HOST configuration.');
      }
    } else {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✓ Email service ready (${envType})`);
      console.log(`Host: ${host}:${port}`);
      console.log(`From: ${config.auth.user}`);
      console.log(`${'='.repeat(60)}\n`);
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
