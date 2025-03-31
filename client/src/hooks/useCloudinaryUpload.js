'use client';

import { useState } from 'react';
import { getCloudinarySignature } from '../services/api';

/**
 * Custom hook for handling Cloudinary uploads
 * @param {Object} options - Options for the upload
 * @returns {Object} - Upload state and functions
 */
const useCloudinaryUpload = (options = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  /**
   * Upload a file to Cloudinary
   * @param {File} file - The file to upload
   * @returns {Promise<string>} - The URL of the uploaded file
   */
  const uploadFile = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Get signature from our backend
      const folder = options.folder || 'uploads';
      const signatureData = await getCloudinarySignature(folder);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('signature', signatureData.signature);
      formData.append('folder', folder);

      // Add optional parameters
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }

      // Upload directly to Cloudinary
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Create a promise to handle the upload
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`
        );

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setUploadedUrl(response.secure_url);
            resolve(response.secure_url);
          } else {
            setUploadError('Upload failed');
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => {
          setUploadError('Network error');
          reject(new Error('Network error'));
        };

        xhr.send(formData);
      });

      const url = await uploadPromise;
      return url;
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    uploadError,
    uploadedUrl,
    resetUpload: () => {
      setUploadedUrl('');
      setUploadError(null);
      setUploadProgress(0);
    },
  };
};

export default useCloudinaryUpload;
