import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { DataTable } from "@ui/data-table";
import AddAdultPatientForm from "./AddAdultPatientForm";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchAdultPatients, createAdultPatient, updateAdultPatient } from "../store/slices/patientsSlice";
import { 
  UserPlus,
  Users,
  Loader2
} from "lucide-react";

export function AdultsModule() {
  const dispatch = useAppDispatch();
  const { adultPatients, loading, error, pagination } = useAppSelector((state) => state.patients);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Fetch patients on component mount
  useEffect(() => {
    dispatch(fetchAdultPatients({}));
  }, [dispatch]);

  const handleSubmit = async (formData: any) => {
    try {
      // Transform form data to match API format
      const apiData = {
        houseNumber: formData.houseNumber,
        // only include code if user entered one; backend will generate otherwise
        patientCode: formData.code || undefined,
        pov: formData.pov,
        patientName: formData.patientName,
        sex: (formData.sex === 'M' ? 'male' : 'female') as 'male' | 'female',
        age: parseInt(formData.age) || 0,
        occupation: formData.occupation || undefined,
        mobileNumber: formData.mobileNumber || undefined,
        maritalStatus: formData.maritalStatus ? formData.maritalStatus.toLowerCase() as 'single' | 'married' | 'divorced' | 'widowed' : undefined,
        ifMarriedChildren: formData.ifMarriedChildren ? parseInt(formData.ifMarriedChildren) : undefined,
        ageOfYoungest: formData.ageOfYoungest ? parseInt(formData.ageOfYoungest) : undefined,
        educationLevel: formData.educationLevel || undefined,
        smoking: formData.smoking ? {
          status: (formData.smoking === 'Yes' ? 'yes' : formData.smoking === 'Former' ? 'former' : 'no') as 'yes' | 'former' | 'no',
          rate: formData.smokingRate || undefined,
          type: formData.smokingType || undefined,
          durationYears: formData.smokingDuration ? parseInt(formData.smokingDuration) : undefined,
          cessationYears: formData.smokingCessation === 'Yes' ? parseInt(formData.smokingIfYes) : undefined,
        } : undefined,
        menstruation: formData.menstruation ? {
          regular: formData.menstruation === 'Regular',
          gravidaNumber: formData.gravidaNumber ? parseInt(formData.gravidaNumber) : undefined,
          abortionNumber: formData.abortionNumber ? parseInt(formData.abortionNumber) : undefined,
        } : undefined,
        contraception: formData.contraception ? {
          using: formData.contraception === 'Yes',
          method: formData.contraceptionMethod || [],
          other: formData.contraceptionOther || undefined,
        } : undefined,
        complaints: formData.complaints || [],
        pastHistory: {
          diabetes: formData.pastHistoryDM,
          hypertension: formData.pastHistoryHTN,
          HCV: formData.pastHistoryHCV,
          RHD: formData.pastHistoryRHD,
          others: formData.pastHistoryOthers || undefined,
        },
        allergies: {
          hasAllergy: formData.allergyYes,
          details: formData.allergySpecify || undefined,
        },
        bloodTransfusion: formData.bloodTransfusion ? {
          received: formData.bloodTransfusion === 'Yes',
          duration: formData.bloodTransfusionDuration || undefined,
        } : undefined,
        surgery: {
          ICU: formData.surgicalICU,
          operation: formData.surgicalOperation,
        },
        chronicMedications: {
          antiHTN: formData.drugsAntiHTN,
          oralHypoglycemic: formData.drugsOralHypoglycemic,
          antiepileptic: formData.drugsAntiepilep,
          antidiuretic: formData.drugsAntidiuretic,
          others: formData.drugsOther || undefined,
        },
        familyHistory: {
          similar: formData.familySimilar,
          hypertension: formData.familyHTN,
          diabetes: formData.familyDM,
          others: formData.familyOther || undefined,
        },
        vitals: {
          BP: formData.vitalBP || undefined,
          HR: formData.vitalHR ? parseInt(formData.vitalHR) : undefined,
          RBS: formData.vitalRBS ? parseFloat(formData.vitalRBS) : undefined,
          temperature: formData.vitalTemp ? parseFloat(formData.vitalTemp) : undefined,
          SpO2: formData.vitalSpo2 ? parseInt(formData.vitalSpo2) : undefined,
        },
        physicalExam: {
          cyanosis: {
            peripheral: formData.cyanosisPeripheral,
            central: formData.cyanosisCentral,
          },
          jaundice: formData.jaundice,
          pallor: formData.pallor,
        },
        anthropometry: {
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          BMI: formData.bmi ? parseFloat(formData.bmi) : undefined,
        },
        diabetesScreening: (formData.diabetesKnown ? 'known' : formData.diabetesUnknown ? 'unknown' : 'none') as 'known' | 'unknown' | 'none',
        referrals: {
          internalMedicine: formData.referralIM,
          cardiology: formData.referralCardio,
          surgery: formData.referralSurgery,
          ophthalmology: formData.referralOphth,
          obstetricGynecology: formData.referralObsGyn,
          ENT: formData.referralENT,
          dermatology: formData.referralDerma,
          orthopedics: formData.referralOrtho,
          dental: formData.referralDental,
          goHome: formData.referralGoHome,
        },
      };

      if (selectedPatient) {
        // Update existing patient
        await dispatch(updateAdultPatient({ 
          patientCode: selectedPatient.patientCode, 
          patientData: apiData 
        })).unwrap();
        toast.success("Patient updated successfully!", {
          description: `${formData.patientName} has been updated in the system.`
        });
      } else {
        // Create new patient
        await dispatch(createAdultPatient(apiData)).unwrap();
        toast.success("Patient added successfully!", {
          description: `${formData.patientName} has been registered in the system.`
        });
      }
      
      setIsAddPatientOpen(false);
      setSelectedPatient(null);
      
      // Refresh the patient list
      dispatch(fetchAdultPatients({}));
    } catch (error: any) {
      // show server-provided message if available
      toast.error("Failed to save patient", {
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
      patientName: patient.patientName || undefined,
      sex: patient.sex === 'male' ? 'M' : 'F',
      age: patient.age?.toString() || undefined,
      occupation: patient.occupation || undefined,
      mobileNumber: patient.mobileNumber || undefined,
      maritalStatus: patient.maritalStatus || undefined,
      ifMarriedChildren: patient.ifMarriedChildren?.toString() || undefined,
      ageOfYoungest: patient.ageOfYoungest?.toString() || undefined,
      educationLevel: patient.educationLevel || undefined,
      smoking: patient.smoking?.status === 'yes' ? 'Yes' : patient.smoking?.status === 'former' ? 'Former' : patient.smoking?.status === 'no' ? 'No' : undefined,
      smokingRate: patient.smoking?.rate || undefined,
      smokingType: patient.smoking?.type || undefined,
      smokingOther: undefined,
      smokingCessation: patient.smoking?.cessationYears ? 'Yes' : 'No',
      smokingIfYes: patient.smoking?.cessationYears?.toString() || undefined,
      smokingDuration: patient.smoking?.durationYears?.toString() || undefined,
      menstruation: patient.menstruation?.regular ? 'Regular' : 'Irregular',
      gravidaNumber: patient.menstruation?.gravidaNumber?.toString() || undefined,
      abortionNumber: patient.menstruation?.abortionNumber?.toString() || undefined,
      contraception: patient.contraception?.using ? 'Yes' : 'No',
      contraceptionMethod: patient.contraception?.method || [],
      contraceptionOther: patient.contraception?.other || undefined,
      complaints: patient.complaints || [],
      pastHistoryDM: patient.pastHistory?.diabetes || false,
      pastHistoryHTN: patient.pastHistory?.hypertension || false,
      pastHistoryHCV: patient.pastHistory?.HCV || false,
      pastHistoryRHD: patient.pastHistory?.RHD || false,
      pastHistoryOthers: patient.pastHistory?.others || undefined,
      allergyYes: patient.allergies?.hasAllergy || false,
      allergyNo: !patient.allergies?.hasAllergy || false,
      allergySpecify: patient.allergies?.details || undefined,
      bloodTransfusion: patient.bloodTransfusion?.received ? 'Yes' : 'No',
      bloodTransfusionDuration: patient.bloodTransfusion?.duration || undefined,
      surgicalICU: patient.surgery?.ICU || false,
      surgicalOperation: patient.surgery?.operation || false,
      drugsAntiHTN: patient.chronicMedications?.antiHTN || false,
      drugsOralHypoglycemic: patient.chronicMedications?.oralHypoglycemic || false,
      drugsAntiepilep: patient.chronicMedications?.antiepileptic || false,
      drugsAntidiuretic: patient.chronicMedications?.antidiuretic || false,
      drugsOther: patient.chronicMedications?.others || undefined,
      familySimilar: patient.familyHistory?.similar || false,
      familyHTN: patient.familyHistory?.hypertension || false,
      familyDM: patient.familyHistory?.diabetes || false,
      familyOther: patient.familyHistory?.others || undefined,
      vitalBP: patient.vitals?.BP || undefined,
      vitalHR: patient.vitals?.HR?.toString() || undefined,
      vitalRBS: patient.vitals?.RBS?.toString() || undefined,
      vitalTemp: patient.vitals?.temperature?.toString() || undefined,
      vitalSpo2: patient.vitals?.SpO2?.toString() || undefined,
      cyanosisPeripheral: patient.physicalExam?.cyanosis?.peripheral || false,
      cyanosisCentral: patient.physicalExam?.cyanosis?.central || false,
      jaundice: patient.physicalExam?.jaundice || false,
      pallor: patient.physicalExam?.pallor || false,
      weight: patient.anthropometry?.weight?.toString() || undefined,
      height: patient.anthropometry?.height?.toString() || undefined,
      bmi: patient.anthropometry?.BMI?.toString() || undefined,
      diabetesKnown: patient.diabetesScreening === 'known',
      diabetesUnknown: patient.diabetesScreening === 'unknown',
      referralIM: patient.referrals?.internalMedicine || false,
      referralCardio: patient.referrals?.cardiology || false,
      referralSurgery: patient.referrals?.surgery || false,
      referralOphth: patient.referrals?.ophthalmology || false,
      referralObsGyn: patient.referrals?.obstetricGynecology || false,
      referralENT: patient.referrals?.ENT || false,
      referralDerma: patient.referrals?.dermatology || false,
      referralOrtho: patient.referrals?.orthopedics || false,
      referralDental: patient.referrals?.dental || false,
      referralGoHome: patient.referrals?.goHome || false,
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

  const transformedPatients = transformPatientData(adultPatients);

  const patientColumns = [
    {
      key: 'id',
      header: 'Patient Code',
      width: 'w-32',
      render: (value: string) => (
        <span className="font-mono text-sm bg-bedaya-green/10 text-bedaya-green px-2 py-1 rounded-lg font-medium">{value}</span>
      )
    },
    {
      key: 'name',
      header: 'Name',
      width: 'w-48',
      render: (value: string) => (
        <span className="font-medium text-sm text-bedaya-dark-gray">{value}</span>
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
              className="text-xs bg-bedaya-light-gray text-bedaya-dark-gray border-0"
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Adult Patient Management</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all adult patients in the convoy</p>
        </div>
        <Button 
          onClick={() => setIsAddPatientOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          New Patient
        </Button>
      </div>

      {/* Form Drawer */}
      <AddAdultPatientForm 
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
             <div className="p-3 bg-green-50 rounded-xl">
               <Users className="w-6 h-6 text-green-600" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Active Patients</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : adultPatients.filter(p => !p.referrals?.goHome).length}
               </p>
             </div>
             <div className="p-3 bg-blue-50 rounded-xl">
               <Users className="w-6 h-6 text-blue-600" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Referred to Clinics</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : adultPatients.filter(p => Object.values(p.referrals || {}).some(v => v)).length}
               </p>
             </div>
             <div className="p-3 bg-orange-50 rounded-xl">
               <Users className="w-6 h-6 text-orange-600" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">Error loading patients: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Patient Database */}
      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 px-6 py-4">
          <CardTitle className="text-lg font-bold text-slate-900">All Patients Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Loading patients...</span>
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