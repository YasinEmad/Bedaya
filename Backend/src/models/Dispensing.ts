import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
  createdAt: Date;
  updatedAt: Date;
}

const dispensingSchema = new Schema<IDispensingRecord>(
  {
    dispensingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `DISP-${uuidv4().substring(0, 8)}`
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
    medications: [
      {
        medicineId: String,
        medicineName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        type: String,
        instructions: String
      }
    ],
    prescribedBy: {
      type: String,
      required: true
    },
    dispensedBy: {
      type: String,
      required: true
    },
    dispensingDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    dispensingTime: String,
    notes: String
  },
  { timestamps: true }
);

// Create indexes for efficient queries
dispensingSchema.index({ patientId: 1, dispensingDate: -1 });
dispensingSchema.index({ dispensingDate: 1 });

export const DispensingRecord = mongoose.model<IDispensingRecord>(
  'DispensingRecord',
  dispensingSchema
);
