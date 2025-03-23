
/**
 * Supabase Database Initialization Script
 * 
 * This script can be used to initialize the required tables in Supabase
 * Run with: node src/backend/scripts/init-db.js
 */

const supabase = require('../utils/supabase');
const logger = require('../utils/logger');

const initializeDatabase = async () => {
  try {
    logger.info('Starting database initialization');
    
    // Check if tables exist by querying them
    const { error: usersError } = await supabase.from('users').select('id').limit(1);
    const { error: driversError } = await supabase.from('drivers').select('id').limit(1);
    const { error: bookingsError } = await supabase.from('bookings').select('id').limit(1);
    const { error: carsError } = await supabase.from('cars').select('id').limit(1);
    const { error: contactUsError } = await supabase.from('contactUs').select('id').limit(1);
    
    // Log which tables need to be created
    logger.info('Database initialization check complete');
    logger.info(`Users table ${usersError ? 'needs to be created' : 'already exists'}`);
    logger.info(`Drivers table ${driversError ? 'needs to be created' : 'already exists'}`);
    logger.info(`Bookings table ${bookingsError ? 'needs to be created' : 'already exists'}`);
    logger.info(`Cars table ${carsError ? 'needs to be created' : 'already exists'}`);
    logger.info(`ContactUs table ${contactUsError ? 'needs to be created' : 'already exists'}`);
    
    logger.info('Database initialization check complete. Please create missing tables in Supabase dashboard.');
    logger.info('For SQL definitions of tables, see scripts/sql/schema.sql');
  } catch (error) {
    logger.error(`Database initialization error: ${error.message}`);
  }
};

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
