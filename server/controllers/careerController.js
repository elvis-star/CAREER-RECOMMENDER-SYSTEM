import Career from '../models/Career.js';
import Institution from '../models/Institution.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
export const getCareers = async (req, res, next) => {
  try {
    // Build query
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = Career.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { keySubjects: searchRegex },
        { jobProspects: searchRegex },
      ]);
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Career.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate institutions
    if (req.query.populate) {
      query = query.populate('institutions');
    }

    // Executing query
    const careers = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: careers.length,
      pagination,
      total,
      data: careers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public
export const getCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id).populate(
      'institutions'
    );

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // Increment views
    career.views += 1;
    await career.save();

    // Log activity if user is authenticated
    if (req.user) {
      await Activity.create({
        user: req.user._id,
        action: 'view_career',
        details: { careerId: req.params.id },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new career
// @route   POST /api/careers
// @access  Private/Admin
export const createCareer = async (req, res, next) => {
  try {
    // If the request contains a Cloudinary URL, use it directly
    const careerData = req.body;

    // Create the career
    const career = await Career.create(careerData);

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'create_career', careerId: career._id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private/Admin
export const updateCareer = async (req, res, next) => {
  try {
    let career = await Career.findById(req.params.id);

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // Update with the new data
    career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'update_career', careerId: req.params.id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private/Admin
export const deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    await career.remove();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'delete_career', careerId: req.params.id },
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

// @desc    Get career statistics
// @route   GET /api/careers/statistics
// @access  Public
export const getCareerStatistics = async (req, res, next) => {
  try {
    // Get total careers
    const totalCareers = await Career.countDocuments();

    // Get careers by category
    const careersByCategory = await Career.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get most viewed careers
    const mostViewedCareers = await Career.find()
      .sort('-views')
      .limit(5)
      .select('title category views');

    // Get most saved careers
    const mostSavedCareers = await Career.find()
      .sort('-saves')
      .limit(5)
      .select('title category saves');

    // Get careers by market demand
    const careersByDemand = await Career.aggregate([
      {
        $group: {
          _id: '$marketDemand',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCareers,
        careersByCategory,
        mostViewedCareers,
        mostSavedCareers,
        careersByDemand,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get career trends
// @route   GET /api/careers/trends
// @access  Public
export const getCareerTrends = async (req, res, next) => {
  try {
    // Get trending careers (high demand and high views)
    const trendingCareers = await Career.find({
      marketDemand: { $in: ['Very High', 'High'] },
    })
      .sort('-views')
      .limit(10)
      .select('title category marketDemand views');

    // Get emerging careers (newer careers with growing views)
    const emergingCareers = await Career.find()
      .sort({ createdAt: -1, views: -1 })
      .limit(5)
      .select('title category marketDemand createdAt');

    // Get careers by minimum mean grade
    const careersByGrade = await Career.aggregate([
      {
        $group: {
          _id: '$minimumMeanGrade',
          careers: { $push: { title: '$title', category: '$category' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        trendingCareers,
        emergingCareers,
        careersByGrade,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job market insights
// @route   GET /api/careers/job-market
// @access  Public
export const getJobMarketInsights = async (req, res, next) => {
  try {
    // Get careers with high market demand
    const highDemandCareers = await Career.find({
      marketDemand: { $in: ['Very High', 'High'] },
    })
      .sort('-views')
      .limit(10)
      .select('title category marketDemand jobProspects');

    // Get careers by salary range
    const careersBySalary = await Career.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          entrySalary: '$salary.entry',
          midSalary: '$salary.mid',
          seniorSalary: '$salary.senior',
        },
      },
      {
        $sort: { entrySalary: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get careers with most job prospects
    const careersWithMostProspects = await Career.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          jobProspectsCount: { $size: '$jobProspects' },
        },
      },
      {
        $sort: { jobProspectsCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        highDemandCareers,
        careersBySalary,
        careersWithMostProspects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related careers
// @route   GET /api/careers/:id/related
// @access  Public
export const getRelatedCareers = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // Find careers in the same category
    const relatedCareers = await Career.find({
      _id: { $ne: req.params.id },
      category: career.category,
    })
      .limit(5)
      .select('title category marketDemand minimumMeanGrade');

    // Find careers with similar key subjects
    const similarSubjectCareers = await Career.find({
      _id: { $ne: req.params.id },
      keySubjects: { $in: career.keySubjects },
    })
      .limit(5)
      .select('title category marketDemand keySubjects');

    res.status(200).json({
      success: true,
      data: {
        relatedCareers,
        similarSubjectCareers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add institution to career
// @route   POST /api/careers/:id/institutions
// @access  Private/Admin
export const addInstitutionToCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    const institution = await Institution.findById(req.body.institutionId);

    if (!institution) {
      return next(
        createError(
          `Institution not found with id of ${req.body.institutionId}`,
          404
        )
      );
    }

    // Check if institution is already added
    if (career.institutions.includes(req.body.institutionId)) {
      return next(createError('Institution already added to this career', 400));
    }

    career.institutions.push(req.body.institutionId);
    await career.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'add_institution_to_career',
        careerId: req.params.id,
        institutionId: req.body.institutionId,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove institution from career
// @route   DELETE /api/careers/:id/institutions/:institutionId
// @access  Private/Admin
export const removeInstitutionFromCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if institution is in the career
    if (!career.institutions.includes(req.params.institutionId)) {
      return next(createError('Institution not found in this career', 404));
    }

    career.institutions = career.institutions.filter(
      (id) => id.toString() !== req.params.institutionId
    );
    await career.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'remove_institution_from_career',
        careerId: req.params.id,
        institutionId: req.params.institutionId,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};
