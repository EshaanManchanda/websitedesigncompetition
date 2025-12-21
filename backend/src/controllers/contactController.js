const ContactSubmission = require('../models/ContactSubmission');
const { sendContactEmail } = require('../services/emailService');

/**
 * Contact Controller
 * Handles contact form submissions
 */

/**
 * Submit contact form
 * POST /api/contact
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, age, subject, message } = req.body;

    console.log('Processing contact form from:', email);

    // Create contact submission
    const contactSubmission = new ContactSubmission({
      name,
      email,
      age: age.toString(),
      subject,
      message
    });

    // Save to database
    await contactSubmission.save();
    console.log(`✅ Contact submission created: ${contactSubmission._id}`);

    // Send admin notification email (non-blocking)
    sendContactEmail(contactSubmission.toObject())
      .then(emailResults => {
        console.log('Contact email sent:', emailResults);
      })
      .catch(emailError => {
        console.error('Contact email failed:', emailError);
        // Don't fail the request - emails are sent in background
      });

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        _id: contactSubmission._id,
        name: contactSubmission.name,
        email: contactSubmission.email,
        subject: contactSubmission.subject,
        createdAt: contactSubmission.createdAt
      },
      message: 'Contact form submitted successfully! We will respond soon.'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    next(error);
  }
};

/**
 * Get all contact submissions (admin only - for future use)
 * GET /api/contact
 */
const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const contacts = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await ContactSubmission.countDocuments();

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    next(error);
  }
};

module.exports = {
  submitContact,
  getAllContacts
};
