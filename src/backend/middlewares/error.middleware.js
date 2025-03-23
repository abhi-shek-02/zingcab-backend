
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Log stack trace in non-production environment
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
  }
  
  return errorResponse(
    res,
    statusCode,
    err.message || 'Server Error',
    process.env.NODE_ENV === 'production' ? undefined : err.stack
  );
};

module.exports = {
  notFound,
  errorHandler,
};
