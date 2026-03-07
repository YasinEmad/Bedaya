import mongoose from 'mongoose';
import { AdultPatient } from './models/AdultPatient';
import { connectDatabase } from './config/database';
import logger from './config/logger';

const seedData = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Connected to database for seeding');

    // Sample adult patient data - minimal required fields
    const samplePatient = {
      houseNumber: 'H002',
      patientCode: 'P002',
      pov: false,
      patientName: 'Jane Smith',
      sex: 'female' as const,
      age: 28
    };

    // Insert the sample patient
    const patient = new AdultPatient(samplePatient);
    await patient.save();

    logger.info('Sample patient inserted successfully');
    console.log('Sample patient inserted with ID:', patient._id);

    // Query and display the inserted data
    const insertedPatient = await AdultPatient.findById(patient._id);
    console.log('Inserted patient data:', JSON.stringify(insertedPatient, null, 2));

    // Query all patients to show total count
    const allPatients = await AdultPatient.find({}, 'patientName patientCode houseNumber');
    console.log(`Total patients in database: ${allPatients.length}`);
    console.log('All patients:', allPatients.map(p => ({ name: p.patientName, code: p.patientCode, house: p.houseNumber })));

  } catch (error) {
    logger.error('Error seeding data:', error);
    console.error('Error seeding data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

// Run the seed function
seedData();