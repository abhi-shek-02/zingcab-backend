
const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { 
  rentalRideSchema, 
  airportRideSchema, 
  outstationRideSchema 
} = require('../middlewares/validation.middleware');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Calculate ride price
router.post('/calculate-price', bookingController.calculateRidePrice);

// Apply coupon
router.post('/apply-coupon', bookingController.applyCoupon);

// Create rental ride booking
router.post(
  '/rental', 
  validate(rentalRideSchema),
  bookingController.createRentalRideBooking
);

// Create airport ride booking
router.post(
  '/airport', 
  validate(airportRideSchema),
  bookingController.createAirportRideBooking
);

// Create outstation ride booking
router.post(
  '/outstation', 
  validate(outstationRideSchema),
  bookingController.createOutstationRideBooking
);

// Get booking details
router.get('/:bookingId', bookingController.getBookingDetails);

// Cancel booking
router.post('/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;
