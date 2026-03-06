# Bedaya Backend Structure Documentation

## 📋 جدول المحتويات
1. [مقدمة عامة](#مقدمة-عامة)
2. [هيكل المجلدات](#هيكل-المجلدات)
3. [المتطلبات](#المتطلبات)
4. [Database Models](#database-models)
5. [REST API Endpoints](#rest-api-endpoints)
6. [File Organization](#file-organization)
7. [Validation & Error Handling](#validation--error-handling)
8. [Environment Variables](#environment-variables)
9. [Middleware](#middleware)
10. [أمثلة عملية](#أمثلة-عملية)

---

## مقدمة عامة

هذا التوثيق يوضح البنية الموصى بها لبناء Backend للتطبيق **Bedaya** - منصة إدارة صحية شاملة.

### المتطلبات الأساسية:
- ✅ Node.js
- ✅ Express.js
- ✅ MongoDB
- ✅ TypeScript
- ✅ Scalable Architecture
- ✅ Easy Maintenance

### Core Modules المدعومة:
- **Patient Management** (Adult & Pediatric)
- **Laboratory Tests** (Blood, Urine, Stool)
- **Clinic Management** (10 Specialized Clinics)
- **Pharmacy Management** (Inventory & Dispensing)

---

## هيكل المجلدات

```
Backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB Connection
│   │   ├── environment.ts       # Environment Variables
│   │   └── constants.ts         # App Constants
│   │
│   ├── models/
│   │   ├── Patient.ts           # Base Patient Model
│   │   ├── AdultPatient.ts      # Adult Patient Schema
│   │   ├── PediatricPatient.ts  # Pediatric Patient Schema
│   │   ├── LabTest.ts           # Lab Tests Model
│   │   ├── ClinicVisit.ts       # Clinic Visits Model
│   │   ├── Medicine.ts          # Medicine Inventory Model
│   │   ├── Dispensing.ts        # Medicine Dispensing Model
│   │   └── Referral.ts          # Referral Records Model
│   │
│   ├── controllers/
│   │   ├── patients/
│   │   │   ├── adultsController.ts
│   │   │   └── pediatricsController.ts
│   │   ├── labs/
│   │   │   ├── bloodLabsController.ts
│   │   │   ├── urineLabsController.ts
│   │   │   └── stoolLabsController.ts
│   │   ├── clinics/
│   │   │   └── clinicsController.ts
│   │   ├── pharmacyController.ts
│   │   └── dashboardController.ts
│   │
│   ├── services/
│   │   ├── patients/
│   │   │   ├── patientService.ts
│   │   │   ├── adultService.ts
│   │   │   └── pediatricService.ts
│   │   ├── labs/
│   │   │   └── labService.ts
│   │   ├── clinics/
│   │   │   └── clinicService.ts
│   │   ├── pharmacy/
│   │   │   ├── medicineService.ts
│   │   │   └── dispensingService.ts
│   │   └── statisticsService.ts
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global Error Handler
│   │   ├── validation.ts        # Request Validation
│   │   ├── logging.ts           # Request Logging
│   │   └── corsHandler.ts       # CORS Configuration
│   │
│   ├── routes/
│   │   ├── patients.ts
│   │   ├── labs.ts
│   │   ├── clinics.ts
│   │   ├── pharmacy.ts
│   │   ├── dashboard.ts
│   │   └── index.ts             # Route Registry
│   │
│   ├── validators/
│   │   ├── patientValidators.ts
│   │   ├── labValidators.ts
│   │   ├── clinicValidators.ts
│   │   └── medicineValidators.ts
│   │
│   ├── utils/
│   │   ├── errorHandler.ts      # Custom Error Classes
│   │   ├── response.ts          # Standard Response format
│   │   └── helpers.ts           # Utility Functions
│   │
│   ├── types/
│   │   ├── index.ts             # TypeScript Interfaces
│   │   └── enums.ts             # Enums & Constants
│   │
│   ├── app.ts                   # Express App Setup
│   └── server.ts                # Server Entry Point
│
├── dist/                        # Compiled JavaScript
├── tests/                       # Jest Tests
├── logs/                        # Application Logs
├── .env                         # Environment Variables
├── .env.example                 # Example Env File
├── tsconfig.json                # TypeScript Config
├── package.json
└── README.md
```

---

## المتطلبات

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "dotenv": "^16.0.0",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "ts-node-dev": "^2.0.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0"
  }
}
```

### Installation

```bash
cd Backend
npm install
npm run dev        # Development
npm run build      # Build
npm start          # Production
```

---

## Database Models

### 1. Patient (Base Model)

```typescript
// src/models/Patient.ts
import { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  // Header
  houseNumber: string;
  patientCode: string;
  pov: boolean;          // Point of View / Person of Visitor
  createdAt: Date;
  updatedAt: Date;
}

// Common fields for all patients
const patientBaseSchema = {
  houseNumber: {
    type: String,
    required: true,
    index: true
  },
  patientCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  pov: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export { patientBaseSchema };
```

### 2. Adult Patient Model

```typescript
// src/models/AdultPatient.ts
import mongoose, { Schema, Document } from 'mongoose';
import { patientBaseSchema } from './Patient';

export interface IAdultPatient extends Document {
  // Personal Info
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  occupation: string;
  mobileNumber: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  ifMarriedChildren: number;
  ageOfYoungest: number;

  // Education
  educationLevel: string;

  // Lifestyle
  smoking: {
    status: 'yes' | 'no' | 'former';
    rate: string;
    type: string;
    durationYears: number;
    cessationYears?: number;
  };

  // Menstruation (if female)
  menstruation?: {
    regular: boolean;
    gravidaNumber: number;
    abortionNumber: number;
  };

  // Contraception (if female)
  contraception?: {
    using: boolean;
    method: string[];
    other?: string;
  };

  // Complaints
  complaints: string[];

  // Past Medical History
  pastHistory: {
    diabetes: boolean;
    hypertension: boolean;
    HCV: boolean;
    RHD: boolean;
    others: string;
  };

  // Allergies
  allergies: {
    hasAllergy: boolean;
    details: string;
  };

  // Blood Transfusion
  bloodTransfusion?: {
    received: boolean;
    duration: string;
  };

  // Surgical History
  surgery: {
    ICU: boolean;
    operation: boolean;
  };

  // Chronic Medications
  chronicMedications: {
    antiHTN: boolean;
    oralHypoglycemic: boolean;
    antiepileptic: boolean;
    antidiuretic: boolean;
    others: string;
  };

  // Family History
  familyHistory: {
    similar: boolean;
    hypertension: boolean;
    diabetes: boolean;
    others: string;
  };

  // Vital Signs
  vitals: {
    BP: string;        // Blood Pressure
    HR: number;        // Heart Rate
    RBS: number;       // Random Blood Sugar
    temperature: number;
    SpO2: number;      // Oxygen Saturation
  };

  // Physical Examination
  physicalExam: {
    cyanosis: { peripheral: boolean; central: boolean };
    jaundice: boolean;
    pallor: boolean;
  };

  // Anthropometry
  anthropometry: {
    weight: number;    // kg
    height: number;    // cm
    BMI: number;
  };

  // Screening
  diabetesScreening: 'known' | 'unknown' | 'none';

  // Referrals
  referrals: {
    internalMedicine: boolean;
    cardiology: boolean;
    surgery: boolean;
    ophthalmology: boolean;
    obstetricGynecology: boolean;
    ENT: boolean;
    dermatology: boolean;
    orthopedics: boolean;
    dental: boolean;
    goHome: boolean;
  };
}

const adultPatientSchema = new Schema<IAdultPatient>({
  ...patientBaseSchema,
  patientName: { type: String, required: true, index: true },
  sex: { type: String, enum: ['male', 'female'], required: true },
  age: { type: Number, required: true },
  occupation: String,
  mobileNumber: String,
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed']
  },
  ifMarriedChildren: Number,
  ageOfYoungest: Number,
  educationLevel: String,
  smoking: {
    status: { type: String, enum: ['yes', 'no', 'former'] },
    rate: String,
    type: String,
    durationYears: Number,
    cessationYears: Number
  },
  menstruation: {
    regular: Boolean,
    gravidaNumber: Number,
    abortionNumber: Number
  },
  contraception: {
    using: Boolean,
    method: [String],
    other: String
  },
  complaints: [String],
  pastHistory: {
    diabetes: Boolean,
    hypertension: Boolean,
    HCV: Boolean,
    RHD: Boolean,
    others: String
  },
  allergies: {
    hasAllergy: Boolean,
    details: String
  },
  bloodTransfusion: {
    received: Boolean,
    duration: String
  },
  surgery: {
    ICU: Boolean,
    operation: Boolean
  },
  chronicMedications: {
    antiHTN: Boolean,
    oralHypoglycemic: Boolean,
    antiepileptic: Boolean,
    antidiuretic: Boolean,
    others: String
  },
  familyHistory: {
    similar: Boolean,
    hypertension: Boolean,
    diabetes: Boolean,
    others: String
  },
  vitals: {
    BP: String,
    HR: Number,
    RBS: Number,
    temperature: Number,
    SpO2: Number
  },
  physicalExam: {
    cyanosis: { peripheral: Boolean, central: Boolean },
    jaundice: Boolean,
    pallor: Boolean
  },
  anthropometry: {
    weight: Number,
    height: Number,
    BMI: Number
  },
  diabetesScreening: { type: String, enum: ['known', 'unknown', 'none'] },
  referrals: {
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
  }
}, { timestamps: true });

// Index for quick searches
adultPatientSchema.index({ patientCode: 1, patientName: 1 });

export const AdultPatient = mongoose.model<IAdultPatient>('AdultPatient', adultPatientSchema);
```

### 3. Pediatric Patient Model

```typescript
// src/models/PediatricPatient.ts
import mongoose, { Schema, Document } from 'mongoose';
import { patientBaseSchema } from './Patient';

export interface IPediatricPatient extends Document {
  // Patient Info
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  
  // Parent/Guardian Info
  fatherOccupation: string;
  mobileNumber: string;
  fatherEducation: string;
  motherEducation: string;
  pharmacy: string;

  // Birth Info
  orderOfBirth: number;
  birthTerm: 'full' | 'pre';
  pretermWeeks?: number;
  birthMode: 'vaginalDelivery' | 'cesareanSection';
  csReason?: string;
  consanguinity: string;
  NICUAdmission: boolean;
  NICUAdmissionReason?: string;

  // Medical History
  complaints: string[];
  
  // Family History
  familyHistory: {
    diabetes: boolean;
    hypertension: boolean;
    similarCondition: boolean;
    similarConditionDetails?: string;
    geneticDisease: boolean;
    geneticDiseaseDetails?: string;
  };

  // Past History
  pastHistory: {
    medical: boolean;
    medicalDetails?: string;
    allergy: boolean;
    allergyDetails?: string;
    ICU: boolean;
    surgical: boolean;
    surgicalDetails?: string;
    bloodTransfusion: boolean;
  };

  // Immunization
  immunization: 'upToDate' | 'delayed' | 'none';

  // Dietary History
  dietaryHistory: 'breastfeeding' | 'artificial' | 'combined' | 'weaned';

  // Developmental History
  development: {
    grossMotor: string;
    fineMotor: string;
    language: string;
    social: string;
    sphincters: string;
  };

  // Vital Signs
  vitals: {
    HR: number;
    RR: number;
    BP: string;
    temperature: number;
    CRT: number;     // Capillary Refill Time
    RBS: number;
    Hb: number;       // Hemoglobin
  };

  // Screening Results
  screening: {
    SpO2: number;
    ricketsResult: string;
    parasitesResult: string;
  };

  // Physical Examination
  physicalExam: {
    pallor: boolean;
    jaundice: boolean;
    cyanosis: { central: boolean; peripheral: boolean };
  };

  // Anthropometry
  anthropometry: {
    weight: number;
    height: number;
    ofc: number;       // Occipito-Frontal Circumference
    weightForAge: string;
    heightForAge: string;
    weightForHeight: string;
    deformity: boolean;
  };

  // Local Examination
  examination: {
    cardiac: string;
    chest: string;
    abdominal: string;
    tonsils: string;
    general: string;
  };

  // Referrals
  referrals: {
    ENT: boolean;
    cardiology: boolean;
    ophthalmology: boolean;
    dermatology: boolean;
    dental: boolean;
    surgery: boolean;
    gynecology: boolean;
    pharmacy: boolean;
    goHome: boolean;
    other: boolean;
  };
}

const pediatricPatientSchema = new Schema<IPediatricPatient>({
  ...patientBaseSchema,
  patientName: { type: String, required: true, index: true },
  sex: { type: String, enum: ['male', 'female'], required: true },
  age: { type: Number, required: true },
  fatherOccupation: String,
  mobileNumber: String,
  fatherEducation: String,
  motherEducation: String,
  pharmacy: String,
  orderOfBirth: Number,
  birthTerm: { type: String, enum: ['full', 'pre'] },
  pretermWeeks: Number,
  birthMode: { type: String, enum: ['vaginalDelivery', 'cesareanSection'] },
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
  immunization: { type: String, enum: ['upToDate', 'delayed', 'none'] },
  dietaryHistory: { type: String, enum: ['breastfeeding', 'artificial', 'combined', 'weaned'] },
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
    cyanosis: { central: Boolean, peripheral: Boolean }
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
}, { timestamps: true });

pediatricPatientSchema.index({ patientCode: 1, patientName: 1 });

export const PediatricPatient = mongoose.model<IPediatricPatient>('PediatricPatient', pediatricPatientSchema);
```

### 4. Blood Lab Model

```typescript
// src/models/LabTest.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodLabTest extends Document {
  patientId: string;
  patientName: string;
  testDate: Date;
  testType: 'blood' | 'urine' | 'stool';
  
  // CBC - Complete Blood Count
  CBC?: {
    WBCs: number;
    lymphocytes?: number;
    midRange?: number;
    granulocytes?: number;
    RBCs: number;
    hemoglobin: number;
    hematocrit: number;
    MCV: number;
    MCH: number;
    MCHC: number;
  };

  // Liver Function Tests
  liverFunction?: {
    ALT: number;
    AST: number;
    alkalinePhosphatase: number;
    albumin: number;
    totalBilirubin: number;
    directBilirubin: number;
  };

  // Coagulation Tests
  coagulation?: {
    PTInr: number;
    PTTime: number;
    PTPercentage: number;
    PTT: number;
  };

  // Kidney Function Tests
  kidneyFunction?: {
    creatinine: number;
    urea: number;
    uricAcid: number;
  };

  // Lipid Profile
  lipidProfile?: {
    cholesterol: number;
    triglycerides: number;
    HDL: number;
    LDL: number;
  };

  // Ions
  electrolytes?: {
    potassium: number;
    calcium: number;
    sodium: number;
  };

  // Glucose
  glucose?: {
    random: number;
    fasting: number;
    postPrandial: number;
    HbA1C: number;
  };

  // Serology
  serology?: {
    HBV: boolean;
    HCV: boolean;
    alphaFetoprotein: number;
    PSA: number;
    betaHCG: number;
    antiD: boolean;
  };

  // Inflammatory Markers
  inflammatory?: {
    rheumatoidFactor: number;
    ASOT: number;
    CRP: number;
  };
}

const bloodLabSchema = new Schema<IBloodLabTest>({
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  testDate: { type: Date, default: Date.now },
  testType: { type: String, enum: ['blood', 'urine', 'stool'] },

  CBC: {
    WBCs: Number,
    lymphocytes: Number,
    midRange: Number,
    granulocytes: Number,
    RBCs: Number,
    hemoglobin: Number,
    hematocrit: Number,
    MCV: Number,
    MCH: Number,
    MCHC: Number
  },

  liverFunction: {
    ALT: Number,
    AST: Number,
    alkalinePhosphatase: Number,
    albumin: Number,
    totalBilirubin: Number,
    directBilirubin: Number
  },

  coagulation: {
    PTInr: Number,
    PTTime: Number,
    PTPercentage: Number,
    PTT: Number
  },

  kidneyFunction: {
    creatinine: Number,
    urea: Number,
    uricAcid: Number
  },

  lipidProfile: {
    cholesterol: Number,
    triglycerides: Number,
    HDL: Number,
    LDL: Number
  },

  electrolytes: {
    potassium: Number,
    calcium: Number,
    sodium: Number
  },

  glucose: {
    random: Number,
    fasting: Number,
    postPrandial: Number,
    HbA1C: Number
  },

  serology: {
    HBV: Boolean,
    HCV: Boolean,
    alphaFetoprotein: Number,
    PSA: Number,
    betaHCG: Number,
    antiD: Boolean
  },

  inflammatory: {
    rheumatoidFactor: Number,
    ASOT: Number,
    CRP: Number
  }
}, { timestamps: true });

bloodLabSchema.index({ patientId: 1, testDate: -1 });

export const BloodLabTest = mongoose.model<IBloodLabTest>('BloodLabTest', bloodLabSchema);
```

### 5. Medicine Inventory Model

```typescript
// src/models/Medicine.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  barcode: string;
  medicineName: string;
  medicineType: 'pills' | 'ampules' | 'bottle';
  stockType: 'pills' | 'strip';
  pillsPerStrip?: number;
  currentStock: number;
  dispensed: number;
  lastRestocked: Date;
  minStockLevel: number;
  supplier?: string;
  expiryDate?: Date;
  cost?: number;
  notes?: string;
}

const medicineSchema = new Schema<IMedicine>({
  barcode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  medicineName: {
    type: String,
    required: true,
    index: true
  },
  medicineType: {
    type: String,
    enum: ['pills', 'ampules', 'bottle'],
    required: true
  },
  stockType: {
    type: String,
    enum: ['pills', 'strip'],
    required: true
  },
  pillsPerStrip: Number,
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  dispensed: {
    type: Number,
    default: 0
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  supplier: String,
  expiryDate: Date,
  cost: Number,
  notes: String
}, { timestamps: true });

medicineSchema.index({ medicineName: 1, barcode: 1 });

export const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);
```

### 6. Dispensing Record Model

```typescript
// src/models/Dispensing.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDispensingRecord extends Document {
  dispensingId: string;
  patientId: string;
  patientName: string;
  medications: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    type: string;
    instructions: string;
  }[];
  prescribedBy: string;
  dispensedBy: string;
  dispensingDate: Date;
  dispensingTime: string;
  notes?: string;
}

const dispensingSchema = new Schema<IDispensingRecord>({
  dispensingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  patientId: {
    type: String,
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: true
  },
  medications: [{
    medicineId: String,
    medicineName: String,
    quantity: Number,
    type: String,
    instructions: String
  }],
  prescribedBy: String,
  dispensedBy: String,
  dispensingDate: {
    type: Date,
    default: Date.now
  },
  dispensingTime: String,
  notes: String
}, { timestamps: true });

dispensingSchema.index({ patientId: 1, dispensingDate: -1 });

export const DispensingRecord = mongoose.model<IDispensingRecord>('DispensingRecord', dispensingSchema);
```

### 7. Clinic Visit Model

```typescript
// src/models/ClinicVisit.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IClinicVisit extends Document {
  patientId: string;
  patientName: string;
  clinicType: string;
  visitDate: Date;
  doctor: string;
  diagnosis: string;
  treatment: string;
  referrals?: string[];
  notes?: string;
}

const clinicVisitSchema = new Schema<IClinicVisit>({
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  clinicType: { 
    type: String,
    enum: ['internal-medicine', 'cardiology', 'orthopedics', 'ophthalmology', 
           'obstetrics-gynecology', 'dermatology', 'dental', 'surgery', 'ent', 'pediatrics-clinic'],
    required: true
  },
  visitDate: { type: Date, default: Date.now },
  doctor: String,
  diagnosis: String,
  treatment: String,
  referrals: [String],
  notes: String
}, { timestamps: true });

clinicVisitSchema.index({ patientId: 1, visitDate: -1 });

export const ClinicVisit = mongoose.model<IClinicVisit>('ClinicVisit', clinicVisitSchema);
```

---

## REST API Endpoints

### Patient Management Endpoints

#### Adult Patients

```
POST   /api/patients/adults
       - Create new adult patient
       - Body: AdultPatient data

GET    /api/patients/adults
       - Get all adult patients
       - Query: ?page=1&limit=20&search=name

GET    /api/patients/adults/:patientId
       - Get specific adult patient

PUT    /api/patients/adults/:patientId
       - Update adult patient

DELETE /api/patients/adults/:patientId
       - Delete adult patient
```

#### Pediatric Patients

```
POST   /api/patients/pediatrics
       - Create new pediatric patient

GET    /api/patients/pediatrics
       - Get all pediatric patients

GET    /api/patients/pediatrics/:patientId
       - Get specific pediatric patient

PUT    /api/patients/pediatrics/:patientId
       - Update pediatric patient

DELETE /api/patients/pediatrics/:patientId
       - Delete pediatric patient
```

### Laboratory Endpoints

```
POST   /api/labs/blood
       - Record blood test results

GET    /api/labs/blood/patient/:patientId
       - Get patient's blood test results

POST   /api/labs/urine
       - Record urine test results

POST   /api/labs/stool
       - Record stool test results

GET    /api/labs/:testType/patient/:patientId
       - Get specific lab test results
```

### Clinic Endpoints

```
POST   /api/clinics/:clinicType/visit
       - Record clinic visit

GET    /api/clinics/:clinicType/patients
       - Get patients in specific clinic

GET    /api/clinics
       - Get all clinic stats
```

### Pharmacy Endpoints

```
POST   /api/pharmacy/medicines
       - Add medicine to inventory

GET    /api/pharmacy/medicines
       - Get all medicines

PUT    /api/pharmacy/medicines/:medicineId
       - Update medicine stock

POST   /api/pharmacy/dispensing
       - Record medicine dispensing

GET    /api/pharmacy/dispensing/history
       - Get dispensing history

GET    /api/pharmacy/dispensing/patient/:patientId
       - Get patient's dispensing history
```

### Dashboard Endpoints

```
GET    /api/dashboard/stats
       - Get dashboard statistics

GET    /api/dashboard/clinic-referrals
       - Get clinic referral stats

GET    /api/dashboard/lab-samples
       - Get lab sample stats
```

---

## File Organization

### Controllers

```typescript
// src/controllers/patients/adultsController.ts
import { Request, Response } from 'express';
import { adultService } from '../../services/patients/adultService';
import { ApiResponse } from '../../utils/response';
import { AppError } from '../../utils/errorHandler';

export class AdultsController {
  async createAdultPatient(req: Request, res: Response) {
    try {
      const patientData = req.body;
      const patient = await adultService.createPatient(patientData);
      ApiResponse.success(res, patient, 'Adult patient created successfully', 201);
    } catch (error) {
      if (error instanceof AppError) {
        ApiResponse.error(res, error.message, error.statusCode);
      } else {
        ApiResponse.error(res, 'Internal server error', 500);
      }
    }
  }

  async getAdultPatients(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const patients = await adultService.getPatients(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );
      ApiResponse.success(res, patients, 'Adult patients retrieved');
    } catch (error) {
      ApiResponse.error(res, 'Failed to retrieve patients', 500);
    }
  }

  async getAdultPatientById(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      const patient = await adultService.getPatientById(patientId);
      if (!patient) {
        return ApiResponse.error(res, 'Patient not found', 404);
      }
      ApiResponse.success(res, patient, 'Patient retrieved');
    } catch (error) {
      ApiResponse.error(res, 'Failed to retrieve patient', 500);
    }
  }

  async updateAdultPatient(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      const patientData = req.body;
      const patient = await adultService.updatePatient(patientId, patientData);
      ApiResponse.success(res, patient, 'Patient updated successfully');
    } catch (error) {
      ApiResponse.error(res, 'Failed to update patient', 500);
    }
  }

  async deleteAdultPatient(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      await adultService.deletePatient(patientId);
      ApiResponse.success(res, null, 'Patient deleted successfully');
    } catch (error) {
      ApiResponse.error(res, 'Failed to delete patient', 500);
    }
  }
}

