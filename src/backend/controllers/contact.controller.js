
const { successResponse, errorResponse } = require('../utils/response');
const supabase = require('../utils/supabase');
const logger = require('../utils/logger');

/**
 * Submit a contact form
 */
const submitContactForm = async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      message: req.body.message
    };
    
    logger.info(`Processing contact form submission from ${contactData.email}`);
    
    const { data, error } = await supabase
      .from('contactUs')
      .insert([contactData])
      .select();
    
    if (error) {
      logger.error(`Contact form submission error: ${error.message}`);
      throw new Error(error.message);
    }
    
    logger.info(`Contact form submitted successfully from ${contactData.email}`);
    return successResponse(res, 201, 'Contact form submitted successfully', data[0]);
  } catch (error) {
    logger.error(`Submit contact form error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to submit contact form', [error.message]);
  }
};

module.exports = {
  submitContactForm,
};
