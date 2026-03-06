import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DataTable } from "./ui/data-table";
import { AddPediatricPatientForm } from "./AddPediatricPatientForm";
import { toast } from "sonner";
import {
  UserPlus,
  Baby,
  Stethoscope,
  Clock
} from "lucide-react";

export function PediatricsModule() {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const handleSubmit = (formData: any) => {
    // Here you would typically send the data to your backend
    console.log("New pediatric patient data:", formData);
    
    setIsAddPatientOpen(false);
    
    // Show success message
    toast.success("Pediatric patient added successfully!", {
      description: `${formData.patientName} has been registered in the system.`
    });
  };

  // Generate pediatric patients dataset
  const generatePatients = () => {
    const firstNames = ["Ahmed", "Fatima", "Omar", "Nour", "Youssef", "Layla", "Hassan", "Zahra", "Ali", "Maryam", "Ibrahim", "Sara", "Khalid", "Amira", "Mohammed"];
    const lastNames = ["Ali", "Hassan", "Said", "Ibrahim", "Ahmed", "Mahmoud", "Yousef", "Salem", "Farah", "Nasser", "Khalil", "Rashid", "Hamza", "Tariq", "Malik"];
    const clinicsOptions = ["Pediatrics", "ENT", "Dermatology", "Dental", "Ophthalmology", "Cardiology", "Orthopedics"];

    const patients = [];
    for (let i = 1; i <= 89; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Each patient can be referred to 1-2 clinics
      const numClinics = Math.floor(Math.random() * 2) + 1;
      const referredClinics = [];
      const availableClinics = [...clinicsOptions];
      
      for (let j = 0; j < numClinics; j++) {
        const randomIndex = Math.floor(Math.random() * availableClinics.length);
        referredClinics.push(availableClinics[randomIndex]);
        availableClinics.splice(randomIndex, 1);
      }
      
      patients.push({
        id: `PED${String(i).padStart(3, '0')}`,
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
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        onSubmit={handleSubmit}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Total Patients</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">{patients.length}</p>
             </div>
             <div className="p-3 bg-pink-50 rounded-xl">
               <Baby className="w-6 h-6 text-pink-500" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Seen Today</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">42</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl">
               <Stethoscope className="w-6 h-6 text-slate-500" />
             </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500">Pending</p>
               <p className="text-3xl font-bold text-slate-900 mt-1">12</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl">
               <Clock className="w-6 h-6 text-slate-500" />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Database */}
      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 px-6 py-4">
          <CardTitle className="text-lg font-bold text-slate-900">All Pediatric Patients Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
            data={patients} 
            columns={patientColumns}
            pageSize={15}
          />
        </CardContent>
      </Card>
    </div>
  );
}