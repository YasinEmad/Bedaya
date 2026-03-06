import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Badge } from "@ui/badge";
import { Switch } from "@ui/switch";
import { DataTable } from "@ui/data-table"; // Assuming DataTable is used in dispensing
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@ui/dialog";import {
  Pill,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  ShoppingCart,
  Settings,
  Pause,
  Play,
  Zap,
  Truck,
  Eye,
  Edit
} from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui/select";

interface DispensingControlProps {
    // Define any props that DispensingTab might have received or needs now
    // For now, it seems self-contained, but it will need data later.
}

export function DispensingControl({ /* props */ }: DispensingControlProps) {

    // These data definitions were inside PharmacyModule.
    // They need to be moved or passed as props if PharmacyModule generates them.
    // For now, I'll move them directly into DispensingControl.

    const dispensingHistory = [
        {
            id: "DISP001",
            patientId: "P001",
            patientName: "Maria Rodriguez",
            medication: "Metformin 500mg",
            quantity: 30,
            date: "2024-09-20",
            time: "10:30 AM",
            prescribedBy: "Dr. Sarah Chen",
            dispensedBy: "Pharmacist John",
            instructions: "Take twice daily with meals"
        },
        {
            id: "DISP002",
            patientId: "P002",
            patientName: "John Smith",
            medication: "Lisinopril 10mg",
            quantity: 30,
            date: "2024-09-20",
            time: "09:45 AM",
            prescribedBy: "Dr. Sarah Chen",
            dispensedBy: "Pharmacist John",
            instructions: "Take once daily in the morning"
        },
        {
            id: "DISP003",
            patientId: "P003",
            patientName: "Emma Johnson",
            medication: "Ibuprofen 400mg",
            quantity: 20,
            date: "2024-09-19",
            time: "03:20 PM",
            prescribedBy: "Dr. Michael Rodriguez",
            dispensedBy: "Pharmacist Sarah",
            instructions: "Take as needed for pain, max 3 times daily"
        }
    ];




    const dispensingColumns = [
        {
            key: 'patientId',
            header: 'Patient ID',
            width: 'w-24',
            render: (value: string) => (
                <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{value}</span>
            )
        },
        {
            key: 'patientName',
            header: 'Patient Name',
            width: 'w-48',
            render: (value: string) => (
                <span className="font-medium text-sm text-slate-900">{value}</span>
            )
        },
        {
            key: 'medication', // Use the actual medication key from the data
            header: 'Medication',
            render: (value: string, row: any) => ( // 'value' here is row.medication
                <div className="flex flex-wrap gap-1">
                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                        {`${value} x ${row.quantity}`}
                    </Badge>
                </div>
            )
        },
        {
            key: 'date',
            header: 'Date',
            width: 'w-24',
            render: (value: string, row: any) => (
                <span className="text-sm text-slate-500">{value} {row.time}</span>
            )
        },

    ];

    const [isDispenseDialogOpen, setIsDispenseDialogOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [medsToDispense, setMedsToDispense] = useState([{ medicationId: "", quantity: "", type: "pills" as "pills" | "strip", pillsPerStrip: "", medicationNameInput: "", showSuggestions: false }]);
    // Mock data for available medications and patients (can be fetched from a global store later)
    const availableMedications = [
        { id: "MED001", name: "Ibuprofen 200mg", type: "pills" as "pills" | "ampules" | "bottle", stock: 500, pillsPerStrip: 10 },
        { id: "MED002", name: "Amoxicillin 250mg", type: "pills", stock: 300, pillsPerStrip: 7 },
        { id: "MED003", name: "Telfast 120mg", type: "pills", stock: 200, pillsPerStrip: 10 },
        { id: "MED004", name: "Paracetamol 500mg", type: "pills", stock: 1000, pillsPerStrip: 10 },
        { id: "MED005", name: "Insulin 100IU", type: "ampules", stock: 50 },
        { id: "MED006", name: "Cough Syrup", type: "bottle", stock: 30 },
    ];

    const availablePatients = [
        { id: "P001", name: "Maria Rodriguez" },
        { id: "P002", name: "John Smith" },
        { id: "P003", name: "Emma Johnson" },
        { id: "P004", name: "David Wilson" },
        { id: "P005", name: "Sophie Brown" },
    ];

    const handleAddMedicationField = () => {
        setMedsToDispense([...medsToDispense, { medicationId: "", quantity: "", type: "pills", pillsPerStrip: "", medicationNameInput: "", showSuggestions: false }]);
    };

    const handleRemoveMedicationField = (index: number) => {
        const list = [...medsToDispense];
        list.splice(index, 1);
        setMedsToDispense(list);
    };

    const handleMedicationChange = (index: number, field: string, value: string | boolean) => {
        const list = [...medsToDispense];
        (list[index] as any)[field] = value;

        if (field === "medicationId") {
            const med = availableMedications.find(m => m.id === value);
            if (med) {
                list[index].type = med.type === "pills" ? "pills" : (med.type === "ampules" ? "pills" : "pills");
                if (med.pillsPerStrip) {
                    list[index].pillsPerStrip = med.pillsPerStrip.toString();
                } else {
                    list[index].pillsPerStrip = "";
                }
                list[index].medicationNameInput = med.name; // Update input field with selected name
            }
        } else if (field === "medicationNameInput") {
            list[index].medicationId = ""; // Clear selected ID when user types
        }
        setMedsToDispense(list);
    };

    const handleSubmitDispense = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Dispensing for Patient:", selectedPatientId, "Medications:", medsToDispense);

        // Here you would add logic to actually dispense medicine,
        // update inventory, and add to dispensing history.

        // For now, reset and close dialog
        setIsDispenseDialogOpen(false);
        setSelectedPatientId("");
        setMedsToDispense([{ medicationId: "", quantity: "", type: "pills", pillsPerStrip: "", medicationNameInput: "", showSuggestions: false }]);
    };


    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="border-slate-100 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-white border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900">Recent Dispensing Activity</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">Track medication history and dispense new prescriptions</p>
                        </div>
                        <Dialog open={isDispenseDialogOpen} onOpenChange={setIsDispenseDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200">
                                    <Plus className="w-4 h-4 mr-2" /> Dispense Medicine
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none bg-slate-50/95 backdrop-blur-sm p-0 flex items-center justify-center z-50">
                                <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                                    <DialogHeader className="px-8 py-6 border-b border-slate-100 bg-white items-center">
                                        <div className="p-3 bg-green-50 rounded-full mb-2">
                                            <Pill className="w-6 h-6 text-primary" />
                                        </div>
                                        <DialogTitle className="text-2xl font-bold text-slate-900">Dispense Medicine</DialogTitle>
                                        <DialogDescription className="text-center text-slate-500">
                                            Select patient and medications to dispense from inventory.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <form id="dispense-form" onSubmit={handleSubmitDispense} className="flex-1 overflow-y-auto p-8 space-y-8">
                                        {/* Patient Selection */}
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="patient-select" className="text-sm font-semibold text-slate-900">Select Patient</Label>
                                            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                                <SelectTrigger id="patient-select" className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-primary/20">
                                                    <SelectValue placeholder="Search or select patient..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availablePatients.map((patient) => (
                                                        <SelectItem key={patient.id} value={patient.id}>
                                                            {patient.name} (ID: {patient.id})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Medication Multi-selection */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-semibold text-slate-900">Medications List</h3>
                                                <Button type="button" variant="outline" size="sm" onClick={handleAddMedicationField} className="border-dashed border-slate-300 text-slate-600 hover:text-primary hover:border-primary">
                                                    <Plus className="w-4 h-4 mr-1" /> Add Another
                                                </Button>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {medsToDispense.map((medItem, index) => (
                                                    <div key={index} className="flex flex-col gap-4 border border-slate-200 bg-slate-50/50 p-5 rounded-xl transition-all hover:border-slate-300 hover:bg-slate-50">
                                                        <div className="flex justify-between items-center">
                                                            <Badge variant="outline" className="bg-white text-slate-700 border-slate-200">
                                                                Item #{index + 1}
                                                            </Badge>
                                                            {medsToDispense.length > 1 && (
                                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2" onClick={() => handleRemoveMedicationField(index)}>
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="col-span-1 md:col-span-2 relative">
                                                                <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">Search Medication</Label>
                                                                <div className="relative">
                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Scan Barcode or Type Name..."
                                                                        value={medItem.medicationNameInput}
                                                                        onChange={(e) => {
                                                                            handleMedicationChange(index, "medicationNameInput", e.target.value);
                                                                            handleMedicationChange(index, "showSuggestions", true); 
                                                                        }}
                                                                        onFocus={() => handleMedicationChange(index, "showSuggestions", true)} 
                                                                        onBlur={() => setTimeout(() => handleMedicationChange(index, "showSuggestions", false), 200)} 
                                                                        className="pl-9 bg-white border-slate-200 focus:border-primary rounded-lg"
                                                                    />
                                                                </div>
                                                                {/* Suggestions Dropdown */}
                                                                {medItem.showSuggestions && medItem.medicationNameInput && (
                                                                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                                                        {availableMedications.filter(med =>
                                                                            med.name.toLowerCase().includes(medItem.medicationNameInput.toLowerCase()) ||
                                                                            med.id.toLowerCase().includes(medItem.medicationNameInput.toLowerCase())
                                                                        ).length > 0 ? (
                                                                            availableMedications.filter(med =>
                                                                                med.name.toLowerCase().includes(medItem.medicationNameInput.toLowerCase()) ||
                                                                                med.id.toLowerCase().includes(medItem.medicationNameInput.toLowerCase())
                                                                            ).map((med) => (
                                                                                <div
                                                                                    key={med.id}
                                                                                    className="p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center"
                                                                                    onMouseDown={() => { 
                                                                                        handleMedicationChange(index, "medicationId", med.id);
                                                                                        handleMedicationChange(index, "medicationNameInput", med.name);
                                                                                        handleMedicationChange(index, "showSuggestions", false); 
                                                                                    }}
                                                                                >
                                                                                    <span className="font-medium text-slate-900">{med.name}</span>
                                                                                    <Badge variant="secondary" className="text-xs">Stock: {med.stock}</Badge>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="p-4 text-center text-slate-500 text-sm">No matches found</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col gap-1.5">
                                                                <Label className="text-xs font-semibold text-slate-500">Quantity</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={medItem.quantity}
                                                                    onChange={(e) => handleMedicationChange(index, "quantity", e.target.value)}
                                                                    className="bg-white border-slate-200 rounded-lg"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-1.5">
                                                                <Label className="text-xs font-semibold text-slate-500">Unit Type</Label>
                                                                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                                                    {(["pills", "strip", "bottle"] as const).map((typeOption) => (
                                                                        <button
                                                                            key={typeOption}
                                                                            type="button"
                                                                            onClick={() => handleMedicationChange(index, "type", typeOption)}
                                                                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all
                                                                                    ${medItem.type === typeOption ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                                                                        >
                                                                            {typeOption === "pills" ? "Units" : (typeOption === "strip" ? "Strip" : "Bot")}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </form>
                                    
                                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                                        <div className="flex gap-4 w-full">
                                            <Button variant="outline" className="flex-1 h-12 bg-white border-slate-200" onClick={() => setIsDispenseDialogOpen(false)}>Cancel</Button>
                                            <Button type="submit" form="dispense-form" className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-green-200 text-base">Confirm Dispense</Button>
                                        </div>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable columns={dispensingColumns} data={dispensingHistory} />
                </CardContent>
            </Card>
        </div>
    );
}
