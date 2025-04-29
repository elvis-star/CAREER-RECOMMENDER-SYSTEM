import User from '../models/User.js';
import Career from '../models/Career.js';
import Institution from '../models/Institution.js';
import Recommendation from '../models/Recommendation.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';
import mongoose from 'mongoose';
import { sendAccountNotification } from '../utils/email.js';
import crypto from 'crypto';
import AdminInvitation from '../models/AdminInvitation.js';
import { sendAdminInvitation } from '../utils/email.js';

// @desc    Get admin dashboard overview
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getAdminOverview = async (req, res, next) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const careerCount = await Career.countDocuments();
    const institutionCount = await Institution.countDocuments();
    const recommendationCount = await Recommendation.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(5);

    // Get recent activities
    const recentActivities = await Activity.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          careers: careerCount,
          institutions: institutionCount,
          recommendations: recommendationCount,
        },
        recentUsers,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    // Get user statistics
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    const usersByType = await User.aggregate([
      { $group: { _id: '$userType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get career statistics
    const featuredCareers = await Career.countDocuments({ featured: true });
    const careersByCategory = await Career.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const mostViewedCareers = await Career.find()
      .sort('-views')
      .limit(5)
      .select('title category views');

    // Get institution statistics
    const universities = await Institution.countDocuments({
      type: 'university',
    });

    // Get recommendation statistics
    const lastMonthRecommendations = await Recommendation.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // Get system statistics
    const systemStats = {
      database: {
        status: 'connected',
        name: mongoose.connection.name,
      },
      server: {
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime() / 3600) + ' hours',
        memoryUsage: {
          heapUsed:
            Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        },
      },
      lastBackup: process.env.LAST_BACKUP_DATE || null,
    };

    res.status(200).json({
      success: true,
      data: {
        users: {
          active: activeUsers,
          byType: usersByType,
        },
        careers: {
          featured: featuredCareers,
          byCategory: careersByCategory,
          mostViewed: mostViewedCareers,
        },
        institutions: {
          universities,
        },
        recommendations: {
          lastMonth: lastMonthRecommendations,
        },
        system: systemStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user growth data
// @route   GET /api/admin/user-growth
// @access  Private/Admin
export const getUserGrowth = async (req, res, next) => {
  try {
    // Get user growth by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: userGrowth,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get career popularity data
// @route   GET /api/admin/career-popularity
// @access  Private/Admin
export const getCareerPopularity = async (req, res, next) => {
  try {
    // Get most popular careers based on views and saves
    const popularCareers = await Career.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          views: 1,
          saves: { $size: { $ifNull: ['$savedBy', []] } },
        },
      },
      {
        $sort: { views: -1, saves: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        popularCareers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin invitation
// @route   POST /api/admin/invite
// @access  Private/Admin
export const createAdminInvitation = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    console.log('req.user: ', req.user);

    if (!email || !name) {
      return next(
        createError('Please provide name and email for the invitation', 400)
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('User with this email already exists', 400));
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    // Create temporary admin invitation record
    const invitation = await AdminInvitation.create({
      name,
      email,
      token: hashedToken,
      invitedBy: req.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Create invitation URL
    const invitationURL = `${process.env.CLIENT_URL}/admin/accept-invitation/${invitationToken}`;

    // Send invitation email
    const sendResult = await sendAdminInvitation(
      email,
      name,
      invitationURL,
      req.user.name
    );
    console.log('sendResult: ', sendResult);

    // Check if either primary or backup sent the email successfully
    if (sendResult.response.status == 200) {
      await Activity.create({
        user: req.user._id,
        action: 'admin_invitation_sent',
        details: { invitedEmail: email },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return res.status(200).json({
        success: true,
        message: 'Admin invitation sent successfully',
      });
    } else {
      await invitation.deleteOne();
      console.error('Invitation email could not be sent:', email);
      return next(
        createError('Email sending failed via both transports.', 500)
      );
    }
  } catch (error) {
    console.error('Error in createAdminInvitation:', error);
    return next(error);
  }
};

// @desc    Accept admin invitation
// @route   POST /api/admin/accept-invitation/:token
// @access  Public
export const acceptAdminInvitation = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return next(createError('Please provide your name and password', 400));
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const invitation = await AdminInvitation.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!invitation) {
      return next(createError('Invalid or expired invitation token', 400));
    }

    const user = await User.create({
      name,
      email: invitation.email,
      password,
      role: 'admin',
      userType: 'admin',
      emailVerified: true,
    });

    await Activity.create({
      user: user._id,
      action: 'admin_invitation_accepted',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    await invitation.remove();

    try {
      await sendAccountNotification(
        user.email,
        `Welcome to the Career Recommender System admin team! Your admin account has been created successfully.`
      );
    } catch (err) {
      console.error('Welcome email could not be sent', err);
    }

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    verify admin invitation
// @route   GET /api/admin/verify-invitation/:token
// @access  Public
export const verifyAdminInvitation = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const invitation = await AdminInvitation.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    }).populate('invitedBy', 'name email'); // To show who invited

    if (!invitation) {
      return next(createError('Invalid or expired invitation token', 400));
    }

    res.status(200).json({
      success: true,
      data: {
        email: invitation.email,
        invitedBy: invitation.invitedBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system activity logs
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getActivityLogs = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by user
    if (req.query.user) {
      query.user = req.query.user;
    }

    // Filter by action
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Execute query
    const activities = await Activity.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform database backup
// @route   POST /api/admin/backup
// @access  Private/Admin
export const performBackup = async (req, res, next) => {
  try {
    // In a real application, this would trigger a database backup process
    // For this example, we'll just update the last backup date

    // Update environment variable
    process.env.LAST_BACKUP_DATE = new Date().toISOString();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'database_backup',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'Database backup initiated successfully',
      data: {
        lastBackup: process.env.LAST_BACKUP_DATE,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system health information
// @route   GET /api/admin/system-health
// @access  Private/Admin
export const getSystemHealthInfo = async (req, res, next) => {
  try {
    const { getSystemHealth } = await import('../utils/systemHealth.js');
    const healthData = await getSystemHealth();

    res.status(200).json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics by type
// @route   GET /api/admin/user-stats
// @access  Private/Admin
export const getUserStatsByType = async (req, res, next) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    '$lastActive',
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommendation statistics
// @route   GET /api/admin/recommendation-stats
// @access  Private/Admin
export const getRecommendationStats = async (req, res, next) => {
  try {
    // Get recommendations by month
    const recommendationsByMonth = await Recommendation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
    ]);

    // Get top recommended careers
    const topRecommendedCareers = await Recommendation.aggregate([
      { $unwind: '$careers' },
      {
        $group: {
          _id: '$careers.careerId',
          count: { $sum: 1 },
          averageMatch: { $avg: '$careers.matchPercentage' },
        },
      },
      {
        $lookup: {
          from: 'careers',
          localField: '_id',
          foreignField: '_id',
          as: 'careerDetails',
        },
      },
      { $unwind: '$careerDetails' },
      {
        $project: {
          _id: 0,
          careerId: '$_id',
          title: '$careerDetails.title',
          category: '$careerDetails.category',
          count: 1,
          averageMatch: { $round: ['$averageMatch', 1] },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byMonth: recommendationsByMonth,
        topCareers: topRecommendedCareers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res, next) => {
  try {
    // In a real application, you would store these in a Settings collection
    // For this example, we'll use environment variables

    const allowedSettings = [
      'REQUIRE_EMAIL_VERIFICATION',
      'MAX_LOGIN_ATTEMPTS',
      'PASSWORD_EXPIRY_DAYS',
      'MAINTENANCE_MODE',
    ];

    const updatedSettings = {};

    // Only update allowed settings
    for (const key of allowedSettings) {
      if (req.body[key] !== undefined) {
        // In a real app, you'd update the database
        // Here we're just simulating by updating process.env
        process.env[key] = req.body[key];
        updatedSettings[key] = req.body[key];
      }
    }

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'update_system_settings',
      details: { updatedSettings },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'System settings updated successfully',
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};
