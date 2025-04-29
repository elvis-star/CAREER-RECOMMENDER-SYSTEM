import Recommendation from '../models/Recommendation.js';
import Career from '../models/Career.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';
import { sendRecommendationEmail } from '../utils/email.js';

// Helper function to calculate match score
const calculateMatchScore = (kcseResults, career) => {
  let score = 0;
  let maxScore = 0;

  // Convert KCSE grades to points
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  // Convert minimum mean grade to points
  const minGradePoints = gradePoints[career.minimumMeanGrade] || 0;

  // Check if mean grade meets minimum requirement
  const meanGradePoints = gradePoints[kcseResults.meanGrade] || 0;
  if (meanGradePoints < minGradePoints) {
    return 0; // Doesn't meet minimum requirements
  }

  // Base score from mean grade match (up to 40%)
  const meanGradeScore = (meanGradePoints / 12) * 40;
  score += meanGradeScore;
  maxScore += 40;

  // Check subject requirements (up to 40%)
  const subjectMap = {};
  kcseResults.subjects.forEach((subject) => {
    subjectMap[subject.subject.toLowerCase()] = {
      grade: subject.grade,
      points: gradePoints[subject.grade] || 0,
    };
  });

  let subjectScore = 0;
  let requiredSubjectsCount = 0;

  // Check each key subject
  career.keySubjects.forEach((subject) => {
    requiredSubjectsCount++;
    const subjectLower = subject.toLowerCase();

    // Check if student has taken this subject
    if (subjectMap[subjectLower]) {
      // Check required grade if specified
      const requiredGrade =
        career.requiredGrades && career.requiredGrades.get(subject);

      if (requiredGrade) {
        const requiredPoints = gradePoints[requiredGrade] || 0;
        if (subjectMap[subjectLower].points >= requiredPoints) {
          subjectScore += 10; // Full points for meeting specific requirement
        } else {
          subjectScore += 5; // Partial points for taking subject but not meeting grade
        }
      } else {
        // No specific grade required, points based on performance
        subjectScore += (subjectMap[subjectLower].points / 12) * 10;
      }
    }
  });

  // Calculate percentage of subject score
  const subjectPercentage =
    requiredSubjectsCount > 0
      ? (subjectScore / (requiredSubjectsCount * 10)) * 40
      : 0;

  score += subjectPercentage;
  maxScore += 40;

  // Market demand bonus (up to 20%)
  const demandBonus = {
    'Very High': 20,
    High: 15,
    Medium: 10,
    Low: 5,
  };

  score += demandBonus[career.marketDemand] || 0;
  maxScore += 20;

  // Calculate final percentage
  const finalScore = Math.round((score / maxScore) * 100);

  return finalScore;
};

