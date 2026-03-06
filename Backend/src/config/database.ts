import mongoose, { Connection } from 'mongoose';
import { env } from './environment';
import logger from './logger';

let connection: Connection | null = null;

export const connectDatabase = async (): Promise<Connection> => {
  try {
    if (connection) {
      logger.info('Database connection already established');
      return connection;
    }

    logger.info(`Connecting to MongoDB: ${env.MONGODB_URI}`);

    const mongooseInstance = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    connection = mongooseInstance.connection;

    // Connection event handlers
    connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      connection = null;
    });

    connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
      connection = null;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      if (connection) {
        await connection.close();
        logger.info('MongoDB connection closed due to process termination');
        process.exit(0);
      }
    });

    return connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (connection) {
      await connection.close();
      connection = null;
      logger.info('Database connection closed');
    }
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export const getDatabase = (): Connection => {
  if (!connection) {
    throw new Error(
      'Database connection not established. Call connectDatabase() first.'
    );
  }
  return connection;
};
