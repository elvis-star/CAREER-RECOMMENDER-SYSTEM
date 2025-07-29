import Career from '../models/Career.js';
import Institution from '../models/Institution.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import { createError } from '../utils/errorHandler.js';

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
export const getCareers = async (req, res, next) => {
  try {
    console.log('getCareers called with query:', req.query);

    // Build query
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = [
      'select',
      'sort',
      'page',
      'limit',
      'search',
      'populate',
    ];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Clean up empty string values
    Object.keys(reqQuery).forEach((key) => {
      if (
        reqQuery[key] === '' ||
        reqQuery[key] === null ||
        reqQuery[key] === undefined
      ) {
        delete reqQuery[key];
      }
    });

    console.log('Filtered query object:', reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    console.log('MongoDB query string:', queryStr);

    // Finding resource
    const parsedQuery = JSON.parse(queryStr);
    console.log('Parsed MongoDB query:', parsedQuery);

    query = Career.find(parsedQuery);

    // Search functionality
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query = query.or([
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { keySubjects: searchRegex },
        { jobProspects: searchRegex },
      ]);
      console.log('Applied search filter:', req.query.search);
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
      console.log('Applied sort:', sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Get total count for pagination BEFORE applying pagination
    const totalQuery = Career.find(parsedQuery);
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      totalQuery.or([
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { keySubjects: searchRegex },
        { jobProspects: searchRegex },
      ]);
    }
    const total = await totalQuery.countDocuments();
    console.log('Total careers found:', total);

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    query = query.skip(startIndex).limit(limit);

    // Populate institutions
    if (req.query.populate && req.query.populate.includes('institutions')) {
      query = query.populate({
        path: 'institutions',
        select: 'name type location.city location.country logo website',
      });
      console.log('Applied institutions population');
    }

    // Executing query
    const careers = await query;
    console.log('Careers found:', careers.length);

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
    console.error('Error in getCareers:', error);
    next(error);
  }
};

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public (but enhanced with auth data if available)
export const getCareer = async (req, res, next) => {
  try {
    let career = await Career.findById(req.params.id).populate({
      path: 'institutions',
      select: 'name type location.city location.country logo website',
    });

    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // If user is logged in, check for personalized recommendation data
    if (req.user) {
      const userRecommendation = await Recommendation.findOne({
        user: req.user._id,
      });

      if (userRecommendation) {
        const careerRec = userRecommendation.recommendations.find(
          (rec) => rec.career.toString() === req.params.id
        );

        if (careerRec) {
          // Convert Mongoose document to plain object to add new properties
          career = career.toObject();
          career.match = careerRec.match;
          career.reasons = careerRec.reasons;
        }
      }

      // Log activity if user is authenticated
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

// @desc    Rate a career
// @route   POST /api/careers/:id/rate
// @access  Private
export const rateCareer = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(createError('Rating must be between 1 and 5', 400));
    }

    const career = await Career.findById(req.params.id);
    if (!career) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    // Update user's rating for this career
    const user = await User.findById(req.user._id);

    // Find existing rating or create new one
    const existingRatingIndex = user.careerRatings?.findIndex(
      (r) => r.careerId.toString() === req.params.id
    );

    if (!user.careerRatings) {
      user.careerRatings = [];
    }

    if (existingRatingIndex > -1) {
      user.careerRatings[existingRatingIndex].rating = rating;
    } else {
      user.careerRatings.push({
        careerId: req.params.id,
        rating: rating,
      });
    }

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'rate_career',
      details: { careerId: req.params.id, rating },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'Career rated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record career view
// @route   POST /api/careers/:id/view
// @access  Public (optional auth)
export const viewCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
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
      message: 'View recorded',
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
    const careerData = req.body;
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

    await career.deleteOne();

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

// @desc    Bulk delete careers
// @route   POST /api/careers/bulk-delete
// @access  Private/Admin
export const bulkDeleteCareers = async (req, res, next) => {
  try {
    const { careerIds } = req.body;

    if (!Array.isArray(careerIds) || careerIds.length === 0) {
      return next(createError('No career IDs provided for bulk delete', 400));
    }

    const result = await Career.deleteMany({ _id: { $in: careerIds } });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'bulk_delete_careers',
        deletedCount: result.deletedCount,
        careerIds: careerIds,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `${result.deletedCount} careers deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update featured status for careers
// @route   POST /api/careers/bulk-update-featured
// @access  Private/Admin
export const bulkUpdateFeaturedStatus = async (req, res, next) => {
  try {
    const { careerIds, featured } = req.body;

    if (!Array.isArray(careerIds) || careerIds.length === 0) {
      return next(createError('No career IDs provided for bulk update', 400));
    }

    const result = await Career.updateMany(
      { _id: { $in: careerIds } },
      { $set: { featured: featured } }
    );

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'bulk_update_featured_status',
        modifiedCount: result.modifiedCount,
        featuredStatus: featured,
        careerIds: careerIds,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount },
      message: `${result.modifiedCount} careers updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import careers from a list
// @route   POST /api/careers/import
// @access  Private/Admin
export const importCareers = async (req, res, next) => {
  try {
    const { careers: careersToImport } = req.body;

    if (!Array.isArray(careersToImport) || careersToImport.length === 0) {
      return next(createError('No careers provided for import', 400));
    }

    let successCount = 0;
    let failedCount = 0;
    const failedImports = [];

    for (const careerData of careersToImport) {
      try {
        if (
          !careerData.title ||
          !careerData.category ||
          !careerData.description
        ) {
          failedImports.push({
            data: careerData,
            error: 'Missing required fields',
          });
          failedCount++;
          continue;
        }

        const existingCareer = await Career.findOne({
          title: careerData.title,
        });
        if (existingCareer) {
          failedImports.push({
            data: careerData,
            error: 'Career with this title already exists',
          });
          failedCount++;
          continue;
        }

        await Career.create(careerData);
        successCount++;
      } catch (error) {
        failedImports.push({ data: careerData, error: error.message });
        failedCount++;
      }
    }

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'import_careers',
        successCount,
        failedCount,
        failedImports,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: { success: successCount, failed: failedCount, failedImports },
      message: `Import complete: ${successCount} successful, ${failedCount} failed.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate a career
// @route   POST /api/careers/:id/duplicate
// @access  Private/Admin
export const duplicateCareer = async (req, res, next) => {
  try {
    const originalCareer = await Career.findById(req.params.id);

    if (!originalCareer) {
      return next(
        createError(`Career not found with id of ${req.params.id}`, 404)
      );
    }

    const { newTitle } = req.body;

    if (!newTitle) {
      return next(createError('New title is required for duplication', 400));
    }

    const existingCareer = await Career.findOne({ title: newTitle });
    if (existingCareer) {
      return next(
        createError(`Career with title "${newTitle}" already exists`, 400)
      );
    }

    const newCareerData = originalCareer.toObject();
    delete newCareerData._id;
    delete newCareerData.slug;
    delete newCareerData.createdAt;
    delete newCareerData.updatedAt;
    newCareerData.title = newTitle;
    newCareerData.views = 0;
    newCareerData.saves = 0;
    newCareerData.featured = false;

    const duplicatedCareer = await Career.create(newCareerData);

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'duplicate_career',
        originalCareerId: originalCareer._id,
        duplicatedCareerId: duplicatedCareer._id,
        newTitle: newTitle,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      data: duplicatedCareer,
      message: `Career "${originalCareer.title}" duplicated as "${newTitle}"`,
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
    const totalCareers = await Career.countDocuments();

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

    const mostViewedCareers = await Career.find()
      .sort('-views')
      .limit(5)
      .select('title category views');

    const mostSavedCareers = await Career.find()
      .sort('-saves')
      .limit(5)
      .select('title category saves');

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
    const trendingCareers = await Career.find({
      marketDemand: { $in: ['Very High', 'High'] },
    })
      .sort('-views')
      .limit(10)
      .select('title category marketDemand views');

    const emergingCareers = await Career.find()
      .sort({ createdAt: -1, views: -1 })
      .limit(5)
      .select('title category marketDemand createdAt');

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
    const highDemandCareers = await Career.find({
      marketDemand: { $in: ['Very High', 'High'] },
    })
      .sort('-views')
      .limit(10)
      .select('title category marketDemand jobProspects');

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

    const relatedCareers = await Career.find({
      _id: { $ne: req.params.id },
      category: career.category,
    })
      .limit(5)
      .select('title category marketDemand minimumMeanGrade');

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
