import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file or base64 encoded string
 * @param {string} folder - Folder in Cloudinary to upload to
 * @returns {Promise} - Cloudinary upload result
 */
export const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        folder,
        resource_type: 'auto', // auto-detect whether it's an image, video, etc.
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

/**
 * Remove a file from Cloudinary
 * @param {string} publicId - Public ID of the file to remove
 * @returns {Promise} - Cloudinary deletion result
 */
export const removeFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary deletion error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Get a signed URL for uploading directly to Cloudinary from the client
 * @param {Object} options - Options for the signed URL
 * @returns {Object} - Signature and other parameters needed for direct upload
 */
export const getCloudinarySignature = (options = {}) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder: options.folder || 'uploads',
    ...options,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    ...params,
  };
};

export default {
  uploadToCloudinary,
  removeFromCloudinary,
  getCloudinarySignature,
};
