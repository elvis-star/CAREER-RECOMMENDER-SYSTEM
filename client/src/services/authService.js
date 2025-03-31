import api from './api';

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

// Check reset token validity
export const checkResetToken = async (token) => {
  const response = await api.get(`/auth/check-reset-token/${token}`);
  return response.data;
};

// Check verification token validity
export const checkVerificationToken = async (token) => {
  const response = await api.get(`/auth/check-verification-token/${token}`);
  return response.data;
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/update-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Get user sessions
export const getUserSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

// Revoke session
export const revokeSession = async (sessionId) => {
  const response = await api.delete(`/sessions/${sessionId}`);
  return response.data;
};

// Invite admin
export const inviteAdmin = async (name, email) => {
  const response = await api.post('/admin/invite', { name, email });
  return response.data;
};

// Accept admin invitation
export const acceptAdminInvitation = async (token, password) => {
  const response = await api.post(`/admin/accept-invitation/${token}`, {
    password,
  });
  return response.data;
};
