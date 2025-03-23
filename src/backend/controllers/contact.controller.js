
const { successResponse, errorResponse } = require('../utils/response');
const contactService = require('../services/contact.service');
const logger = require('../utils/logger');

/**
 * Submit a contact form
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, phoneNumber, email, message } = req.body;
    
    // Basic validation
    if (!name || !phoneNumber || !email || !message) {
      return errorResponse(res, 400, 'All fields are required', ['name, phoneNumber, email, and message are required fields']);
    }
    
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 400, 'Invalid email format');
    }
    
    const contactData = { name, phoneNumber, email, message };
    
    logger.info(`Processing contact form submission from ${contactData.email}`);
    
    const data = await contactService.submitContactForm(contactData);
    
    logger.info(`Contact form submitted successfully from ${contactData.email}`);
    return successResponse(res, 201, 'Contact form submitted successfully', data);
  } catch (error) {
    logger.error(`Submit contact form error: ${error.message}`);
    return errorResponse(res, 500, 'Failed to submit contact form', [error.message]);
  }
};

module.exports = {
  submitContactForm,
};
