import mongoose, { Schema, Document } from 'mongoose';

export interface ILabTest extends Document {
  patientId: string;
  patientName: string;
  testDate: Date;
  testType: 'blood' | 'urine' | 'stool';

  // CBC - Complete Blood Count
  CBC?: {
    WBCs?: number;
    lymphocytes?: number;
    midRange?: number;
    granulocytes?: number;
    RBCs?: number;
    hemoglobin?: number;
    hematocrit?: number;
    MCV?: number;
    MCH?: number;
    MCHC?: number;
    platelets?: number;
    RDW_CV?: number;
    RDW_SD?: number;
    MPV?: number;
    PDW?: number;
    PCT?: number;
  };

  // Liver Function Tests
  liverFunction?: {
    ALT?: number;
    AST?: number;
    alkalinePhosphatase?: number;
    albumin?: number;
    totalBilirubin?: number;
    directBilirubin?: number;
  };

  // Coagulation Tests
  coagulation?: {
    PTInr?: number;
    PTTime?: number;
    PTPercentage?: number;
    PTT?: number;
  };

  // Kidney Function Tests
  kidneyFunction?: {
    creatinine?: number;
    urea?: number;
    uricAcid?: number;
  };

  // Lipid Profile
  lipidProfile?: {
    cholesterol?: number;
    triglycerides?: number;
    HDL?: number;
    LDL?: number;
  };

  // Ions/Electrolytes
  electrolytes?: {
    potassium?: number;
    calcium?: number;
    sodium?: number;
  };

  // Glucose
  glucose?: {
    random?: number;
    fasting?: number;
    postPrandial?: number;
    HbA1C?: number;
  };

  // Serology
  serology?: {
    HBV?: string;
    HCV?: string;
    alphaFetoprotein?: number;
    PSA?: number;
    betaHCG?: number;
    antiD?: string;
  };

  // Inflammatory Markers
  inflammatory?: {
    rheumatoidFactor?: number;
    ASOT?: number;
    CRP?: number;
  };

  // Urine Tests
  urine?: {
    consistency?: string;
    blood?: string;
    mucus?: string;
    color?: string;
    WBCs?: number;
    RBCs?: number;
    protein?: string;
    glucose?: string;
    ketones?: string;
    bilirubin?: string;
  };

  // Stool Tests
  stool?: {
    consistency?: string;
    blood?: string;
    mucus?: string;
    color?: string;
    worm?: string;
    odour?: string;
    fasciola?: string;
    schMansoni?: string;
    giardiaTrophozoite?: string;
    eHistoliticaTrophozoite?: string;
    blastocystHominis?: string;
    candidaAlbicans?: string;
    HPylori?: string;
  };

  notes?: string;
}

const labTestSchema = new Schema<ILabTest>(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    patientName: {
      type: String,
      required: true
    },
    testDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    testType: {
      type: String,
      enum: ['blood', 'urine', 'stool'],
      required: true
    },

    // CBC
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
      MCHC: Number,
      platelets: Number,
      RDW_CV: Number,
      RDW_SD: Number,
      MPV: Number,
      PDW: Number,
      PCT: Number
    },

    // Liver Function
    liverFunction: {
      ALT: Number,
      AST: Number,
      alkalinePhosphatase: Number,
      albumin: Number,
      totalBilirubin: Number,
      directBilirubin: Number
    },

    // Coagulation
    coagulation: {
      PTInr: Number,
      PTTime: Number,
      PTPercentage: Number,
      PTT: Number
    },

    // Kidney Function
    kidneyFunction: {
      creatinine: Number,
      urea: Number,
      uricAcid: Number
    },

    // Lipid Profile
    lipidProfile: {
      cholesterol: Number,
      triglycerides: Number,
      HDL: Number,
      LDL: Number
    },

    // Electrolytes
    electrolytes: {
      potassium: Number,
      calcium: Number,
      sodium: Number
    },

    // Glucose
    glucose: {
      random: Number,
      fasting: Number,
      postPrandial: Number,
      HbA1C: Number
    },

    // Serology
    serology: {
      HBV: String,
      HCV: String,
      alphaFetoprotein: Number,
      PSA: Number,
      betaHCG: Number,
      antiD: String
    },

    // Inflammatory
    inflammatory: {
      rheumatoidFactor: Number,
      ASOT: Number,
      CRP: Number
    },

    // Urine
    urine: {
      consistency: String,
      blood: String,
      mucus: String,
      color: String,
      WBCs: Number,
      RBCs: Number,
      protein: String,
      glucose: String,
      ketones: String,
      bilirubin: String
    },

    // Stool
    stool: {
      consistency: String,
      blood: String,
      mucus: String,
      color: String,
      worm: String,
      odour: String,
      fasciola: String,
      schMansoni: String,
      giardiaTrophozoite: String,
      eHistoliticaTrophozoite: String,
      blastocystHominis: String,
      candidaAlbicans: String,
      HPylori: String
    },

    notes: String
  },
  { timestamps: true }
);

// Create indexes
labTestSchema.index({ patientId: 1, testDate: -1 });
labTestSchema.index({ testType: 1 });

export const LabTest = mongoose.model<ILabTest>('LabTest', labTestSchema);
