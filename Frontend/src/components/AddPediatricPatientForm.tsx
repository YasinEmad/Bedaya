import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "./ui/drawer";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Checkbox } from "@ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Textarea } from "@ui/textarea";
import { X, Baby } from "lucide-react";

interface PediatricFormData {
  // Header
  houseNumber: string;
  code: string;
  pov: boolean;
  pharmacy: string;
  // Patient Info
  patientName: string;
  sex: string;
  signature: string;
  age: string;
  fatherOccupation: string;
  mobileNumber: string;
  // Education
  fatherEducation: string;
  motherEducation: string;
  // Birth Info
  orderOfBirth: string;
  birthTerm: string; // "full" or "pre"
  pretermWeeks: string;
  birthModeVD: boolean;
  birthModeCS: boolean;
  csWhy: string;
  consanguinity: string;
  nicuAdmission: string;
  nicuAdmissionReason: string;
  // Complaints - now array of strings (tags)
  complaints: string[];
  // Family History
  familyDM: boolean;
  familyHTN: boolean;
  familySimilarCondition: boolean;
  familySimilarConditionDetails: string;
  familyGeneticDisease: boolean;
  familyGeneticDiseaseDetails: string;
  // Past History
  pastMedical: boolean;
  pastMedicalDetails: string;
  pastAllergy: boolean;
  pastAllergyDetails: string;
  pastICU: boolean;
  pastSurgical: boolean;
  pastSurgicalDetails: string;
  pastBloodTransfusion: boolean;
  // Immunization
  immunization: string; // "uptodate", "delayed", "none"
  // Dietetic History
  dietic: string; // "breast", "artificial", "combined", "weaned"
  // Developmental History
  devGrossMotor: string;
  devFineMotor: string;
  devLanguage: string;
  devSocial: string;
  devSphincters: string;
  // Antenatal History
  antenatalSTORCH: boolean;
  antenatalDisease: boolean;
  antenatalDiseaseDetails: string;
  antenatalIrradiation: boolean;
  antenatalTeratogenicDrugs: boolean;
  antenatalTeratogenicDrugsDetails: string;
  antenatalHospitalization: boolean;
  // Natal History
  prematureRupture: boolean;
  prolongedDelivery: boolean;
  birthPlace: string; // "home", "hospital"
  // Neonatal History
  neonatalNICU: boolean;
  neonatalCyanosis: boolean;
  neonatalJaundice: boolean;
  neonatalPallor: boolean;
  neonatalConvulsions: boolean;
  // Vital Data
  vitalHR: string;
  vitalRR: string;
  vitalBP: string;
  vitalTemp: string;
  vitalCRT: string;
  vitalRBS: string;
  vitalHb: string;
  // Screening
  spo2: string;
  ricketsScreeningResult: string;
  parasitesScreeningResult: string;
  // Complexions
  pallor: boolean;
  jaundice: boolean;
  cyanosisCentral: boolean;
  cyanosisPeripheral: boolean;
  // Anthropometry
  weight: string;
  height: string;
  ofc: string;
  weightForAge: string;
  heightForAge: string;
  weightForHeight: string;
  deformity: boolean;
  // Local Examination
  cardiacExamination: string;
  chestExamination: string;
  abdominalExamination: string;
  tonsilsExamination: string;
  generalExamination: string;
  // Referral to other clinics
  referralENT: boolean;
  referralCardio: boolean;
  referralOphthalmology: boolean;
  referralDerma: boolean;
  referralDental: boolean;
  referralSurgery: boolean;
  referralGyn: boolean;
  referralPharmacy: boolean;
  referralGoHome: boolean;
  referralOther: boolean;
}

interface AddPediatricPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PediatricFormData) => void;
  initialData?: Partial<PediatricFormData>;
}

