
const { successResponse, errorResponse } = require('../utils/response');
const userService = require('../services/user.service');
const logger = require('../utils/logger');

/**
 * Get current user profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'User profile retrieved successfully', user);
  } catch (error) {
    logger.error(`Get user profile error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get user profile');
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Prevent updating phoneNumber as it's used for authentication
    if (updateData.phoneNumber) {
      delete updateData.phoneNumber;
    }
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    return successResponse(res, 200, 'User profile updated successfully', updatedUser);
  } catch (error) {
    logger.error(`Update user profile error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to update user profile');
  }
};

/**
 * Delete user account
 */
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await userService.deleteUser(userId);
    
    return successResponse(res, 200, 'User account deleted successfully');
  } catch (error) {
    logger.error(`Delete user account error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to delete user account');
  }
};

/**
 * Get user bookings
 */
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await userService.getUserBookings(userId);
    
    return successResponse(res, 200, 'User bookings retrieved successfully', bookings);
  } catch (error) {
    logger.error(`Get user bookings error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get user bookings');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserBookings,
};
