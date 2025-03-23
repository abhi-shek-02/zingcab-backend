
const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');
const logger = require('./logger');

if (!config.supabaseUrl || !config.supabaseKey) {
  logger.error('Supabase URL or Key not found');
  throw new Error('Supabase URL or Key not found');
}

// Initialize the Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Test the connection only in development mode to avoid excessive logs in production
if (config.nodeEnv === 'development') {
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        logger.error(`Supabase connection error: ${error.message}`);
      } else {
        logger.info(`Supabase connected successfully. Found ${count} users.`);
      }
    })
    .catch(err => {
      logger.error(`Supabase error: ${err.message}`);
    });
} else {
  logger.info('Supabase client initialized in production mode');
}

module.exports = supabase;
