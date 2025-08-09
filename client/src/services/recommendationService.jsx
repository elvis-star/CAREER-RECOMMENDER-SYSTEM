/* eslint-disable no-useless-catch */
import api from './api';

// Existing functions
export const getRecommendations = async (results) => {
  try {
    const response = await api.post('/recommendations', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRecommendations = async (results) => {
  try {
    const response = await api.put(
      `/recommendations/update/${results.id}`,
      results
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRecommendationsForUser = async (results) => {
  try {
    const response = await api.get('/recommendations', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRecommendationHistoryForUser = async (results) => {
  try {
    const response = await api.get('/recommendations/history', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCareerDetails = async (careerId) => {
  try {
    const response = await api.get(`/careers/${careerId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCareers = async () => {
  try {
    const response = await api.get('/careers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCareerStatistics = async () => {
  try {
    const response = await api.get('/careers/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveCareerPreferences = async (preferences) => {
  try {
    const response = await api.post('/users/preferences', { preferences });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCareerTrends = async () => {
  try {
    const response = await api.get('/careers/trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobMarketInsights = async () => {
  try {
    const response = await api.get('/careers/job-market');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New ML-enhanced functions
export const getMLEnhancedRecommendations = async (results) => {
  try {
    const response = await api.post('/mlRecommendations/ml-enhanced', {
      results,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//updateRecommendations function
export const updateMLEnhancedRecommendations = async (results) => {
  try {
    const response = await api.put(
      `/mlRecommendations/ml-enhanced/${results.id}`,
      {
        results,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSimilarCareers = async (careerId, limit = 5) => {
  try {
    const response = await api.get(
      `/mlRecommendations/similar/${careerId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMLCareerTrends = async () => {
  try {
    const response = await api.get('/mlRecommendations/trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMLSystemHealth = async () => {
  try {
    const response = await api.get('/mlRecommendations/ml-health');
    return response.data;
  } catch (error) {
    throw error;
  }
};
