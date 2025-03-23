
const { successResponse, errorResponse } = require('../utils/response');
const bookingService = require('../services/booking.service');
const logger = require('../utils/logger');

/**
 * Calculate ride price and details
 */
const calculateRidePrice = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, cabType } = req.body;
    
    const rideDetails = await bookingService.calculateRideDetails(
      pickupLocation, 
      dropLocation, 
      cabType
    );
    
    return successResponse(res, 200, 'Ride details calculated', rideDetails);
  } catch (error) {
    logger.error(`Calculate ride price error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to calculate ride price');
  }
};

/**
 * Apply coupon to ride
 */
const applyCoupon = async (req, res) => {
  try {
    const { couponId, price } = req.body;
    
    const result = await bookingService.applyCoupon(couponId, price);
    
    if (result.error) {
      return errorResponse(res, 400, result.error);
    }
    
    return successResponse(res, 200, 'Coupon applied successfully', result);
  } catch (error) {
    logger.error(`Apply coupon error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to apply coupon');
  }
};

/**
 * Create a new rental ride booking
 */
const createRentalRideBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = {
      rideType: 'rental',
      ...req.body,
    };
    
    // Calculate ride details
    const { price } = await bookingService.calculateRideDetails(
      bookingData.pickupLocation, 
      null, 
      bookingData.cabType
    );
    
    bookingData.distance = 0; // For rental rides, distance is package-dependent
    
    // Apply coupon if provided
    let finalPrice = price;
    if (bookingData.couponId) {
      const couponResult = await bookingService.applyCoupon(bookingData.couponId, price);
      if (couponResult.error) {
        return errorResponse(res, 400, couponResult.error);
      }
      finalPrice = couponResult.finalPrice;
    }
    
    bookingData.finalPrice = finalPrice;
    
    // Create the booking
    const booking = await bookingService.createBooking(bookingData, userId);
    
    return successResponse(res, 201, 'Rental ride booking created successfully', booking);
  } catch (error) {
    logger.error(`Create rental booking error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to create rental ride booking');
  }
};

/**
 * Create a new airport ride booking
 */
const createAirportRideBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = {
      rideType: 'airport',
      ...req.body,
    };
    
    // Calculate ride details
    const { distance, price } = await bookingService.calculateRideDetails(
      bookingData.pickupLocation, 
      bookingData.dropLocation, 
      bookingData.cabType
    );
    
    bookingData.distance = distance;
    
    // Apply coupon if provided
    let finalPrice = price;
    if (bookingData.couponId) {
      const couponResult = await bookingService.applyCoupon(bookingData.couponId, price);
      if (couponResult.error) {
        return errorResponse(res, 400, couponResult.error);
      }
      finalPrice = couponResult.finalPrice;
    }
    
    bookingData.finalPrice = finalPrice;
    
    // Create the booking
    const booking = await bookingService.createBooking(bookingData, userId);
    
    return successResponse(res, 201, 'Airport ride booking created successfully', booking);
  } catch (error) {
    logger.error(`Create airport booking error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to create airport ride booking');
  }
};

/**
 * Create a new outstation ride booking
 */
const createOutstationRideBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = {
      rideType: 'outstation',
      ...req.body,
    };
    
    // Calculate ride details
    const { distance, price } = await bookingService.calculateRideDetails(
      bookingData.pickupLocation, 
      bookingData.dropLocation, 
      bookingData.cabType
    );
    
    bookingData.distance = distance;
    
    // Apply coupon if provided
    let finalPrice = price;
    if (bookingData.couponId) {
      const couponResult = await bookingService.applyCoupon(bookingData.couponId, price);
      if (couponResult.error) {
        return errorResponse(res, 400, couponResult.error);
      }
      finalPrice = couponResult.finalPrice;
    }
    
    bookingData.finalPrice = finalPrice;
    
    // Create the booking
    const booking = await bookingService.createBooking(bookingData, userId);
    
    return successResponse(res, 201, 'Outstation ride booking created successfully', booking);
  } catch (error) {
    logger.error(`Create outstation booking error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to create outstation ride booking');
  }
};

/**
 * Get booking details
 */
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    
    const booking = await bookingService.getBookingById(bookingId);
    
    // Check if booking belongs to the user
    if (booking.userId !== userId) {
      return errorResponse(res, 403, 'Not authorized to access this booking');
    }
    
    return successResponse(res, 200, 'Booking details retrieved successfully', booking);
  } catch (error) {
    logger.error(`Get booking details error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get booking details');
  }
};

/**
 * Cancel a booking
 */
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    
    await bookingService.cancelBooking(bookingId, userId);
    
    return successResponse(res, 200, 'Booking cancelled successfully');
  } catch (error) {
    logger.error(`Cancel booking error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to cancel booking');
  }
};

module.exports = {
  calculateRidePrice,
  applyCoupon,
  createRentalRideBooking,
  createAirportRideBooking,
  createOutstationRideBooking,
  getBookingDetails,
  cancelBooking,
};
