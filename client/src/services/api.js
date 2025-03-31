import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid or expired
      if (
        error.response.data.message === 'Invalid token' ||
        error.response.data.message === 'Token expired'
      ) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await api.put('/users/update-password', passwordData);
  return response.data;
};

export const uploadProfileImage = async (formData) => {
  const response = await api.post('/users/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Session management
export const getUserSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

export const terminateSession = async (sessionId) => {
  const response = await api.delete(`/sessions/${sessionId}`);
  return response.data;
};

export const terminateAllSessions = async () => {
  const response = await api.delete('/sessions');
  return response.data;
};

// Career API calls
export const fetchCareers = async (params = {}) => {
  const response = await api.get('/careers', { params });
  return response.data;
};

export const fetchCareer = async (id) => {
  const response = await api.get(`/careers/${id}`);
  return response.data;
};

export const fetchCareerTrends = async () => {
  const response = await api.get('/careers/trends');
  return response.data;
};

export const fetchJobMarketInsights = async () => {
  const response = await api.get('/careers/job-market');
  return response.data;
};

export const fetchRelatedCareers = async (id) => {
  const response = await api.get(`/careers/${id}/related`);
  return response.data;
};

export const saveCareer = async (careerId) => {
  const response = await api.post(`/users/saved-careers/${careerId}`);
  return response.data;
};

export const unsaveCareer = async (careerId) => {
  const response = await api.delete(`/users/saved-careers/${careerId}`);
  return response.data;
};

// Institution API calls
export const fetchInstitutions = async (params = {}) => {
  const response = await api.get('/institutions', { params });
  return response.data;
};

export const fetchInstitution = async (id) => {
  const response = await api.get(`/institutions/${id}`);
  return response.data;
};

export const fetchInstitutionsByLocation = async (city) => {
  const response = await api.get(`/institutions/location/${city}`);
  return response.data;
};

export const fetchInstitutionsByProgram = async (program) => {
  const response = await api.get(`/institutions/programs/${program}`);
  return response.data;
};

// Recommendation API calls
export const submitResults = async (resultsData) => {
  const response = await api.post('/recommendations', resultsData);
  return response.data;
};

export const fetchUserRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const fetchRecommendation = async (id) => {
  const response = await api.get(`/recommendations/${id}`);
  return response.data;
};

// Admin API calls
export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminOverview = async () => {
  const response = await api.get('/admin/overview');
  return response.data;
};

export const fetchActivityLogs = async (params = {}) => {
  const response = await api.get('/admin/activity', { params });
  return response.data;
};

export const fetchSystemHealth = async () => {
  const response = await api.get('/admin/health');
  return response.data;
};

export const fetchUserGrowth = async () => {
  const response = await api.get('/admin/user-growth');
  return response.data;
};

export const fetchCareerPopularity = async () => {
  const response = await api.get('/admin/career-popularity');
  return response.data;
};

export const performBackup = async () => {
  const response = await api.post('/admin/backup');
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Get Cloudinary signature for direct uploads
export const getCloudinarySignature = async (folder = 'uploads') => {
  const response = await api.get(`/cloudinary/signature?folder=${folder}`);
  return response.data;
};

// Upload file to Cloudinary using the widget (this is a client-side function)
export const uploadToCloudinary = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64data = reader.result;
        const formData = new FormData();

        // Get signature from our backend
        const signatureData = await getCloudinarySignature(options.folder);

        // Add all required parameters
        formData.append('file', base64data);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);

        // Make direct request to Cloudinary API
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`,
          formData
        );

        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export default api;