// @desc    Generate career recommendations
// @route   POST /api/recommendations
// @access  Public
export const generateRecommendations = async (req, res, next) => {
  try {
    const { year, subjects, meanGrade, meanPoints } = req.body.results;
    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    // Get all careers
    const careers = await Career.find();

    // Calculate match scores for each career
    const recommendations = [];

    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      // Only include careers with at least 50% match
      if (match >= 50) {
        recommendations.push({
          career: career._id,
          match,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    // Sort recommendations by match score (descending)
    recommendations.sort((a, b) => b.match - a.match);

    // Determine academic strengths
    const strengths = determineStrengths(subjects);

    // Create recommendation record if user is authenticated
    if (req.user) {
      // Save KCSE results to user profile
      const user = await User.findById(req.user._id);
      user.kcseResults = {
        year,
        meanGrade,
        meanPoints,
        subjects,
      };
      await user.save();

      // Create recommendation record
      await Recommendation.create({
        user: req.user._id,
        kcseResults: {
          year,
          meanGrade,
          meanPoints,
          subjects,
        },
        strengths,
        recommendations,
      });

      // Log activity
      await Activity.create({
        user: req.user._id,
        action: 'generate_recommendations',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Send recommendation email
      try {
        // Populate career details for the email
        const topCareers = [];
        for (const rec of recommendations.slice(0, 3)) {
          // Top 3 for email
          const career = await Career.findById(rec.career);
          topCareers.push({
            title: career.title,
            match: rec.match,
            description: career.description,
          });
        }

        await sendRecommendationEmail(user.email, user.name, topCareers);
      } catch (emailError) {
        console.error('Failed to send recommendation email:', emailError);
        // Continue even if email fails
      }
    }

    // Populate career details for response
    const populatedRecommendations = [];

    for (const rec of recommendations.slice(0, 10)) {
      // Limit to top 10
      const career = await Career.findById(rec.career);
      populatedRecommendations.push({
        id: career._id,
        title: career.title,
        match: rec.match,
        category: career.category,
        description: career.description,
        keySubjects: career.keySubjects,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        marketDemand: career.marketDemand,
        salary: career.salary,
        reasons: rec.reasons,
      });
    }

    res.status(200).json({
      success: true,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths,
      },
      recommendations: populatedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate reasons for recommendation
const generateReasons = (kcseResults, career, match) => {
  const reasons = [];

  // Mean grade reason
  const gradeMap = {
    A: 'excellent',
    'A-': 'excellent',
    'B+': 'very good',
    B: 'good',
    'B-': 'good',
    'C+': 'satisfactory',
    C: 'average',
    'C-': 'average',
    'D+': 'below average',
    D: 'below average',
    'D-': 'poor',
    E: 'poor',
  };

  const performanceLevel = gradeMap[kcseResults.meanGrade] || 'average';

  if (match >= 90) {
    reasons.push(
      `Your ${performanceLevel} overall performance aligns perfectly with this career path.`
    );
  } else if (match >= 75) {
    reasons.push(
      `Your ${performanceLevel} overall performance is well-suited for this career.`
    );
  } else if (match >= 60) {
    reasons.push(
      `Your ${performanceLevel} overall performance meets the requirements for this career.`
    );
  } else {
    reasons.push(
      `Your overall performance meets the minimum requirements for this career.`
    );
  }

  // Subject match reasons
  const subjectMap = {};
  kcseResults.subjects.forEach((subject) => {
    subjectMap[subject.subject.toLowerCase()] = subject.grade;
  });

  const matchedSubjects = [];
  career.keySubjects.forEach((subject) => {
    const subjectLower = subject.toLowerCase();
    if (subjectMap[subjectLower]) {
      matchedSubjects.push(subject);
    }
  });

  if (matchedSubjects.length > 0) {
    if (matchedSubjects.length === career.keySubjects.length) {
      reasons.push(
        `You've studied all the key subjects required for this career: ${matchedSubjects.join(
          ', '
        )}.`
      );
    } else {
      reasons.push(
        `You've studied ${matchedSubjects.length} of ${
          career.keySubjects.length
        } key subjects for this career: ${matchedSubjects.join(', ')}.`
      );
    }
  }

  // Market demand reason
  if (career.marketDemand === 'Very High') {
    reasons.push('This career has very high demand in the current job market.');
  } else if (career.marketDemand === 'High') {
    reasons.push('This career has high demand in the current job market.');
  }

  return reasons;
};

// Helper function to determine academic strengths
const determineStrengths = (subjects) => {
  const subjectCategories = {
    Mathematics: 'Sciences',
    Physics: 'Sciences',
    Chemistry: 'Sciences',
    Biology: 'Sciences',
    English: 'Languages',
    Kiswahili: 'Languages',
    French: 'Languages',
    German: 'Languages',
    Arabic: 'Languages',
    History: 'Humanities',
    Geography: 'Humanities',
    'Religious Education': 'Humanities',
    'Business Studies': 'Commerce',
    Economics: 'Commerce',
    Accounting: 'Commerce',
    'Computer Studies': 'Technical',
    Agriculture: 'Technical',
    'Home Science': 'Technical',
    'Art & Design': 'Creative Arts',
    Music: 'Creative Arts',
  };

  // Group subjects by category and calculate average points
  const categoryPoints = {};
  const categoryCount = {};

  // Grade to points mapping
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  subjects.forEach((subject) => {
    const category = subjectCategories[subject.subject] || 'Other';
    const points = gradePoints[subject.grade] || 0;

    if (!categoryPoints[category]) {
      categoryPoints[category] = 0;
      categoryCount[category] = 0;
    }

    categoryPoints[category] += points;
    categoryCount[category]++;
  });

  // Calculate average points per category
  const categoryAverages = {};
  Object.keys(categoryPoints).forEach((category) => {
    categoryAverages[category] =
      categoryPoints[category] / categoryCount[category];
  });

  // Determine top 3 strengths
  const strengths = Object.keys(categoryAverages)
    .sort((a, b) => categoryAverages[b] - categoryAverages[a])
    .slice(0, 3);

  return strengths;
};

// @desc    Get user's recommendations
// @route   GET /api/recommendations
// @access  Private
export const getUserRecommendations = async (req, res, next) => {
  try {
    // Get the most recent recommendation
    const recommendation = await Recommendation.findOne({ user: req.user._id })
      .sort('-createdAt')
      .populate({
        path: 'recommendations.career',
        select:
          'title category description keySubjects jobProspects marketDemand salary institutions',
      });

    if (!recommendation) {
      return next(
        createError(
          'No recommendations found. Please input your KCSE results first.',
          404
        )
      );
    }

    // Format response
    const formattedRecommendations = recommendation.recommendations.map(
      (rec) => ({
        id: rec.career._id,
        title: rec.career.title,
        match: rec.match,
        category: rec.career.category,
        description: rec.career.description,
        keySubjects: rec.career.keySubjects,
        institutions: rec.career.institutions,
        jobProspects: rec.career.jobProspects,
        marketDemand: rec.career.marketDemand,
        salary: rec.career.salary,
        saved: rec.saved,
        reasons: rec.reasons,
      })
    );

    res.status(200).json({
      success: true,
      studentInfo: {
        meanGrade: recommendation.kcseResults.meanGrade,
        meanPoints: recommendation.kcseResults.meanPoints,
        strengths: recommendation.strengths,
      },
      recommendations: formattedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommendation history
// @route   GET /api/recommendations/history
// @access  Private
export const getRecommendationHistory = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user._id })
      .sort('-createdAt')
      .select(
        'createdAt kcseResults.meanGrade kcseResults.meanPoints strengths'
      );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific recommendation
// @route   GET /api/recommendations/:id
// @access  Private
export const getRecommendation = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(
      req.params.id
    ).populate({
      path: 'recommendations.career',
      select:
        'title category description keySubjects jobProspects marketDemand salary institutions',
    });

    if (!recommendation) {
      return next(
        createError(`Recommendation not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if recommendation belongs to user
    if (
      recommendation.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        createError('Not authorized to access this recommendation', 401)
      );
    }

    // Format response
    const formattedRecommendations = recommendation.recommendations.map(
      (rec) => ({
        id: rec.career._id,
        title: rec.career.title,
        match: rec.match,
        category: rec.career.category,
        description: rec.career.description,
        keySubjects: rec.career.keySubjects,
        institutions: rec.career.institutions,
        jobProspects: rec.career.jobProspects,
        marketDemand: rec.career.marketDemand,
        salary: rec.career.salary,
        saved: rec.saved,
        reasons: rec.reasons,
      })
    );

    res.status(200).json({
      success: true,
      studentInfo: {
        meanGrade: recommendation.kcseResults.meanGrade,
        meanPoints: recommendation.kcseResults.meanPoints,
        strengths: recommendation.strengths,
      },
      recommendations: formattedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update saved status in recommendation
// @route   PUT /api/recommendations/:id/careers/:careerId
// @access  Private
export const updateSavedStatus = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return next(
        createError(`Recommendation not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if recommendation belongs to user
    if (recommendation.user.toString() !== req.user.id) {
      return next(
        createError('Not authorized to update this recommendation', 401)
      );
    }

    // Find the career in recommendations
    const careerRec = recommendation.recommendations.find(
      (rec) => rec.career.toString() === req.params.careerId
    );

    if (!careerRec) {
      return next(createError(`Career not found in this recommendation`, 404));
    }

    // Update saved status
    careerRec.saved = req.body.saved;
    await recommendation.save();

    // Update user's saved careers
    const user = await User.findById(req.user.id);

    if (req.body.saved) {
      // Add to saved careers if not already there
      if (!user.savedCareers.includes(req.params.careerId)) {
        user.savedCareers.push(req.params.careerId);

        // Increment saves count on career
        const career = await Career.findById(req.params.careerId);
        if (career) {
          career.saves += 1;
          await career.save();
        }

        // Log activity
        await Activity.create({
          user: req.user._id,
          action: 'save_career',
          details: { careerId: req.params.careerId },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
      }
    } else {
      // Remove from saved careers
      user.savedCareers = user.savedCareers.filter(
        (id) => id.toString() !== req.params.careerId
      );

      // Log activity
      await Activity.create({
        user: req.user._id,
        action: 'remove_saved_career',
        details: { careerId: req.params.careerId },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's KCSE results and regenerate recommendations
// @route   PUT /api/recommendations/:id
// @access  Private
export const updateUserRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    if (
      !results ||
      !results.subjects ||
      !Array.isArray(results.subjects) ||
      results.subjects.length < 7
    ) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    let recommendation;

    // If ID is 'current', update the most recent recommendation
    if (id === 'current') {
      recommendation = await Recommendation.findOne({
        user: req.user._id,
      }).sort('-createdAt');

      if (!recommendation) {
        return next(
          createError('No existing recommendation found to update', 404)
        );
      }
    } else {
      // Find the specific recommendation by ID
      recommendation = await Recommendation.findById(id);

      // Check if recommendation exists
      if (!recommendation) {
        return next(
          createError(`Recommendation not found with id of ${id}`, 404)
        );
      }

      // Check if recommendation belongs to user
      if (recommendation.user.toString() !== req.user._id.toString()) {
        return next(
          createError('Not authorized to update this recommendation', 401)
        );
      }
    }

    // Update KCSE results
    recommendation.kcseResults = {
      year: results.year,
      meanGrade: results.meanGrade,
      meanPoints: results.meanPoints,
      subjects: results.subjects,
    };

    // Determine academic strengths
    const strengths = determineStrengths(results.subjects);
    recommendation.strengths = strengths;

    // Get all careers
    const careers = await Career.find();

    // Calculate match scores for each career
    const recommendations = [];

    for (const career of careers) {
      const match = calculateMatchScore(
        {
          year: results.year,
          subjects: results.subjects,
          meanGrade: results.meanGrade,
          meanPoints: results.meanPoints,
        },
        career
      );

      // Only include careers with at least 50% match
      if (match >= 50) {
        recommendations.push({
          career: career._id,
          match,
          reasons: generateReasons(
            {
              year: results.year,
              subjects: results.subjects,
              meanGrade: results.meanGrade,
              meanPoints: results.meanPoints,
            },
            career,
            match
          ),
          saved: false, // Reset saved status on update
        });
      }
    }

    // Sort recommendations by match score (descending)
    recommendations.sort((a, b) => b.match - a.match);

    // Update recommendations
    recommendation.recommendations = recommendations;
    recommendation.updatedAt = Date.now();

    await recommendation.save();

    // Update user's KCSE results
    const user = await User.findById(req.user._id);
    user.kcseResults = {
      year: results.year,
      meanGrade: results.meanGrade,
      meanPoints: results.meanPoints,
      subjects: results.subjects,
    };
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'update_recommendations',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Populate career details for response
    const populatedRecommendations = [];

    for (const rec of recommendations.slice(0, 10)) {
      // Limit to top 10
      const career = await Career.findById(rec.career);
      populatedRecommendations.push({
        id: career._id,
        title: career.title,
        match: rec.match,
        category: career.category,
        description: career.description,
        keySubjects: career.keySubjects,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        marketDemand: career.marketDemand,
        salary: career.salary,
        reasons: rec.reasons,
      });
    }

    res.status(200).json({
      success: true,
      studentInfo: {
        meanGrade: results.meanGrade,
        meanPoints: results.meanPoints,
        strengths,
      },
      recommendations: populatedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};
