const logger = require('../utilities/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`"errorHandler.js","global","${req.method} ${req.originalUrl} - Error: ${err.message}"`);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || (statusCode === 400 ? 'BAD_REQUEST' : statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'),
      message: err.message || 'An unexpected error occurred'
    }
  };

  if (err.details) {
    response.error.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
