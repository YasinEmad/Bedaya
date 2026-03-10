import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchAllClinics, fetchClinicVisitsByType, createClinicVisit, ClinicVisit } from "../store/slices/clinicsSlice";
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
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@ui/button";

interface ClinicsModuleProps {
    activeClinic: string;
}

// Map clinic IDs to icons
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "internal-medicine": Stethoscope,
  "orthopedics": Bone,
  "ophthalmology": Eye,
  "obstetrics-gynecology": Baby,
  "dermatology": Users,
  "dental": Users,
  "cardiology": Heart,
  "surgery": Scissors,
  "ent": Ear,
  "pediatrics-clinic": Baby,
};

export function ClinicsModule({ activeClinic }: ClinicsModuleProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { clinics, clinicVisits, loading, error } = useSelector((state: RootState) => state.clinics);
    const [isAddPatientFormOpen, setIsAddPatientFormOpen] = useState(false);

    // Map clinic visits to patient data
    const clinicPatients = clinicVisits.map(visit => {
        console.log('Clinic visit data:', visit);
        return {
            id: visit.patientCode || visit.patientId,
            name: visit.patientName,
            diagnosis: visit.diagnosis,
            treatment: visit.treatment
        };
    });

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

    // Fetch clinics on component mount
    useEffect(() => {
        dispatch(fetchAllClinics());
    }, [dispatch]);

    // Fetch clinic visits when active clinic changes
    useEffect(() => {
        if (activeClinic) {
            dispatch(fetchClinicVisitsByType(activeClinic as ClinicVisit['clinicType']));
        }
    }, [dispatch, activeClinic]);

    const selectedClinic = clinics.find(c => c.id === activeClinic);

    const handleAddPatientSubmit = async (formData: any) => {
        try {
            await dispatch(createClinicVisit(formData)).unwrap();
            setIsAddPatientFormOpen(false);
            toast.success("Patient added to clinic successfully!", {
                description: `Patient has been added to the ${selectedClinic?.name} queue.`
            });
            // Refresh the clinic visits
            dispatch(fetchClinicVisitsByType(activeClinic as any));
        } catch (error) {
            toast.error("Failed to add patient to clinic", {
                description: error instanceof Error ? error.message : "Unknown error occurred"
            });
        }
    };

    // Loading state
    if (loading && clinics.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading clinics...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-1">Error Loading Clinics</h3>
                            <p className="text-red-800 text-sm mb-4">{error}</p>
                            <Button
                                onClick={() => dispatch(fetchAllClinics())}
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-100"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (selectedClinic) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                            selectedClinic.color.replace('text-', 'bg-').replace('100', '50')
                        }`}>
                            {iconMap[selectedClinic.id] && 
                                React.createElement(iconMap[selectedClinic.id], {
                                    className: `w-8 h-8 ${selectedClinic.color.split(' ')[1]}`
                                })
                            }
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
                    clinicType={activeClinic}
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

            {/* Clinics Grid */}
            {clinics.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="p-8 text-center">
                        <p className="text-slate-600">No clinics available</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {clinics.map((clinic) => {
                        const Icon = iconMap[clinic.id];
                        
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
                                        {Icon && (
                                            <div className={`p-3 rounded-xl transition-colors group-hover:scale-105 duration-200 ${clinic.color.replace('text-', 'bg-').split(' ')[0]}`}>
                                                <Icon className={`w-6 h-6 ${clinic.color.split(' ')[1]}`} />
                                            </div>
                                        )}
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
            )}
        </div>
    );
}
