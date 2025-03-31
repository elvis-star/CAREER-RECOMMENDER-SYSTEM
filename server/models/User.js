import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    userType: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'counselor', 'admin', 'other'],
      default: 'student',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    savedCareers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
      },
    ],
    preferences: {
      interests: [String],
      skills: [String],
      locations: [String],
      notificationSettings: {
        email: { type: Boolean, default: true },
        newRecommendations: { type: Boolean, default: true },
        careerEvents: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: false },
      },
    },
    kcseResults: {
      year: Number,
      meanGrade: String,
      meanPoints: Number,
      subjects: [
        {
          subject: String,
          grade: String,
          points: Number,
        },
      ],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
    sessions: [
      {
        token: String,
        device: String,
        ip: String,
        lastActive: {
          type: Date,
          default: Date.now,
        },
        expiresAt: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's age based on graduation year
UserSchema.virtual('estimatedAge').get(function () {
  if (!this.graduationYear) return null;
  const currentYear = new Date().getFullYear();
  // Assuming average graduation age is 18
  return currentYear - this.graduationYear + 18;
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return verificationToken;
};

// Fix for Mongoose 7+ - replace remove() with deleteOne()
UserSchema.method(
  'remove',
  async function () {
    return this.deleteOne();
  },
  { suppressWarning: true }
); // This suppresses the Mongoose warning

const User = mongoose.model('User', UserSchema);

export default User;
