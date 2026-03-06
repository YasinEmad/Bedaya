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
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    medicineName: {
      type: String,
      required: true,
      index: true,
      trim: true
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
      default: 0,
      min: 0
    },
    dispensed: {
      type: Number,
      default: 0,
      min: 0
    },
    lastRestocked: {
      type: Date,
      default: Date.now
    },
    minStockLevel: {
      type: Number,
      default: 10,
      min: 0
    },
    supplier: String,
    expiryDate: Date,
    cost: Number,
    notes: String
  },
  { timestamps: true }
);

// Create compound index for faster searches
medicineSchema.index({ medicineName: 1, barcode: 1 });

// Virtual getter for low stock warning
medicineSchema.virtual('isLowStock').get(function (this: IMedicine) {
  return this.currentStock <= this.minStockLevel;
});

export const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);
