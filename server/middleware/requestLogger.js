// Middleware to log all API requests
import Activity from '../models/Activity.js';

const requestLogger = async (req, res, next) => {
  // Skip logging for certain paths
  const skipPaths = ['/api/health', '/api/metrics'];
  if (skipPaths.includes(req.path)) {
    return next();
  }

  const start = Date.now();

  // Add response listener to log after request completes
  res.on('finish', async () => {
    const duration = Date.now() - start;

    // Only log requests that take longer than expected or have errors
    if (duration > 1000 || res.statusCode >= 400) {
      try {
        // Log to console
        console.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );

        // Log to database if user is authenticated
        if (req.user && req.user._id) {
          await Activity.create({
            user: req.user._id,
            action: 'api_request',
            details: {
              method: req.method,
              path: req.originalUrl,
              statusCode: res.statusCode,
              duration: duration,
              ip: req.ip,
            },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
          }).catch((err) => console.error('Failed to log activity:', err));
        }
      } catch (error) {
        // Don't block the response if logging fails
        console.error('Error in request logger:', error);
      }
    }
  });

  next();
};

export default requestLogger;
