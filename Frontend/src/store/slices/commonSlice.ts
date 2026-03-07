import { createSlice } from '@reduxjs/toolkit';

// Types
export interface CommonData {
  adultComplaints: string[];
  pediatricComplaints: string[];
  educationOptions: string[];
}

// Initial state with common data
const initialState: CommonData = {
  adultComplaints: [
    "Headache",
    "Fever",
    "Cough",
    "Chest Pain",
    "Abdominal Pain",
    "Back Pain",
    "Joint Pain",
    "Fatigue",
    "Dizziness",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Shortness of Breath",
    "Palpitations",
    "Hypertension",
    "Diabetes",
    "Skin Rash",
    "Eye Pain",
    "Blurred Vision",
    "Ear Pain",
    "Sore Throat",
    "Dental Pain",
    "Toothache",
    "Weakness",
    "Weight Loss",
    "Loss of Appetite"
  ],
  pediatricComplaints: [
    "Fever",
    "Cough",
    "Ear Infection",
    "Skin Rash",
    "Asthma",
    "Diarrhea",
    "Vomiting",
    "Abdominal Pain",
    "Constipation",
    "Dental Pain",
    "Growth Concerns",
    "Developmental Delay",
    "Poor Feeding",
    "Jaundice",
    "Seizures",
    "Headache",
    "Malnutrition",
    "Anemia",
    "Respiratory Distress"
  ],
  educationOptions: [
    "Illiterate",
    "Read and Write",
    "Primary",
    "Preparatory",
    "Secondary",
    "University",
    "Postgraduate"
  ]
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    addAdultComplaint: (state, action) => {
      if (!state.adultComplaints.includes(action.payload)) {
        state.adultComplaints.push(action.payload);
      }
    },
    addPediatricComplaint: (state, action) => {
      if (!state.pediatricComplaints.includes(action.payload)) {
        state.pediatricComplaints.push(action.payload);
      }
    },
    addEducationOption: (state, action) => {
      if (!state.educationOptions.includes(action.payload)) {
        state.educationOptions.push(action.payload);
      }
    },
  },
});

export const { addAdultComplaint, addPediatricComplaint, addEducationOption } = commonSlice.actions;
export default commonSlice.reducer;