/* eslint-disable no-useless-catch */
import api from './api';

// Get career recommendations based on KCSE results
export const getRecommendations = async (results) => {
  try {
    const response = await api.post('/recommendations', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get career recommendations based on KCSE results
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

// Get User career recommendations
export const fetchRecommendationsForUser = async (results) => {
  try {
    const response = await api.get('/recommendations', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Get career recommendations Logged In User History
export const fetchRecommendationHistoryForUser = async (results) => {
  try {
    const response = await api.get('/recommendations/history', { results });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get detailed information about a specific career
export const getCareerDetails = async (careerId) => {
  try {
    const response = await api.get(`/careers/${careerId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get all available careers
export const getAllCareers = async () => {
  try {
    const response = await api.get('/careers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get career statistics
export const getCareerStatistics = async () => {
  try {
    const response = await api.get('/careers/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Save user's career preferences
export const saveCareerPreferences = async (preferences) => {
  try {
    const response = await api.post('/users/preferences', { preferences });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get career trends
export const getCareerTrends = async () => {
  try {
    const response = await api.get('/careers/trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get job market insights
export const getJobMarketInsights = async () => {
  try {
    const response = await api.get('/careers/job-market');
    return response.data;
  } catch (error) {
    throw error;
  }
};
