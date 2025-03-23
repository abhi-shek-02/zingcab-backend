
const { successResponse, errorResponse } = require('../utils/response');
const userService = require('../services/user.service');
const otpService = require('../services/otp.service');
const logger = require('../utils/logger');

/**
 * Request OTP for login/registration
 */
const requestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    const result = await otpService.sendOTP(phoneNumber);
    
    if (!result.success) {
      return errorResponse(res, 500, result.message);
    }
    
    const userExists = await otpService.checkUserExists(phoneNumber);
    
    return successResponse(res, 200, 'OTP sent successfully', { isNewUser: !userExists });
  } catch (error) {
    logger.error(`Request OTP error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to send OTP');
  }
};

/**
 * Verify OTP and login/register user
 */
const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const verification = otpService.verifyOTP(phoneNumber, otp);
    
    if (!verification.valid) {
      return errorResponse(res, 400, verification.message);
    }
    
    // Check if user exists
    let user = await userService.getUserByPhone(phoneNumber);
    let isNewUser = false;
    
    if (!user) {
      // This is a new user, but we're not creating an account yet
      // We'll return a flag indicating this is a new user
      isNewUser = true;
    } else {
      // Generate token for existing user
      const token = userService.generateToken(user);
      return successResponse(res, 200, 'Login successful', { user, token, isNewUser: false });
    }
    
    return successResponse(res, 200, 'OTP verified successfully', { isNewUser });
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to verify OTP');
  }
};

/**
 * Complete user registration after OTP verification
 */
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Verify OTP one more time (optional, can be skipped if you're confident in your flow)
    const verification = otpService.verifyOTP(userData.phoneNumber, userData.otp);
    
    if (!verification.valid) {
      return errorResponse(res, 400, verification.message);
    }
    
    // Check if user already exists
    const existingUser = await userService.getUserByPhone(userData.phoneNumber);
    
    if (existingUser) {
      return errorResponse(res, 409, 'User already exists');
    }
    
    // Remove OTP from userData before saving
    delete userData.otp;
    
    // Register the user
    const newUser = await userService.registerUser(userData);
    
    // Generate token
    const token = userService.generateToken(newUser);
    
    return successResponse(res, 201, 'User registered successfully', { user: newUser, token });
  } catch (error) {
    logger.error(`Register user error: ${error.message}`);
    return errorResponse(res, 500, 'Registration failed');
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  registerUser,
};