export function AddPediatricPatientForm({ open, onOpenChange, onSubmit, initialData }: AddPediatricPatientFormProps) {
  const pediatricComplaints = useAppSelector((state) => state.common.pediatricComplaints);
  const educationOptions = useAppSelector((state) => state.common.educationOptions);

  const [formData, setFormData] = useState<PediatricFormData>({
    houseNumber: "",
    code: "",
    pov: false,
    pharmacy: "",
    patientName: "",
    sex: "",
    signature: "",
    age: "",
    fatherOccupation: "",
    mobileNumber: "",
    fatherEducation: "",
    motherEducation: "",
    orderOfBirth: "",
    birthTerm: "",
    pretermWeeks: "",
    birthModeVD: false,
    birthModeCS: false,
    csWhy: "",
    consanguinity: "",
    nicuAdmission: "",
    nicuAdmissionReason: "",
    complaints: [],
    familyDM: false,
    familyHTN: false,
    familySimilarCondition: false,
    familySimilarConditionDetails: "",
    familyGeneticDisease: false,
    familyGeneticDiseaseDetails: "",
    pastMedical: false,
    pastMedicalDetails: "",
    pastAllergy: false,
    pastAllergyDetails: "",
    pastICU: false,
    pastSurgical: false,
    pastSurgicalDetails: "",
    pastBloodTransfusion: false,
    immunization: "",
    dietic: "",
    devGrossMotor: "",
    devFineMotor: "",
    devLanguage: "",
    devSocial: "",
    devSphincters: "",
    antenatalSTORCH: false,
    antenatalDisease: false,
    antenatalDiseaseDetails: "",
    antenatalIrradiation: false,
    antenatalTeratogenicDrugs: false,
    antenatalTeratogenicDrugsDetails: "",
    antenatalHospitalization: false,
    prematureRupture: false,
    prolongedDelivery: false,
    birthPlace: "",
    neonatalNICU: false,
    neonatalCyanosis: false,
    neonatalJaundice: false,
    neonatalPallor: false,
    neonatalConvulsions: false,
    vitalHR: "",
    vitalRR: "",
    vitalBP: "",
    vitalTemp: "",
    vitalCRT: "",
    vitalRBS: "",
    vitalHb: "",
    spo2: "",
    ricketsScreeningResult: "",
    parasitesScreeningResult: "",
    pallor: false,
    jaundice: false,
    cyanosisCentral: false,
    cyanosisPeripheral: false,
    weight: "",
    height: "",
    ofc: "",
    weightForAge: "",
    heightForAge: "",
    weightForHeight: "",
    deformity: false,
    // Local Examination
    cardiacExamination: "",
    chestExamination: "",
    abdominalExamination: "",
    tonsilsExamination: "",
    generalExamination: "",
    // Referral to other clinics
    referralENT: false,
    referralCardio: false,
    referralOphthalmology: false,
    referralDerma: false,
    referralDental: false,
    referralSurgery: false,
    referralGyn: false,
    referralPharmacy: false,
    referralGoHome: false,
    referralOther: false
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const [complaintSearch, setComplaintSearch] = useState("");
  const [showComplaintDropdown, setShowComplaintDropdown] = useState(false);

  const handleInputChange = (field: keyof PediatricFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof PediatricFormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
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

  const filteredComplaints = pediatricComplaints.filter(c =>
    c.toLowerCase().includes(complaintSearch.toLowerCase()) &&
    !formData.complaints.includes(c)
  );

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent fullscreen className="p-0 gap-0 bg-white">
        <DrawerHeader className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-semibold text-slate-900">
                  Bedaya Medical Caravan - Pediatric Sheet
                </DrawerTitle>
                <DrawerDescription className="text-sm text-slate-500 mt-1">
                  Complete all required fields for pediatric patient registration
                </DrawerDescription>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6 max-w-full">
            
            {/* Header Info */}
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">House Number:</Label>
                <Input 
                  value={formData.houseNumber}
                  onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                  className="h-8 text-sm w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Code:</Label>
                <Input 
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  className="h-8 text-sm w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Pov:</Label>
                <Checkbox 
                  checked={formData.pov}
                  onCheckedChange={(checked) => handleCheckboxChange("pov", checked as boolean)}
                />
              </div>
            </div>

            {/* Patient Info */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Patient's Name:</Label>
                <Input 
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  className="h-8 text-sm flex-1"
                  placeholder="Full name..."
                />
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Sex:</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.sex === "M"}
                    onCheckedChange={(checked) => handleInputChange("sex", checked ? "M" : "")}
                  />
                  <span className="text-sm font-medium">M</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.sex === "F"}
                    onCheckedChange={(checked) => handleInputChange("sex", checked ? "F" : "")}
                  />
                  <span className="text-sm font-medium">F</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Age:</Label>
                <Input 
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="h-8 text-sm max-w-[20%]"
                />
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap ml-4">Father Occupation:</Label>
                <Input 
                  value={formData.fatherOccupation}
                  onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                  className="h-8 text-sm max-w-[20%]"
                />
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap ml-4">Mobile Number:</Label>
                <Input 
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="h-8 text-sm w-40"
                  placeholder="0"
                />
              </div>

              {/* Father Education */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Father Education:</Label>
                <RadioGroup 
                  onValueChange={(value) => handleInputChange("fatherEducation", value)} 
                  value={formData.fatherEducation}
                  className="flex flex-wrap gap-4"
                >
                  {educationOptions.map(option => (
                    <div key={`father-${option}`} className="flex items-center space-x-1.5 cursor-pointer">
                      <RadioGroupItem value={option} id={`father-${option}`} />
                      <Label htmlFor={`father-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Mother Education */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Mother Education:</Label>
                <RadioGroup 
                  onValueChange={(value) => handleInputChange("motherEducation", value)} 
                  value={formData.motherEducation}
                  className="flex flex-wrap gap-4"
                >
                  {educationOptions.map(option => (
                    <div key={`mother-${option}`} className="flex items-center space-x-1.5 cursor-pointer">
                      <RadioGroupItem value={option} id={`mother-${option}`} />
                      <Label htmlFor={`mother-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Horizontal Divider */}
              <div className="border-b border-slate-200"></div>

              {/* Birth Info */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Order of Birth:</Label>
                <Input 
                  value={formData.orderOfBirth}
                  onChange={(e) => handleInputChange("orderOfBirth", e.target.value)}
                  className="h-8 text-sm max-w-[20%]"
                />
                <div className="flex items-center gap-4 ml-4">
                  <RadioGroup 
                    onValueChange={(value) => handleInputChange("birthTerm", value)} 
                    value={formData.birthTerm}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="full" id="term-full" />
                      <Label htmlFor="term-full" className="text-sm font-normal">Full Term</Label>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="pre" id="term-pre" />
                      <Label htmlFor="term-pre" className="text-sm font-normal">Preterm</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {formData.birthTerm === "pre" && (
                  <Input 
                    value={formData.pretermWeeks}
                    onChange={(e) => handleInputChange("pretermWeeks", e.target.value)}
                    className="h-8 text-sm max-w-[80px]"
                    placeholder="weeks"
                  />
                )}
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap ml-4">Birth Mode:</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.birthModeVD}
                    onCheckedChange={(checked) => handleCheckboxChange("birthModeVD", checked as boolean)}
                  />
                  <span className="text-sm">V.D</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.birthModeCS}
                    onCheckedChange={(checked) => handleCheckboxChange("birthModeCS", checked as boolean)}
                  />
                  <span className="text-sm">C.S</span>
                </label>
                {formData.birthModeCS && (
                  <>
                    <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">(why):</Label>
                    <Input 
                      value={formData.csWhy}
                      onChange={(e) => handleInputChange("csWhy", e.target.value)}
                      className="h-8 text-sm w-48"
                    />
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap">Consanguinity:</Label>
                <Input 
                  value={formData.consanguinity}
                  onChange={(e) => handleInputChange("consanguinity", e.target.value)}
                  className="h-8 text-sm max-w-[20%]"
                />
                <Label className="text-xs font-medium text-slate-700 whitespace-nowrap ml-4">NICU Admission</Label>
                <span className="text-xs text-slate-600">(if Yes Why and for How Long?):</span>
                <Input 
                  value={formData.nicuAdmissionReason}
                  onChange={(e) => handleInputChange("nicuAdmissionReason", e.target.value)}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>

            {/* Complaints Section - Tag System */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
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
                  onBlur={() => setTimeout(() => setShowComplaintDropdown(false), 200)}
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

            {/* Family and Past History */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Family History & Past History</h3>
              
              <div className="flex items-center gap-4 flex-wrap">
                <Label className="text-xs font-medium text-slate-700">Family History:</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.familyDM}
                    onCheckedChange={(checked) => handleCheckboxChange("familyDM", checked as boolean)}
                  />
                  <span className="text-sm">DM</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.familyHTN}
                    onCheckedChange={(checked) => handleCheckboxChange("familyHTN", checked as boolean)}
                  />
                  <span className="text-sm">HTN</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.familySimilarCondition}
                    onCheckedChange={(checked) => handleCheckboxChange("familySimilarCondition", checked as boolean)}
                  />
                  <span className="text-sm">Similar Condition</span>
                </label>
                {formData.familySimilarCondition && (
                  <Input 
                    value={formData.familySimilarConditionDetails}
                    onChange={(e) => handleInputChange("familySimilarConditionDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Details..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.familyGeneticDisease}
                    onCheckedChange={(checked) => handleCheckboxChange("familyGeneticDisease", checked as boolean)}
                  />
                  <span className="text-sm">Genetic Disease</span>
                </label>
                {formData.familyGeneticDisease && (
                  <Input 
                    value={formData.familyGeneticDiseaseDetails}
                    onChange={(e) => handleInputChange("familyGeneticDiseaseDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Details..."
                  />
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <Label className="text-xs font-medium text-slate-700">Past History:</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.pastMedical}
                    onCheckedChange={(checked) => handleCheckboxChange("pastMedical", checked as boolean)}
                  />
                  <span className="text-sm">Medical</span>
                </label>
                {formData.pastMedical && (
                  <Input 
                    value={formData.pastMedicalDetails}
                    onChange={(e) => handleInputChange("pastMedicalDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Details..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.pastAllergy}
                    onCheckedChange={(checked) => handleCheckboxChange("pastAllergy", checked as boolean)}
                  />
                  <span className="text-sm">Allergy</span>
                </label>
                {formData.pastAllergy && (
                  <Input 
                    value={formData.pastAllergyDetails}
                    onChange={(e) => handleInputChange("pastAllergyDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Details..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.pastICU}
                    onCheckedChange={(checked) => handleCheckboxChange("pastICU", checked as boolean)}
                  />
                  <span className="text-sm">ICU</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.pastSurgical}
                    onCheckedChange={(checked) => handleCheckboxChange("pastSurgical", checked as boolean)}
                  />
                  <span className="text-sm">Surgical</span>
                </label>
                {formData.pastSurgical && (
                  <Input 
                    value={formData.pastSurgicalDetails}
                    onChange={(e) => handleInputChange("pastSurgicalDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Details..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.pastBloodTransfusion}
                    onCheckedChange={(checked) => handleCheckboxChange("pastBloodTransfusion", checked as boolean)}
                  />
                  <span className="text-sm">Blood Transfusion</span>
                </label>
              </div>
            </div>

            {/* Medical History Sections */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Medical History</h3>
              
              {/* Immunization History */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 w-32">Immunization History</Label>
                <RadioGroup 
                  onValueChange={(value) => handleInputChange("immunization", value)} 
                  value={formData.immunization}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="uptodate" id="imm-uptodate" />
                    <Label htmlFor="imm-uptodate" className="text-sm font-normal">Up To Date</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="delayed" id="imm-delayed" />
                    <Label htmlFor="imm-delayed" className="text-sm font-normal">Delayed</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="none" id="imm-none" />
                    <Label htmlFor="imm-none" className="text-sm font-normal">Didn't Receive Any Vaccinations</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dietetic History */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 w-32">Dietetic History</Label>
                <RadioGroup 
                  onValueChange={(value) => handleInputChange("dietic", value)} 
                  value={formData.dietic}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="breast" id="diet-breast" />
                    <Label htmlFor="diet-breast" className="text-sm font-normal">Breast Feeding</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="artificial" id="diet-artificial" />
                    <Label htmlFor="diet-artificial" className="text-sm font-normal">Artificial Feeding</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="combined" id="diet-combined" />
                    <Label htmlFor="diet-combined" className="text-sm font-normal">Combined</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="weaned" id="diet-weaned" />
                    <Label htmlFor="diet-weaned" className="text-sm font-normal">Weaned</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Developmental History */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 w-32">Developmental History</Label>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-700">Gross Motor</span>
                  <Input 
                    value={formData.devGrossMotor}
                    onChange={(e) => handleInputChange("devGrossMotor", e.target.value)}
                    className="h-7 text-sm w-20"
                  />
                  <span className="text-slate-700">Fine Motor</span>
                  <Input 
                    value={formData.devFineMotor}
                    onChange={(e) => handleInputChange("devFineMotor", e.target.value)}
                    className="h-7 text-sm w-20"
                  />
                  <span className="text-slate-700">Language</span>
                  <Input 
                    value={formData.devLanguage}
                    onChange={(e) => handleInputChange("devLanguage", e.target.value)}
                    className="h-7 text-sm w-20"
                  />
                  <span className="text-slate-700">Social</span>
                  <Input 
                    value={formData.devSocial}
                    onChange={(e) => handleInputChange("devSocial", e.target.value)}
                    className="h-7 text-sm w-20"
                  />
                  <span className="text-slate-700">Sphincters</span>
                  <Input 
                    value={formData.devSphincters}
                    onChange={(e) => handleInputChange("devSphincters", e.target.value)}
                    className="h-7 text-sm w-20"
                  />
                </div>
              </div>

              {/* Antenatal History */}
              <div className="flex items-center gap-3 flex-wrap">
                <Label className="text-xs font-medium text-slate-700 w-32">Antenatal History</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.antenatalSTORCH}
                    onCheckedChange={(checked) => handleCheckboxChange("antenatalSTORCH", checked as boolean)}
                  />
                  <span className="text-sm">STORCH</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.antenatalDisease}
                    onCheckedChange={(checked) => handleCheckboxChange("antenatalDisease", checked as boolean)}
                  />
                  <span className="text-sm">Disease</span>
                </label>
                {formData.antenatalDisease && (
                  <Input 
                    value={formData.antenatalDiseaseDetails}
                    onChange={(e) => handleInputChange("antenatalDiseaseDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Specify disease..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.antenatalIrradiation}
                    onCheckedChange={(checked) => handleCheckboxChange("antenatalIrradiation", checked as boolean)}
                  />
                  <span className="text-sm">Irradiation</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.antenatalTeratogenicDrugs}
                    onCheckedChange={(checked) => handleCheckboxChange("antenatalTeratogenicDrugs", checked as boolean)}
                  />
                  <span className="text-sm">Teratogenic Drugs</span>
                </label>
                {formData.antenatalTeratogenicDrugs && (
                  <Input 
                    value={formData.antenatalTeratogenicDrugsDetails}
                    onChange={(e) => handleInputChange("antenatalTeratogenicDrugsDetails", e.target.value)}
                    className="h-8 text-sm max-w-[25%]"
                    placeholder="Specify drugs..."
                  />
                )}
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.antenatalHospitalization}
                    onCheckedChange={(checked) => handleCheckboxChange("antenatalHospitalization", checked as boolean)}
                  />
                  <span className="text-sm">Hospitalization</span>
                </label>
              </div>

              {/* Natal History */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 w-32">Natal History</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.prematureRupture}
                    onCheckedChange={(checked) => handleCheckboxChange("prematureRupture", checked as boolean)}
                  />
                  <span className="text-sm">Premature Rupture Of Membranes</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.prolongedDelivery}
                    onCheckedChange={(checked) => handleCheckboxChange("prolongedDelivery", checked as boolean)}
                  />
                  <span className="text-sm">Prolonged Delivery</span>
                </label>
                <Label className="text-xs font-medium text-slate-700 ml-2">Place:</Label>
                <RadioGroup 
                  onValueChange={(value) => handleInputChange("birthPlace", value)} 
                  value={formData.birthPlace}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="home" id="place-home" />
                    <Label htmlFor="place-home" className="text-sm font-normal">Home</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="hospital" id="place-hospital" />
                    <Label htmlFor="place-hospital" className="text-sm font-normal">Hospital</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Neonatal History */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-medium text-slate-700 w-32">Neonatal History</Label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.neonatalNICU}
                    onCheckedChange={(checked) => handleCheckboxChange("neonatalNICU", checked as boolean)}
                  />
                  <span className="text-sm">NICU</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.neonatalCyanosis}
                    onCheckedChange={(checked) => handleCheckboxChange("neonatalCyanosis", checked as boolean)}
                  />
                  <span className="text-sm">Cyanosis</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.neonatalJaundice}
                    onCheckedChange={(checked) => handleCheckboxChange("neonatalJaundice", checked as boolean)}
                  />
                  <span className="text-sm">Jaundice</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.neonatalPallor}
                    onCheckedChange={(checked) => handleCheckboxChange("neonatalPallor", checked as boolean)}
                  />
                  <span className="text-sm">Pallor</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <Checkbox 
                    checked={formData.neonatalConvulsions}
                    onCheckedChange={(checked) => handleCheckboxChange("neonatalConvulsions", checked as boolean)}
                  />
                  <span className="text-sm">Convulsions</span>
                </label>
              </div>
            </div>

            {/* General Examination & Screening */}
            <div className="grid grid-cols-2 gap-6">
              {/* General Examination */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">General Examination</h3>
                
                {/* Vital Data */}
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-2 block">Vital Data</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Column 1: HR + Temp */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">HR:</Label>
                        <Input 
                          value={formData.vitalHR}
                          onChange={(e) => handleInputChange("vitalHR", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">Temp:</Label>
                        <Input 
                          value={formData.vitalTemp}
                          onChange={(e) => handleInputChange("vitalTemp", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Column 2: RR + CRT */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">RR:</Label>
                        <Input 
                          value={formData.vitalRR}
                          onChange={(e) => handleInputChange("vitalRR", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">CRT:</Label>
                        <Input 
                          value={formData.vitalCRT}
                          onChange={(e) => handleInputChange("vitalCRT", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Column 3: BP + RBS */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">BP:</Label>
                        <Input 
                          value={formData.vitalBP}
                          onChange={(e) => handleInputChange("vitalBP", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">RBS:</Label>
                        <Input 
                          value={formData.vitalRBS}
                          onChange={(e) => handleInputChange("vitalRBS", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Column 4: SpO2 + Hb */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">SpO2:</Label>
                        <Input 
                          value={formData.spo2}
                          onChange={(e) => handleInputChange("spo2", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-600 whitespace-nowrap">Hb:</Label>
                        <Input 
                          value={formData.vitalHb}
                          onChange={(e) => handleInputChange("vitalHb", e.target.value)}
                          className="h-7 text-sm flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complexions */}
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-2 block">Complexions</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData.pallor}
                        onCheckedChange={(checked) => handleCheckboxChange("pallor", checked as boolean)}
                      />
                      <span className="text-sm">Pallor</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData.jaundice}
                        onCheckedChange={(checked) => handleCheckboxChange("jaundice", checked as boolean)}
                      />
                      <span className="text-sm">Jaundice</span>
                    </label>
                    <Label className="text-xs font-medium text-slate-700 ml-2">Cyanosis:</Label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData.cyanosisCentral}
                        onCheckedChange={(checked) => handleCheckboxChange("cyanosisCentral", checked as boolean)}
                      />
                      <span className="text-sm">Central</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <Checkbox 
                        checked={formData.cyanosisPeripheral}
                        onCheckedChange={(checked) => handleCheckboxChange("cyanosisPeripheral", checked as boolean)}
                      />
                      <span className="text-sm">Peripheral</span>
                    </label>
                  </div>
                </div>

                {/* Anthropometry */}
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-2 block">Anthropometry</Label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">Weight:</Label>
                      <Input 
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className="h-7 text-sm flex-1"
                      />
                      <span className="text-xs text-slate-600">kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">Height:</Label>
                      <Input 
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        className="h-7 text-sm flex-1"
                      />
                      <span className="text-xs text-slate-600">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">OFC:</Label>
                      <Input 
                        value={formData.ofc}
                        onChange={(e) => handleInputChange("ofc", e.target.value)}
                        className="h-7 text-sm flex-1"
                      />
                      <span className="text-xs text-slate-600">cm</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">Weight for Age:</Label>
                      <Input 
                        value={formData.weightForAge}
                        onChange={(e) => handleInputChange("weightForAge", e.target.value)}
                        className="h-7 text-sm w-16"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">Height for Age:</Label>
                      <Input 
                        value={formData.heightForAge}
                        onChange={(e) => handleInputChange("heightForAge", e.target.value)}
                        className="h-7 text-sm w-16"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 whitespace-nowrap">Weight for Height:</Label>
                      <Input 
                        value={formData.weightForHeight}
                        onChange={(e) => handleInputChange("weightForHeight", e.target.value)}
                        className="h-7 text-sm w-16"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={formData.deformity}
                          onCheckedChange={(checked) => handleCheckboxChange("deformity", checked as boolean)}
                        />
                        <span className="text-sm font-medium">Deformity</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screening */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Screening</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium text-slate-700">( ) Rickets screening (6m – 5y)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-slate-600 whitespace-nowrap">Result:</Label>
                    <Input 
                      value={formData.ricketsScreeningResult}
                      onChange={(e) => handleInputChange("ricketsScreeningResult", e.target.value)}
                      className="h-8 text-sm flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium text-slate-700">( ) parasites screening</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-slate-600 whitespace-nowrap">Result:</Label>
                    <Input 
                      value={formData.parasitesScreeningResult}
                      onChange={(e) => handleInputChange("parasitesScreeningResult", e.target.value)}
                      className="h-8 text-sm flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="border-b border-slate-300"></div>

            {/* Local Examination */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Local Examination</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium text-slate-700 w-40">General:</Label>
                  <Input
                    value={formData.generalExamination}
                    onChange={(e) => handleInputChange("generalExamination", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="General examination findings..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium text-slate-700 w-40">Cardiac Examination:</Label>
                  <Input
                    value={formData.cardiacExamination}
                    onChange={(e) => handleInputChange("cardiacExamination", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Cardiac findings..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium text-slate-700 w-40">Chest Examination:</Label>
                  <Input
                    value={formData.chestExamination}
                    onChange={(e) => handleInputChange("chestExamination", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Chest findings..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium text-slate-700 w-40">Abdominal Examination:</Label>
                  <Input
                    value={formData.abdominalExamination}
                    onChange={(e) => handleInputChange("abdominalExamination", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Abdominal findings..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium text-slate-700 w-40">Tonsils Examination:</Label>
                  <Input
                    value={formData.tonsilsExamination}
                    onChange={(e) => handleInputChange("tonsilsExamination", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Tonsils findings..."
                  />
                </div>
              </div>
            </div>

            {/* Referral to other clinics */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Referral or Convoy Clinics</h3>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { key: "referralENT", label: "ENT" },
                  { key: "referralCardio", label: "Cardio" },
                  { key: "referralOphthalmology", label: "Ophthalmology" },
                  { key: "referralDerma", label: "Derma" },
                  { key: "referralDental", label: "Dental" },
                  { key: "referralSurgery", label: "Surgery" },
                  { key: "referralGyn", label: "Gyn" },
                  { key: "referralPharmacy", label: "Pharmacy" },
                  { key: "referralGoHome", label: "Go Home!" },
                  { key: "referralOther", label: "Other" }
                ].map(item => (
                  <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer">
                    <Checkbox 
                      checked={formData[item.key as keyof PediatricFormData] as boolean}
                      onCheckedChange={(checked) => handleCheckboxChange(item.key as keyof PediatricFormData, checked as boolean)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <DrawerFooter className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Save Pediatric Patient
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}