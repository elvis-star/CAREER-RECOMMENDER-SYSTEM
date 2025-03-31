import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import { createError } from '../utils/errorHandler.js';

// Middleware to protect routes
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

    // Check if account is locked
    if (user.accountLocked && user.lockUntil && user.lockUntil > Date.now()) {
      const unlockTime = new Date(user.lockUntil).toLocaleString();
      return next(createError(`Account is locked until ${unlockTime}`, 401));
    }

    // Check if user changed password after token was issued
    if (
      user.lastPasswordChange &&
      decoded.iat * 1000 < user.lastPasswordChange.getTime()
    ) {
      return next(
        createError('Password recently changed, please log in again', 401)
      );
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    return next(createError('Not authorized to access this route', 401));
  }
};

// Middleware to authorize roles
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

// Middleware to track user activity
export const trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      // Update last active timestamp
      req.user.lastActive = Date.now();
      await req.user.save({ validateBeforeSave: false });
    }
    next();
  } catch (error) {
    // Don't block the request if tracking fails
    console.error('Failed to track user activity:', error);
    next();
  }
};

// Middleware to check if email is verified
export const requireEmailVerification = async (req, res, next) => {
  try {
    if (
      req.user &&
      !req.user.emailVerified &&
      process.env.REQUIRE_EMAIL_VERIFICATION === 'true'
    ) {
      return next(createError('Email verification required', 403));
    }
    next();
  } catch (error) {
    return next(createError('Authentication error', 401));
  }
};
