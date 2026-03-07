import mongoose from 'mongoose';
import { AdultPatient } from './models/AdultPatient';
import { connectDatabase } from './config/database';
import logger from './config/logger';

const checkDatabase = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Connected to database for checking');

    // Query all patients
    const allPatients = await AdultPatient.find({}, 'patientName patientCode houseNumber sex age createdAt');
    console.log(`Total patients in database: ${allPatients.length}`);
    console.log('All patients:');
    allPatients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.patientName} (${patient.patientCode}) - House: ${patient.houseNumber}, Age: ${patient.age}, Sex: ${patient.sex}`);
    });

  } catch (error) {
    logger.error('Error checking database:', error);
    console.error('Error checking database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

// Run the check function
checkDatabase();