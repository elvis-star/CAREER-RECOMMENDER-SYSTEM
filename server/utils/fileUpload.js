import multer from 'multer';
import path from 'path';
import { createError } from './errorHandler.js';

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xlsx|xls/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(createError('File type not supported', 400));
  }
};

// Initialize upload
export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: fileFilter,
});
