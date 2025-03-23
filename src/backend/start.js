
/**
 * Server entry point
 * This is the main script that starts the ZingCab backend server
 */

const server = require('./server');
const logger = require('./utils/logger');
const config = require('./config/config');

// Start the server
const PORT = config.port || 5000;
server.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  
  // Log some useful startup information
  logger.info(`API documentation: http://localhost:${PORT}/api-docs`);
  if (config.nodeEnv === 'development') {
    logger.info('---------------------------------------------');
    logger.info('DEVELOPMENT MODE - ADDITIONAL INFORMATION:');
    logger.info('In development mode, OTPs are logged to the console');
    logger.info('JWT Secret should be changed in production');
    logger.info('---------------------------------------------');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  // Give the server a chance to finish current requests before shutting down
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});
