import express from 'express';
import { patientController } from '../controllers/PatientController';
import { labController } from '../controllers/LabController';
import { pharmacyController } from '../controllers/PharmacyController';
import { clinicController } from '../controllers/ClinicController';
import { validateRequest } from '../middleware/validation';
import {
  createAdultPatientSchema,
  updateAdultPatientSchema,
  createPediatricPatientSchema,
  updatePediatricPatientSchema,
  createLabTestSchema,
  createMedicineSchema,
  dispenseMedicineSchema,
  createClinicVisitSchema
} from '../validators/patientValidators';

const router = express.Router();

// ============================================
// PATIENT ROUTES
// ============================================

// Adult Patients
router.post(
  '/patients/adults',
  validateRequest(createAdultPatientSchema),
  patientController.createAdultPatient
);
router.get('/patients/adults', patientController.getAdultPatients);
router.get('/patients/adults/:patientId', patientController.getAdultPatientById);
router.put(
  '/patients/adults/:patientId',
  validateRequest(updateAdultPatientSchema),
  patientController.updateAdultPatient
);
router.delete('/patients/adults/:patientId', patientController.deleteAdultPatient);

// Pediatric Patients
router.post(
  '/patients/pediatrics',
  validateRequest(createPediatricPatientSchema),
  patientController.createPediatricPatient
);
router.get('/patients/pediatrics', patientController.getPediatricPatients);
router.get('/patients/pediatrics/:patientId', patientController.getPediatricPatientById);
router.put(
  '/patients/pediatrics/:patientId',
  validateRequest(updatePediatricPatientSchema),
  patientController.updatePediatricPatient
);
router.delete('/patients/pediatrics/:patientId', patientController.deletePediatricPatient);

// ============================================
// LABORATORY ROUTES
// ============================================

router.post(
  '/labs/tests',
  validateRequest(createLabTestSchema),
  labController.createLabTest
);
router.get('/labs/patient/:patientId', labController.getLabTestsByPatient);
router.get('/labs/test/:testId', labController.getLabTestById);
router.put('/labs/test/:testId', labController.updateLabTest);
router.delete('/labs/test/:testId', labController.deleteLabTest);
router.get('/labs/recent', labController.getRecentTests);
router.get('/labs/statistics', labController.getLabStatistics);

// ============================================
// PHARMACY ROUTES
// ============================================

// Medicines
router.post(
  '/pharmacy/medicines',
  validateRequest(createMedicineSchema),
  pharmacyController.addMedicine
);
router.get('/pharmacy/medicines', pharmacyController.getAllMedicines);
router.get('/pharmacy/medicines/:medicineId', pharmacyController.getMedicineById);
router.put(
  '/pharmacy/medicines/:medicineId/stock',
  pharmacyController.updateMedicineStock
);
router.delete('/pharmacy/medicines/:medicineId', pharmacyController.deleteMedicine);

// Dispensing
router.post(
  '/pharmacy/dispensing',
  validateRequest(dispenseMedicineSchema),
  pharmacyController.dispenseMedicine
);
router.get('/pharmacy/dispensing/history', pharmacyController.getDispensingHistory);
router.get('/pharmacy/medicines/low-stock', pharmacyController.getLowStockMedicines);
router.get('/pharmacy/statistics', pharmacyController.getPharmacyStatistics);

// ============================================
// CLINIC ROUTES
// ============================================

router.get('/clinics', clinicController.getAllClinics);
router.post(
  '/clinics/visit',
  validateRequest(createClinicVisitSchema),
  clinicController.createClinicVisit
);
router.get('/clinics/patient/:patientId', clinicController.getPatientClinicVisits);
router.get('/clinics/type/:clinicType', clinicController.getClinicVisitsByType);
router.get('/clinics/visit/:visitId', clinicController.getClinicVisitById);
router.put('/clinics/visit/:visitId', clinicController.updateClinicVisit);
router.delete('/clinics/visit/:visitId', clinicController.deleteClinicVisit);
router.get('/clinics/statistics', clinicController.getClinicStatistics);
router.get('/clinics/date-range', clinicController.getVisitsForDateRange);

export default router;
