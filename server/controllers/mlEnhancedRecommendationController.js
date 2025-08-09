import { callMLService } from '../utils/mlHelper.js';
import Recommendation from '../models/Recommendation.js';
import Career from '../models/Career.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';

// Helper functions from your existing recommendationController.js
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

const generateReasons = (kcseResults, career, match) => {
  const reasons = [];

  // Mean grade reason
  const gradeMap = {
    A: 'excellent',
    'A-': 'excellent',
    'B+': 'very good',
    B: 'good',
    'B-': 'good',
    'C+': 'average',
    C: 'average',
    'C-': 'below average',
    'D+': 'poor',
    D: 'poor',
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
    'History & Government': 'Humanities',
    Geography: 'Humanities',
    'Christian Religious Education': 'Humanities',
    'Islamic Religious Education': 'Humanities',
    'Hindu Religious Education': 'Humanities',
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

// Enhanced recommendation generation with ML
export const generateMLEnhancedRecommendations = async (req, res, next) => {
  try {
    // Fix the nested results issue
    const resultsData =
      req.body.results?.results || req.body.results || req.body;
    const { year, subjects, meanGrade, meanPoints } = resultsData;

    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    // First, get rule-based recommendations using your existing logic
    const careers = await Career.find();
    const ruleBasedRecommendations = [];

    // Use your existing calculateMatchScore logic
    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      if (match >= 50) {
        ruleBasedRecommendations.push({
          id: career._id,
          title: career.title,
          match,
          category: career.category,
          description: career.description,
          keySubjects: career.keySubjects,
          minimumMeanGrade: career.minimumMeanGrade,
          marketDemand: career.marketDemand,
          salary: career.salary,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    // Sort by match score
    ruleBasedRecommendations.sort((a, b) => b.match - a.match);

    // Enhance with ML if user is authenticated
    let enhancedRecommendations = ruleBasedRecommendations;
    let mlEnhanced = false;

    if (req.user) {
      try {
        const user = await User.findById(req.user._id);

        // Call ML service to enhance recommendations
        const mlResult = await callMLService('enhance_recommendations', {
          user: user.toObject(),
          recommendations: ruleBasedRecommendations.slice(0, 20), // Top 20 for ML processing
        });

        if (mlResult.success) {
          enhancedRecommendations =
            mlResult.enhanced_recommendations || ruleBasedRecommendations;
          mlEnhanced = mlResult.ml_enhanced || false;
        }

        // Log ML enhancement
        await Activity.create({
          user: req.user._id,
          action: 'ml_enhanced_recommendations',
          details: {
            original_count: ruleBasedRecommendations.length,
            enhanced_count: enhancedRecommendations.length,
            ml_enhanced: mlEnhanced,
          },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
      } catch (mlError) {
        console.error(
          'ML Enhancement failed, falling back to rule-based:',
          mlError
        );
        // Continue with rule-based recommendations if ML fails
      }
    }

    // Save recommendation record and populate career details
    if (req.user) {
      // Save KCSE results to user profile
      const user = await User.findById(req.user._id);
      user.kcseResults = { year, meanGrade, meanPoints, subjects };
      await user.save();

      // Create recommendation record with ML enhancement flag
      await Recommendation.create({
        user: req.user._id,
        kcseResults: { year, meanGrade, meanPoints, subjects },
        strengths: determineStrengths(subjects),
        recommendations: enhancedRecommendations.slice(0, 10).map((rec) => ({
          career: rec.id,
          match: rec.ml_enhanced_score || rec.match,
          reasons: [...(rec.reasons || []), ...(rec.ml_reasons || [])],
          mlEnhanced: !!rec.ml_enhanced_score,
          improvementSuggestions: rec.improvement_suggestions || [],
        })),
      });
    }

    // Populate career details for response
    const populatedRecommendations = [];
    for (const rec of enhancedRecommendations.slice(0, 10)) {
      const career = await Career.findById(rec.id).populate(
        'institutions',
        'name type location.city logo'
      );

      populatedRecommendations.push({
        ...rec,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        improvementSuggestions: rec.improvement_suggestions || [],
      });
    }

    res.status(200).json({
      success: true,
      mlEnhanced: mlEnhanced,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths: determineStrengths(subjects),
      },
      recommendations: populatedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// Update ML-enhanced recommendations
export const updateMLEnhancedRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultsData =
      req.body.results?.results || req.body.results || req.body;
    const { year, subjects, meanGrade, meanPoints } = resultsData;

    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    // Find existing recommendation
    let existingRecommendation;
    if (id === 'current') {
      existingRecommendation = await Recommendation.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });
    } else {
      existingRecommendation = await Recommendation.findById(id);
    }

    if (!existingRecommendation) {
      return next(createError('Recommendation not found', 404));
    }

    // Generate new recommendations using the same logic as create
    const careers = await Career.find();
    const ruleBasedRecommendations = [];

    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      if (match >= 50) {
        ruleBasedRecommendations.push({
          id: career._id,
          title: career.title,
          match,
          category: career.category,
          description: career.description,
          keySubjects: career.keySubjects,
          minimumMeanGrade: career.minimumMeanGrade,
          marketDemand: career.marketDemand,
          salary: career.salary,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    ruleBasedRecommendations.sort((a, b) => b.match - a.match);

    // Enhance with ML
    let enhancedRecommendations = ruleBasedRecommendations;
    let mlEnhanced = false;

    try {
      const user = await User.findById(req.user._id);

      const mlResult = await callMLService('enhance_recommendations', {
        user: user.toObject(),
        recommendations: ruleBasedRecommendations.slice(0, 20),
      });

      if (mlResult.success) {
        enhancedRecommendations =
          mlResult.enhanced_recommendations || ruleBasedRecommendations;
        mlEnhanced = mlResult.ml_enhanced || false;
      }
    } catch (mlError) {
      console.error('ML Enhancement failed during update:', mlError);
    }

    // Update user's KCSE results
    const user = await User.findById(req.user._id);
    user.kcseResults = { year, meanGrade, meanPoints, subjects };
    await user.save();

    // Update the recommendation record
    existingRecommendation.kcseResults = {
      year,
      meanGrade,
      meanPoints,
      subjects,
    };
    existingRecommendation.strengths = determineStrengths(subjects);
    existingRecommendation.recommendations = enhancedRecommendations
      .slice(0, 10)
      .map((rec) => ({
        career: rec.id,
        match: rec.ml_enhanced_score || rec.match,
        reasons: [...(rec.reasons || []), ...(rec.ml_reasons || [])],
        mlEnhanced: !!rec.ml_enhanced_score,
        improvementSuggestions: rec.improvement_suggestions || [],
      }));
    existingRecommendation.updatedAt = new Date();

    await existingRecommendation.save();

    // Populate career details for response
    const populatedRecommendations = [];
    for (const rec of enhancedRecommendations.slice(0, 10)) {
      const career = await Career.findById(rec.id).populate(
        'institutions',
        'name type location.city logo'
      );

      populatedRecommendations.push({
        ...rec,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        improvementSuggestions: rec.improvement_suggestions || [],
      });
    }

    res.status(200).json({
      success: true,
      mlEnhanced: mlEnhanced,
      updated: true,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths: determineStrengths(subjects),
      },
      recommendations: populatedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// Get ML-based similar careers
export const getSimilarCareers = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { limit = 5 } = req.query;

    // Call ML service for similar careers
    const mlResult = await callMLService('similar_careers', null, [
      careerId,
      limit.toString(),
    ]);

    if (mlResult.success && mlResult.similar_careers.length > 0) {
      const similarCareerIds = mlResult.similar_careers.map(
        (sc) => sc.career_id
      );

      // Populate career details
      const similarCareers = await Career.find({
        _id: { $in: similarCareerIds },
      }).populate('institutions', 'name type location.city logo');

      // Combine ML scores with career data
      const enrichedSimilarCareers = similarCareers.map((career) => {
        const mlData = mlResult.similar_careers.find(
          (sc) => sc.career_id === career._id.toString()
        );
        return {
          ...career.toObject(),
          similarity_score: mlData?.similarity_score || 0,
        };
      });

      res.status(200).json({
        success: true,
        data: enrichedSimilarCareers,
      });
    } else {
      // Fallback to category-based similarity
      const career = await Career.findById(careerId);
      const similarCareers = await Career.find({
        category: career.category,
        _id: { $ne: career._id },
      }).limit(Number.parseInt(limit) || 5);

      res.status(200).json({
        success: true,
        data: similarCareers,
        fallback: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get career trends using ML
export const getCareerTrends = async (req, res, next) => {
  try {
    // Get historical recommendation data
    const historicalData = await Recommendation.find({
      createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last year
    }).populate('recommendations.career', 'title category');

    // Call ML service for trend prediction
    const mlResult = await callMLService('predict_trends', {
      historical_data: historicalData,
    });

    if (mlResult.success) {
      // Populate career details for trends
      const trendCareerIds = mlResult.trends.map((t) => t.career_id);
      const careers = await Career.find({ _id: { $in: trendCareerIds } });

      const enrichedTrends = mlResult.trends
        .map((trend) => {
          const career = careers.find(
            (c) => c._id.toString() === trend.career_id
          );
          return {
            ...trend,
            career: career
              ? {
                  title: career.title,
                  category: career.category,
                  marketDemand: career.marketDemand,
                }
              : null,
          };
        })
        .filter((t) => t.career); // Remove trends for careers that don't exist

      res.status(200).json({
        success: true,
        trends: enrichedTrends,
      });
    } else {
      res.status(200).json({
        success: true,
        trends: [],
        message: 'No trend data available',
      });
    }
  } catch (error) {
    next(error);
  }
};

// ML System health check
export const getMLSystemHealth = async (req, res, next) => {
  try {
    const healthResult = await callMLService('health_check');
    res.status(200).json({
      success: true,
      ...healthResult,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      healthy: false,
      status: 'unavailable',
      error: error.message,
    });
  }
};
