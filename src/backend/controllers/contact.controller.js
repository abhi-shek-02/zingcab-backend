
const { successResponse, errorResponse } = require('../utils/response');
const supabase = require('../utils/supabase');
const logger = require('../utils/logger');

/**
 * Submit a contact form
 */
const submitContactForm = async (req, res) => {
  try {
    const contactData = req.body;
    
    const { data, error } = await supabase
      .from('contactUs')
      .insert([contactData])
      .select();
    
    if (error) {
      logger.error(`Contact form submission error: ${error.message}`);
      throw new Error(error.message);
    }
    
    return successResponse(res, 201, 'Contact form submitted successfully', data[0]);
  } catch (error) {
    logger.error(`Submit contact form error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to submit contact form');
  }
};

module.exports = {
  submitContactForm,
};
