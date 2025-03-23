
const { successResponse, errorResponse } = require('../utils/response');
const adminService = require('../services/admin.service');
const driverService = require('../services/driver.service');
const logger = require('../utils/logger');

/**
 * Admin login
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await adminService.adminLogin(email, password);
    
    return successResponse(res, 200, 'Admin login successful', result);
  } catch (error) {
    logger.error(`Admin login error: ${error.message}`);
    return errorResponse(res, 401, error.message || 'Invalid credentials');
  }
};

/**
 * Get all bookings with optional status filter
 */
const getAllBookings = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const bookings = await adminService.getAllBookings(
      status,
      parseInt(limit),
      parseInt(page)
    );
    
    return successResponse(res, 200, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    logger.error(`Get all bookings error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get bookings');
  }
};

/**
 * Assign driver to booking
 */
const assignDriverToBooking = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;
    
    const assignment = await adminService.assignDriverToBooking(bookingId, driverId);
    
    return successResponse(res, 200, 'Driver assigned successfully', assignment);
  } catch (error) {
    logger.error(`Assign driver error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to assign driver');
  }
};

/**
 * Register a new driver
 */
const registerDriver = async (req, res) => {
  try {
    const driverData = req.body;
    
    const newDriver = await driverService.registerDriver(driverData);
    
    return successResponse(res, 201, 'Driver registered successfully', newDriver);
  } catch (error) {
    logger.error(`Register driver error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to register driver');
  }
};

/**
 * Get all drivers
 */
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await adminService.getAllDrivers();
    
    return successResponse(res, 200, 'Drivers retrieved successfully', drivers);
  } catch (error) {
    logger.error(`Get all drivers error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get drivers');
  }
};

/**
 * Register a new car
 */
const registerCar = async (req, res) => {
  try {
    const carData = req.body;
    
    const newCar = await adminService.registerCar(carData);
    
    return successResponse(res, 201, 'Car registered successfully', newCar);
  } catch (error) {
    logger.error(`Register car error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to register car');
  }
};

/**
 * Get all cars
 */
const getAllCars = async (req, res) => {
  try {
    const cars = await adminService.getAllCars();
    
    return successResponse(res, 200, 'Cars retrieved successfully', cars);
  } catch (error) {
    logger.error(`Get all cars error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get cars');
  }
};

/**
 * Assign car to driver
 */
const assignCarToDriver = async (req, res) => {
  try {
    const { carId, driverId } = req.body;
    
    const updated = await adminService.assignCarToDriver(carId, driverId);
    
    return successResponse(res, 200, 'Car assigned to driver successfully', updated);
  } catch (error) {
    logger.error(`Assign car error: ${error.message}`);
    return errorResponse(res, 500, error.message || 'Failed to assign car');
  }
};

/**
 * Get all contact queries
 */
const getContactQueries = async (req, res) => {
  try {
    const queries = await adminService.getContactQueries();
    
    return successResponse(res, 200, 'Contact queries retrieved successfully', queries);
  } catch (error) {
    logger.error(`Get contact queries error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to get contact queries');
  }
};

module.exports = {
  adminLogin,
  getAllBookings,
  assignDriverToBooking,
  registerDriver,
  getAllDrivers,
  registerCar,
  getAllCars,
  assignCarToDriver,
  getContactQueries,
};
