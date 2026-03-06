import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DataTable } from "./ui/data-table";
import { AddAdultPatientForm } from "./AddAdultPatientForm";
import { toast } from "sonner";
import { 
  UserPlus,
  Users
} from "lucide-react";

export function AdultsModule() {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleSubmit = (formData: any) => {
    // Here you would typically send the data to your backend
    console.log("Patient data:", formData);
    
    setIsAddPatientOpen(false);
    setSelectedPatient(null);
    
    // Show success message
    toast.success(selectedPatient ? "Patient updated successfully!" : "Patient added successfully!", {
      description: `${formData.patientName} has been ${selectedPatient ? 'updated' : 'registered'} in the system.`
    });
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

  // Generate larger dataset for demonstration
  const generatePatients = () => {
    const firstNames = ["Maria", "John", "Sarah", "Ahmed", "Emma", "David", "Lisa", "Robert", "Anna", "Michael", "Elena", "James", "Sofia", "Daniel", "Carmen"];
    const lastNames = ["Rodriguez", "Smith", "Johnson", "Hassan", "Wilson", "Brown", "Garcia", "Lee", "Martinez", "Taylor", "Anderson", "Thompson", "White", "Martin", "Clark"];
    const clinicsOptions = ["Internal Medicine", "Cardiology", "Orthopedics", "Ophthalmology", "Dental", "Dermatology", "ENT", "Surgery"];

    const patients = [];
    for (let i = 1; i <= 247; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Each patient can be referred to 1-3 clinics
      const numClinics = Math.floor(Math.random() * 3) + 1;
      const referredClinics = [];
      const availableClinics = [...clinicsOptions];
      
      for (let j = 0; j < numClinics; j++) {
        const randomIndex = Math.floor(Math.random() * availableClinics.length);
        referredClinics.push(availableClinics[randomIndex]);
        availableClinics.splice(randomIndex, 1);
      }
      
      patients.push({
        id: `P${String(i).padStart(3, '0')}`,
        name: `${firstName} ${lastName}`,
        clinics: referredClinics
      });
    }
    return patients;
  };

  const patients = generatePatients();

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
          code: selectedPatient.id,
          patientName: selectedPatient.name
        } : undefined}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Total Patients</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">{patients.length}</p>
             </div>
             <div className="p-3 bg-green-50 rounded-xl">
               <Users className="w-6 h-6 text-green-600" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Seen Today</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">152</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl">
               <Users className="w-6 h-6 text-slate-500" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Pending</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">95</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl">
               <Users className="w-6 h-6 text-slate-500" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Database */}
      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 px-6 py-4">
          <CardTitle className="text-lg font-bold text-slate-900">All Patients Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
            data={patients} 
            columns={patientColumns}
            pageSize={15}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}