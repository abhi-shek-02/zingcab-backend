
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Calculate ride distance and price
 * This is a placeholder. In production, you would integrate with Maps API
 */
const calculateRideDetails = async (pickupLocation, dropLocation, cabType) => {
  // Mock implementation - would be replaced with actual Maps API call
  const cabPricing = {
    'SUV': { basePrice: 15, perKm: 12 },
    'Sedan': { basePrice: 10, perKm: 10 },
    'Hatchback': { basePrice: 8, perKm: 8 },
  };
  
  // Calculate mock distance
  const mockDistance = dropLocation ? 
    Math.floor(Math.random() * 250) + 50 : // distance for outstation/airport rides
    0; // for rental rides, distance is package-dependent
  
  const pricing = cabPricing[cabType] || cabPricing['Sedan'];
  const price = dropLocation ? 
    pricing.basePrice + (mockDistance * pricing.perKm) : // for outstation/airport rides
    Math.floor(Math.random() * 2000) + 1000; // for rental packages
  
  return {
    distance: mockDistance,
    price,
  };
};

/**
 * Apply coupon to price if valid
 */
const applyCoupon = async (couponId, currentPrice) => {
  if (!couponId) {
    return { finalPrice: currentPrice, discountAmount: 0 };
  }
  
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', couponId)
    .single();
  
  if (error || !coupon) {
    logger.error(`Coupon fetch error: ${error?.message || 'Coupon not found'}`);
    return { finalPrice: currentPrice, discountAmount: 0, error: 'Invalid coupon' };
  }
  
  // Check if coupon is expired
  if (new Date(coupon.expiryDate) < new Date()) {
    return { finalPrice: currentPrice, discountAmount: 0, error: 'Coupon expired' };
  }
  
  // Check if coupon has reached usage limit
  // This would require additional tracking logic in production
  
  const discountAmount = Math.min(coupon.discountAmount, currentPrice);
  const finalPrice = currentPrice - discountAmount;
  
  return {
    finalPrice,
    discountAmount,
    couponDetails: coupon,
  };
};

/**
 * Create a new booking
 */
const createBooking = async (bookingData, userId) => {
  // Start a Supabase transaction (using the client as we can't use true transactions with Supabase REST)
  const baseBookingData = {
    userId,
    status: 'PENDING',
    rideType: bookingData.rideType,
    distance: bookingData.distance,
    price: bookingData.finalPrice,
    couponId: bookingData.couponId || null,
  };
  
  // Create the base booking record first
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([baseBookingData])
    .select();
  
  if (bookingError) {
    logger.error(`Booking creation error: ${bookingError.message}`);
    throw new Error('Failed to create booking');
  }
  
  const bookingId = booking[0].id;
  
  // Create the specific ride type record linked to the booking
  let rideTypeData;
  let rideError;
  
  switch (bookingData.rideType) {
    case 'rental':
      ({ data: rideTypeData, error: rideError } = await supabase
        .from('rentalRides')
        .insert([{
          bookingId,
          pickupLocation: bookingData.pickupLocation,
          rentalPackage: bookingData.rentalPackage,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          cabType: bookingData.cabType,
        }])
        .select());
      break;
      
    case 'airport':
      ({ data: rideTypeData, error: rideError } = await supabase
        .from('airportRides')
        .insert([{
          bookingId,
          pickupLocation: bookingData.pickupLocation,
          dropLocation: bookingData.dropLocation,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          cabType: bookingData.cabType,
        }])
        .select());
      break;
      
    case 'outstation':
      ({ data: rideTypeData, error: rideError } = await supabase
        .from('outstationRides')
        .insert([{
          bookingId,
          pickupLocation: bookingData.pickupLocation,
          dropLocation: bookingData.dropLocation,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          cabType: bookingData.cabType,
          dropOffDate: bookingData.dropOffDate,
        }])
        .select());
      break;
      
    default:
      throw new Error('Invalid ride type');
  }
  
  if (rideError) {
    logger.error(`Ride type creation error: ${rideError.message}`);
    
    // Attempt to rollback the booking
    await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);
      
    throw new Error('Failed to create ride details');
  }
  
  // Create a payment record for the booking
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert([{
      amount: bookingData.finalPrice,
      paymentStatus: 'PENDING',
      paymentMethod: 'NOT_SELECTED',
      userId,
    }])
    .select();
  
  if (paymentError) {
    logger.error(`Payment record creation error: ${paymentError.message}`);
    // We could try to rollback here, but let's assume the booking is still valid
    // The payment record can be created later in real scenarios
  } else {
    // Update the booking with the payment ID
    await supabase
      .from('bookings')
      .update({ paymentId: payment[0].id })
      .eq('id', bookingId);
  }
  
  // Fetch the complete booking details to return
  const { data: completeBooking, error: fetchError } = await supabase
    .from('bookings')
    .select(`
      *,
      rentalRides(*),
      airportRides(*),
      outstationRides(*)
    `)
    .eq('id', bookingId)
    .single();
  
  if (fetchError) {
    logger.error(`Error fetching complete booking: ${fetchError.message}`);
    // Just return what we have so far
    return { ...booking[0], ...(rideTypeData ? rideTypeData[0] : {}) };
  }
  
  return completeBooking;
};

/**
 * Get booking details by ID
 */
const getBookingById = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      rentalRides(*),
      airportRides(*),
      outstationRides(*),
      driverBookings(*, drivers(*))
    `)
    .eq('id', bookingId)
    .single();
  
  if (error) {
    logger.error(`Error fetching booking: ${error.message}`);
    throw new Error('Booking not found');
  }
  
  return data;
};

/**
 * Update booking status
 */
const updateBookingStatus = async (bookingId, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updatedAt: new Date() })
    .eq('id', bookingId)
    .select();
  
  if (error) {
    logger.error(`Booking status update error: ${error.message}`);
    throw new Error('Failed to update booking status');
  }
  
  return data[0];
};

/**
 * Cancel a booking
 */
const cancelBooking = async (bookingId, userId) => {
  // First check if the booking belongs to the user
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('userId', userId)
    .single();
  
  if (fetchError || !booking) {
    logger.error(`Booking fetch error: ${fetchError?.message || 'Booking not found'}`);
    throw new Error('Booking not found or not authorized');
  }
  
  // Check if the booking is in a cancellable state
  if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
    throw new Error(`Cannot cancel booking with status: ${booking.status}`);
  }
  
  // Update the booking status to CANCELLED
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ 
      status: 'CANCELLED',
      updatedAt: new Date()
    })
    .eq('id', bookingId);
  
  if (updateError) {
    logger.error(`Booking cancellation error: ${updateError.message}`);
    throw new Error('Failed to cancel booking');
  }
  
  // Update any driver bookings associated with this booking
  const { error: driverUpdateError } = await supabase
    .from('driverBookings')
    .update({ 
      status: 'CANCELLED',
      updatedAt: new Date()
    })
    .eq('bookingId', bookingId);
  
  if (driverUpdateError) {
    logger.error(`Driver booking update error: ${driverUpdateError.message}`);
    // Not throwing here as the main cancellation succeeded
  }
  
  return true;
};

module.exports = {
  calculateRideDetails,
  applyCoupon,
  createBooking,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
