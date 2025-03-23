
const twilio = require('twilio');
const config = require('../config/config');
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

const twilioClient = config.twilioAccountSid && config.twilioAuthToken
  ? twilio(config.twilioAccountSid, config.twilioAuthToken)
  : null;

// In-memory OTP storage (in production, use Redis or a database)
const otpStore = new Map();

/**
 * Generates a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Stores OTP with expiry time
 */
const storeOTP = (phoneNumber, otp) => {
  const expiryTime = Date.now() + config.otpExpiryTime;
  otpStore.set(phoneNumber, { otp, expiryTime });
  
  // Set timeout to clean up expired OTPs
  setTimeout(() => {
    if (otpStore.has(phoneNumber) && otpStore.get(phoneNumber).expiryTime <= Date.now()) {
      otpStore.delete(phoneNumber);
    }
  }, config.otpExpiryTime);
};

/**
 * Verifies OTP for a phone number
 */
const verifyOTP = (phoneNumber, otp) => {
  if (!otpStore.has(phoneNumber)) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  const storedData = otpStore.get(phoneNumber);
  
  if (Date.now() > storedData.expiryTime) {
    otpStore.delete(phoneNumber);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (storedData.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, clean up
  otpStore.delete(phoneNumber);
  return { valid: true, message: 'OTP verified successfully' };
};

/**
 * Sends OTP via Twilio SMS
 */
const sendOTP = async (phoneNumber) => {
  const otp = generateOTP();
  storeOTP(phoneNumber, otp);
  
  if (config.nodeEnv === 'production' && twilioClient) {
    try {
      await twilioClient.messages.create({
        body: `Your ZingCab verification code is: ${otp}`,
        from: config.twilioPhoneNumber,
        to: `+91${phoneNumber}` // Assuming Indian phone numbers
      });
      
      logger.info(`OTP sent to ${phoneNumber}`);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      logger.error(`Twilio SMS failed: ${error.message}`);
      return { success: false, message: 'Failed to send OTP' };
    }
  } else {
    // In development mode, just log the OTP
    logger.info(`[DEV MODE] OTP for ${phoneNumber}: ${otp}`);
    return { success: true, message: 'OTP generated (check logs in dev mode)' };
  }
};

/**
 * Check if a user exists in the database
 */
const checkUserExists = async (phoneNumber) => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('phoneNumber', phoneNumber)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    logger.error(`Error checking user: ${error.message}`);
    throw new Error('Database error checking user');
  }
  
  return !!data;
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
  checkUserExists,
};
