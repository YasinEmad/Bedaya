import { Schema, Document, Model } from 'mongoose';

export interface IBasePatient extends Document {
  houseNumber: string;
  patientCode: string;
  pov: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatientTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export const patientBaseSchema = {
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
  }
};
