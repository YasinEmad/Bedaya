import app from './app';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import logger from './config/logger';

const PORT = env.PORT;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('Attempting to connect to database...');
    await connectDatabase();
    logger.info('Database connected successfully');

    // Start Express Server
    const server = app.listen(PORT, () => {
      logger.info(`
        ========================================
        Bedaya API Server Started Successfully
        ========================================
        Environment: ${env.NODE_ENV}
        Port: ${PORT}
        API Prefix: ${env.API_PREFIX}
        Database: ${env.MONGODB_DB_NAME}
        ========================================
      `);

      // Log available endpoints
      console.log('\n📋 Available Endpoints:');
      console.log('  GET     /health                         - Health check');
      console.log('  POST    /api/patients/adults            - Create adult patient');
      console.log('  GET     /api/patients/adults            - Get all adult patients');
      console.log('  POST    /api/patients/pediatrics        - Create pediatric patient');
      console.log('  GET     /api/patients/pediatrics        - Get all pediatric patients');
      console.log('  POST    /api/labs/tests                 - Create lab test');
      console.log('  GET     /api/labs/patient/:patientId    - Get patient lab tests');
      console.log('  POST    /api/pharmacy/medicines         - Add medicine');
      console.log('  GET     /api/pharmacy/medicines         - Get all medicines');
      console.log('  POST    /api/pharmacy/dispensing        - Dispense medicine');
      console.log('  POST    /api/clinics/visit              - Record clinic visit');
      console.log('  GET     /api/clinics/statistics         - Get clinic statistics');
      console.log('\n');
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, closing server gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, closing server gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    // Unhandled Exception Handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Unhandled Promise Rejection Handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
