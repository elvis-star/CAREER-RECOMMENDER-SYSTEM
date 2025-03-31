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

// Get detailed information about a specific career
export const getCareerDetails = async (careerId) => {
  try {
    const response = await api.get(`/careers/${careerId}`);
    return response.data;
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
