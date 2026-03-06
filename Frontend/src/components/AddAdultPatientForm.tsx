import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Plus, X, Save, Users } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface FormData {
  // Header
  houseNumber: string;
  code: string;
  pov: boolean;
  // Personal Info
  patientName: string;
  sex: string;
  age: string;
  occupation: string;
  mobileNumber: string;
  maritalStatus: string;
  ifMarriedChildren: string;
  ageOfYoungest: string;
  // Education
  educationLevel: string;
  // Habits
  smoking: string;
  smokingRate: string;
  smokingType: string;
  smokingOther: string;
  smokingCessation: string;
  smokingIfYes: string;
  smokingDuration: string;
  // Menstruation
  menstruation: string;
  gravidaNumber: string;
  abortionNumber: string;
  // Contraception
  contraception: string;
  contraceptionMethod: string[];
  contraceptionOther: string;
  // Complaints - now array of strings (tags)
  complaints: string[];
  // Past History
  pastHistoryDM: boolean;
  pastHistoryHTN: boolean;
  pastHistoryHCV: boolean;
  pastHistoryRHD: boolean;
  pastHistoryOthers: string;
  allergyYes: boolean;
  allergyNo: boolean;
  allergySpecify: string;
  // Blood Transfusion
  bloodTransfusion: string;
  bloodTransfusionDuration: string;
  // Surgical
  surgicalICU: boolean;
  surgicalOperation: boolean;
  // Drugs for Chronic Disease
  drugsAntiHTN: boolean;
  drugsOralHypoglycemic: boolean;
  drugsAntiepilep: boolean;
  drugsAntidiuretic: boolean;
  drugsOther: string;
  // Family History
  familySimilar: boolean;
  familyHTN: boolean;
  familyDM: boolean;
  familyOther: string;
  // Vital Data
  vitalBP: string;
  vitalHR: string;
  vitalRBS: string;
  vitalTemp: string;
  vitalSpo2: string;
  // Complexions
  cyanosisPeripheral: boolean;
  cyanosisCentral: boolean;
  jaundice: boolean;
  pallor: boolean;
  // Anthropometric
  weight: string;
  height: string;
  bmi: string;
  // Screening
  diabetesKnown: boolean;
  diabetesUnknown: boolean;
  // Referral
  referralIM: boolean;
  referralCardio: boolean;
  referralSurgery: boolean;
  referralOphth: boolean;
  referralObsGyn: boolean;
  referralENT: boolean;
  referralDerma: boolean;
  referralOrtho: boolean;
  referralDental: boolean;
  referralGoHome: boolean;
}

interface AddAdultPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

// Common diagnoses/complaints for the tag system
const COMMON_COMPLAINTS = [
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
];

