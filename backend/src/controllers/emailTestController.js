const { createTransporter, emailConfig } = require('../config/email');
const { sendEmailWithRetry } = require('../services/emailService');

/**
 * Email Test Controller
 * Provides endpoints for testing SMTP configuration
 *
 * SECURITY WARNING: These endpoints should be protected in production
 * Consider adding authentication middleware before deploying
 */

/**
 * Test SMTP connection
 * @route GET /api/test-email/connection
 * @returns {Object} Connection status and SMTP details
 */
const testConnection = async (req, res, next) => {
  try {
    const transporter = createTransporter();
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log(`Testing SMTP connection (${isDevelopment ? 'development' : 'production'})...`);

    // Attempt to verify connection
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });

    // Connection successful
    const response = {
      success: true,
      message: 'SMTP connection verified successfully',
      details: {
        environment: isDevelopment ? 'development' : 'production',
        host: isDevelopment ? process.env.SMTP_HOST_DEV : process.env.SMTP_HOST,
        port: isDevelopment ? process.env.SMTP_PORT_DEV : process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: isDevelopment ? process.env.SMTP_USER_DEV : process.env.SMTP_USER,
        fromEmail: emailConfig.from,
        adminEmail: emailConfig.adminEmail,
        timestamp: new Date().toISOString()
      }
    };

    console.log('✓ SMTP connection test passed');
    res.json(response);

  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.error('✗ SMTP connection test failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'SMTP connection failed',
      error: error.message,
      code: error.code || 'UNKNOWN',
      details: {
        environment: isDevelopment ? 'development' : 'production',
        host: isDevelopment ? process.env.SMTP_HOST_DEV : process.env.SMTP_HOST,
        port: isDevelopment ? process.env.SMTP_PORT_DEV : process.env.SMTP_PORT
      }
    });
  }
};

/**
 * Send test email
 * @route POST /api/test-email/send
 * @body {string} to - Email recipient address
 * @returns {Object} Send status and message ID
 */
const sendTestEmail = async (req, res, next) => {
  try {
    const { to } = req.body;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Email recipient (to) is required'
      });
    }

    console.log(`Sending test email to: ${to} (${isDevelopment ? 'development' : 'production'})`);

    const result = await sendEmailWithRetry({
      from: `"Kids Web Design Competition" <${emailConfig.from}>`,
      to: to,
      subject: `SMTP Test Email - ${isDevelopment ? 'Development' : 'Production'} Environment`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ SMTP Test Successful</h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px 20px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                This is a test email from the <strong>Kids Web Design Competition</strong> backend system.
              </p>

              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                If you received this email, your SMTP configuration is working correctly! 🎉
              </p>

              <!-- Environment Details Box -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Environment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Environment:</strong></td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${isDevelopment ? 'Development (Mailtrap)' : 'Production (Hostinger)'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>SMTP Host:</strong></td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${isDevelopment ? process.env.SMTP_HOST_DEV : process.env.SMTP_HOST}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>SMTP Port:</strong></td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${isDevelopment ? process.env.SMTP_PORT_DEV : process.env.SMTP_PORT}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>From Email:</strong></td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${emailConfig.from}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Timestamp:</strong></td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${new Date().toISOString()}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                This test email was sent via the <code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace;">/api/test-email/send</code> endpoint.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Kids Web Design Competition ${process.env.COMPETITION_YEAR || '2025'}<br>
                This is an automated test email. Please do not reply.
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    });

    if (result.success) {
      console.log('✓ Test email sent successfully:', result.messageId);
      res.json({
        success: true,
        message: 'Test email sent successfully',
        details: {
          to: to,
          messageId: result.messageId,
          environment: isDevelopment ? 'development' : 'production',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.error('✗ Test email send failed:', result.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('✗ Test email send failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
};

/**
 * Get email configuration (sanitized - no passwords)
 * @route GET /api/test-email/config
 * @returns {Object} Email configuration details
 */
const getEmailConfig = (req, res) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.json({
    success: true,
    config: {
      environment: isDevelopment ? 'development' : 'production',
      smtp: {
        host: isDevelopment ? process.env.SMTP_HOST_DEV : process.env.SMTP_HOST,
        port: isDevelopment ? process.env.SMTP_PORT_DEV : process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: isDevelopment ? process.env.SMTP_USER_DEV : process.env.SMTP_USER,
        // Never expose passwords
        passwordConfigured: isDevelopment
          ? !!process.env.SMTP_PASSWORD_DEV
          : !!process.env.SMTP_PASSWORD
      },
      emails: {
        from: emailConfig.from || process.env.FROM_EMAIL,
        admin: emailConfig.adminEmail || process.env.ADMIN_EMAIL,
        support: emailConfig.supportEmail || process.env.SUPPORT_EMAIL
      },
      competition: {
        year: process.env.COMPETITION_YEAR,
        registrationOpen: process.env.REGISTRATION_OPEN_DATE,
        registrationClose: process.env.REGISTRATION_CLOSE_DATE,
        submissionDeadline: process.env.SUBMISSION_DEADLINE,
        resultsAnnouncement: process.env.RESULTS_ANNOUNCEMENT_DATE
      }
    }
  });
};

module.exports = {
  testConnection,
  sendTestEmail,
  getEmailConfig
};
