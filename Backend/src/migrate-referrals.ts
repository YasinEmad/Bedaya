/**
 * Migration script to create missing ClinicVisit records for existing patient referrals
 * Run this once to backfill ClinicVisit records for patients who were marked as referred
 * before the referral tracking feature was implemented.
 *
 * Usage: ts-node src/migrate-referrals.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdultPatient, IAdultPatient } from './models/AdultPatient';
import { PediatricPatient, IPediatricPatient } from './models/PediatricPatient';
import { ClinicVisit, IClinicVisit } from './models/ClinicVisit';
import logger from './config/logger';

dotenv.config();

const referralFieldsToClinicTypes: {
  [key: string]: IClinicVisit['clinicType'];
} = {
  internalMedicine: 'internal-medicine',
  cardiology: 'cardiology',
  surgery: 'surgery',
  ophthalmology: 'ophthalmology',
  obstetricGynecology: 'obstetrics-gynecology',
  ENT: 'ent',
  dermatology: 'dermatology',
  orthopedics: 'orthopedics',
  dental: 'dental'
};

async function migrateAdultPatients() {
  try {
    logger.info('Starting migration of adult patient referrals...');

    // Get all adult patients with referrals
    const patients = await AdultPatient.find({});
    let createdCount = 0;

    for (const patient of patients) {
      if (!patient.referrals) continue;

      for (const [key, isReferred] of Object.entries(patient.referrals)) {
        if (isReferred !== true) continue;

        const clinicType = referralFieldsToClinicTypes[key];
        if (!clinicType) continue;

        // Check if ClinicVisit already exists
        const existingVisit = await ClinicVisit.findOne({
          patientId: patient.patientCode,
          clinicType
        });

        if (!existingVisit) {
          // Create missing ClinicVisit
          await ClinicVisit.create({
            patientId: patient.patientCode,
            patientName: patient.patientName,
            clinicType,
            visitDate: patient.createdAt || new Date(),
            doctor: 'Clinic Staff',
            diagnosis: 'Referral',
            treatment: 'Pending'
          });
          createdCount++;
          logger.info(
            `Created ClinicVisit: ${patient.patientCode} -> ${clinicType}`
          );
        }
      }
    }

    logger.info(
      `Adult patient migration complete. Created ${createdCount} ClinicVisit records.`
    );
    return createdCount;
  } catch (error) {
    logger.error('Error migrating adult patients:', error);
    throw error;
  }
}

async function migratePediatricPatients() {
  try {
    logger.info('Starting migration of pediatric patient referrals...');

    // Get all pediatric patients with referrals
    const patients = await PediatricPatient.find({});
    let createdCount = 0;

    for (const patient of patients) {
      if (!patient.referrals) continue;

      for (const [key, isReferred] of Object.entries(patient.referrals)) {
        if (isReferred !== true) continue;

        const clinicType = referralFieldsToClinicTypes[key];
        if (!clinicType) continue;

        // Check if ClinicVisit already exists
        const existingVisit = await ClinicVisit.findOne({
          patientId: patient.patientCode,
          clinicType
        });

        if (!existingVisit) {
          // Create missing ClinicVisit
          await ClinicVisit.create({
            patientId: patient.patientCode,
            patientName: patient.patientName,
            clinicType,
            visitDate: patient.createdAt || new Date(),
            doctor: 'Clinic Staff',
            diagnosis: 'Referral',
            treatment: 'Pending'
          });
          createdCount++;
          logger.info(
            `Created ClinicVisit: ${patient.patientCode} -> ${clinicType}`
          );
        }
      }
    }

    logger.info(
      `Pediatric patient migration complete. Created ${createdCount} ClinicVisit records.`
    );
    return createdCount;
  } catch (error) {
    logger.error('Error migrating pediatric patients:', error);
    throw error;
  }
}

async function runMigration() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/bedaya';
    await mongoose.connect(mongoUrl);
    logger.info('Connected to MongoDB');

    // Run migrations
    const adultCount = await migrateAdultPatients();
    const pediatricCount = await migratePediatricPatients();

    const totalCount = adultCount + pediatricCount;
    logger.info(`\n✅ Migration complete! Created ${totalCount} total ClinicVisit records.`);

    process.exit(0);
  } catch (error: any) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