export function AddAdultPatientForm({ open, onOpenChange, onSubmit, initialData }: AddAdultPatientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    houseNumber: initialData?.houseNumber || "",
    code: initialData?.code || "",
    pov: initialData?.pov || false,
    patientName: initialData?.patientName || "",
    sex: initialData?.sex || "",
    age: initialData?.age || "",
    occupation: initialData?.occupation || "",
    mobileNumber: initialData?.mobileNumber || "",
    maritalStatus: initialData?.maritalStatus || "",
    ifMarriedChildren: initialData?.ifMarriedChildren || "",
    ageOfYoungest: initialData?.ageOfYoungest || "",
    educationLevel: initialData?.educationLevel || "",
    smoking: initialData?.smoking || "",
    smokingRate: initialData?.smokingRate || "",
    smokingType: initialData?.smokingType || "",
    smokingOther: initialData?.smokingOther || "",
    smokingCessation: initialData?.smokingCessation || "",
    smokingIfYes: initialData?.smokingIfYes || "",
    smokingDuration: initialData?.smokingDuration || "",
    menstruation: initialData?.menstruation || "",
    gravidaNumber: initialData?.gravidaNumber || "",
    abortionNumber: initialData?.abortionNumber || "",
    contraception: initialData?.contraception || "",
    contraceptionMethod: initialData?.contraceptionMethod || [],
    contraceptionOther: initialData?.contraceptionOther || "",
    complaints: initialData?.complaints || [],
    pastHistoryDM: initialData?.pastHistoryDM || false,
    pastHistoryHTN: initialData?.pastHistoryHTN || false,
    pastHistoryHCV: initialData?.pastHistoryHCV || false,
    pastHistoryRHD: initialData?.pastHistoryRHD || false,
    pastHistoryOthers: initialData?.pastHistoryOthers || "",
    allergyYes: initialData?.allergyYes || false,
    allergyNo: initialData?.allergyNo || false,
    allergySpecify: initialData?.allergySpecify || "",
    bloodTransfusion: initialData?.bloodTransfusion || "",
    bloodTransfusionDuration: initialData?.bloodTransfusionDuration || "",
    surgicalICU: initialData?.surgicalICU || false,
    surgicalOperation: initialData?.surgicalOperation || false,
    drugsAntiHTN: initialData?.drugsAntiHTN || false,
    drugsOralHypoglycemic: initialData?.drugsOralHypoglycemic || false,
    drugsAntiepilep: initialData?.drugsAntiepilep || false,
    drugsAntidiuretic: initialData?.drugsAntidiuretic || false,
    drugsOther: initialData?.drugsOther || "",
    familySimilar: initialData?.familySimilar || false,
    familyHTN: initialData?.familyHTN || false,
    familyDM: initialData?.familyDM || false,
    familyOther: initialData?.familyOther || "",
    vitalBP: initialData?.vitalBP || "",
    vitalHR: initialData?.vitalHR || "",
    vitalRBS: initialData?.vitalRBS || "",
    vitalTemp: initialData?.vitalTemp || "",
    vitalSpo2: initialData?.vitalSpo2 || "",
    cyanosisPeripheral: initialData?.cyanosisPeripheral || false,
    cyanosisCentral: initialData?.cyanosisCentral || false,
    jaundice: initialData?.jaundice || false,
    pallor: initialData?.pallor || false,
    weight: initialData?.weight || "",
    height: initialData?.height || "",
    bmi: initialData?.bmi || "",
    diabetesKnown: initialData?.diabetesKnown || false,
    diabetesUnknown: initialData?.diabetesUnknown || false,
    referralIM: initialData?.referralIM || false,
    referralCardio: initialData?.referralCardio || false,
    referralSurgery: initialData?.referralSurgery || false,
    referralOphth: initialData?.referralOphth || false,
    referralObsGyn: initialData?.referralObsGyn || false,
    referralENT: initialData?.referralENT || false,
    referralDerma: initialData?.referralDerma || false,
    referralOrtho: initialData?.referralOrtho || false,
    referralDental: initialData?.referralDental || false,
    referralGoHome: initialData?.referralGoHome || false
  });

  const [complaintSearch, setComplaintSearch] = useState("");
  const [showComplaintDropdown, setShowComplaintDropdown] = useState(false);

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.weight && formData.height) {
      const weightKg = parseFloat(formData.weight);
      const heightCm = parseFloat(formData.height);
      if (weightKg > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi }));
      }
    }
  }, [formData.weight, formData.height]);

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleArrayCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addComplaint = (complaint: string) => {
    if (!formData.complaints.includes(complaint)) {
      setFormData(prev => ({
        ...prev,
        complaints: [...prev.complaints, complaint]
      }));
    }
    setComplaintSearch("");
    setShowComplaintDropdown(false);
  };

  const removeComplaint = (complaint: string) => {
    setFormData(prev => ({
      ...prev,
      complaints: prev.complaints.filter(c => c !== complaint)
    }));
  };

  const filteredComplaints = COMMON_COMPLAINTS.filter(c => 
    c.toLowerCase().includes(complaintSearch.toLowerCase()) &&
    !formData.complaints.includes(c)
  );

  const showMaritalFields = ["Married", "Divorced", "Widowed"].includes(formData.maritalStatus);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent fullscreen className="p-0 gap-0 bg-white">
        <DrawerHeader className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-semibold text-slate-900">
                  Bedaya Medical Caravan - Adult Sheet
                </DrawerTitle>
                <DrawerDescription className="text-sm text-slate-500 mt-1">
                  Complete patient registration form
                </DrawerDescription>
              </div>
            </div>
          </div>
        </DrawerHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
              
              {/* Top Header Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1.5 block">House Number</Label>
                  <Input 
                    value={formData.houseNumber}
                    onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Code</Label>
                  <Input 
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1.5 block">POV</Label>
                  <div className="flex items-center h-9">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData.pov}
                        onCheckedChange={(checked) => handleInputChange("pov", checked as boolean)}
                      />
                      <span className="text-sm">POV Patient</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Patient's Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Patient Information</h3>
                
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Patient's Name</Label>
                    <Input 
                      value={formData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Sex</Label>
                    <div className="flex items-center space-x-4 h-9">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <Checkbox 
                          checked={formData.sex === "M"}
                          onCheckedChange={(checked) => handleInputChange("sex", checked ? "M" : "")}
                        />
                        <span className="text-sm">Male</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <Checkbox 
                          checked={formData.sex === "F"}
                          onCheckedChange={(checked) => handleInputChange("sex", checked ? "F" : "")}
                        />
                        <span className="text-sm">Female</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Age</Label>
                    <Input 
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="Years"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Occupation</Label>
                    <Input 
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Mobile Number and Marital Status */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Mobile Number</Label>
                    <Input 
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="11 digits"
                    />
                  </div>
                  <div className="col-span-8">
                    <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Marital Status</Label>
                    <div className="flex items-center space-x-4 h-9">
                      {["Single", "Married", "Divorced", "Widowed"].map(status => (
                        <label key={status} className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData.maritalStatus === status}
                            onCheckedChange={(checked) => handleInputChange("maritalStatus", checked ? status : "")}
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* If Married, Divorced, or Widowed */}
                {showMaritalFields && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-slate-700 mb-1.5 block">If Married, Children Number</Label>
                      <Input 
                        type="number"
                        value={formData.ifMarriedChildren}
                        onChange={(e) => handleInputChange("ifMarriedChildren", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Age of Youngest</Label>
                      <Input 
                        type="number"
                        value={formData.ageOfYoungest}
                        onChange={(e) => handleInputChange("ageOfYoungest", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Education Level */}
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-3 block">Education Level</Label>
                  <RadioGroup 
                    value={formData.educationLevel}
                    onValueChange={(value) => handleInputChange("educationLevel", value)}
                    className="flex flex-row flex-wrap gap-4"
                  >
                    {["Illiterate", "Read and Write", "Primary", "Preparatory", "Secondary", "University", "Postgraduate"].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="text-sm cursor-pointer">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Habits of Medical Importance */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Habits of Medical Importance</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox 
                        checked={formData.smoking === "Yes"}
                        onCheckedChange={(checked) => handleInputChange("smoking", checked ? "Yes" : "No")}
                      />
                      <span className="text-sm font-medium text-slate-700">Smoking</span>
                    </label>
                    {formData.smoking === "Yes" && (
                      <>
                        <Label className="text-xs font-medium text-slate-700">Rate:</Label>
                        <Input 
                          value={formData.smokingRate}
                          onChange={(e) => handleInputChange("smokingRate", e.target.value)}
                          className="h-8 text-sm w-24"
                          placeholder="/day"
                        />
                        <Label className="text-xs font-medium text-slate-700">Type:</Label>
                        <Input 
                          value={formData.smokingType}
                          onChange={(e) => handleInputChange("smokingType", e.target.value)}
                          className="h-8 text-sm w-28"
                        />
                        <Label className="text-xs font-medium text-slate-700">Other:</Label>
                        <Input 
                          value={formData.smokingOther}
                          onChange={(e) => handleInputChange("smokingOther", e.target.value)}
                          className="h-8 text-sm flex-1"
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox 
                        checked={formData.smokingCessation === "Yes"}
                        onCheckedChange={(checked) => handleInputChange("smokingCessation", checked ? "Yes" : "No")}
                      />
                      <span className="text-sm font-medium text-slate-700">Smoking Cessation</span>
                    </label>
                    {formData.smokingCessation === "Yes" && (
                      <>
                        <Label className="text-xs font-medium text-slate-700">Details:</Label>
                        <Input 
                          value={formData.smokingIfYes}
                          onChange={(e) => handleInputChange("smokingIfYes", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                        <Label className="text-xs font-medium text-slate-700">Duration:</Label>
                        <Input 
                          value={formData.smokingDuration}
                          onChange={(e) => handleInputChange("smokingDuration", e.target.value)}
                          className="h-8 text-sm flex-1"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Menstruation, Contraception - Only show for Female */}
              {formData.sex === "F" && (
                <>
                  <div className="h-px bg-slate-200"></div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">Female-Specific Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-slate-700 mb-2 block">Menstruation</Label>
                        <div className="flex items-center space-x-4">
                          {["Regular", "Irregular", "Menopause"].map(type => (
                            <label key={type} className="flex items-center space-x-1.5 cursor-pointer">
                              <Checkbox 
                                checked={formData.menstruation === type}
                                onCheckedChange={(checked) => handleInputChange("menstruation", checked ? type : "")}
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Gravida Number</Label>
                          <Input 
                            type="number"
                            value={formData.gravidaNumber}
                            onChange={(e) => handleInputChange("gravidaNumber", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs font-medium text-slate-700 mb-1.5 block">Abortion Number</Label>
                          <Input 
                            type="number"
                            value={formData.abortionNumber}
                            onChange={(e) => handleInputChange("abortionNumber", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contraception */}
                    <div>
                      <div className="flex items-center flex-wrap gap-3">
                        <Label className="text-xs font-medium text-slate-700">Contraception:</Label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData.contraception === "Yes"}
                            onCheckedChange={(checked) => handleInputChange("contraception", checked ? "Yes" : "")}
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData.contraception === "No"}
                            onCheckedChange={(checked) => handleInputChange("contraception", checked ? "No" : "")}
                          />
                          <span className="text-sm">No</span>
                        </label>
                        {formData.contraception === "Yes" && (
                          <>
                            <Label className="text-xs font-medium text-slate-700 ml-4">Method:</Label>
                            {["IUD", "Implant", "COC"].map(method => (
                              <label key={method} className="flex items-center space-x-1.5 cursor-pointer">
                                <Checkbox 
                                  checked={formData.contraceptionMethod.includes(method)}
                                  onCheckedChange={(checked) => handleArrayCheckboxChange("contraceptionMethod", method, checked as boolean)}
                                />
                                <span className="text-sm">{method}</span>
                              </label>
                            ))}
                            <Label className="text-xs font-medium text-slate-700">Other:</Label>
                            <Input 
                              value={formData.contraceptionOther}
                              onChange={(e) => handleInputChange("contraceptionOther", e.target.value)}
                              className="h-8 text-sm flex-1"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="h-px bg-slate-200"></div>

              {/* Complaint Analysis - Tag System */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Complaints / Diagnoses</h3>
                </div>
                
                <div className="relative">
                  <Input 
                    value={complaintSearch}
                    onChange={(e) => {
                      setComplaintSearch(e.target.value);
                      setShowComplaintDropdown(true);
                    }}
                    onFocus={() => setShowComplaintDropdown(true)}
                    className="h-9 text-sm"
                    placeholder="Search and select complaints..."
                  />
                  
                  {showComplaintDropdown && filteredComplaints.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredComplaints.map(complaint => (
                        <div
                          key={complaint}
                          onClick={() => addComplaint(complaint)}
                          className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                        >
                          {complaint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {formData.complaints.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.complaints.map(complaint => (
                      <div
                        key={complaint}
                        className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200"
                      >
                        <span>{complaint}</span>
                        <button
                          type="button"
                          onClick={() => removeComplaint(complaint)}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Past History */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Past History</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center flex-wrap gap-3">
                        <Label className="text-xs font-medium text-slate-700">Medical:</Label>
                        {[
                          { key: "pastHistoryDM", label: "DM" },
                          { key: "pastHistoryHTN", label: "HTN" },
                          { key: "pastHistoryHCV", label: "HCV" },
                          { key: "pastHistoryRHD", label: "RHD" }
                        ].map(item => (
                          <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                            <Checkbox 
                              checked={formData[item.key as keyof FormData] as boolean}
                              onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof FormData, checked as boolean)}
                            />
                            <span className="text-sm">{item.label}</span>
                          </label>
                        ))}
                        <Label className="text-xs font-medium text-slate-700 ml-2">Others:</Label>
                        <Input 
                          value={formData.pastHistoryOthers}
                          onChange={(e) => handleInputChange("pastHistoryOthers", e.target.value)}
                          className="h-8 text-sm flex-1"
                          placeholder="Other medical history..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 flex-nowrap">
                        <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Blood Transfusion:</Label>
                        {["No", "Occasional", "Regular"].map(option => (
                          <label key={option} className="flex items-center space-x-1.5 cursor-pointer whitespace-nowrap">
                            <Checkbox 
                              checked={formData.bloodTransfusion === option}
                              onCheckedChange={(checked) => handleInputChange("bloodTransfusion", checked ? option : "")}
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                        <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Duration:</Label>
                        <Input 
                          value={formData.bloodTransfusionDuration}
                          onChange={(e) => handleInputChange("bloodTransfusionDuration", e.target.value)}
                          className="h-8 text-sm w-32"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-slate-700 mb-2 block">Drugs for Chronic Disease</Label>
                      <div className="flex items-center flex-wrap gap-3">
                        {[
                          { key: "drugsAntiHTN", label: "Anti-HTN" },
                          { key: "drugsOralHypoglycemic", label: "Oral Hypoglycemic" },
                          { key: "drugsAntiepilep", label: "Antiepilept" },
                          { key: "drugsAntidiuretic", label: "Antidiuretic" }
                        ].map(item => (
                          <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                            <Checkbox 
                              checked={formData[item.key as keyof FormData] as boolean}
                              onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof FormData, checked as boolean)}
                            />
                            <span className="text-sm">{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <Input 
                        value={formData.drugsOther}
                        onChange={(e) => handleInputChange("drugsOther", e.target.value)}
                        className="h-9 text-sm mt-2"
                        placeholder="Other medications..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox 
                            checked={formData.allergyYes}
                            onCheckedChange={(checked) => handleCheckboxChange("allergyYes", checked as boolean)}
                          />
                          <span className="text-sm font-medium text-slate-700">Has Allergies</span>
                        </label>
                        {formData.allergyYes && (
                          <Input 
                            value={formData.allergySpecify}
                            onChange={(e) => handleInputChange("allergySpecify", e.target.value)}
                            className="h-8 text-sm flex-1"
                            placeholder="Specify allergies..."
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-slate-700 mb-2 block">Surgical</Label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData.surgicalICU}
                            onCheckedChange={(checked) => handleCheckboxChange("surgicalICU", checked as boolean)}
                          />
                          <span className="text-sm">ICU</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData.surgicalOperation}
                            onCheckedChange={(checked) => handleCheckboxChange("surgicalOperation", checked as boolean)}
                          />
                          <span className="text-sm">Operation</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Family History - Full Width Row */}
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-2 block">Family History</Label>
                  <div className="flex items-center flex-wrap gap-3">
                    {[
                      { key: "familySimilar", label: "Similar Condition" },
                      { key: "familyHTN", label: "HTN" },
                      { key: "familyDM", label: "DM" }
                    ].map(item => (
                      <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                        <Checkbox 
                          checked={formData[item.key as keyof FormData] as boolean}
                          onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof FormData, checked as boolean)}
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                    <Label className="text-xs font-medium text-slate-700 ml-2">Other:</Label>
                    <Input 
                      value={formData.familyOther}
                      onChange={(e) => handleInputChange("familyOther", e.target.value)}
                      className="h-8 text-sm flex-1"
                      placeholder="Other family history..."
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* General Examination & Anthropometric */}
              <div className="grid grid-cols-2 gap-6">
                {/* General Examination */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">General Examination</h3>
                  
                  <div>
                    <Label className="text-xs font-medium text-slate-700 mb-2 block">Vital Data</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Column 1: BP */}
                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">BP</Label>
                        <Input 
                          value={formData.vitalBP}
                          onChange={(e) => handleInputChange("vitalBP", e.target.value)}
                          className="h-8 text-xs"
                          placeholder="120/80"
                        />
                      </div>
                      
                      {/* Column 2: HR + RBS */}
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">HR</Label>
                          <Input 
                            value={formData.vitalHR}
                            onChange={(e) => handleInputChange("vitalHR", e.target.value)}
                            className="h-8 text-xs"
                            placeholder="bpm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">RBS</Label>
                          <Input 
                            value={formData.vitalRBS}
                            onChange={(e) => handleInputChange("vitalRBS", e.target.value)}
                            className="h-8 text-xs"
                            placeholder="mg/dL"
                          />
                        </div>
                      </div>
                      
                      {/* Column 3: Temp + SpO2 */}
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">Temp</Label>
                          <Input 
                            value={formData.vitalTemp}
                            onChange={(e) => handleInputChange("vitalTemp", e.target.value)}
                            className="h-8 text-xs"
                            placeholder="°C"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">SpO2</Label>
                          <Input 
                            value={formData.vitalSpo2}
                            onChange={(e) => handleInputChange("vitalSpo2", e.target.value)}
                            className="h-8 text-xs"
                            placeholder="%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-slate-700 mb-2 block">Complexions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "cyanosisPeripheral", label: "Cyanosis Peripheral" },
                        { key: "pallor", label: "Pallor" },
                        { key: "cyanosisCentral", label: "Cyanosis Central" },
                        { key: "jaundice", label: "Jaundice" }
                      ].map(item => (
                        <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                          <Checkbox 
                            checked={formData[item.key as keyof FormData] as boolean}
                            onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof FormData, checked as boolean)}
                          />
                          <span className="text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Anthropometric & Screening */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Anthropometric Measurements</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">Weight (kg)</Label>
                        <Input 
                          type="number"
                          value={formData.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="kg"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">Height (cm)</Label>
                        <Input 
                          type="number"
                          value={formData.height}
                          onChange={(e) => handleInputChange("height", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="cm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">BMI</Label>
                        <Input 
                          value={formData.bmi}
                          onChange={(e) => handleInputChange("bmi", e.target.value)}
                          className="h-8 text-sm bg-slate-50"
                          placeholder="Auto"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Screening</h3>
                    <p className="text-sm text-slate-400 italic">To be decided</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Referral or Convoy Clinics */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Referral or Convoy Clinics</h3>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { key: "referralIM", label: "IM" },
                    { key: "referralCardio", label: "Cardio" },
                    { key: "referralSurgery", label: "Surgery" },
                    { key: "referralOphth", label: "Ophth" },
                    { key: "referralObsGyn", label: "Obs & Gyn" },
                    { key: "referralENT", label: "ENT" },
                    { key: "referralDerma", label: "Derma" },
                    { key: "referralOrtho", label: "Ortho" },
                    { key: "referralDental", label: "Dental" },
                    { key: "referralGoHome", label: "Go Home!" }
                  ].map(item => (
                    <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData[item.key as keyof FormData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof FormData, checked as boolean)}
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </form>
        </div>
        
        <DrawerFooter className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Save Patient
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}