import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Badge } from "@ui/badge";
import { DataTable } from "@ui/data-table";
import { AddPatientToClinicForm } from "./AddPatientToClinicForm";
import { toast } from "sonner";
import { 
  Heart, 
  Bone, 
  Eye, 
  Baby, 
  Stethoscope,
  Scissors,
  Ear,
  Users,
  Plus,
  Clock
} from "lucide-react";
import { Button } from "@ui/button";

interface ClinicsModuleProps {
    activeClinic: string;
}

export function ClinicsModule({ activeClinic }: ClinicsModuleProps) {
    const [isAddPatientFormOpen, setIsAddPatientFormOpen] = useState(false);

    const clinics = [
        {
            id: "internal-medicine",
            name: "Internal Medicine",
            icon: Stethoscope,
            color: "bg-blue-100 text-blue-600",
            patients: 23,
            status: "active",
            waitTime: "15 min",
            doctor: "Dr. Sarah Chen",
            completed: 12,
            avgTime: "18m"
        },
        {
            id: "orthopedics",
            name: "Orthopedics",
            icon: Bone,
            color: "bg-green-100 text-green-600",
            patients: 8,
            status: "break",
            waitTime: "30 min",
            doctor: "Dr. Michael Rodriguez",
            completed: 15,
            avgTime: "25m"
        },
        {
            id: "ophthalmology",
            name: "Ophthalmology",
            icon: Eye,
            color: "bg-purple-100 text-purple-600",
            patients: 15,
            status: "active",
            waitTime: "20 min",
            doctor: "Dr. Lisa Wang",
            completed: 8,
            avgTime: "12m"
        },
        {
            id: "obstetrics-gynecology",
            name: "Obs & Gynecology",
            icon: Baby,
            color: "bg-pink-100 text-pink-600",
            patients: 12,
            status: "active",
            waitTime: "25 min",
            doctor: "Dr. Jennifer Adams",
            completed: 6,
            avgTime: "22m"
        },
        {
            id: "dermatology",
            name: "Dermatology",
            icon: Users,
            color: "bg-yellow-100 text-yellow-600",
            patients: 9,
            status: "break",
            waitTime: "40 min",
            doctor: "Dr. David Kim",
            completed: 11,
            avgTime: "15m"
        },
        {
            id: "dental",
            name: "Dental",
            icon: Users,
            color: "bg-cyan-100 text-cyan-600",
            patients: 11,
            status: "active",
            waitTime: "10 min",
            doctor: "Dr. Maria Gonzalez",
            completed: 9,
            avgTime: "20m"
        },
        {
            id: "cardiology",
            name: "Cardiology",
            icon: Heart,
            color: "bg-red-100 text-red-600",
            patients: 12,
            status: "active",
            waitTime: "35 min",
            doctor: "Dr. Robert Taylor",
            completed: 7,
            avgTime: "28m"
        },
        {
            id: "surgery",
            name: "Surgery",
            icon: Scissors,
            color: "bg-orange-100 text-orange-600",
            patients: 5,
            status: "active",
            waitTime: "45 min",
            doctor: "Dr. Amanda Foster",
            completed: 3,
            avgTime: "45m"
        },
        {
            id: "ent",
            name: "ENT",
            icon: Ear,
            color: "bg-indigo-100 text-indigo-600",
            patients: 7,
            status: "active",
            waitTime: "18 min",
            doctor: "Dr. James Wilson",
            completed: 5,
            avgTime: "16m"
        },
        {
            id: "pediatrics-clinic",
            name: "Pediatrics",
            icon: Baby,
            color: "bg-rose-100 text-rose-600",
            patients: 18,
            status: "active",
            waitTime: "12 min",
            doctor: "Dr. Elena Martinez",
            completed: 14,
            avgTime: "14m"
        }
    ];

    const clinicPatients = [
        {
            id: "P001",
            name: "Maria Rodriguez",
            diagnosis: "Cataracts, Presbyopia",
            treatment: "Surgical referral, Reading glasses"
        },
        {
            id: "P002",
            name: "John Smith",
            diagnosis: "Diabetic Retinopathy",
            treatment: "Laser therapy, Blood sugar monitoring"
        },
        {
            id: "P003",
            name: "Emma Johnson",
            diagnosis: "Glaucoma",
            treatment: "Eye drops, Pressure monitoring"
        },
    ];

    const patientColumns = [
        {
            key: "id",
            header: "Patient Code",
            width: "w-32",
            render: (value: any) => (
                <span className="font-mono text-sm bg-pink-50 text-pink-700 px-2 py-1 rounded font-medium">{value}</span>
            )
        },
        {
            key: "name",
            header: "Name",
            width: "w-48",
            render: (value: any) => (
                <span className="font-medium text-sm text-slate-900">{value}</span>
            )
        },
        {
            key: "diagnosis",
            header: "Diagnosis",
            width: "flex-1",
            render: (value: any) => (
                <span className="text-sm text-slate-700">{value}</span>
            )
        },
        {
            key: "treatment",
            header: "Treatment",
            width: "flex-1",
            sortable: false,
            render: (value: any) => (
                <div className="flex flex-wrap gap-1.5">
                    {value.split(',').map((treatment: any, idx: number) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                            {treatment.trim()}
                        </Badge>
                    ))}
                </div>
            )
        },
    ];

    const selectedClinic = clinics.find(c => c.id === activeClinic);

    const handleAddPatientSubmit = (formData: any) => {
        // Here you would typically send the data to your backend
        console.log("Patient data for clinic:", formData);

        setIsAddPatientFormOpen(false);

        // Show success message
        toast.success("Patient added to clinic successfully!", {
            description: `Patient has been added to the ${selectedClinic?.name} queue.`
        });
    };

    if (selectedClinic) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                            selectedClinic.color.replace('text-', 'bg-').replace('100', '50')
                        }`}>
                            <selectedClinic.icon className={`w-8 h-8 ${selectedClinic.color.split(' ')[1]}`} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{selectedClinic.name}</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {selectedClinic.patients} Patients Waiting
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{selectedClinic.doctor}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddPatientFormOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Patient
                    </Button>
                </div>

                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-base font-semibold text-slate-800">Patient Queue</CardTitle>
                        <p className="text-sm text-slate-500">Manage patient status and treatments</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable columns={patientColumns} data={clinicPatients} />
                    </CardContent>
                </Card>

                <AddPatientToClinicForm
                    open={isAddPatientFormOpen}
                    onOpenChange={setIsAddPatientFormOpen}
                    onSubmit={handleAddPatientSubmit}
                    clinicName={selectedClinic.name}
                />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Clinics</h1>
                <p className="text-slate-500 mt-1">Select a clinic to view queues and manage patients</p>
            </div>

            {/* Clinics Grid - Clean and Simple */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {clinics.map((clinic) => {
                    const Icon = clinic.icon;
                    // Extract color base (e.g., 'blue', 'green') from the props for dynamic background
                    const colorClass = clinic.color;
                    
                    return (
                        <Card
                            key={clinic.id}
                            onClick={() => {
                                // In a real app, this would set activeClinic via props/context
                                // For this demo, we can't change the prop from here, but the parent would handle it
                            }}
                            className="bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer group"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl transition-colors group-hover:scale-105 duration-200 ${clinic.color.replace('text-', 'bg-').split(' ')[0]}`}>
                                        <Icon className={`w-6 h-6 ${clinic.color.split(' ')[1]}`} />
                                    </div>
                                    <Badge variant="outline" className={`bg-white font-normal ${
                                        clinic.status === 'active' 
                                            ? 'text-green-600 border-green-200 bg-green-50' 
                                            : 'text-amber-600 border-amber-200 bg-amber-50'
                                    }`}>
                                        {clinic.status === 'active' ? 'Active' : 'On Break'}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{clinic.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{clinic.doctor}</p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Waiting</p>
                                        <p className="text-xl font-bold text-slate-900 mt-0.5">{clinic.patients}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Avg Wait</p>
                                        <p className="text-sm font-bold text-slate-700 mt-1.5 flex items-center justify-end gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {clinic.waitTime}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
