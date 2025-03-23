
/**
 * Creates a standardized success response
 */
const successResponse = (res, status = 200, message = 'Success', data = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Creates a standardized error response
 */
const errorResponse = (res, status = 500, message = 'Server Error', errors = []) => {
  return res.status(status).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
