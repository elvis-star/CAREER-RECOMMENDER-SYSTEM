import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

// Import middleware
import { trackActivity } from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 1000, // 100 requests per IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Specific rate limit for authentication routes
const authLimiter = rateLimit({
  // max: 10, // 10 requests per IP
  // windowMs: 15 * 60 * 1000, // 15 minutes

  max: 50, // instead of 10
  windowMs: 10 * 60 * 1000, // instead of 15 minutes

  message: 'Too many authentication attempts, please try again later',
});
app.use('/api/auth', authLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5174'],
    credentials: true,
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Track user activity
app.use(trackActivity);

// Add request logger middleware after existing middleware
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Add health routes
app.use('/api', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Career Recommender API is running');
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Update the error handler to use our custom one
// Replace the existing error handler with this:
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
});

export default app;
