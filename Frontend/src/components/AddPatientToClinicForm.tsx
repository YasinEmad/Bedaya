import React, { useState, useEffect } from "react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Checkbox } from "@ui/checkbox";
import { X, Search, Upload, File, User } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@ui/drawer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchAdultPatients, fetchPediatricPatients, AdultPatient, PediatricPatient } from "../store/slices/patientsSlice";

// Common diagnoses for the tag system
const COMMON_DIAGNOSES = [
    "Hypertension", "Type 2 Diabetes", "Upper Respiratory Infection", "Acute Bronchitis", "Asthma", "COPD", "Gastritis", "GERD", "Peptic Ulcer", "Urinary Tract Infection", "Pneumonia", "Migraine", "Tension Headache", "Osteoarthritis", "Rheumatoid Arthritis", "Allergic Rhinitis", "Sinusitis", "Conjunctivitis", "Dermatitis", "Eczema", "Psoriasis", "Anemia", "Hyperlipidemia", "Hypothyroidism", "Hyperthyroidism", "Depression", "Anxiety Disorder", "Back Pain", "Sciatica", "Cellulitis", "Acute Pharyngitis", "Tonsillitis", "Otitis Media"
];

// Common treatments for the tag system
const COMMON_TREATMENTS = [
    "Antibiotics", "Anti-inflammatory drugs", "Pain relief medication", "Antihypertensives", "Insulin therapy", "Oral hypoglycemics", "Bronchodilators", "Corticosteroids", "Antacids", "Proton pump inhibitors", "Antihistamines", "Analgesics", "Physical therapy", "Rest and hydration", "Dietary modifications", "Blood sugar monitoring", "Blood pressure monitoring", "Inhalers", "Topical steroids", "Antibiotic cream", "Eye drops", "Nasal spray", "Vitamin supplements", "Iron supplements", "Thyroid medication", "Antidepressants", "Anti-anxiety medication", "Wound care", "Follow-up required", "Referral to specialist", "Laboratory tests ordered"
];


interface AddPatientToClinicFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    clinicName: string;
    clinicType: string;
}

