import Institution from '../models/Institution.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';

// Helper function for type casting
const castInstitutionData = (data) => {
  const castedData = { ...data };

  // Cast number fields
  if (castedData.rankings) {
    if (castedData.rankings.national) {
      castedData.rankings.national =
        Number(castedData.rankings.national) || null;
    }
    if (castedData.rankings.international) {
      castedData.rankings.international =
        Number(castedData.rankings.international) || null;
    }
    if (castedData.rankings.year) {
      // Handle date string for rankings.year
      if (
        castedData.rankings.year &&
        typeof castedData.rankings.year === 'string'
      ) {
        if (castedData.rankings.year.includes('T')) {
          // It's a date string, extract just the year
          castedData.rankings.year = new Date(
            castedData.rankings.year
          ).getFullYear();
        } else {
          castedData.rankings.year = Number(castedData.rankings.year) || null;
        }
      }
    }
  }

  // Handle date string for establishedYear
  if (castedData.establishedYear) {
    if (
      typeof castedData.establishedYear === 'string' &&
      castedData.establishedYear.includes('T')
    ) {
      // It's a date string, extract just the year
      castedData.establishedYear = new Date(
        castedData.establishedYear
      ).getFullYear();
    } else {
      castedData.establishedYear = Number(castedData.establishedYear) || null;
    }
  }

  if (castedData.location && castedData.location.coordinates) {
    if (castedData.location.coordinates.latitude) {
      castedData.location.coordinates.latitude =
        Number(castedData.location.coordinates.latitude) || null;
    }
    if (castedData.location.coordinates.longitude) {
      castedData.location.coordinates.longitude =
        Number(castedData.location.coordinates.longitude) || null;
    }
  }

  // Cast boolean fields
  if (castedData.featured !== undefined) {
    castedData.featured =
      castedData.featured === true || castedData.featured === 'true';
  }

  // Ensure arrays are properly formatted
  if (castedData.facilities && !Array.isArray(castedData.facilities)) {
    castedData.facilities = castedData.facilities
      .split(',')
      .map((item) => item.trim());
  }

  if (castedData.accreditation && !Array.isArray(castedData.accreditation)) {
    castedData.accreditation = castedData.accreditation
      .split(',')
      .map((item) => item.trim());
  }

  if (castedData.images && !Array.isArray(castedData.images)) {
    castedData.images = castedData.images.split(',').map((item) => item.trim());
  }

  // Process programs array if it exists
  if (castedData.programs && Array.isArray(castedData.programs)) {
    castedData.programs = castedData.programs.map((program) => {
      const castedProgram = { ...program };

      // Process entry requirements
      if (castedProgram.entryRequirements) {
        // Ensure specificSubjects is an array
        if (
          castedProgram.entryRequirements.specificSubjects &&
          !Array.isArray(castedProgram.entryRequirements.specificSubjects)
        ) {
          castedProgram.entryRequirements.specificSubjects = [];
        }

        // Ensure additionalRequirements is an array
        if (
          castedProgram.entryRequirements.additionalRequirements &&
          !Array.isArray(castedProgram.entryRequirements.additionalRequirements)
        ) {
          castedProgram.entryRequirements.additionalRequirements =
            castedProgram.entryRequirements.additionalRequirements
              .split(',')
              .map((item) => item.trim());
        }
      }

      // Ensure careers is an array of ObjectIds
      if (castedProgram.careers && Array.isArray(castedProgram.careers)) {
        castedProgram.careers = castedProgram.careers.filter(
          (id) => id && id.trim() !== ''
        );
      }

      return castedProgram;
    });
  }

  return castedData;
};

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
    // Cast data to appropriate types
    const castedData = castInstitutionData(req.body);

    // Create the institution with the properly casted data
    const institution = await Institution.create(castedData);

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
    console.error('Error creating institution:', error);
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

    // Cast data to appropriate types
    const castedData = castInstitutionData(req.body);

    // Update the institution with the properly casted data
    institution = await Institution.findByIdAndUpdate(
      req.params.id,
      castedData,
      {
        new: true,
        runValidators: true,
      }
    );

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
    console.error('Error updating institution:', error);
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

    await institution.deleteOne(); // Using deleteOne instead of remove which is deprecated

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

    // Cast program data
    const programData = req.body;

    // Process entry requirements
    if (programData.entryRequirements) {
      // Ensure specificSubjects is an array
      if (
        programData.entryRequirements.specificSubjects &&
        !Array.isArray(programData.entryRequirements.specificSubjects)
      ) {
        programData.entryRequirements.specificSubjects = [];
      }

      // Ensure additionalRequirements is an array
      if (
        programData.entryRequirements.additionalRequirements &&
        !Array.isArray(programData.entryRequirements.additionalRequirements)
      ) {
        programData.entryRequirements.additionalRequirements =
          programData.entryRequirements.additionalRequirements
            .split(',')
            .map((item) => item.trim());
      }
    }

    // Ensure careers is an array of ObjectIds
    if (programData.careers && Array.isArray(programData.careers)) {
      programData.careers = programData.careers.filter(
        (id) => id && id.trim() !== ''
      );
    }

    institution.programs.push(programData);
    await institution.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'add_program',
        institutionId: req.params.id,
        programName: programData.name,
      },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    console.error('Error adding program:', error);
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

    // Cast program data
    const programData = req.body;

    // Process entry requirements
    if (programData.entryRequirements) {
      // Ensure specificSubjects is an array
      if (
        programData.entryRequirements.specificSubjects &&
        !Array.isArray(programData.entryRequirements.specificSubjects)
      ) {
        programData.entryRequirements.specificSubjects = [];
      }

      // Ensure additionalRequirements is an array
      if (
        programData.entryRequirements.additionalRequirements &&
        !Array.isArray(programData.entryRequirements.additionalRequirements)
      ) {
        programData.entryRequirements.additionalRequirements =
          programData.entryRequirements.additionalRequirements
            .split(',')
            .map((item) => item.trim());
      }
    }

    // Ensure careers is an array of ObjectIds
    if (programData.careers && Array.isArray(programData.careers)) {
      programData.careers = programData.careers.filter(
        (id) => id && id.trim() !== ''
      );
    }

    // Update program
    institution.programs[programIndex] = {
      ...institution.programs[programIndex].toObject(),
      ...programData,
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
    console.error('Error updating program:', error);
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

// @desc    Update institution featured status
// @route   PATCH /api/institutions/:id/featured
// @access  Private/Admin
export const updateFeaturedStatus = async (req, res, next) => {
  try {
    const { featured } = req.body;

    // Cast to boolean
    const featuredBoolean = featured === true || featured === 'true';

    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return next(
        createError(`Institution not found with id of ${req.params.id}`, 404)
      );
    }

    institution.featured = featuredBoolean;
    await institution.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'admin_action',
      details: {
        action: 'update_featured_status',
        institutionId: req.params.id,
        featured: featuredBoolean,
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

// @desc    Get institution statistics
// @route   GET /api/institutions/stats
// @access  Private/Admin
export const getInstitutionStats = async (req, res, next) => {
  try {
    const stats = await Institution.aggregate([
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          byType: [
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byCity: [
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          featuredCount: [{ $match: { featured: true } }, { $count: 'count' }],
          programsCount: [
            { $project: { programsCount: { $size: '$programs' } } },
            { $group: { _id: null, total: { $sum: '$programsCount' } } },
          ],
          recentlyAdded: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: { name: 1, type: 1, 'location.city': 1, createdAt: 1 },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCount: stats[0].totalCount[0]?.count || 0,
        byType: stats[0].byType,
        byCity: stats[0].byCity,
        featuredCount: stats[0].featuredCount[0]?.count || 0,
        programsCount: stats[0].programsCount[0]?.total || 0,
        recentlyAdded: stats[0].recentlyAdded,
      },
    });
  } catch (error) {
    next(error);
  }
};
