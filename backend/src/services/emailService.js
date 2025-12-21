const { createTransporter, emailConfig } = require('../config/email');
const { loadAndRenderTemplate, formatEmailDate, formatFileSize, getSubjectLabel, capitalize } = require('./templateService');

/**
 * Email Service
 * Handles sending emails with templates and retry logic
 */

/**
 * Send email with retry logic
 * @param {Object} options - Email options
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} - Result object
 */
const sendEmailWithRetry = async (options, maxRetries = 3) => {
  const transporter = createTransporter();
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt}/${maxRetries} to ${options.to}`);

      const info = await transporter.sendMail(options);

      console.log(`✅ Email sent successfully to ${options.to}`);
      console.log(`Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      lastError = error;
      console.error(`❌ Email send attempt ${attempt} failed:`, error.message);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  const errorMessage = lastError?.message || 'Unknown error';
  console.error(`❌ All email send attempts failed: ${errorMessage}`);
  return {
    success: false,
    error: errorMessage
  };
};

/**
 * Send registration confirmation emails to student, parent, and admin
 * @param {Object} registrationData - Registration data
 * @returns {Promise<Object>} - Email send results
 */
const sendRegistrationEmails = async (registrationData) => {
  const results = {
    student: { sent: false },
    parent: { sent: false },
    admin: { sent: false }
  };

  // Prepare template data
  const templateData = {
    firstName: registrationData.firstName,
    lastName: registrationData.lastName,
    email: registrationData.email,
    category: registrationData.category,
    experience: capitalize(registrationData.experience),
    school: registrationData.school,
    parentName: registrationData.parentName,
    parentEmail: registrationData.parentEmail,
    agreeTerms: registrationData.agreeTerms,
    agreeNewsletter: registrationData.agreeNewsletter,
    submissionFileUrl: registrationData.submissionFileUrl || null,
    submissionFileName: registrationData.submissionFileName || null,
    submissionFileSize: registrationData.submissionFileSize ? formatFileSize(registrationData.submissionFileSize) : null,
    submissionFileType: registrationData.submissionFileType || null,
    submissionUploadedAt: registrationData.submissionUploadedAt ? formatEmailDate(registrationData.submissionUploadedAt) : null,
    registrationDate: formatEmailDate(registrationData.createdAt || new Date().toISOString()),
    registrationId: registrationData._id || registrationData.id,
    competitionYear: process.env.COMPETITION_YEAR || '2025',
    registrationOpenDate: process.env.REGISTRATION_OPEN_DATE || 'January 1, 2025',
    registrationCloseDate: process.env.REGISTRATION_CLOSE_DATE || 'March 15, 2025',
    submissionDeadline: process.env.SUBMISSION_DEADLINE || 'March 31, 2025 at 11:59 PM',
    resultsAnnouncementDate: process.env.RESULTS_ANNOUNCEMENT_DATE || 'April 15, 2025',
    adminEmail: emailConfig.adminEmail
  };

  try {
    // Send student confirmation email
    console.log('Sending student confirmation email...');
    const studentHtml = await loadAndRenderTemplate('student_confirmation', templateData);
    const studentResult = await sendEmailWithRetry({
      from: `"Kids Web Design Competition" <${emailConfig.from}>`,
      to: registrationData.email,
      subject: `Welcome to the Kids Web Design Competition ${templateData.competitionYear}!`,
      html: studentHtml
    });
    results.student = studentResult;
  } catch (error) {
    console.error('Error sending student email:', error);
    results.student = { sent: false, error: error.message };
  }

  try {
    // Send parent confirmation email
    console.log('Sending parent confirmation email...');
    const parentHtml = await loadAndRenderTemplate('parent_confirmation', templateData);
    const parentResult = await sendEmailWithRetry({
      from: `"Kids Web Design Competition" <${emailConfig.from}>`,
      to: registrationData.parentEmail,
      subject: `Your Child's Registration Confirmed - Kids Web Design Competition ${templateData.competitionYear}`,
      html: parentHtml
    });
    results.parent = parentResult;
  } catch (error) {
    console.error('Error sending parent email:', error);
    results.parent = { sent: false, error: error.message };
  }

  try {
    // Send admin notification email
    console.log('Sending admin notification email...');
    const adminHtml = await loadAndRenderTemplate('admin_notification', templateData);
    const adminResult = await sendEmailWithRetry({
      from: `"Kids Web Design Competition" <${emailConfig.from}>`,
      to: emailConfig.adminEmail,
      subject: `New Registration: ${registrationData.firstName} ${registrationData.lastName} (${registrationData.category})`,
      html: adminHtml
    });
    results.admin = adminResult;
  } catch (error) {
    console.error('Error sending admin email:', error);
    results.admin = { sent: false, error: error.message };
  }

  return results;
};

/**
 * Send contact form notification to admin
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} - Email send result
 */
const sendContactEmail = async (contactData) => {
  try {
    // Prepare template data
    const templateData = {
      id: contactData._id || contactData.id,
      name: contactData.name,
      email: contactData.email,
      age: contactData.age,
      subject: contactData.subject,
      subjectLabel: getSubjectLabel(contactData.subject),
      message: contactData.message,
      submittedAt: formatEmailDate(contactData.createdAt || new Date().toISOString())
    };

    console.log('Sending contact form notification to admin...');
    const htmlContent = await loadAndRenderTemplate('contact_admin', templateData);

    const result = await sendEmailWithRetry({
      from: `"Kids Web Design Competition" <${emailConfig.from}>`,
      to: emailConfig.adminEmail,
      replyTo: contactData.email,
      subject: `Contact Form: ${templateData.subjectLabel} - ${contactData.name}`,
      html: htmlContent
    });

    return {
      admin: result
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      admin: { sent: false, error: error.message }
    };
  }
};

module.exports = {
  sendEmailWithRetry,
  sendRegistrationEmails,
  sendContactEmail
};
