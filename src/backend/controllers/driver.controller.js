
const { successResponse, errorResponse } = require('../utils/response');
const driverService = require('../services/driver.service');
const otpService = require('../services/otp.service');
const logger = require('../utils/logger');

/**
 * Driver login with OTP
 */
const driverRequestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Check if driver exists
    const driver = await driverService.getDriverByPhone(phoneNumber);
    
    if (!driver) {
      return errorResponse(res, 404, 'Driver not found');
    }
    
    const result = await otpService.sendOTP(phoneNumber);
    
    if (!result.success) {
      return errorResponse(res, 500, result.message);
    }
    
    return successResponse(res, 200, 'OTP sent successfully');
  } catch (error) {
    logger.error(`Driver request OTP error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to send OTP');
  }
};

/**
 * Verify driver OTP and log in
 */
const driverVerifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const verification = otpService.verifyOTP(phoneNumber, otp);
    
    if (!verification.valid) {
      return errorResponse(res, 400, verification.message);
    }
    
    // Get driver data
    const driver = await driverService.getDriverByPhone(phoneNumber);
    
    if (!driver) {
      return errorResponse(res, 404, 'Driver not found');
    }
    
    // Generate token
    const token = driverService.generateDriverToken(driver);
    
    return successResponse(res, 200, 'Login successful', { driver, token });
  } catch (error) {
    logger.error(`Driver verify OTP error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to verify OTP');
  }
};

/**
 * Get driver bookings (filter by status optional)
 */
const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { status } = req.query;
    
    const bookings = await driverService.getDriverBookings(driverId, status);
    
    return successResponse(res, 200, 'Driver bookings retrieved successfully', bookings);
  } catch (error) {
    logger.error(`Get driver bookings error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get driver bookings');
  }
};

/**
 * Start a ride
 */
const startRide = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { driverBookingId } = req.params;
    
    await driverService.startTrip(driverBookingId, driverId);
    
    return successResponse(res, 200, 'Ride started successfully');
  } catch (error) {
    logger.error(`Start ride error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to start ride');
  }
};

/**
 * Complete a ride
 */
const completeRide = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { driverBookingId } = req.params;
    
    await driverService.completeTrip(driverBookingId, driverId);
    
    return successResponse(res, 200, 'Ride completed successfully');
  } catch (error) {
    logger.error(`Complete ride error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to complete ride');
  }
};

/**
 * Mark ride as no-show
 */
const markRideNoShow = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { driverBookingId } = req.params;
    
    await driverService.markRideNoShow(driverBookingId, driverId);
    
    return successResponse(res, 200, 'Ride marked as no-show');
  } catch (error) {
    logger.error(`Mark no-show error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to mark ride as no-show');
  }
};

module.exports = {
  driverRequestOtp,
  driverVerifyOtp,
  getDriverBookings,
  startRide,
  completeRide,
  markRideNoShow,
};
