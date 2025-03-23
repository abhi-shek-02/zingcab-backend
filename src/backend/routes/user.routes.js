
const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get current user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Delete user account
router.delete('/account', userController.deleteUserAccount);

// Get user bookings
router.get('/bookings', userController.getUserBookings);

module.exports = router;