export function AddPatientToClinicForm({ open, onOpenChange, onSubmit, clinicName, clinicType }: AddPatientToClinicFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { adultPatients, pediatricPatients, loading: patientsLoading } = useSelector((state: RootState) => state.patients);
    
    const [diagnosisSearch, setDiagnosisSearch] = useState("");
    const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);

    const [treatmentSearch, setTreatmentSearch] = useState("");
    const [showTreatmentDropdown, setShowTreatmentDropdown] = useState(false);
    const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

    // PDF upload state
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [showFollowupPdfUpload, setShowFollowupPdfUpload] = useState(false);

    // Patient search state
    const [patientSearch, setPatientSearch] = useState("");
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<AdultPatient | PediatricPatient | null>(null);

    // Search patients when search term changes
    useEffect(() => {
        if (patientSearch.length > 2) {
            dispatch(fetchAdultPatients({ search: patientSearch, limit: 10 }));
            dispatch(fetchPediatricPatients({ search: patientSearch, limit: 10 }));
        }
    }, [patientSearch, dispatch]);

    // Combine adult and pediatric patients for dropdown
    const allPatients = [...adultPatients, ...pediatricPatients];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPatient) {
            alert("Please select a patient first");
            return;
        }

        const submitData = {
            patientId: selectedPatient._id,
            patientCode: selectedPatient.patientCode || selectedPatient._id.substring(0, 8),
            patientName: selectedPatient.patientName,
            clinicType: clinicType as any,
            diagnosis: selectedDiagnoses.join(', ') || 'Not specified',
            treatment: selectedTreatments.join(', ') || 'Not specified',
            doctor: clinicName,
        };

        console.log('Submitting clinic visit with patient code:', submitData.patientCode, 'Full data:', submitData);
        onSubmit(submitData);
        
        // Reset form
        setSelectedPatient(null);
        setSelectedDiagnoses([]);
        setSelectedTreatments([]);
        setUploadedFile(null);
        setShowFollowupPdfUpload(false);
    };

    // Helper functions for tag system
    const addDiagnosis = (diagnosis: string) => {
        if (!selectedDiagnoses.includes(diagnosis)) {
            setSelectedDiagnoses(prev => [...prev, diagnosis]);
        }
        setDiagnosisSearch("");
        setShowDiagnosisDropdown(false);
    };

    const removeDiagnosis = (diagnosis: string) => {
        setSelectedDiagnoses(prev => prev.filter(d => d !== diagnosis));
    };

    const addTreatment = (treatment: string) => {
        if (!selectedTreatments.includes(treatment)) {
            setSelectedTreatments(prev => [...prev, treatment]);
        }
        setTreatmentSearch("");
        setShowTreatmentDropdown(false);
    };

    const removeTreatment = (treatment: string) => {
        setSelectedTreatments(prev => prev.filter(t => t !== treatment));
    };

    const filteredDiagnoses = COMMON_DIAGNOSES.filter(d =>
        d.toLowerCase().includes(diagnosisSearch.toLowerCase()) &&
        !selectedDiagnoses.includes(d)
    );

    const filteredTreatments = COMMON_TREATMENTS.filter(t =>
        t.toLowerCase().includes(treatmentSearch.toLowerCase()) &&
        !selectedTreatments.includes(t)
    );


    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent fullscreen className="bg-white p-0 gap-0">
                <DrawerHeader className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            </div>
                            <div>
                                <DrawerTitle className="font-semibold text-base text-slate-900">Add Patient to {clinicName}</DrawerTitle>
                                <DrawerDescription className="text-xs text-slate-500">Search and assign patient to clinic queue</DrawerDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </DrawerHeader>
                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                        {/* Search Patient */}
                        <div>
                            <Label htmlFor="patient-search-clinic" className="text-sm font-medium text-slate-700 mb-2 block">
                                Search Patient by ID or Name
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="patient-search-clinic"
                                    value={patientSearch}
                                    onChange={(e) => {
                                        setPatientSearch(e.target.value);
                                        setShowPatientDropdown(true);
                                    }}
                                    onFocus={() => setShowPatientDropdown(true)}
                                    placeholder="Enter patient ID or name to search..."
                                    className="pl-11 h-11 text-sm"
                                />
                                {selectedPatient && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                        <User className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-700 font-medium">{selectedPatient.patientName}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPatient(null)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {showPatientDropdown && patientSearch.length > 2 && allPatients.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {patientsLoading ? (
                                        <div className="px-3 py-2 text-sm text-slate-500">Searching...</div>
                                    ) : (
                                        allPatients.map(patient => (
                                            <div
                                                key={patient._id}
                                                onClick={() => {
                                                    setSelectedPatient(patient);
                                                    setPatientSearch("");
                                                    setShowPatientDropdown(false);
                                                }}
                                                className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b border-slate-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-slate-900">{patient.patientName}</div>
                                                <div className="text-xs text-slate-500">ID: {patient.patientCode} • Age: {patient.age}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Diagnosis - Tag System */}
                        <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                Diagnosis
                            </Label>
                            <div className="relative">
                                <Input
                                    value={diagnosisSearch}
                                    onChange={(e) => {
                                        setDiagnosisSearch(e.target.value);
                                        setShowDiagnosisDropdown(true);
                                    }}
                                    onFocus={() => setShowDiagnosisDropdown(true)}
                                    className="h-10 text-sm"
                                    placeholder="Search and select diagnoses..."
                                />

                                {showDiagnosisDropdown && filteredDiagnoses.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {filteredDiagnoses.map(diagnosis => (
                                            <div
                                                key={diagnosis}
                                                onClick={() => addDiagnosis(diagnosis)}
                                                className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                                            >
                                                {diagnosis}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedDiagnoses.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedDiagnoses.map(diagnosis => (
                                        <div
                                            key={diagnosis}
                                            className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200"
                                        >
                                            <span>{diagnosis}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeDiagnosis(diagnosis)}
                                                className="hover:bg-blue-100 rounded-full p-0.5"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Treatment - Tag System */}
                        <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                Treatment Plan
                            </Label>
                            <div className="relative">
                                <Input
                                    value={treatmentSearch}
                                    onChange={(e) => {
                                        setTreatmentSearch(e.target.value);
                                        setShowTreatmentDropdown(true);
                                    }}
                                    onFocus={() => setShowTreatmentDropdown(true)}
                                    className="h-10 text-sm"
                                    placeholder="Search and select treatments..."
                                />

                                {showTreatmentDropdown && filteredTreatments.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {filteredTreatments.map(treatment => (
                                            <div
                                                key={treatment}
                                                onClick={() => addTreatment(treatment)}
                                                className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                                            >
                                                {treatment}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedTreatments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedTreatments.map(treatment => (
                                        <div
                                            key={treatment}
                                            className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200"
                                        >
                                            <span>{treatment}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTreatment(treatment)}
                                                className="hover:bg-green-100 rounded-full p-0.5"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Followup Checkbox */}
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                                checked={showFollowupPdfUpload}
                                onCheckedChange={(checked) => setShowFollowupPdfUpload(checked as boolean)}
                                id="followup-clinic"
                            />
                            <Label htmlFor="followup-clinic" className="text-sm font-medium text-slate-700">
                                Follow-up required
                            </Label>
                        </div>

                        {/* PDF Upload */}
                        {showFollowupPdfUpload && (
                            <div>
                                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Attach Medical Records (PDF)
                                </Label>

                                {!uploadedFile ? (
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            id="pdf-upload-clinic"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file && file.type === 'application/pdf') {
                                                    setUploadedFile(file);
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="pdf-upload-clinic"
                                            className="flex flex-col items-center cursor-pointer"
                                        >
                                            <Upload className="w-10 h-10 text-slate-400 mb-3" />
                                            <p className="text-sm font-medium text-slate-700 mb-1">Click to upload PDF</p>
                                            <p className="text-xs text-slate-500">or drag and drop your file here</p>
                                            <p className="text-xs text-slate-400 mt-2">PDF files only, max 10MB</p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* File info header */}
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <File className="w-6 h-6 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">{uploadedFile.name}</p>
                                                    <p className="text-xs text-green-700">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUploadedFile(null);
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* PDF File Info */}
                                        <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                            <p className="text-xs text-slate-600 text-center">PDF file attached successfully</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}          </form>
                </div>

                <DrawerFooter className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Add to Queue
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
