
const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { 
  adminLoginSchema, 
  driverRegistrationSchema 
} = require('../middlewares/validation.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Admin login (no auth required)
router.post(
  '/login', 
  validate(adminLoginSchema),
  adminController.adminLogin
);

// All routes below require admin authentication
router.use(verifyToken);
router.use(isAdmin);

// Bookings management
router.get('/bookings', adminController.getAllBookings);
router.post('/bookings/assign-driver', adminController.assignDriverToBooking);

// Driver management
router.post(
  '/drivers', 
  validate(driverRegistrationSchema),
  adminController.registerDriver
);
router.get('/drivers', adminController.getAllDrivers);

// Car management
router.post('/cars', adminController.registerCar);
router.get('/cars', adminController.getAllCars);
router.post('/cars/assign-driver', adminController.assignCarToDriver);

// Contact queries
router.get('/contact-queries', adminController.getContactQueries);

module.exports = router;
