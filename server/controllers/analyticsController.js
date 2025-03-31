import User from '../models/User.js';
import Career from '../models/Career.js';
import Recommendation from '../models/Recommendation.js';

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalyticsData = async (req, res, next) => {
  try {
    const { timeRange, startDate, endDate, category } = req.query;

    // Calculate date range based on timeRange or custom dates
    let startDateTime, endDateTime;

    if (startDate && endDate) {
      startDateTime = new Date(startDate);
      endDateTime = new Date(endDate);
    } else {
      endDateTime = new Date();

      switch (timeRange) {
        case 'week':
          startDateTime = new Date(
            endDateTime.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          break;
        case 'quarter':
          startDateTime = new Date(
            endDateTime.getTime() - 90 * 24 * 60 * 60 * 1000
          );
          break;
        case 'year':
          startDateTime = new Date(
            endDateTime.getTime() - 365 * 24 * 60 * 60 * 1000
          );
          break;
        case 'month':
        default:
          startDateTime = new Date(
            endDateTime.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          break;
      }
    }

    // Build category filter if provided
    const categoryFilter = category && category !== 'all' ? { category } : {};

    // Get user growth data
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDateTime, $lte: endDateTime },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get recommendation data
    const recommendations = await Recommendation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDateTime, $lte: endDateTime },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get career popularity data
    const careerPopularity = await Career.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $project: {
          title: 1,
          category: 1,
          count: { $add: ['$views', { $size: { $ifNull: ['$savedBy', []] } }] },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get user types data
    const userTypes = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        recommendations,
        careerPopularity,
        userTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};
