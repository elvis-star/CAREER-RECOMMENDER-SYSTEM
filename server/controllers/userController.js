import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';
import { sendAccountNotification } from '../utils/email.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(
        createError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return next(
        createError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'update_user', userId: req.params.id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send notification to user
    try {
      await sendAccountNotification(
        user.email,
        'Your account information has been updated by an administrator. If you did not request this change, please contact support.'
      );
    } catch (emailError) {
      console.error('Failed to send account notification email:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        createError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Send notification to user before deletion
    try {
      await sendAccountNotification(
        user.email,
        'Your account has been deleted from our system. If you did not request this action, please contact support immediately.'
      );
    } catch (emailError) {
      console.error(
        'Failed to send account deletion notification email:',
        emailError
      );
      // Continue even if email fails
    }

    await user.remove();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'delete_user', userId: req.params.id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      school: req.body.school,
      graduationYear: req.body.graduationYear,
      bio: req.body.bio,
      avatar: req.body.avatar, // This will now be a Cloudinary URL
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'update_profile',
      details: { fields: Object.keys(fieldsToUpdate) },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send notification email
    try {
      await sendAccountNotification(
        user.email,
        'Your profile information has been successfully updated.'
      );
    } catch (emailError) {
      console.error(
        'Failed to send profile update notification email:',
        emailError
      );
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
export const getUserActivity = async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError('User not found', 404));
    }

    // Update preferences
    if (req.body.interests) user.preferences.interests = req.body.interests;
    if (req.body.skills) user.preferences.skills = req.body.skills;
    if (req.body.locations) user.preferences.locations = req.body.locations;

    // Update notification settings if provided
    if (req.body.notificationSettings) {
      user.preferences.notificationSettings = {
        ...user.preferences.notificationSettings,
        ...req.body.notificationSettings,
      };
    }

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'update_preferences',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save career to user's saved careers
// @route   POST /api/users/saved-careers/:careerId
// @access  Private
export const saveCareer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const careerId = req.params.careerId;

    // Check if career is already saved
    if (user.savedCareers.includes(careerId)) {
      return next(createError('Career already saved', 400));
    }

    user.savedCareers.push(careerId);
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'save_career',
      details: { careerId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: user.savedCareers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove career from user's saved careers
// @route   DELETE /api/users/saved-careers/:careerId
// @access  Private
export const removeSavedCareer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const careerId = req.params.careerId;

    // Check if career is saved
    if (!user.savedCareers.includes(careerId)) {
      return next(createError('Career not saved', 400));
    }

    user.savedCareers = user.savedCareers.filter(
      (id) => id.toString() !== careerId
    );
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'remove_saved_career',
      details: { careerId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: user.savedCareers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved careers
// @route   GET /api/users/saved-careers
// @access  Private
export const getSavedCareers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedCareers');

    res.status(200).json({
      success: true,
      count: user.savedCareers.length,
      data: user.savedCareers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save KCSE results
// @route   POST /api/users/kcse-results
// @access  Private
export const saveKcseResults = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.kcseResults = {
      year: req.body.year,
      meanGrade: req.body.meanGrade,
      meanPoints: req.body.meanPoints,
      subjects: req.body.subjects,
    };

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'input_results',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: user.kcseResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's KCSE results
// @route   GET /api/users/kcse-results
// @access  Private
export const getKcseResults = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.kcseResults) {
      return next(createError('No KCSE results found', 404));
    }

    res.status(200).json({
      success: true,
      data: user.kcseResults,
    });
  } catch (error) {
    next(error);
  }
};
