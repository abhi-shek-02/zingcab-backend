
const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return errorResponse(res, 400, 'Validation Error', errorMessages);
  }
  
  next();
};

// User validation schemas
const userRegistrationSchema = Joi.object({
  phoneNumber: Joi.string().required().pattern(/^\d{10}$/),
  otp: Joi.string().length(6).required(),
  name: Joi.string().required(),
  gender: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  dob: Joi.date().iso().allow('', null),
  displayName: Joi.string().allow('', null),
});

const requestOtpSchema = Joi.object({
  phoneNumber: Joi.string().required().pattern(/^\d{10}$/),
});

const verifyOtpSchema = Joi.object({
  phoneNumber: Joi.string().required().pattern(/^\d{10}$/),
  otp: Joi.string().length(6).required(),
});

// Booking validation schemas
const rentalRideSchema = Joi.object({
  pickupLocation: Joi.string().required(),
  rentalPackage: Joi.string().required(),
  pickupDate: Joi.date().iso().required(),
  pickupTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  cabType: Joi.string().required(),
  couponId: Joi.string().uuid().allow(null, ''),
});

const airportRideSchema = Joi.object({
  pickupLocation: Joi.string().required(),
  dropLocation: Joi.string().required(),
  pickupDate: Joi.date().iso().required(),
  pickupTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  cabType: Joi.string().required(),
  couponId: Joi.string().uuid().allow(null, ''),
});

const outstationRideSchema = Joi.object({
  pickupLocation: Joi.string().required(),
  dropLocation: Joi.string().required(),
  pickupDate: Joi.date().iso().required(),
  pickupTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  cabType: Joi.string().required(),
  dropOffDate: Joi.date().iso().required(),
  couponId: Joi.string().uuid().allow(null, ''),
});

// Driver validation schemas
const driverRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required().pattern(/^\d{10}$/),
  drivingLicense: Joi.string().required(),
});

// Admin validation schemas
const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Contact us validation schema
const contactUsSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required().pattern(/^\d{10}$/),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

module.exports = {
  validate,
  userRegistrationSchema,
  requestOtpSchema,
  verifyOtpSchema,
  rentalRideSchema,
  airportRideSchema,
  outstationRideSchema,
  driverRegistrationSchema,
  adminLoginSchema,
  contactUsSchema,
};
