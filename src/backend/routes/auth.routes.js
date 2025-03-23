
const express = require('express');
const { validate } = require('../middlewares/validation.middleware');
const { 
  requestOtpSchema, 
  verifyOtpSchema, 
  userRegistrationSchema 
} = require('../middlewares/validation.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Request OTP for login/registration
router.post(
  '/request-otp', 
  validate(requestOtpSchema),
  authController.requestOtp
);

// Verify OTP
router.post(
  '/verify-otp', 
  validate(verifyOtpSchema),
  authController.verifyOtp
);

// Register user after OTP verification
router.post(
  '/register', 
  validate(userRegistrationSchema),
  authController.registerUser
);

module.exports = router;
