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
        patientCode: formData.code,
        pov: formData.pov,
        patientName: formData.patientName,
        sex: formData.sex === 'M' ? 'male' : 'female',
        age: parseInt(formData.age) || 0,
        occupation: formData.occupation || undefined,
        mobileNumber: formData.mobileNumber || undefined,
        maritalStatus: formData.maritalStatus ? formData.maritalStatus.toLowerCase() as 'single' | 'married' | 'divorced' | 'widowed' : undefined,
        ifMarriedChildren: formData.ifMarriedChildren ? parseInt(formData.ifMarriedChildren) : undefined,
        ageOfYoungest: formData.ageOfYoungest ? parseInt(formData.ageOfYoungest) : undefined,
        educationLevel: formData.educationLevel || undefined,
        smoking: formData.smoking ? {
          status: formData.smoking === 'Yes' ? 'yes' : formData.smoking === 'Former' ? 'former' : 'no',
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
        diabetesScreening: formData.diabetesKnown ? 'known' : formData.diabetesUnknown ? 'unknown' : 'none',
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
    } catch (error) {
      toast.error("Failed to save patient", {
        description: "Please try again or contact support if the problem persists."
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
        open={isAddPatientOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        initialData={selectedPatient ? {
          houseNumber: selectedPatient.houseNumber,
          code: selectedPatient.patientCode,
          pov: selectedPatient.pov,
          patientName: selectedPatient.patientName,
          sex: selectedPatient.sex === 'male' ? 'M' : 'F',
          age: selectedPatient.age?.toString(),
          ...selectedPatient
        } : undefined}
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