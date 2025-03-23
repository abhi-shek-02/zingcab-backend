
const supabase = require('../utils/supabase');
const logger = require('../utils/logger');

/**
 * Service to handle contact form operations
 */
const contactService = {
  /**
   * Save contact form submission to database
   * @param {Object} contactData - The contact form data
   * @returns {Promise<Object>} The saved contact data
   */
  submitContactForm: async (contactData) => {
    logger.info(`Saving contact form from ${contactData.email} to database`);
    
    const { data, error } = await supabase
      .from('contactUs')
      .insert([contactData])
      .select();
    
    if (error) {
      logger.error(`Error saving contact form: ${error.message}`);
      throw new Error(error.message);
    }
    
    return data[0];
  }
};

module.exports = contactService;