export const adultsController = new AdultsController();
```

### Services

```typescript
// src/services/patients/adultService.ts
import { AdultPatient, IAdultPatient } from '../../models/AdultPatient';
import { AppError } from '../../utils/errorHandler';

class AdultPatientService {
  async createPatient(data: Partial<IAdultPatient>): Promise<IAdultPatient> {
    try {
      const patient = new AdultPatient(data);
      return await patient.save();
    } catch (error: any) {
      throw new AppError('Failed to create adult patient', 400, error.message);
    }
  }

  async getPatients(page: number, limit: number, search?: string) {
    let query: any = {};
    
    if (search) {
      query = {
        $or: [
          { patientName: { $regex: search, $options: 'i' } },
          { patientCode: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const skip = (page - 1) * limit;
    const patients = await AdultPatient
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await AdultPatient.countDocuments(query);

    return {
      data: patients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getPatientById(patientId: string): Promise<IAdultPatient | null> {
    return await AdultPatient.findOne({ patientCode: patientId });
  }

  async updatePatient(patientId: string, data: Partial<IAdultPatient>): Promise<IAdultPatient | null> {
    return await AdultPatient.findOneAndUpdate(
      { patientCode: patientId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

  async deletePatient(patientId: string): Promise<void> {
    await AdultPatient.deleteOne({ patientCode: patientId });
  }
}

export const adultService = new AdultPatientService();
```

### Validators

```typescript
// src/validators/patientValidators.ts
import Joi from 'joi';

export const adultPatientValidationSchema = Joi.object({
  houseNumber: Joi.string().required(),
  patientCode: Joi.string().required().pattern(/^[A-Z0-9]+$/),
  patientName: Joi.string().required().min(3),
  sex: Joi.string().valid('male', 'female').required(),
  age: Joi.number().required().min(18).max(120),
  occupation: Joi.string(),
  mobileNumber: Joi.string().pattern(/^[0-9+\-\s]+$/),
  maritalStatus: Joi.string().valid('single', 'married', 'divorced', 'widowed'),
  educationLevel: Joi.string(),
  complaints: Joi.array().items(Joi.string()),
  vitals: Joi.object({
    BP: Joi.string(),
    HR: Joi.number().min(0).max(200),
    RBS: Joi.number(),
    temperature: Joi.number().min(30).max(45),
    SpO2: Joi.number().min(0).max(100)
  })
});

export const validateAdultPatient = (data: any) => {
  return adultPatientValidationSchema.validate(data);
};
```

### Routes

```typescript
// src/routes/patients.ts
import express from 'express';
import { adultsController } from '../controllers/patients/adultsController';
import { pediatricsController } from '../controllers/patients/pediatricsController';
import { validateRequest } from '../middleware/validation';
import { validateAdultPatient } from '../validators/patientValidators';

const router = express.Router();

// Adult Patient Routes
router.post('/adults', validateRequest(validateAdultPatient), adultsController.createAdultPatient.bind(adultsController));
router.get('/adults', adultsController.getAdultPatients.bind(adultsController));
router.get('/adults/:patientId', adultsController.getAdultPatientById.bind(adultsController));
router.put('/adults/:patientId', adultsController.updateAdultPatient.bind(adultsController));
router.delete('/adults/:patientId', adultsController.deleteAdultPatient.bind(adultsController));

// Pediatric Patient Routes
router.post('/pediatrics', pediatricsController.createPediatricPatient.bind(pediatricsController));
router.get('/pediatrics', pediatricsController.getPediatricPatients.bind(pediatricsController));
router.get('/pediatrics/:patientId', pediatricsController.getPediatricPatientById.bind(pediatricsController));
router.put('/pediatrics/:patientId', pediatricsController.updatePediatricPatient.bind(pediatricsController));
router.delete('/pediatrics/:patientId', pediatricsController.deletePediatricPatient.bind(pediatricsController));

export default router;
```

---

## Validation & Error Handling

### Custom Error Handler

```typescript
// src/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
```

### Global Error Middleware

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { ApiResponse } from '../utils/response';
import logger from '../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.url });

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  // Default error
  ApiResponse.error(res, 'Internal server error', 500);
};
```

### Standard Response Format

```typescript
// src/utils/response.ts
import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string, statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, details?: string) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(res: Response, data: any[], pagination: any, message: string = '') {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## Environment Variables

```bash
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bedaya
MONGODB_DB_NAME=bedaya

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log

# CORS
CORS_ORIGIN=http://localhost:3000

# API
API_PREFIX=/api
API_VERSION=v1

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

### Load Environment Variables

```typescript
// src/config/environment.ts
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bedaya',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'bedaya',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  API_PREFIX: process.env.API_PREFIX || '/api',
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20'),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100')
};
```

---

## Middleware

### Request Validation Middleware

```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ApiResponse } from '../utils/response';

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { stripUnknown: true });
    
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return ApiResponse.error(res, 'Validation Error', 400, message);
    }

    req.body = value;
    next();
  };
};
```

### Logging Middleware

```typescript
// src/middleware/logging.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
```

### CORS Middleware

```typescript
// src/middleware/corsHandler.ts
import cors from 'cors';
import { env } from '../config/environment';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = env.CORS_ORIGIN.split(',');
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);
```

---

## أمثلة عملية

### مثال 1: إنشاء مريض بالغ

```bash
POST /api/patients/adults
Content-Type: application/json

{
  "houseNumber": "H001",
  "patientCode": "P001",
  "patientName": "أحمد محمد",
  "sex": "male",
  "age": 35,
  "occupation": "Engineer",
  "mobileNumber": "+20123456789",
  "maritalStatus": "married",
  "educationLevel": "University",
  "smoking": {
    "status": "no",
    "rate": "",
    "type": "",
    "durationYears": 0
  },
  "complaints": ["Headache", "Fever"],
  "vitals": {
    "BP": "120/80",
    "HR": 75,
    "RBS": 95,
    "temperature": 37.5,
    "SpO2": 98
  },
  "anthropometry": {
    "weight": 70,
    "height": 175,
    "BMI": 22.9
  }
}
```

**Response (Success 201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Adult patient created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patientCode": "P001",
    "patientName": "أحمد محمد",
    "age": 35,
    "sex": "male",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### مثال 2: تسجيل اختبار دم

```bash
POST /api/labs/blood
Content-Type: application/json

{
  "patientId": "P001",
  "patientName": "أحمد محمد",
  "testDate": "2024-01-20",
  "CBC": {
    "WBCs": 7.5,
    "RBCs": 4.8,
    "hemoglobin": 14.5,
    "hematocrit": 43,
    "platelets": 250
  },
  "glucose": {
    "random": 105,
    "fasting": 95,
    "HbA1C": 5.2
  }
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Blood test recorded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "patientId": "P001",
    "patientName": "أحمد محمد",
    "testDate": "2024-01-20",
    "CBC": { ... },
    "glucose": { ... },
    "createdAt": "2024-01-20T10:35:00Z"
  }
}
```

### مثال 3: صرف دواء

```bash
POST /api/pharmacy/dispensing
Content-Type: application/json

{
  "patientId": "P001",
  "patientName": "أحمد محمد",
  "medications": [
    {
      "medicineId": "med1",
      "medicineName": "Paracetamol 500mg",
      "quantity": 30,
      "type": "pills",
      "instructions": "Take twice daily with meals"
    }
  ],
  "prescribedBy": "Dr. Sarah Chen",
  "dispensedBy": "Pharmacist John"
}
```

### مثال 4: الحصول على إحصائيات لوحة التحكم

```bash
GET /api/dashboard/stats

Response:
{
  "success": true,
  "data": {
    "totalAdultPatients": 152,
    "totalPediatricPatients": 95,
    "totalClinicReferrals": 87,
    "totalLabSamples": 156,
    "clinicBreakdown": {
      "internalMedicine": 23,
      "cardiology": 14,
      "orthopedics": 8,
      ...
    }
  }
}
```

---

## الخطوات التالية للتطوير

### 1. Setup دانة قاعدة

```bash
npm install mongoose dotenv helmet cors winston
npm install --save-dev typescript @types/node @types/express ts-node ts-node-dev
```

### 2. Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Backend structure"
```

### 3. Development Server

```bash
npm run dev
```

### 4. Testing

```bash
npm run test
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## الملاحظات المهمة

✅ **تم تجاهل Authentication تماماً** كما طلبت

✅ **معايير REST API** - تتبع أفضل الممارسات

✅ **Type Safety** - استخدام TypeScript في كل مكان

✅ **Scalable** - يمكن التوسع بسهولة وإضافة ميزات جديدة

✅ **Maintainable** - فصل واضح بين الطبقات

✅ **Error Handling** - معالجة أخطاء شاملة

✅ **Validation** - التحقق من البيانات قبل الحفظ

---

**تم إعداد هذا التوثيق بناءً على متطلبات Frontend فقط ويوفر بنية قابلة للتوسع والصيانة في المستقبل.**
