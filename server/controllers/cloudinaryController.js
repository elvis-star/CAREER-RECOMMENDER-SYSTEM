import { getCloudinarySignature } from '../utils/cloudinary.js';

/**
 * @desc    Get Cloudinary signature for direct uploads
 * @route   GET /api/cloudinary/signature
 * @access  Private
 */
export const getSignature = (req, res) => {
  try {
    const folder = req.query.folder || 'uploads';
    const signatureData = getCloudinarySignature({ folder });

    res.status(200).json({
      success: true,
      data: signatureData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};
