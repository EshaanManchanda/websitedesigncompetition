const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [100, 'Last name cannot exceed 100 characters']
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
    required: [true, 'Age group is required'],
    enum: {
      values: ['8-10', '11-13', '14-17'],
      message: '{VALUE} is not a valid age group'
    }
  },
  school: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },

  // Parent/Guardian Information
  parentName: {
    type: String,
    required: [true, 'Parent/Guardian name is required'],
    trim: true,
    maxlength: [100, 'Parent name cannot exceed 100 characters']
  },
  parentEmail: {
    type: String,
    required: [true, 'Parent/Guardian email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid parent email']
  },

  // Competition Details
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['8-10', '11-13', '14-17'],
      message: '{VALUE} is not a valid category'
    }
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: '{VALUE} is not a valid experience level'
    }
  },

  // Agreement Flags
  agreeTerms: {
    type: Boolean,
    required: [true, 'Must agree to terms'],
    validate: {
      validator: (v) => v === true,
      message: 'Must agree to terms and conditions'
    }
  },
  agreeNewsletter: {
    type: Boolean,
    default: false
  },

  // File Upload Information (Cloudinary)
  submissionFileUrl: {
    type: String,
    default: null
  },
  submissionFileName: {
    type: String,
    default: null
  },
  submissionFileSize: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || v <= parseInt(process.env.MAX_FILE_SIZE_BYTES || '52428800');
      },
      message: 'File size cannot exceed 50MB'
    }
  },
  submissionFileType: {
    type: String,
    default: null
  },
  submissionUploadedAt: {
    type: Date,
    default: null
  },
  cloudinaryPublicId: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'registrations'
});

// Indexes for performance
registrationSchema.index({ email: 1 });
registrationSchema.index({ createdAt: -1 });
registrationSchema.index({ category: 1 });

// Virtual for full name
registrationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
registrationSchema.set('toJSON', { virtuals: true });
registrationSchema.set('toObject', { virtuals: true });

// Pre-save hook for email normalization
registrationSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.parentEmail) {
    this.parentEmail = this.parentEmail.toLowerCase().trim();
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
