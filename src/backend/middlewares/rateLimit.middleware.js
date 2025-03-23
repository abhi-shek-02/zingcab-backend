
const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

// General rate limiter for most routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res, 
      429, 
      'Too many requests, please try again later.'
    );
  }
});

// More strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res, 
      429, 
      'Too many login attempts, please try again later.'
    );
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
};
