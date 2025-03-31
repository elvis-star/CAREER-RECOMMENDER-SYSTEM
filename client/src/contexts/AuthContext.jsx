'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../services/api';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  forgotPassword,
  resetPassword as resetPasswordApi,
  resendVerificationEmail,
  getCurrentUser,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { user } = await getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await registerUser(userData);

      // Check if email verification is required
      if (data.requireEmailVerification) {
        // Don't set token or authenticate if verification is required
        messageApi.success({
          content:
            'Registration successful! Please check your email to verify your account.',
          duration: 5,
        });
        return data;
      }

      // If no verification required, proceed with login
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setIsAuthenticated(true);

      messageApi.success({
        content:
          'Registration successful! Welcome to Career Recommender System!',
        duration: 5,
      });

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(credentials);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setIsAuthenticated(true);

      messageApi.success({
        content: `Welcome back, ${data.user.name}!`,
        duration: 5,
      });

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout endpoint if authenticated
      if (isAuthenticated) {
        await logoutUser();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);

      messageApi.info({
        content: 'You have been successfully logged out.',
        duration: 5,
      });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await updateUserProfile(userData);
      setUser(data.user);

      messageApi.success({
        content: 'Your profile has been successfully updated.',
        duration: 5,
      });

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const data = await forgotPassword(email);

      messageApi.success({
        content: 'Password reset link has been sent to your email.',
        duration: 5,
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Password reset request failed';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await resetPasswordApi(token, password);

      messageApi.success({
        content:
          'Password has been reset successfully. You can now log in with your new password.',
        duration: 5,
      });

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset failed';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const data = await resendVerificationEmail(email);

      messageApi.success({
        content: 'Verification email has been sent. Please check your inbox.',
        duration: 5,
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to resend verification email';
      setError(message);

      messageApi.error({
        content: message,
        duration: 5,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    resendVerification,
  };

  return (
    <>
      {contextHolder}
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
