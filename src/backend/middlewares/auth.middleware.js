
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Access token is required');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    return errorResponse(res, 401, 'Invalid or expired token');
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Access denied. Admin role required');
  }
  next();
};

const isDriver = (req, res, next) => {
  if (!req.user || req.user.role !== 'driver') {
    return errorResponse(res, 403, 'Access denied. Driver role required');
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isDriver
};
