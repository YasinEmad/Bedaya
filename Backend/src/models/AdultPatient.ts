import mongoose, { Schema, Document } from 'mongoose';
import { patientBaseSchema, IBasePatient } from './Patient';

export interface IAdultPatient extends IBasePatient {
  // Patient Basic Info
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  occupation?: string;
  mobileNumber?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  ifMarriedChildren?: number;
  ageOfYoungest?: number;

  // Education
  educationLevel?: string;

  // Lifestyle - Smoking
  smoking?: {
    status?: 'yes' | 'no' | 'former';
    rate?: string;
    type?: string;
    durationYears?: number;
    cessationYears?: number;
  };

  // Menstruation (if female)
  menstruation?: {
    regular?: boolean;
    gravidaNumber?: number;
    abortionNumber?: number;
  };

  // Contraception
  contraception?: {
    using?: boolean;
    method?: string[];
    other?: string;
  };

  // Complaints
  complaints?: string[];

  // Past Medical History
  pastHistory?: {
    diabetes?: boolean;
    hypertension?: boolean;
    HCV?: boolean;
    RHD?: boolean;
    others?: string;
  };

  // Allergies
  allergies?: {
    hasAllergy?: boolean;
    details?: string;
  };

  // Blood Transfusion
  bloodTransfusion?: {
    received?: boolean;
    duration?: string;
  };

  // Surgical History
  surgery?: {
    ICU?: boolean;
    operation?: boolean;
  };

  // Chronic Medications
  chronicMedications?: {
    antiHTN?: boolean;
    oralHypoglycemic?: boolean;
    antiepileptic?: boolean;
    antidiuretic?: boolean;
    others?: string;
  };

  // Family History
  familyHistory?: {
    similar?: boolean;
    hypertension?: boolean;
    diabetes?: boolean;
    others?: string;
  };

  // Vital Signs
  vitals?: {
    BP?: string;
    HR?: number;
    RBS?: number;
    temperature?: number;
    SpO2?: number;
  };

  // Physical Examination
  physicalExam?: {
    cyanosis?: { peripheral?: boolean; central?: boolean };
    jaundice?: boolean;
    pallor?: boolean;
  };

  // Anthropometry
  anthropometry?: {
    weight?: number;
    height?: number;
    BMI?: number;
  };

  // Screening
  diabetesScreening?: 'known' | 'unknown' | 'none';

  // Referrals
  referrals?: {
    internalMedicine?: boolean;
    cardiology?: boolean;
    surgery?: boolean;
    ophthalmology?: boolean;
    obstetricGynecology?: boolean;
    ENT?: boolean;
    dermatology?: boolean;
    orthopedics?: boolean;
    dental?: boolean;
    goHome?: boolean;
  };
}

const smokingSchema = new Schema({
  status: {
    type: String,
    enum: ['yes', 'no', 'former']
  },
  rate: String,
  type: String,
  durationYears: Number,
  cessationYears: Number
}, { _id: false });

const menstruationSchema = new Schema({
  regular: Boolean,
  gravidaNumber: Number,
  abortionNumber: Number
}, { _id: false });

const contraceptionSchema = new Schema({
  using: Boolean,
  method: [String],
  other: String
}, { _id: false });

const pastHistorySchema = new Schema({
  diabetes: Boolean,
  hypertension: Boolean,
  HCV: Boolean,
  RHD: Boolean,
  others: String
}, { _id: false });

const allergiesSchema = new Schema({
  hasAllergy: Boolean,
  details: String
}, { _id: false });

const bloodTransfusionSchema = new Schema({
  received: Boolean,
  duration: String
}, { _id: false });

const surgerySchema = new Schema({
  ICU: Boolean,
  operation: Boolean
}, { _id: false });

const chronicMedicationsSchema = new Schema({
  antiHTN: Boolean,
  oralHypoglycemic: Boolean,
  antiepileptic: Boolean,
  antidiuretic: Boolean,
  others: String
}, { _id: false });

const familyHistorySchema = new Schema({
  similar: Boolean,
  hypertension: Boolean,
  diabetes: Boolean,
  others: String
}, { _id: false });

const vitalsSchema = new Schema({
  BP: String,
  HR: Number,
  RBS: Number,
  temperature: Number,
  SpO2: Number
}, { _id: false });

const physicalExamSchema = new Schema({
  cyanosis: {
    peripheral: Boolean,
    central: Boolean
  },
  jaundice: Boolean,
  pallor: Boolean
}, { _id: false });

const anthropometrySchema = new Schema({
  weight: Number,
  height: Number,
  BMI: Number
}, { _id: false });

const referralsSchema = new Schema({
  internalMedicine: Boolean,
  cardiology: Boolean,
  surgery: Boolean,
  ophthalmology: Boolean,
  obstetricGynecology: Boolean,
  ENT: Boolean,
  dermatology: Boolean,
  orthopedics: Boolean,
  dental: Boolean,
  goHome: Boolean
}, { _id: false });

const adultPatientSchema = new Schema<IAdultPatient>(
  {
    ...patientBaseSchema,
    patientName: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 120
    },
    occupation: {
      type: String,
      trim: true
    },
    mobileNumber: String,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    ifMarriedChildren: Number,
    ageOfYoungest: Number,
    educationLevel: String,
    smoking: smokingSchema,
    menstruation: menstruationSchema,
    contraception: contraceptionSchema,
    complaints: [String],
    pastHistory: pastHistorySchema,
    allergies: allergiesSchema,
    bloodTransfusion: bloodTransfusionSchema,
    surgery: surgerySchema,
    chronicMedications: chronicMedicationsSchema,
    familyHistory: familyHistorySchema,
    vitals: vitalsSchema,
    physicalExam: physicalExamSchema,
    anthropometry: anthropometrySchema,
    diabetesScreening: {
      type: String,
      enum: ['known', 'unknown', 'none']
    },
    referrals: referralsSchema
  },
  { timestamps: true }
);

// Create indexes for better query performance
adultPatientSchema.index({ patientCode: 1, patientName: 1 });
adultPatientSchema.index({ patientCode: 1 });
adultPatientSchema.index({ patientName: 'text' });

export const AdultPatient = mongoose.model<IAdultPatient>(
  'AdultPatient',
  adultPatientSchema
);
