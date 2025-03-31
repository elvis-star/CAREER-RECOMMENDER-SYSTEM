import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';
import { sendSecurityAlertEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

// @desc    Get all active sessions for a user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('sessions');

    res.status(200).json({
      success: true,
      count: user.sessions.length,
      data: user.sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Terminate a specific session
// @route   DELETE /api/sessions/:sessionId
// @access  Private
export const terminateSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Find the session
    const sessionIndex = user.sessions.findIndex(
      (session) => session._id.toString() === req.params.sessionId
    );

    if (sessionIndex === -1) {
      return next(createError('Session not found', 404));
    }

    // Get session details for security alert
    const session = user.sessions[sessionIndex];

    // Remove the session
    user.sessions.splice(sessionIndex, 1);
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'session_terminated',
      details: { sessionId: req.params.sessionId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send security alert if the terminated session is not the current one
    const currentToken =
      req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (session.token !== currentToken) {
      try {
        await sendSecurityAlertEmail(
          user.email,
          'Session terminated',
          new Date().toLocaleString(),
          `${session.ip || 'Unknown'} (${session.device || 'Unknown device'})`
        );
      } catch (error) {
        console.error('Failed to send security alert email:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Terminate all sessions except current
// @route   DELETE /api/sessions
// @access  Private
export const terminateAllSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Get current token
    const currentToken =
      req.headers.authorization?.split(' ')[1] || req.cookies.token;

    // Keep only the current session
    const currentSession = user.sessions.find(
      (session) => session.token === currentToken
    );
    user.sessions = currentSession ? [currentSession] : [];

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'all_sessions_terminated',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send security alert
    try {
      await sendSecurityAlertEmail(
        user.email,
        'All other sessions terminated',
        new Date().toLocaleString(),
        `${req.ip || 'Unknown'} (${
          req.headers['user-agent'] || 'Unknown device'
        })`
      );
    } catch (error) {
      console.error('Failed to send security alert email:', error);
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Generate a new token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    // Create expiry date
    const expiresAt = new Date(
      Date.now() + Number.parseInt(process.env.JWT_EXPIRE) * 24 * 60 * 60 * 1000
    );

    // Add new session
    user.sessions.push({
      token,
      device: req.headers['user-agent'] || 'Unknown device',
      ip: req.ip || 'Unknown',
      lastActive: Date.now(),
      expiresAt,
    });

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'new_session_created',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
