import User from '../models/User.js';
import Career from '../models/Career.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';
import { sendAccountNotification } from '../utils/email.js';

// @desc    Get user profile (for authenticated user)
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedCareers', 'title category marketDemand')
      .populate('pinnedCareers', 'title category marketDemand')
      .select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin career
// @route   POST /api/users/pinned-careers/:careerId
// @access  Private
export const pinCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.careerId);
    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.careerId}`, 404)
      );
    }

    const user = await User.findById(req.user._id);

    if (user.pinnedCareers.includes(req.params.careerId)) {
      return next(createError('Career already pinned', 400));
    }

    user.pinnedCareers.push(req.params.careerId);
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'pin_career',
      details: { careerId: req.params.careerId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'Career pinned successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpin career
// @route   DELETE /api/users/pinned-careers/:careerId
// @access  Private
export const unpinCareer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.pinnedCareers.includes(req.params.careerId)) {
      return next(createError('Career not in pinned list', 400));
    }

    user.pinnedCareers = user.pinnedCareers.filter(
      (id) => id.toString() !== req.params.careerId
    );
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'unpin_career',
      details: { careerId: req.params.careerId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'Career unpinned successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pinned careers
// @route   GET /api/users/pinned-careers
// @access  Private
export const getPinnedCareers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'pinnedCareers',
      'title category marketDemand minimumMeanGrade description'
    );

    res.status(200).json({
      success: true,
      data: user.pinnedCareers,
    });
  } catch (error) {
    next(error);
  }
};

// Keep all your existing functions unchanged
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
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      school: req.body.school,
      graduationYear: req.body.graduationYear,
      bio: req.body.bio,
      avatar: req.body.avatar,
    };

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
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError('User not found', 404));
    }

    if (req.body.interests) user.preferences.interests = req.body.interests;
    if (req.body.skills) user.preferences.skills = req.body.skills;
    if (req.body.locations) user.preferences.locations = req.body.locations;

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

export const saveCareer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const careerId = req.params.careerId;

    if (user.savedCareers.includes(careerId)) {
      return next(createError('Career already saved', 400));
    }

    user.savedCareers.push(careerId);
    await user.save();

    // Increment saves count on career
    await Career.findByIdAndUpdate(careerId, { $inc: { saves: 1 } });

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

export const removeSavedCareer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const careerId = req.params.careerId;

    if (!user.savedCareers.includes(careerId)) {
      return next(createError('Career not saved', 400));
    }

    user.savedCareers = user.savedCareers.filter(
      (id) => id.toString() !== careerId
    );
    await user.save();

    // Decrement saves count on career
    await Career.findByIdAndUpdate(careerId, { $inc: { saves: -1 } });

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
