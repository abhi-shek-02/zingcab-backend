
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Generate JWT token for authenticated user
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      role: 'user',
      name: user.name
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();
  
  if (error) {
    logger.error(`User registration error: ${error.message}`);
    throw new Error(error.message);
  }
  
  return data[0];
};

/**
 * Get user by phone number
 */
const getUserByPhone = async (phoneNumber) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phoneNumber', phoneNumber)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    logger.error(`Error fetching user: ${error.message}`);
    throw new Error('Database error fetching user');
  }
  
  return data;
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    logger.error(`Error fetching user by ID: ${error.message}`);
    throw new Error('Database error fetching user');
  }
  
  return data;
};

/**
 * Update user profile
 */
const updateUser = async (userId, updateData) => {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();
  
  if (error) {
    logger.error(`User update error: ${error.message}`);
    throw new Error(error.message);
  }
  
  return data[0];
};

/**
 * Delete user account
 */
const deleteUser = async (userId) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (error) {
    logger.error(`User deletion error: ${error.message}`);
    throw new Error(error.message);
  }
  
  return true;
};

/**
 * Get user's booking history
 */
const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      rentalRides(*),
      airportRides(*),
      outstationRides(*)
    `)
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  
  if (error) {
    logger.error(`Error fetching user bookings: ${error.message}`);
    throw new Error('Database error fetching bookings');
  }
  
  return data;
};

module.exports = {
  generateToken,
  registerUser,
  getUserByPhone,
  getUserById,
  updateUser,
  deleteUser,
  getUserBookings,
};
