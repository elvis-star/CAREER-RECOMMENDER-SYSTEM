import User from '../models/User.js';
import Activity from '../models/Activity.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendAccountNotification,
} from '../utils/email.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { createError } from '../utils/errorHandler.js';

// Generate token and set cookie response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('Email already registered', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      userType: userType || 'student',
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send email
    try {
      await sendVerificationEmail(user.email, verificationURL);

      // Send welcome email
      await sendWelcomeEmail(user.email, user.name);

      // Log activity
      await Activity.create({
        user: user._id,
        action: 'register',
        details: { userType },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Return success but don't send token if email verification is required
      if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
        return res.status(201).json({
          success: true,
          message:
            'Registration successful! Please check your email to verify your account.',
          requireEmailVerification: true,
        });
      }

      // If email verification is not required, send token response
      sendTokenResponse(user, 201, res);
    } catch (err) {
      console.error('Email could not be sent', err);
      user.emailVerificationToken = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        createError('Email could not be sent. Please try again later.', 500)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(createError('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Invalid credentials 1');
      return next(createError('Invalid credentials', 401));
    }

    // Check if email is verified when required
    if (
      process.env.REQUIRE_EMAIL_VERIFICATION === 'true' &&
      !user.emailVerified
    ) {
      return next(
        createError('Please verify your email before logging in', 401)
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Implement failed login attempts tracking
      await trackFailedLoginAttempt(user);
      console.log('Invalid credentials 2');
      return next(createError('Invalid credentials', 401));
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.accountLocked = false;
      user.lockUntil = undefined;
      await user.save({ validateBeforeSave: false });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'login',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Add a function to track failed login attempts
const trackFailedLoginAttempt = async (user) => {
  // Increment failed login attempts
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

  // Lock account after 5 failed attempts
  if (user.failedLoginAttempts >= 5) {
    user.accountLocked = true;
    // Lock for 30 minutes
    user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);

    // Send account lock notification
    try {
      await sendAccountNotification(
        user.email,
        'Your account has been temporarily locked due to multiple failed login attempts. You can try again in 30 minutes or reset your password.'
      );
    } catch (error) {
      console.error('Failed to send account lock notification:', error);
    }
  }

  await user.save({ validateBeforeSave: false });
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    if (req.user) {
      // Log activity
      await Activity.create({
        user: req.user._id,
        action: 'logout',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerified: false,
    });

    if (!user) {
      return next(createError('Invalid or expired verification token', 400));
    }

    // Set emailVerified to true and remove token
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'email_verification',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send confirmation email
    try {
      await sendAccountNotification(
        user.email,
        'Your email has been successfully verified. You can now log in to your account.'
      );
    } catch (error) {
      console.error('Failed to send verification confirmation email:', error);
    }

    // If frontend URL is provided, redirect to login page
    if (req.query.redirect && process.env.CLIENT_URL) {
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
    }

    res.status(200).json({
      success: true,
      message:
        'Email verified successfully. You can now log in to your account.',
    });
  } catch (error) {
    next(error);
  }
};

// Add a function to resend verification email
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError('Please provide an email address', 400));
    }

    const user = await User.findOne({ email, emailVerified: false });

    if (!user) {
      return next(createError('User not found or already verified', 404));
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    try {
      await sendVerificationEmail(user.email, verificationURL);

      res.status(200).json({
        success: true,
        message: 'Verification email resent successfully',
      });
    } catch (err) {
      console.error('Email could not be sent', err);
      user.emailVerificationToken = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        createError('Email could not be sent. Please try again later.', 500)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(createError('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (err) {
      console.error('Email could not be sent', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        createError('Email could not be sent. Please try again later.', 500)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(createError('Invalid or expired reset token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Reset failed login attempts and unlock account
    user.failedLoginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = undefined;

    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'password_reset',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send password change notification
    try {
      await sendAccountNotification(
        user.email,
        'Your password has been successfully reset. If you did not request this change, please contact support immediately.'
      );
    } catch (error) {
      console.error('Failed to send password reset confirmation email:', error);
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Add a function to check reset token validity
export const checkResetToken = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Valid reset token',
    });
  } catch (error) {
    next(error);
  }
};

// Add a function to check email verification token validity
export const checkVerificationToken = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Valid verification token',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return next(createError('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'update_profile',
      details: { field: 'password' },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Add a function to get current user session
export const getSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Protect routes middleware
// @usage   Used in route files to protect routes
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // Set token from cookie
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(createError('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError('User no longer exists', 401));
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    return next(createError('Not authorized to access this route', 401));
  }
};

// @desc    Authorize roles middleware
// @usage   Used in route files to restrict access based on role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
