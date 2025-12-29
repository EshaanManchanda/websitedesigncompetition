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
      agreeTerms,
      agreeNewsletter: agreeNewsletter || false
    });

    // Save to database
    await registration.save();
    console.log(`✅ Registration created: ${registration._id}`);

    // Handle file upload if provided
    if (req.file) {
      try {
        console.log('Uploading file to Cloudinary...');
        const fileData = await uploadFile(req.file, registration._id.toString());

        // Update registration with file information
        registration.submissionFileUrl = fileData.url;
        registration.submissionFileName = fileData.name;
        registration.submissionFileSize = fileData.size;
        registration.submissionFileType = fileData.type;
        registration.submissionUploadedAt = new Date(fileData.uploadedAt);
        registration.cloudinaryPublicId = fileData.publicId;

        await registration.save();
        console.log('✅ File uploaded and registration updated');
      } catch (fileError) {
        console.error('File upload failed:', fileError);
        // Continue - registration is saved, just no file
        // We don't want to fail the entire registration if file upload fails
      }
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
