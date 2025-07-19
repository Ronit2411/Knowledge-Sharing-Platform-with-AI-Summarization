const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id || 'anonymous'
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.details || err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === '23505') { // PostgreSQL unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
    details = 'A resource with this information already exists';
  } else if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    statusCode = 400;
    message = 'Invalid reference';
    details = 'Referenced resource does not exist';
  } else if (err.code === '23502') { // PostgreSQL not null constraint violation
    statusCode = 400;
    message = 'Missing required field';
    details = err.message;
  } else if (err.message && err.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.message && err.message.includes('Unauthorized')) {
    statusCode = 403;
    message = 'Access denied';
  } else if (err.message && err.message.includes('Authentication')) {
    statusCode = 401;
    message = 'Authentication required';
  } else if (err.message && err.message.includes('API key')) {
    statusCode = 500;
    message = 'AI service configuration error';
    details = err.message;
  } else if (err.message && err.message.includes('rate limit')) {
    statusCode = 429;
    message = 'Too many requests';
    details = err.message;
  } else if (err.message && err.message.includes('timeout')) {
    statusCode = 408;
    message = 'Request timeout';
    details = err.message;
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service unavailable';
    details = 'Database connection failed';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'Service unavailable';
    details = 'External service not found';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    details = null;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      timestamp: new Date().toISOString()
    })
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
const createError = {
  notFound: (message = 'Resource not found') => 
    new AppError(message, 404),
  
  unauthorized: (message = 'Authentication required') => 
    new AppError(message, 401),
  
  forbidden: (message = 'Access denied') => 
    new AppError(message, 403),
  
  badRequest: (message = 'Bad request', details = null) => 
    new AppError(message, 400, details),
  
  conflict: (message = 'Resource conflict') => 
    new AppError(message, 409),
  
  validation: (message = 'Validation failed', details = null) => 
    new AppError(message, 400, details),
  
  internal: (message = 'Internal server error') => 
    new AppError(message, 500),
  
  serviceUnavailable: (message = 'Service unavailable', details = null) => 
    new AppError(message, 503, details)
};

export default {
  errorHandler,
  asyncHandler,
  AppError,
  createError
}; 