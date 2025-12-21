const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  age: {
    type: String,
    required: [true, 'Age is required'],
    validate: {
      validator: function(v) {
        const age = parseInt(v);
        return age >= 8 && age <= 17;
      },
      message: 'Age must be between 8 and 17'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: {
      values: [
        'competition-rules',
        'submission-help',
        'technical-support',
        'prizes',
        'general-question',
        'other'
      ],
      message: '{VALUE} is not a valid subject'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  }
}, {
  timestamps: true,
  collection: 'contact_submissions'
});

// Indexes for performance
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ subject: 1 });
contactSubmissionSchema.index({ email: 1 });

// Pre-save hook for email normalization
contactSubmissionSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
