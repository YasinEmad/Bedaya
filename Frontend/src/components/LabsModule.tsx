import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Badge } from "@ui/badge";
import { DataTable } from "@ui/data-table";
import { Button } from "@ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { InOutSelector } from "@ui/in-out-selector";
import { Plus } from "lucide-react";

import { UrineLabsModule } from "./UrineLabsModule";
import { StoolLabsModule } from "./StoolLabsModule";
import { BloodLabsModule } from "./BloodLabsModule";
import { AddCrUreaPatientDialog } from "./AddCrUreaPatientDialog";

interface LabsModuleProps {
    activeLabSection?: string; // e.g., "labs", "labs-blood", "labs-urine"
}

type LabStatusType = "in" | "out" | null;

export function LabsModule({ activeLabSection }: LabsModuleProps) {
    // Route to specific lab modules based on activeLabSection
    if (activeLabSection === 'labs-blood') {
        return <BloodLabsModule activeLabSection={activeLabSection} />;
    }
    if (activeLabSection === 'labs-urine') {
        return <UrineLabsModule activeLabSection={activeLabSection} />;
    }
    if (activeLabSection === 'labs-stool') {
        return <StoolLabsModule activeLabSection={activeLabSection} />;
    }
    // Note: Cr/Urea logic is intertwined with overall or handled separately? 
    // The previous code had specific logic for cr_urea in the generic view.
    // If Cr/Urea has its own module (which it doesn't seem to have a full one imported?), 
    // or if it was handled inline.
    // Looking at imports: import { AddCrUreaPatientDialog } from "./AddCrUreaPatientDialog";
    // So Cr/Urea uses the generic view but with a specific dialog trigger?
    // Let's keep the generic view logic for cr_urea and overall.
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCrUreaDialogOpen, setIsCrUreaDialogOpen] = useState(false);
    const [patientSearchQuery, setPatientSearchQuery] = useState("");

    // ... existing generic state and logic ...
    const [overallLabStatus, setOverallLabStatus] = useState<LabStatusType>(null);
    const [bloodStatus, setBloodStatus] = useState<LabStatusType>(null);
    const [urineStatus, setUrineStatus] = useState<LabStatusType>(null);
    const [stoolStatus, setStoolStatus] = useState<LabStatusType>(null);
    const [crUreaStatus, setCrUreaStatus] = useState<LabStatusType>(null);

    const labTypes = [
        { id: "overall_lab", name: "Labs", status: overallLabStatus, setStatus: setOverallLabStatus },
        { id: "blood", name: "Blood", status: bloodStatus, setStatus: setBloodStatus },
        { id: "urine", name: "Urine", status: urineStatus, setStatus: setUrineStatus },
        { id: "stool", name: "Stool", status: stoolStatus, setStatus: setStoolStatus },
        { id: "cr_urea", name: "Cr/Urea", status: crUreaStatus, setStatus: setCrUreaStatus },
    ];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        console.log("Adding patient to lab:", {
            patient: patientSearchQuery,
            blood: bloodStatus,
            urine: urineStatus,
            stool: stoolStatus,
            cr_urea: crUreaStatus,
        });
        // Here you would typically dispatch an action to update your state/backend
        setIsDialogOpen(false); // Close the dialog
        setPatientSearchQuery(""); // Reset patient search query
        setBloodStatus(null); // Reset all lab statuses
        setUrineStatus(null);
        setStoolStatus(null);
        setCrUreaStatus(null);
    };

    const renderLabStatusBadge = (value: "empty" | "in" | "out" | null) => {
        if (value === "in") {
            return <Badge variant="destructive" className="shadow-sm">In</Badge>;
        }
        if (value === "out") {
            return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white shadow-sm">Out</Badge>;
        }
        return null; 
    };

    const generatePatients = () => {
        const patients = [];
        for (let i = 1; i <= 20; i++) {
            patients.push({
                id: `LAB${i.toString().padStart(3, '0')}`,
                name: `Patient ${i}`,
                blood: i % 3 === 0 ? "in" : i % 3 === 1 ? "out" : null,
                urine: i % 4 === 0 ? "in" : i % 4 === 1 ? "out" : null,
                stool: i % 5 === 0 ? "in" : i % 5 === 1 ? "out" : null,
                cr_urea: i % 6 === 0 ? "in" : i % 6 === 1 ? "out" : null,
            });
        }
        return patients;
    };

    const patients = generatePatients();

    const getLabSectionTitle = (section?: string) => {
        switch (section) {
            case "labs-cr_urea": return "Cr/Urea Lab Queue";
            default: return "Lab Activity Overview";
        }
    };

    const getDynamicLabColumns = (section?: string) => {
        const baseColumns = [
            { key: "id", header: "Patient ID", render: (v: string) => <span className="font-mono text-xs">{v}</span> },
            { key: "name", header: "Name" },
        ];

        const statusRender = (v: any) => renderLabStatusBadge(v);

        if (!section || section === "labs-overall-status") {
            return [
                ...baseColumns,
                { key: "blood", header: "Blood", render: statusRender },
                { key: "urine", header: "Urine", render: statusRender },
                { key: "stool", header: "Stool", render: statusRender },
                { key: "cr_urea", header: "Cr/Urea", render: statusRender },
            ];
        } else if (section === "labs-cr_urea") {
            return [...baseColumns, { key: "cr_urea", header: "Status", render: statusRender }];
        }
        
        return baseColumns;
    };

    const filteredPatients = patients; // For simplicity in mock

    const labColumns = getDynamicLabColumns(activeLabSection);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 px-6 py-5 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900">{getLabSectionTitle(activeLabSection)}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Manage lab requests and results status</p>
                    </div>
                    <div>
                        {activeLabSection === "labs-cr_urea" && (
                            <div className="flex gap-2">
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200" onClick={() => setIsCrUreaDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Patient to Cr/Urea
                                </Button>
                            </div>
                        )}
                        {(!activeLabSection || activeLabSection === "labs-overall-status") && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200">
                                        <Plus className="mr-2 h-4 w-4" /> Add Patient to Lab
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none bg-slate-50/95 backdrop-blur-sm p-0 flex items-center justify-center z-50">
                                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                                        <DialogHeader className="px-8 py-6 border-b border-slate-100 bg-white">
                                            <DialogTitle className="text-2xl font-bold text-center text-slate-900">Add Patient to Lab Status</DialogTitle>
                                            <DialogDescription className="text-center text-slate-500">
                                                Search for a patient and update their specific lab statuses.
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-8 overflow-y-auto">
                                            {/* Patient Search */}
                                            <div className="space-y-3">
                                                <Label htmlFor="patient-search" className="text-base font-semibold text-slate-900">Patient Name or Code</Label>
                                                <Input
                                                    id="patient-search"
                                                    className="w-full h-12 text-lg bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary px-4 rounded-xl"
                                                    value={patientSearchQuery}
                                                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                                                    placeholder="Search by name or code..."
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Lab Status Selections */}
                                            <div className="space-y-4">
                                                <Label className="text-base font-semibold text-slate-900">Lab Status Updates</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {labTypes.map((lab) => (
                                                        <div key={lab.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                            <span className="font-medium text-slate-700">{lab.name}</span>
                                                            <InOutSelector
                                                                initialState={lab.status}
                                                                onChange={(newState) => lab.setStatus(newState)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </form>
                                        
                                        <DialogFooter className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                                            <div className="flex gap-3 w-full">
                                                <Button variant="outline" className="flex-1 h-12 bg-white border-slate-200" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                                <Button type="submit" onClick={handleSubmit} className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-green-200">Submit Lab Status</Button>
                                            </div>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable columns={labColumns} data={filteredPatients} />
                </CardContent>
            </Card>
            <AddCrUreaPatientDialog
                isOpen={isCrUreaDialogOpen}
                onClose={() => setIsCrUreaDialogOpen(false)}
            />
        </div>
    );
}
