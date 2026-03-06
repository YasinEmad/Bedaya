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
  createdAt: Date;
  updatedAt: Date;
}

const clinicVisitSchema = new Schema<IClinicVisit>(
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
    clinicType: {
      type: String,
      enum: [
        'internal-medicine',
        'cardiology',
        'orthopedics',
        'ophthalmology',
        'obstetrics-gynecology',
        'dermatology',
        'dental',
        'surgery',
        'ent',
        'pediatrics-clinic'
      ],
      required: true,
      index: true
    },
    visitDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    doctor: {
      type: String,
      required: true
    },
    diagnosis: String,
    treatment: String,
    referrals: [String],
    notes: String
  },
  { timestamps: true }
);

// Create indexes
clinicVisitSchema.index({ patientId: 1, visitDate: -1 });
clinicVisitSchema.index({ clinicType: 1 });

export const ClinicVisit = mongoose.model<IClinicVisit>(
  'ClinicVisit',
  clinicVisitSchema
);
