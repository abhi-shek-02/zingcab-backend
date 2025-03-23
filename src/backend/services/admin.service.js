
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Generate JWT token for authenticated admin
 */
const generateAdminToken = (admin) => {
  return jwt.sign(
    { 
      id: admin.id, 
      role: 'admin',
      email: admin.email 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
};

/**
 * Admin login
 */
const adminLogin = async (email, password) => {
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !admin) {
    logger.error(`Admin login error: ${error?.message || 'Admin not found'}`);
    throw new Error('Invalid credentials');
  }
  
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateAdminToken(admin);
  return { admin: { id: admin.id, name: admin.name, email: admin.email }, token };
};

/**
 * Get all bookings (for admin)
 */
const getAllBookings = async (status = null, limit = 50, page = 1) => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      users(name, phoneNumber),
      rentalRides(*),
      airportRides(*),
      outstationRides(*),
      driverBookings(*, drivers(*))
    `);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  // Add pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);
  
  // Order by creation date (newest first)
  query = query.order('createdAt', { ascending: false });
  
  const { data, error, count } = await query;
  
  if (error) {
    logger.error(`Error fetching all bookings: ${error.message}`);
    throw new Error('Database error fetching bookings');
  }
  
  return data;
};

/**
 * Assign driver to booking
 */
const assignDriverToBooking = async (bookingId, driverId) => {
  // Check if booking already has a driver assigned
  const { data: existingAssignment, error: checkError } = await supabase
    .from('driverBookings')
    .select('*')
    .eq('bookingId', bookingId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    logger.error(`Error checking existing assignment: ${checkError.message}`);
    throw new Error('Error checking booking assignment status');
  }
  
  if (existingAssignment) {
    // Update existing assignment
    const { data, error } = await supabase
      .from('driverBookings')
      .update({ 
        driverId,
        status: 'ASSIGNED',
        updatedAt: new Date()
      })
      .eq('id', existingAssignment.id)
      .select();
    
    if (error) {
      logger.error(`Error updating driver assignment: ${error.message}`);
      throw new Error('Failed to update driver assignment');
    }
    
    return data[0];
  } else {
    // Create new assignment
    const { data, error } = await supabase
      .from('driverBookings')
      .insert([{
        bookingId,
        driverId,
        status: 'ASSIGNED'
      }])
      .select();
    
    if (error) {
      logger.error(`Error creating driver assignment: ${error.message}`);
      throw new Error('Failed to assign driver to booking');
    }
    
    // Update booking status
    await supabase
      .from('bookings')
      .update({ 
        status: 'DRIVER_ASSIGNED',
        updatedAt: new Date()
      })
      .eq('id', bookingId);
    
    return data[0];
  }
};

/**
 * Register a new car
 */
const registerCar = async (carData) => {
  const { data, error } = await supabase
    .from('cars')
    .insert([carData])
    .select();
  
  if (error) {
    logger.error(`Car registration error: ${error.message}`);
    throw new Error(error.message);
  }
  
  return data[0];
};

/**
 * Get all drivers
 */
const getAllDrivers = async () => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('name');
  
  if (error) {
    logger.error(`Error fetching all drivers: ${error.message}`);
    throw new Error('Database error fetching drivers');
  }
  
  return data;
};

/**
 * Get all cars
 */
const getAllCars = async () => {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      drivers(name, phoneNumber)
    `);
  
  if (error) {
    logger.error(`Error fetching all cars: ${error.message}`);
    throw new Error('Database error fetching cars');
  }
  
  return data;
};

/**
 * Assign car to driver
 */
const assignCarToDriver = async (carId, driverId) => {
  const { data, error } = await supabase
    .from('cars')
    .update({ assignedDriverId: driverId })
    .eq('id', carId)
    .select();
  
  if (error) {
    logger.error(`Error assigning car to driver: ${error.message}`);
    throw new Error('Failed to assign car to driver');
  }
  
  return data[0];
};

/**
 * Get all contact us queries
 */
const getContactQueries = async () => {
  const { data, error } = await supabase
    .from('contactUs')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) {
    logger.error(`Error fetching contact queries: ${error.message}`);
    throw new Error('Database error fetching contact queries');
  }
  
  return data;
};

module.exports = {
  generateAdminToken,
  adminLogin,
  getAllBookings,
  assignDriverToBooking,
  registerCar,
  getAllDrivers,
  getAllCars,
  assignCarToDriver,
  getContactQueries,
};
