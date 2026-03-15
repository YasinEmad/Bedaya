import Joi from 'joi';

// Patient Common Validators
const patientCodePattern = /^[A-Z0-9]+$/;
const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

export const createAdultPatientSchema = Joi.object({
  houseNumber: Joi.string().required().messages({
    'string.empty': 'House number is required'
  }),
  // patientCode is now optional at creation time; the service will auto-generate a code if
  // one isn't supplied.  When provided, it still must match the same pattern.
  patientCode: Joi.string()
    .pattern(patientCodePattern)
    .optional()
    .messages({
      'string.pattern.base': 'Patient code must contain only letters and numbers'
    }),
  pov: Joi.boolean().default(false),
  patientName: Joi.string().min(2).required().messages({
    'string.min': 'Patient name must be at least 2 characters',
    'string.empty': 'Patient name is required'
  }),
  sex: Joi.string().valid('male', 'female').required().messages({
    'any.only': 'Sex must be either male or female',
    'string.empty': 'Sex is required'
  }),
  age: Joi.number().integer().min(18).max(120).required().messages({
    'number.min': 'Age must be at least 18',
    'number.max': 'Age must not exceed 120',
    'number.base': 'Age must be a number'
  }),
  occupation: Joi.string().optional(),
  mobileNumber: Joi.string()
    .pattern(phonePattern)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid phone number format'
    }),
  maritalStatus: Joi.string()
    .valid('single', 'married', 'divorced', 'widowed')
    .optional(),
  educationLevel: Joi.string().optional(),
  complaints: Joi.array().items(Joi.string()).optional(),
  vitals: Joi.object({
    BP: Joi.string().optional(),
    HR: Joi.number().min(0).max(200).optional(),
    RBS: Joi.number().optional(),
    temperature: Joi.number().min(30).max(45).optional(),
    SpO2: Joi.number().min(0).max(100).optional()
  }).optional(),
  anthropometry: Joi.object({
    weight: Joi.number().positive().optional(),
    height: Joi.number().positive().optional(),
    BMI: Joi.number().positive().optional()
  }).optional()
}).unknown(true);

export const updateAdultPatientSchema = createAdultPatientSchema.fork(
  ['houseNumber', 'patientCode', 'patientName', 'sex', 'age'],
  (schema) => schema.optional()
);

export const createPediatricPatientSchema = Joi.object({
  houseNumber: Joi.string().required(),
  patientCode: Joi.string().pattern(patientCodePattern).required(),
  pov: Joi.boolean().default(false),
  patientName: Joi.string().min(2).required(),
  sex: Joi.string().valid('male', 'female').required(),
  age: Joi.number().integer().min(0).max(18).required(),
  mobileNumber: Joi.string().pattern(phonePattern).optional(),
  complaints: Joi.array().items(Joi.string()).optional(),
  immunization: Joi.string().valid('upToDate', 'delayed', 'none').optional(),
  dietaryHistory: Joi.string().valid('breastfeeding', 'artificial', 'combined', 'weaned').optional(),
  vitals: Joi.object({
    HR: Joi.number().optional(),
    RR: Joi.number().optional(),
    BP: Joi.string().optional(),
    temperature: Joi.number().optional(),
    SpO2: Joi.number().optional()
  }).optional(),
  anthropometry: Joi.object({
    weight: Joi.number().positive().optional(),
    height: Joi.number().positive().optional()
  }).optional()
}).unknown(true);

export const createLabTestSchema = Joi.object({
  patientId: Joi.string().required().messages({
    'string.empty': 'Patient ID is required'
  }),
  patientName: Joi.string().required(),
  testDate: Joi.date().default(() => new Date()),
  testType: Joi.string().valid('blood', 'urine', 'stool').required().messages({
    'any.only': 'Test type must be blood, urine, or stool'
  }),
  CBC: Joi.object({
    WBCs: Joi.number().optional(),
    RBCs: Joi.number().optional(),
    hemoglobin: Joi.number().optional(),
    hematocrit: Joi.number().optional(),
    platelets: Joi.number().optional()
  }).optional(),
  glucose: Joi.object({
    random: Joi.number().optional(),
    fasting: Joi.number().optional(),
    postPrandial: Joi.number().optional(),
    HbA1C: Joi.number().optional()
  }).optional(),
  notes: Joi.string().optional()
}).unknown(true);

export const createMedicineSchema = Joi.object({
  barcode: Joi.string().required().messages({
    'string.empty': 'Barcode is required'
  }),
  medicineName: Joi.string().min(2).required().messages({
    'string.min': 'Medicine name must be at least 2 characters',
    'string.empty': 'Medicine name is required'
  }),
  medicineType: Joi.string()
    .valid('pills', 'ampules', 'bottle')
    .required(),
  stockType: Joi.string().valid('pills', 'strip').required(),
  pillsPerStrip: Joi.number().positive().optional(),
  currentStock: Joi.number().integer().min(0).required(),
  minStockLevel: Joi.number().integer().min(0).optional(),
  supplier: Joi.string().optional(),
  expiryDate: Joi.date().optional(),
  cost: Joi.number().positive().optional(),
  notes: Joi.string().optional()
});

export const dispenseMedicineSchema = Joi.object({
  patientId: Joi.string().required(),
  patientName: Joi.string().required(),
  medications: Joi.array()
    .items(
      Joi.object({
        medicineId: Joi.string().required(),
        medicineName: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        type: Joi.string().optional(),
        instructions: Joi.string().optional()
      })
    )
    .required(),
  prescribedBy: Joi.string().required(),
  dispensedBy: Joi.string().required(),
  notes: Joi.string().optional()
});

export const createClinicVisitSchema = Joi.object({
  patientId: Joi.string().required(),
  patientCode: Joi.string().required(),
  patientName: Joi.string().required(),
  clinicType: Joi.string()
    .valid(
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
    )
    .required(),
  doctor: Joi.string().required(),
  diagnosis: Joi.string().optional(),
  treatment: Joi.string().optional(),
  referrals: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional()
});

// Validation function factory
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (data: any) => {
    const { error, value } = schema.validate(data, {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const messages = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return { success: false, messages };
    }

    return { success: true, value };
  };
};

export const updatePediatricPatientSchema = createPediatricPatientSchema.fork(
  ['houseNumber', 'patientCode', 'patientName', 'sex', 'age'],
  (schema) => schema.optional()
);
