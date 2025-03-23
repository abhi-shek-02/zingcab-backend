
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Generate JWT token for authenticated driver
 */
const generateDriverToken = (driver) => {
  return jwt.sign(
    { 
      id: driver.id, 
      role: 'driver',
      name: driver.name
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Get driver by phone number
 */
const getDriverByPhone = async (phoneNumber) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('phoneNumber', phoneNumber)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    logger.error(`Error fetching driver: ${error.message}`);
    throw new Error('Database error fetching driver');
  }
  
  return data;
};

/**
 * Register a new driver
 */
const registerDriver = async (driverData) => {
  const { data, error } = await supabase
    .from('drivers')
    .insert([driverData])
    .select();
  
  if (error) {
    logger.error(`Driver registration error: ${error.message}`);
    throw new Error(error.message);
  }
  
  return data[0];
};

/**
 * Get assigned bookings for a driver
 */
const getDriverBookings = async (driverId, status = null) => {
  let query = supabase
    .from('driverBookings')
    .select(`
      *,
      bookings!inner(*,
        rentalRides(*),
        airportRides(*),
        outstationRides(*),
        users!inner(name, phoneNumber)
      )
    `)
    .eq('driverId', driverId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    logger.error(`Error fetching driver bookings: ${error.message}`);
    throw new Error('Database error fetching bookings');
  }
  
  return data;
};

/**
 * Update booking status by driver
 */
const updateBookingStatusByDriver = async (driverBookingId, driverId, status) => {
  // Verify the driver booking belongs to this driver
  const { data: driverBooking, error: fetchError } = await supabase
    .from('driverBookings')
    .select('bookingId')
    .eq('id', driverBookingId)
    .eq('driverId', driverId)
    .single();
  
  if (fetchError || !driverBooking) {
    logger.error(`Error verifying driver booking: ${fetchError?.message || 'Not found'}`);
    throw new Error('Driver booking not found or not authorized');
  }
  
  // Update the driver booking status
  const { error: updateError } = await supabase
    .from('driverBookings')
    .update({ 
      status,
      updatedAt: new Date()
    })
    .eq('id', driverBookingId);
  
  if (updateError) {
    logger.error(`Error updating driver booking: ${updateError.message}`);
    throw new Error('Failed to update booking status');
  }
  
  // Update the main booking status too
  const { error: bookingUpdateError } = await supabase
    .from('bookings')
    .update({ 
      status,
      updatedAt: new Date()
    })
    .eq('id', driverBooking.bookingId);
  
  if (bookingUpdateError) {
    logger.error(`Error updating main booking: ${bookingUpdateError.message}`);
    // Not throwing here since the driver booking update succeeded
  }
  
  return true;
};

/**
 * Handle driver "No Show" action
 */
const markRideNoShow = async (driverBookingId, driverId) => {
  return updateBookingStatusByDriver(driverBookingId, driverId, 'NO_SHOW');
};

/**
 * Start trip by driver
 */
const startTrip = async (driverBookingId, driverId) => {
  return updateBookingStatusByDriver(driverBookingId, driverId, 'IN_PROGRESS');
};

/**
 * Complete trip by driver
 */
const completeTrip = async (driverBookingId, driverId) => {
  return updateBookingStatusByDriver(driverBookingId, driverId, 'COMPLETED');
};

module.exports = {
  generateDriverToken,
  getDriverByPhone,
  registerDriver,
  getDriverBookings,
  updateBookingStatusByDriver,
  markRideNoShow,
  startTrip,
  completeTrip,
};
