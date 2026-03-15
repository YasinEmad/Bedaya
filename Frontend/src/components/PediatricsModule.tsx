import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { DataTable } from "@ui/data-table";
import { AddPediatricPatientForm } from "./AddPediatricPatientForm";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPediatricPatients, createPediatricPatient, updatePediatricPatient } from "../store/slices/patientsSlice";
import {
  UserPlus,
  Baby,
  Stethoscope,
  Clock,
  Loader2
} from "lucide-react";

export function PediatricsModule() {
  const dispatch = useAppDispatch();
  const { pediatricPatients, loading, error, pagination } = useAppSelector((state) => state.patients);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Fetch patients on component mount
  useEffect(() => {
    dispatch(fetchPediatricPatients({}));
  }, [dispatch]);

  const handleSubmit = async (formData: any) => {
    try {
      // Transform form data to match API format
      const apiData = {
        houseNumber: formData.houseNumber,
        patientCode: formData.code,
        pov: formData.pov,
        patientName: formData.patientName,
        sex: formData.sex === 'M' ? 'male' : 'female',
        age: parseInt(formData.age) || 0,
        mobileNumber: formData.mobileNumber || undefined,
        complaints: formData.complaints || [],
        immunization: formData.immunization as 'upToDate' | 'delayed' | 'none' || 'none',
        dietaryHistory: formData.dietetic as 'breastfeeding' | 'artificial' | 'combined' | 'weaned' || undefined,
        vitals: {
          HR: formData.vitalHR ? parseInt(formData.vitalHR) : undefined,
          RR: formData.vitalRR ? parseInt(formData.vitalRR) : undefined,
          BP: formData.vitalBP || undefined,
          temperature: formData.vitalTemp ? parseFloat(formData.vitalTemp) : undefined,
          SpO2: formData.vitalSpo2 ? parseInt(formData.vitalSpo2) : undefined,
        },
        anthropometry: {
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
        },
        referrals: {
          internalMedicine: formData.referralIM || false,
          cardiology: formData.referralCardio || false,
          surgery: formData.referralSurgery || false,
          ophthalmology: formData.referralOphthalmology || false,
          ENT: formData.referralENT || false,
          dermatology: formData.referralDerma || false,
          orthopedics: formData.referralOrtho || false,
          dental: formData.referralDental || false,
          goHome: formData.referralGoHome || false,
        },
      };

      if (selectedPatient) {
        // Update existing patient
        await dispatch(updatePediatricPatient({ 
          patientCode: selectedPatient.patientCode, 
          patientData: apiData 
        })).unwrap();
        toast.success("Pediatric patient updated successfully!", {
          description: `${formData.patientName} has been updated in the system.`
        });
      } else {
        // Create new patient
        await dispatch(createPediatricPatient(apiData)).unwrap();
        toast.success("Pediatric patient added successfully!", {
          description: `${formData.patientName} has been registered in the system.`
        });
      }
      
      setIsAddPatientOpen(false);
      setSelectedPatient(null);
      
      // Refresh the patient list
      dispatch(fetchPediatricPatients({}));
    } catch (error: any) {
      // show server-provided message if available
      toast.error("Failed to save pediatric patient", {
        description: error?.message || "Please try again or contact support if the problem persists."
      });
    }
  };

  const handleRowClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsAddPatientOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsAddPatientOpen(isOpen);
    if (!isOpen) {
      setSelectedPatient(null);
    }
  };

  // Transform patient data from API to form format
  const transformPatientToFormData = (patient: any) => {
    return {
      houseNumber: patient.houseNumber || undefined,
      code: patient.patientCode || undefined,
      pov: patient.pov || false,
      pharmacy: patient.pharmacy || undefined,
      patientName: patient.patientName || undefined,
      sex: patient.sex === 'male' ? 'M' : 'F',
      signature: patient.signature || undefined,
      age: patient.age?.toString() || undefined,
      fatherOccupation: patient.fatherOccupation || undefined,
      mobileNumber: patient.mobileNumber || undefined,
      fatherEducation: patient.fatherEducation || undefined,
      motherEducation: patient.motherEducation || undefined,
      orderOfBirth: patient.orderOfBirth?.toString() || undefined,
      birthTerm: patient.birthTerm || undefined,
      pretermWeeks: patient.pretermWeeks?.toString() || undefined,
      birthModeVD: patient.birthModeVD || false,
      birthModeCS: patient.birthModeCS || false,
      csWhy: patient.csWhy || undefined,
      consanguinity: patient.consanguinity || undefined,
      nicuAdmission: patient.nicuAdmission || undefined,
      nicuAdmissionReason: patient.nicuAdmissionReason || undefined,
      complaints: patient.complaints || [],
      familyDM: patient.familyHistory?.diabetes || false,
      familyHTN: patient.familyHistory?.hypertension || false,
      familySimilarCondition: patient.familyHistory?.similar || false,
      familySimilarConditionDetails: patient.familyHistory?.similarDetails || undefined,
      familyGeneticDisease: patient.familyHistory?.genetic || false,
      familyGeneticDiseaseDetails: patient.familyHistory?.geneticDetails || undefined,
      pastMedical: patient.pastHistory?.medical || false,
      pastMedicalDetails: patient.pastHistory?.medicalDetails || undefined,
      pastAllergy: patient.pastHistory?.allergy || false,
      pastAllergyDetails: patient.pastHistory?.allergyDetails || undefined,
      pastICU: patient.pastHistory?.ICU || false,
      pastSurgical: patient.pastHistory?.surgical || false,
      pastSurgicalDetails: patient.pastHistory?.surgicalDetails || undefined,
      pastBloodTransfusion: patient.pastHistory?.bloodTransfusion || false,
      immunization: patient.immunization || undefined,
      dietic: patient.dietaryHistory || undefined,
      devGrossMotor: patient.developmentalHistory?.grossMotor || undefined,
      devFineMotor: patient.developmentalHistory?.fineMotor || undefined,
      devLanguage: patient.developmentalHistory?.language || undefined,
      devSocial: patient.developmentalHistory?.social || undefined,
      devSphincters: patient.developmentalHistory?.sphincters || undefined,
      antenatalSTORCH: patient.antenatalHistory?.STORCH || false,
      antenatalDisease: patient.antenatalHistory?.disease || false,
      antenatalDiseaseDetails: patient.antenatalHistory?.diseaseDetails || undefined,
      antenatalIrradiation: patient.antenatalHistory?.irradiation || false,
      antenatalTeratogenicDrugs: patient.antenatalHistory?.teratogenicDrugs || false,
      antenatalTeratogenicDrugsDetails: patient.antenatalHistory?.teratogenicDrugsDetails || undefined,
      antenatalHospitalization: patient.antenatalHistory?.hospitalization || false,
      prematureRupture: patient.natalHistory?.prematureRupture || false,
      prolongedDelivery: patient.natalHistory?.prolongedDelivery || false,
      birthPlace: patient.natalHistory?.birthPlace || undefined,
      neonatalNICU: patient.neonatalHistory?.NICU || false,
      neonatalCyanosis: patient.neonatalHistory?.cyanosis || false,
      neonatalJaundice: patient.neonatalHistory?.jaundice || false,
      neonatalPallor: patient.neonatalHistory?.pallor || false,
      neonatalConvulsions: patient.neonatalHistory?.convulsions || false,
      vitalHR: patient.vitals?.HR?.toString() || undefined,
      vitalRR: patient.vitals?.RR?.toString() || undefined,
      vitalBP: patient.vitals?.BP || undefined,
      vitalTemp: patient.vitals?.temperature?.toString() || undefined,
      vitalCRT: patient.vitals?.CRT?.toString() || undefined,
      vitalRBS: patient.vitals?.RBS?.toString() || undefined,
      vitalHb: patient.vitals?.Hb?.toString() || undefined,
      spo2: patient.vitals?.SpO2?.toString() || undefined,
      ricketsScreeningResult: patient.screening?.rickets || undefined,
      parasitesScreeningResult: patient.screening?.parasites || undefined,
      pallor: patient.physicalExam?.pallor || false,
      jaundice: patient.physicalExam?.jaundice || false,
      cyanosisCentral: patient.physicalExam?.cyanosis?.central || false,
      cyanosisPeripheral: patient.physicalExam?.cyanosis?.peripheral || false,
      weight: patient.anthropometry?.weight?.toString() || undefined,
      height: patient.anthropometry?.height?.toString() || undefined,
      ofc: patient.anthropometry?.OFC?.toString() || undefined,
      weightForAge: patient.anthropometry?.weightForAge?.toString() || undefined,
      heightForAge: patient.anthropometry?.heightForAge?.toString() || undefined,
      weightForHeight: patient.anthropometry?.weightForHeight?.toString() || undefined,
      deformity: patient.physicalExam?.deformity || false,
      cardiacExamination: patient.localExam?.cardiac || undefined,
      chestExamination: patient.localExam?.chest || undefined,
      abdominalExamination: patient.localExam?.abdominal || undefined,
      tonsilsExamination: patient.localExam?.tonsils || undefined,
      generalExamination: patient.localExam?.general || undefined,
      referralENT: patient.referrals?.ENT || false,
      referralCardio: patient.referrals?.cardiology || false,
      referralOphthalmology: patient.referrals?.ophthalmology || false,
      referralDerma: patient.referrals?.dermatology || false,
      referralDental: patient.referrals?.dental || false,
      referralSurgery: patient.referrals?.surgery || false,
      referralGyn: patient.referrals?.obstetricGynecology || false,
      referralPharmacy: patient.referrals?.pharmacy || false,
      referralGoHome: patient.referrals?.goHome || false,
      referralOther: patient.referrals?.other || false
    };
  };

  // Transform patient data for the table
  const transformPatientData = (patients: any[]) => {
    return patients.map(patient => ({
      id: patient.patientCode,
      name: patient.patientName,
      clinics: getReferredClinics(patient.referrals || {}),
      _id: patient._id,
      ...patient
    }));
  };

  // Helper function to get referred clinics from referrals object
  const getReferredClinics = (referrals: any) => {
    const clinicMap: { [key: string]: string } = {
      internalMedicine: "Internal Medicine",
      cardiology: "Cardiology",
      surgery: "Surgery",
      ophthalmology: "Ophthalmology",
      obstetricGynecology: "Obstetrics & Gynecology",
      ENT: "ENT",
      dermatology: "Dermatology",
      orthopedics: "Orthopedics",
      dental: "Dental",
      goHome: "Go Home"
    };

    return Object.entries(referrals)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => clinicMap[key] || key);
  };

  const transformedPatients = transformPatientData(pediatricPatients);

  const patientColumns = [
    {
      key: 'id',
      header: 'Patient Code',
      width: 'w-32',
      render: (value: string) => (
        <span className="font-mono text-sm bg-pink-50 text-pink-700 px-2 py-1 rounded font-medium">{value}</span>
      )
    },
    {
      key: 'name',
      header: 'Name',
      width: 'w-48',
      render: (value: string) => (
        <span className="font-medium text-sm text-slate-900">{value}</span>
      )
    },
    {
      key: 'clinics',
      header: 'Clinics Referred To',
      width: 'flex-1',
      sortable: false,
      render: (clinics: string[]) => (
        <div className="flex flex-wrap gap-1.5">
          {clinics.map((clinic, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="text-xs bg-green-50 text-green-700 border-green-200"
            >
              {clinic}
            </Badge>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pediatric Patient Management</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all pediatric patients in the convoy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setIsAddPatientOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Pediatric Patient
          </Button>
        </div>
      </div>

      {/* Add Patient Form */}
      <AddPediatricPatientForm
        key={selectedPatient?.patientCode}
        open={isAddPatientOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        initialData={selectedPatient ? transformPatientToFormData(selectedPatient) : undefined}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Total Patients</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : pagination.total}
               </p>
             </div>
             <div className="p-3 bg-pink-50 rounded-xl">
               <Baby className="w-6 h-6 text-pink-500" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Active Patients</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : pediatricPatients.length}
               </p>
             </div>
             <div className="p-3 bg-blue-50 rounded-xl">
               <Stethoscope className="w-6 h-6 text-blue-500" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Referred to Clinics</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 0}
               </p>
             </div>
             <div className="p-3 bg-orange-50 rounded-xl">
               <Clock className="w-6 h-6 text-orange-500" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">Error loading pediatric patients: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Patient Database */}
      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 px-6 py-4">
          <CardTitle className="text-lg font-bold text-slate-900">All Pediatric Patients Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Loading pediatric patients...</span>
            </div>
          ) : (
            <DataTable 
              data={transformedPatients} 
              columns={patientColumns}
              pageSize={15}
              onRowClick={handleRowClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}