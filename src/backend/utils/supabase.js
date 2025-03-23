
const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');
const logger = require('./logger');

if (!config.supabaseUrl || !config.supabaseKey) {
  logger.error('Supabase URL or Key not found');
  throw new Error('Supabase URL or Key not found');
}

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

module.exports = supabase;
