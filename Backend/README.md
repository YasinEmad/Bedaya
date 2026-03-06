# Bedaya Backend API

Healthcare Management System Backend API built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env

# Update .env with your configuration
# Make sure MongoDB is running
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will be available at http://localhost:5000
```

### Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── config/          # Configuration files (database, environment, logger)
├── models/          # Mongoose schemas and models
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # Route definitions
├── middleware/      # Custom middleware
├── validators/      # Request validation schemas
├── utils/           # Utility functions and classes
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔌 API Endpoints

### Patients
- `POST /api/patients/adults` - Create adult patient
- `GET /api/patients/adults` - Get all adult patients (with pagination)
- `GET /api/patients/adults/:patientId` - Get specific adult patient
- `PUT /api/patients/adults/:patientId` - Update adult patient
- `DELETE /api/patients/adults/:patientId` - Delete adult patient

- `POST /api/patients/pediatrics` - Create pediatric patient
- `GET /api/patients/pediatrics` - Get all pediatric patients
- `GET /api/patients/pediatrics/:patientId` - Get specific pediatric patient
- `PUT /api/patients/pediatrics/:patientId` - Update pediatric patient
- `DELETE /api/patients/pediatrics/:patientId` - Delete pediatric patient

### Laboratory Tests
- `POST /api/labs/tests` - Create lab test
- `GET /api/labs/patient/:patientId` - Get patient's lab tests
- `GET /api/labs/test/:testId` - Get specific lab test
- `PUT /api/labs/test/:testId` - Update lab test
- `DELETE /api/labs/test/:testId` - Delete lab test
- `GET /api/labs/recent` - Get recent lab tests
- `GET /api/labs/statistics` - Get lab statistics

### Pharmacy
- `POST /api/pharmacy/medicines` - Add medicine to inventory
- `GET /api/pharmacy/medicines` - Get all medicines
- `GET /api/pharmacy/medicines/:medicineId` - Get specific medicine
- `PUT /api/pharmacy/medicines/:medicineId/stock` - Update medicine stock
- `DELETE /api/pharmacy/medicines/:medicineId` - Delete medicine
- `POST /api/pharmacy/dispensing` - Record medicine dispensing
- `GET /api/pharmacy/dispensing/history` - Get dispensing history
- `GET /api/pharmacy/medicines/low-stock` - Get low stock medicines
- `GET /api/pharmacy/statistics` - Get pharmacy statistics

### Clinics
- `POST /api/clinics/visit` - Record clinic visit
- `GET /api/clinics/patient/:patientId` - Get patient's clinic visits
- `GET /api/clinics/type/:clinicType` - Get visits by clinic type
- `GET /api/clinics/visit/:visitId` - Get specific visit
- `PUT /api/clinics/visit/:visitId` - Update clinic visit
- `DELETE /api/clinics/visit/:visitId` - Delete clinic visit
- `GET /api/clinics/statistics` - Get clinic statistics
- `GET /api/clinics/date-range` - Get visits for date range

## 📊 Example Requests

### Create Adult Patient

```bash
curl -X POST http://localhost:5000/api/patients/adults \
  -H "Content-Type: application/json" \
  -d '{
    "houseNumber": "H001",
    "patientCode": "P001",
    "patientName": "Ahmed Mohamed",
    "sex": "male",
    "age": 35,
    "mobileNumber": "+20123456789",
    "complaints": ["Headache", "Fever"],
    "vitals": {
      "BP": "120/80",
      "HR": 75,
      "temperature": 37.5,
      "SpO2": 98
    }
  }'
```

### Create Lab Test

```bash
curl -X POST http://localhost:5000/api/labs/tests \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P001",
    "patientName": "Ahmed Mohamed",
    "testType": "blood",
    "CBC": {
      "WBCs": 7.5,
      "hemoglobin": 14.5,
      "platelets": 250
    },
    "glucose": {
      "random": 105,
      "fasting": 95
    }
  }'
```

## 🔐 Environment Variables

```bash
NODE_ENV=development              # Environment: development, production
PORT=5000                         # Server port
MONGODB_URI=mongodb://...         # MongoDB connection URI
MONGODB_DB_NAME=bedaya            # Database name
LOG_LEVEL=debug                   # Log level: debug, info, warn, error
CORS_ORIGIN=http://localhost:3000 # CORS origin
API_PREFIX=/api                   # API prefix
DEFAULT_PAGE_SIZE=20              # Default pagination size
MAX_PAGE_SIZE=100                 # Maximum pagination size
```

## 🛠️ Development Tools

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```

## 📝 Database Models

### AdultPatient
Stores comprehensive adult patient health information including personal details, medical history, vitals, and referrals.

### PediatricPatient
Specialized model for pediatric patients with age-specific fields like immunization, developmental history, and NICU admission.

### LabTest
Records laboratory test results including CBC, liver function, kidney function, glucose, and serology tests.

### Medicine
Manages medicine inventory with barcode, stock levels, expiration dates, and cost tracking.

### DispensingRecord
Tracks medicine dispensing with patient information, medications, prescriber, and timestamp.

### ClinicVisit
Records clinic visits with diagnosis, treatment, referrals, and doctor information.

## 📄 License

MIT
