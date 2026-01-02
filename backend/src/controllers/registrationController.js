const Registration = require('../models/Registration');
const { uploadFile } = require('../services/storageService');
const { sendRegistrationEmails } = require('../services/emailService');

/**
 * Registration Controller
 * Handles competition registration operations
 */

/**
 * Create new registration
 * POST /api/registrations
 */
const createRegistration = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      school,
      parentName,
      parentEmail,
      category,
      experience,
      competitionDate,
      agreeTerms,
      agreeNewsletter
    } = req.body;

    console.log('Processing registration for:', email);

    // Create registration document (without file info initially)
    const registration = new Registration({
      firstName,
      lastName,
      email,
      age,
      school,
      parentName,
      parentEmail,
      category,
      experience,
      competitionDate,
      agreeTerms,
      agreeNewsletter: agreeNewsletter || false
    });

    // Save to database
    await registration.save();
    console.log(`✅ Registration created: ${registration._id}`);

    // Handle file upload if provided
    // Handle file uploads
    if (req.files || req.file) {
      // Handle Submission File
      const submissionFile = req.files?.submissionFile?.[0] || req.file;
      if (submissionFile) {
        try {
          console.log('Uploading submission file...');
          const fileData = await uploadFile(submissionFile, registration._id.toString());

          registration.submissionFileUrl = `/api/files/${registration._id}/download`;
          registration.submissionFileName = fileData.name;
          registration.submissionFileSize = fileData.size;
          registration.submissionFileType = fileData.type;
          registration.submissionUploadedAt = new Date(fileData.uploadedAt);
          registration.uploadProvider = fileData.provider; // Main provider tracking

          const storageUrl = fileData.provider === 'local' ? fileData.path : fileData.url;

          registration.fileMetadata = {
            ...(fileData.metadata || {}),
            storageUrl: storageUrl,
            originalUrl: fileData.url,
            ...(fileData.path && { path: fileData.path }),
            ...(fileData.relativePath && { relativePath: fileData.relativePath })
          };

          if (fileData.publicId) {
            registration.cloudinaryPublicId = fileData.publicId;
          }
          console.log(`✅ Submission file uploaded`);
        } catch (fileError) {
          console.error('Submission file upload failed:', fileError);
        }
      }

      // Handle Payment Screenshot
      if (req.files?.paymentScreenshot?.[0]) {
        try {
          console.log('Uploading payment screenshot...');
          // Use a suffix or distinct folder structure if supported by uploadFile, 
          // assumes uploadFile handles naming or pathing reasonably.
          // passing registration._id still keeps it associated with the user/reg.
          const paymentFile = req.files.paymentScreenshot[0];
          const fileData = await uploadFile(paymentFile, `${registration._id}/payment`);

          registration.paymentScreenshotUrl = `/api/files/${registration._id}/payment`; // Use dedicated payment endpoint 
          // For consistency with submission, we might want a proxy, but direct URL is easier if public/signed.
          // Let's stick to storing the URL. Ideally we'd have a specific proxy for payments too if secure.
          // For now, let's assume direct access or authenticated generic file access.

          registration.paymentScreenshotName = fileData.name;
          registration.paymentScreenshotSize = fileData.size;
          registration.paymentScreenshotType = fileData.type;
          registration.paymentUploadedAt = new Date(fileData.uploadedAt);

          registration.paymentFileMetadata = {
            folder: 'payment',
            provider: fileData.provider,
            path: fileData.path,
            url: fileData.url
          };

          console.log(`✅ Payment screenshot uploaded`);
        } catch (paymentError) {
          console.error('Payment screenshot upload failed:', paymentError);
        }
      }

      await registration.save();
    }

    // Send confirmation emails (non-blocking)
    // We don't wait for emails to complete to avoid slow responses
    sendRegistrationEmails(registration.toObject())
      .then(emailResults => {
        console.log('Email send results:', emailResults);
      })
      .catch(emailError => {
        console.error('Email sending failed:', emailError);
        // Don't fail the request - emails are sent in background
      });

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        _id: registration._id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        age: registration.age,
        school: registration.school,
        category: registration.category,
        experience: registration.experience,
        submissionFileUrl: registration.submissionFileUrl,
        submissionFileName: registration.submissionFileName,
        createdAt: registration.createdAt
      },
      message: 'Registration successful! Confirmation emails are being sent.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

/**
 * Check if email exists
 * GET /api/registrations/check-email/:email
 */
const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.params;

    const exists = await Registration.findOne({
      email: email.toLowerCase()
    });

    res.json({
      exists: !!exists
    });

  } catch (error) {
    console.error('Check email error:', error);
    next(error);
  }
};

/**
 * Get all registrations (admin only - for future use)
 * GET /api/registrations
 */
const getAllRegistrations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Registration.countDocuments();

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    next(error);
  }
};

module.exports = {
  createRegistration,
  checkEmailExists,
  getAllRegistrations
};
