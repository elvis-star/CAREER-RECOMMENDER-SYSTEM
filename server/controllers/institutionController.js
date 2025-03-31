import Institution from '../models/Institution.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';

// @desc    Get all institutions
// @route   GET /api/institutions
// @access  Public
export const getInstitutions = async (req, res, next) => {
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
    query = Institution.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { name: searchRegex },
        { type: searchRegex },
        { 'location.city': searchRegex },
        { description: searchRegex },
        { 'programs.name': searchRegex },
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
    const total = await Institution.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const institutions = await query;

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
      count: institutions.length,
      pagination,
      total,
      data: institutions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single institution
// @route   GET /api/institutions/:id
// @access  Public
export const getInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    // Increment views
    institution.views += 1;
    await institution.save();

    // Log activity if user is authenticated
    if (req.user) {
      await Activity.create({
        user: req.user._id,
        action: 'view_institution',
        details: { institutionId: req.params.id },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new institution
// @route   POST /api/institutions
// @access  Private/Admin
export const createInstitution = async (req, res, next) => {
  try {
    // Create the institution with the data from the request body
    // The logo and images will now be Cloudinary URLs
    const institution = await Institution.create(req.body);

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'create_institution', institutionId: institution._id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update institution
// @route   PUT /api/institutions/:id
// @access  Private/Admin
export const updateInstitution = async (req, res, next) => {
  try {
    let institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    // Update the institution with the data from the request body
    institution = await Institution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'update_institution', institutionId: req.params.id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete institution
// @route   DELETE /api/institutions/:id
// @access  Private/Admin
export const deleteInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    await institution.remove();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: { action: 'delete_institution', institutionId: req.params.id },
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

// @desc    Add program to institution
// @route   POST /api/institutions/:id/programs
// @access  Private/Admin
export const addProgram = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    institution.programs.push(req.body);
    await institution.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'add_program',
        institutionId: req.params.id,
        programName: req.body.name,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update program in institution
// @route   PUT /api/institutions/:id/programs/:programId
// @access  Private/Admin
export const updateProgram = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    // Find program index
    const programIndex = institution.programs.findIndex(
      (program) => program._id.toString() === req.params.programId
    );

    if (programIndex === -1) {
      return next(
        createError(`Program not found with id of ${req.params.programId}`, 404)
      );
    }

    // Update program
    institution.programs[programIndex] = {
      ...institution.programs[programIndex].toObject(),
      ...req.body,
      _id: req.params.programId,
    };

    await institution.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'update_program',
        institutionId: req.params.id,
        programId: req.params.programId,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete program from institution
// @route   DELETE /api/institutions/:id/programs/:programId
// @access  Private/Admin
export const deleteProgram = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    // Find program index
    const programIndex = institution.programs.findIndex(
      (program) => program._id.toString() === req.params.programId
    );

    if (programIndex === -1) {
      return next(
        createError(`Program not found with id of ${req.params.programId}`, 404)
      );
    }

    // Remove program
    institution.programs.splice(programIndex, 1);
    await institution.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'delete_program',
        institutionId: req.params.id,
        programId: req.params.programId,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get institutions by location
// @route   GET /api/institutions/location/:city
// @access  Public
export const getInstitutionsByLocation = async (req, res, next) => {
  try {
    const institutions = await Institution.find({
      'location.city': new RegExp(req.params.city, 'i'),
    }).select('name type location.city location.county programs');

    res.status(200).json({
      success: true,
      count: institutions.length,
      data: institutions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get institutions by program
// @route   GET /api/institutions/programs/:program
// @access  Public
export const getInstitutionsByProgram = async (req, res, next) => {
  try {
    const institutions = await Institution.find({
      'programs.name': new RegExp(req.params.program, 'i'),
    }).select('name type location.city programs');

    res.status(200).json({
      success: true,
      count: institutions.length,
      data: institutions,
    });
  } catch (error) {
    next(error);
  }
};
