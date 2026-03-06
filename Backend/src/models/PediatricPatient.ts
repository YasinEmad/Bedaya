import mongoose, { Schema, Document } from 'mongoose';
import { patientBaseSchema, IBasePatient } from './Patient';

export interface IPediatricPatient extends IBasePatient {
  // Patient Info
  patientName: string;
  sex: 'male' | 'female';
  age: number;

  // Parent/Guardian Info
  fatherOccupation?: string;
  mobileNumber?: string;
  fatherEducation?: string;
  motherEducation?: string;
  pharmacy?: string;

  // Birth Info
  orderOfBirth?: number;
  birthTerm?: 'full' | 'pre';
  pretermWeeks?: number;
  birthMode?: 'vaginalDelivery' | 'cesareanSection';
  csReason?: string;
  consanguinity?: string;
  NICUAdmission?: boolean;
  NICUAdmissionReason?: string;

  // Medical History
  complaints?: string[];

  // Family History
  familyHistory?: {
    diabetes?: boolean;
    hypertension?: boolean;
    similarCondition?: boolean;
    similarConditionDetails?: string;
    geneticDisease?: boolean;
    geneticDiseaseDetails?: string;
  };

  // Past History
  pastHistory?: {
    medical?: boolean;
    medicalDetails?: string;
    allergy?: boolean;
    allergyDetails?: string;
    ICU?: boolean;
    surgical?: boolean;
    surgicalDetails?: string;
    bloodTransfusion?: boolean;
  };

  // Immunization
  immunization?: 'upToDate' | 'delayed' | 'none';

  // Dietary History
  dietaryHistory?: 'breastfeeding' | 'artificial' | 'combined' | 'weaned';

  // Developmental History
  development?: {
    grossMotor?: string;
    fineMotor?: string;
    language?: string;
    social?: string;
    sphincters?: string;
  };

  // Vital Signs
  vitals?: {
    HR?: number;
    RR?: number;
    BP?: string;
    temperature?: number;
    CRT?: number;
    RBS?: number;
    Hb?: number;
  };

  // Screening Results
  screening?: {
    SpO2?: number;
    ricketsResult?: string;
    parasitesResult?: string;
  };

  // Physical Examination
  physicalExam?: {
    pallor?: boolean;
    jaundice?: boolean;
    cyanosis?: { central?: boolean; peripheral?: boolean };
  };

  // Anthropometry
  anthropometry?: {
    weight?: number;
    height?: number;
    ofc?: number;
    weightForAge?: string;
    heightForAge?: string;
    weightForHeight?: string;
    deformity?: boolean;
  };

  // Local Examination
  examination?: {
    cardiac?: string;
    chest?: string;
    abdominal?: string;
    tonsils?: string;
    general?: string;
  };

  // Referrals
  referrals?: {
    ENT?: boolean;
    cardiology?: boolean;
    ophthalmology?: boolean;
    dermatology?: boolean;
    dental?: boolean;
    surgery?: boolean;
    gynecology?: boolean;
    pharmacy?: boolean;
    goHome?: boolean;
    other?: boolean;
  };
}

const pediatricPatientSchema = new Schema<IPediatricPatient>(
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
      min: 0,
      max: 18
    },
    fatherOccupation: String,
    mobileNumber: String,
    fatherEducation: String,
    motherEducation: String,
    pharmacy: String,
    orderOfBirth: Number,
    birthTerm: {
      type: String,
      enum: ['full', 'pre']
    },
    pretermWeeks: Number,
    birthMode: {
      type: String,
      enum: ['vaginalDelivery', 'cesareanSection']
    },
    csReason: String,
    consanguinity: String,
    NICUAdmission: Boolean,
    NICUAdmissionReason: String,
    complaints: [String],
    familyHistory: {
      diabetes: Boolean,
      hypertension: Boolean,
      similarCondition: Boolean,
      similarConditionDetails: String,
      geneticDisease: Boolean,
      geneticDiseaseDetails: String
    },
    pastHistory: {
      medical: Boolean,
      medicalDetails: String,
      allergy: Boolean,
      allergyDetails: String,
      ICU: Boolean,
      surgical: Boolean,
      surgicalDetails: String,
      bloodTransfusion: Boolean
    },
    immunization: {
      type: String,
      enum: ['upToDate', 'delayed', 'none']
    },
    dietaryHistory: {
      type: String,
      enum: ['breastfeeding', 'artificial', 'combined', 'weaned']
    },
    development: {
      grossMotor: String,
      fineMotor: String,
      language: String,
      social: String,
      sphincters: String
    },
    vitals: {
      HR: Number,
      RR: Number,
      BP: String,
      temperature: Number,
      CRT: Number,
      RBS: Number,
      Hb: Number
    },
    screening: {
      SpO2: Number,
      ricketsResult: String,
      parasitesResult: String
    },
    physicalExam: {
      pallor: Boolean,
      jaundice: Boolean,
      cyanosis: {
        central: Boolean,
        peripheral: Boolean
      }
    },
    anthropometry: {
      weight: Number,
      height: Number,
      ofc: Number,
      weightForAge: String,
      heightForAge: String,
      weightForHeight: String,
      deformity: Boolean
    },
    examination: {
      cardiac: String,
      chest: String,
      abdominal: String,
      tonsils: String,
      general: String
    },
    referrals: {
      ENT: Boolean,
      cardiology: Boolean,
      ophthalmology: Boolean,
      dermatology: Boolean,
      dental: Boolean,
      surgery: Boolean,
      gynecology: Boolean,
      pharmacy: Boolean,
      goHome: Boolean,
      other: Boolean
    }
  },
  { timestamps: true }
);

// Create indexes
pediatricPatientSchema.index({ patientCode: 1, patientName: 1 });
pediatricPatientSchema.index({ patientName: 'text' });

export const PediatricPatient = mongoose.model<IPediatricPatient>(
  'PediatricPatient',
  pediatricPatientSchema
);
