
const express = require('express');
const { verifyToken, isDriver } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { 
  requestOtpSchema, 
  verifyOtpSchema 
} = require('../middlewares/validation.middleware');
const driverController = require('../controllers/driver.controller');

const router = express.Router();

// Driver login routes (no auth required)
router.post(
  '/request-otp', 
  validate(requestOtpSchema),
  driverController.driverRequestOtp
);

router.post(
  '/verify-otp', 
  validate(verifyOtpSchema),
  driverController.driverVerifyOtp
);

// All routes below require driver authentication
router.use(verifyToken);
router.use(isDriver);

// Get driver's bookings
router.get('/bookings', driverController.getDriverBookings);

// Start ride
router.post('/bookings/:driverBookingId/start', driverController.startRide);

// Complete ride
router.post('/bookings/:driverBookingId/complete', driverController.completeRide);

// Mark ride as no-show
router.post('/bookings/:driverBookingId/no-show', driverController.markRideNoShow);

module.exports = router;
