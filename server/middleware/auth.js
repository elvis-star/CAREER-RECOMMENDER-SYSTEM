import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import { createError } from '../utils/errorHandler.js';
import Activity from '../models/Activity.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(createError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(createError('No user found with this token', 401));
      }

      // Check if user is "active" based on your schema fields
      if (user.accountLocked || !user.emailVerified) {
        return next(
          createError('Your account is not active or not verified', 401)
        );
      }

      req.user = user;
      next();
    } catch (error) {
      return next(createError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't require token but adds user if available
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    console.log('Bearer: ', token);

    // If no token, continue without user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      // Updated active check
      if (user && !user.accountLocked && user.emailVerified) {
        req.user = user;
      }
    } catch (error) {
      // If token is invalid, continue without user
      console.log('Invalid token in optional auth:', error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError('Not authorized to access this route', 401));
    }

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

// Track user activity middleware
export const trackActivity = async (req, res, next) => {
  // Skip activity tracking for certain routes
  const skipRoutes = ['/api/health', '/api/admin/activity'];

  if (skipRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  // Store original end function
  const originalEnd = res.end;

  // Override end function to track activity after response
  res.end = function (...args) {
    // Call original end function
    originalEnd.apply(this, args);

    // Track activity asynchronously (don't wait for it)
    setImmediate(async () => {
      try {
        // Only track successful requests and if user is authenticated
        if (req.user && res.statusCode < 400) {
          const activityData = {
            user: req.user._id,
            action: `api_request`,
            details: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
            },
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
          };

          await Activity.create(activityData);
        }
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    });
  };

  next();
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
