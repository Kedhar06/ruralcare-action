const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled API Error', err);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500
      ? 'An internal server error occurred. Please contact rural health support.'
      : err.message || 'Internal server error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};

