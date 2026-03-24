import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchStoolLabTests, createLabTest, updateLabTest, LabTest } from "../store/slices/labsSlice";
import { fetchAdultPatients, fetchPediatricPatients, AdultPatient, PediatricPatient } from "../store/slices/patientsSlice";
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
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@ui/select";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";
import ValueSelector from "@ui/ValueSelector";

interface StoolLabsModuleProps {
    activeLabSection?: string;
}

// Pre-defined options for stool fields
const stoolConsistencies = ["Formed", "Semi formed", "Loose"];
const absentPresentOptions = ["-ve", "+ve", "Absent", "Present"];
const stoolColours = ["Brown", "Pale", "Black", "Green", "Red"];
const stoolOdours = ["Normal", "Foul", "Pungent"];
const stoolWBCsRBCsOptions = ["0-10/HPF", "0-5/HPF", "Present", "Absent"];

export function StoolLabsModule({ activeLabSection }: StoolLabsModuleProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { stoolTests, loading, error } = useSelector((state: RootState) => state.labs);
    const { adultPatients, pediatricPatients } = useSelector((state: RootState) => state.patients);

    // Stool Test Dialog States
    const [isStoolDialogOpen, setIsStoolDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTestId, setEditingTestId] = useState<string | null>(null);

    const [stoolPatientName, setStoolPatientName] = useState("");
    const [stoolPatientId, setStoolPatientId] = useState("");
    const [selectedPatientCode, setSelectedPatientCode] = useState("");
    // Physical data
    const [stoolConsistency, setStoolConsistency] = useState("");
    const [stoolBlood, setStoolBlood] = useState("");
    const [stoolMucus, setStoolMucus] = useState("");
    const [stoolColor, setStoolColor] = useState("");
    const [stoolWorm, setStoolWorm] = useState("");
    const [stoolOdour, setStoolOdour] = useState("");
    // Microscopic data
    const [stoolFasciola, setStoolFasciola] = useState("");
    const [stoolSchMansoni, setStoolSchMansoni] = useState("");
    const [stoolHNana, setStoolHNana] = useState("");
    const [stoolTinea, setStoolTinea] = useState("");
    const [stoolAscaris, setStoolAscaris] = useState("");
    const [stoolTTrichuria, setStoolTTrichuria] = useState("");
    const [stoolHookWorm, setStoolHookWorm] = useState("");
    const [stoolEntrobious, setStoolEntrobious] = useState("");
    const [stoolEColi, setStoolEColi] = useState("");
    const [stoolEHistolitica, setStoolEHistolitica] = useState("");
    const [stoolGiardiaMicro, setStoolGiardiaMicro] = useState("");
    const [stoolStrongyloidesLarvae, setStoolStrongyloidesLarvae] = useState("");
    const [stoolGiardiaTrophozoite, setStoolGiardiaTrophozoite] = useState("");
    const [stoolEHistoliticaTrophozoite, setStoolEHistoliticaTrophozoite] = useState("");
    const [stoolBlastocystHominis, setStoolBlastocystHominis] = useState("");
    const [stoolCandidaAlbicans, setStoolCandidaAlbicans] = useState("");
    const [stoolWBCs, setStoolWBCs] = useState("");
    const [stoolRBCs, setStoolRBCs] = useState("");
    const [stoolHPylori, setStoolHPylori] = useState("");

    const [notes, setNotes] = useState("");
    const [technician, setTechnician] = useState("");
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchStoolLabTests());
    }, [dispatch]);

    useEffect(() => {
        if (isStoolDialogOpen) {
            dispatch(fetchAdultPatients({}));
            dispatch(fetchPediatricPatients({}));
        }
    }, [isStoolDialogOpen, dispatch]);

    const handlePatientSelect = (patientCode: string) => {
        const allPatients: Array<AdultPatient | PediatricPatient> = [...adultPatients, ...pediatricPatients];
        const patient = allPatients.find((p) => p.patientCode === patientCode);
        if (patient) {
            setSelectedPatientCode(patientCode);
            setStoolPatientId(patient.patientCode);
            setStoolPatientName(patient.patientName);
        }
    };

    const renderLabStatusBadge = (status: LabTest['status']) => {
        if (status === "in") return <Badge variant="default" className="bg-red-500 hover:bg-red-500">In</Badge>;
        if (status === "out") return <Badge variant="default" className="bg-green-500 hover:bg-green-500">Out</Badge>;
        if (status === "pending") return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-500">Pending</Badge>;
        if (status === "completed") return <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">Completed</Badge>;
        return null;
    };

    const handleStatusClick = async (test: LabTest) => {
        try {
            setUpdatingStatusId(test._id);
            const newStatus: LabTest['status'] = test.status === 'in' ? 'out' : 'in';
            await dispatch(updateLabTest({ id: test._id, testData: { status: newStatus } })).unwrap();
            toast.success(`Status updated to ${newStatus.toUpperCase()}`);
        } catch (error) {
            toast.error('Failed to update status', {
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const resetForm = () => {
        setStoolPatientName("");
        setStoolPatientId("");
        setSelectedPatientCode("");
        setStoolConsistency("");
        setStoolBlood("");
        setStoolMucus("");
        setStoolColor("");
        setStoolWorm("");
        setStoolOdour("");
        setStoolFasciola("");
        setStoolSchMansoni("");
        setStoolHNana("");
        setStoolTinea("");
        setStoolAscaris("");
        setStoolTTrichuria("");
        setStoolHookWorm("");
        setStoolEntrobious("");
        setStoolEColi("");
        setStoolEHistolitica("");
        setStoolGiardiaMicro("");
        setStoolStrongyloidesLarvae("");
        setStoolGiardiaTrophozoite("");
        setStoolEHistoliticaTrophozoite("");
        setStoolBlastocystHominis("");
        setStoolCandidaAlbicans("");
        setStoolWBCs("");
        setStoolRBCs("");
        setStoolHPylori("");
        setNotes("");
        setTechnician("");
        setIsEditing(false);
        setEditingTestId(null);
    };

    const handleSubmitStool = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stoolPatientId || !stoolPatientName) {
            toast.error('Patient ID and name are required');
            return;
        }

        const testData = {
            patientId: stoolPatientId,
            patientName: stoolPatientName,
            testType: 'stool' as const,
            stool: {
                consistency: stoolConsistency || undefined,
                blood: stoolBlood || undefined,
                mucus: stoolMucus || undefined,
                color: stoolColor || undefined,
                worm: stoolWorm || undefined,
                odour: stoolOdour || undefined,
                fasciola: stoolFasciola || undefined,
                schMansoni: stoolSchMansoni || undefined,
                hNana: stoolHNana || undefined,
                tinea: stoolTinea || undefined,
                ascaris: stoolAscaris || undefined,
                tTrichuria: stoolTTrichuria || undefined,
                hookWorm: stoolHookWorm || undefined,
                entrobious: stoolEntrobious || undefined,
                eColi: stoolEColi || undefined,
                eHistolitica: stoolEHistolitica || undefined,
                giardiaMicro: stoolGiardiaMicro || undefined,
                strongyloidesLarvae: stoolStrongyloidesLarvae || undefined,
                giardiaTrophozoite: stoolGiardiaTrophozoite || undefined,
                eHistoliticaTrophozoite: stoolEHistoliticaTrophozoite || undefined,
                blastocystHominis: stoolBlastocystHominis || undefined,
                candidaAlbicans: stoolCandidaAlbicans || undefined,
                WBCs: stoolWBCs || undefined,
                RBCs: stoolRBCs || undefined,
                HPylori: stoolHPylori || undefined,
            },
            notes: notes || undefined,
            technician: technician || undefined,
        };

        try {
            if (isEditing && editingTestId) {
                await dispatch(updateLabTest({ id: editingTestId, testData })).unwrap();
                toast.success('Stool test updated successfully');
            } else {
                await dispatch(createLabTest(testData)).unwrap();
                toast.success('Stool test added successfully');
            }
            setIsStoolDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'add'} stool test`, {
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };

    const handleViewPatientDetails = (test: LabTest) => {
        setStoolPatientId(test.patientId);
        setStoolPatientName(test.patientName);
        setSelectedPatientCode(test.patientId);

        setStoolConsistency(test.stool?.consistency || "");
        setStoolBlood(test.stool?.blood || "");
        setStoolMucus(test.stool?.mucus || "");
        setStoolColor(test.stool?.color || "");
        setStoolWorm(test.stool?.worm || "");
        setStoolOdour(test.stool?.odour || "");
        setStoolFasciola(test.stool?.fasciola || "");
        setStoolSchMansoni(test.stool?.schMansoni || "");
        setStoolHNana(test.stool?.hNana || "");
        setStoolTinea(test.stool?.tinea || "");
        setStoolAscaris(test.stool?.ascaris || "");
        setStoolTTrichuria(test.stool?.tTrichuria || "");
        setStoolHookWorm(test.stool?.hookWorm || "");
        setStoolEntrobious(test.stool?.entrobious || "");
        setStoolEColi(test.stool?.eColi || "");
        setStoolEHistolitica(test.stool?.eHistolitica || "");
        setStoolGiardiaMicro(test.stool?.giardiaMicro || "");
        setStoolStrongyloidesLarvae(test.stool?.strongyloidesLarvae || "");
        setStoolGiardiaTrophozoite(test.stool?.giardiaTrophozoite || "");
        setStoolEHistoliticaTrophozoite(test.stool?.eHistoliticaTrophozoite || "");
        setStoolBlastocystHominis(test.stool?.blastocystHominis || "");
        setStoolCandidaAlbicans(test.stool?.candidaAlbicans || "");
        setStoolWBCs(test.stool?.WBCs || "");
        setStoolRBCs(test.stool?.RBCs || "");
        setStoolHPylori(test.stool?.HPylori || "");

        setNotes(test.notes || "");
        setTechnician(test.technician || "");

        setIsEditing(true);
        setEditingTestId(test._id);
        setIsStoolDialogOpen(true);
    };

    const getDynamicLabColumns = () => {
        const commonColumns = [
            {
                key: 'patientId',
                header: 'Patient ID',
                width: 'w-24',
                render: (value: string) => (
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{value}</span>
                )
            },
            {
                key: 'patientName',
                header: 'Name',
                width: 'w-48',
                render: (value: string) => (
                    <span className="font-medium text-sm text-slate-900">{value}</span>
                )
            },
            {
                key: 'testDate',
                header: 'Test Date',
                width: 'w-32',
                render: (value: string) => (
                    <span className="text-sm text-slate-600">{new Date(value).toLocaleDateString()}</span>
                )
            },
            {
                key: 'status',
                header: 'Status',
                width: 'w-20 text-center',
                render: (value: LabTest['status'], row: LabTest) => (
                    <button
                        onClick={() => handleStatusClick(row)}
                        disabled={updatingStatusId === row._id}
                        className="cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Click to toggle between In/Out"
                    >
                        {updatingStatusId === row._id ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                            renderLabStatusBadge(value)
                        )}
                    </button>
                )
            },
            {
                key: 'actions',
                header: 'Actions',
                width: 'w-20',
                render: (_value: any, row: LabTest) => (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatientDetails(row)}
                        className="h-8 px-2"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                )
            },
        ];

        return commonColumns;
    };

    const labColumns = getDynamicLabColumns();

    const getLabSectionTitle = (section: string | undefined) => {
        if (!section || section === "labs") {
            return "Labs";
        }
        const sectionName = section.replace("labs-", "").replace(/_/g, ' ');
        return `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Lab`;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading stool lab tests...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => dispatch(fetchStoolLabTests())}>
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{getLabSectionTitle(activeLabSection)}</CardTitle>
                <Dialog open={isStoolDialogOpen} onOpenChange={setIsStoolDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto" onClick={() => { resetForm(); setIsStoolDialogOpen(true); }}>Add Patient to Stool Lab</Button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Stool Lab Test' : 'Add Patient to Stool Lab'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update the patient\'s stool lab test results.' : 'Enter patient details and assign their stool lab status.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitStool}>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="patient-select" className="text-left w-40">
                                        Select Patient
                                    </Label>
                                    <Select value={selectedPatientCode} onValueChange={handlePatientSelect}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Choose a patient..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...adultPatients, ...pediatricPatients].map((patient) => (
                                                <SelectItem key={patient.patientCode} value={patient.patientCode}>
                                                    {patient.patientCode} - {patient.patientName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label htmlFor="stool-patient-name" className="text-left w-40">
                                        Patient Name
                                    </Label>
                                    <Input
                                        id="stool-patient-name"
                                        value={stoolPatientName}
                                        onChange={(e) => setStoolPatientName(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label htmlFor="stool-patient-id" className="text-left w-40">
                                        Patient ID
                                    </Label>
                                    <Input
                                        id="stool-patient-id"
                                        value={stoolPatientId}
                                        onChange={(e) => setStoolPatientId(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Consistency</Label>
                                    <Select value={stoolConsistency} onValueChange={setStoolConsistency}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select consistency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stoolConsistencies.map((consistency) => (
                                                <SelectItem key={consistency} value={consistency}>{consistency}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Blood</Label>
                                    <Select value={stoolBlood} onValueChange={setStoolBlood}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select blood status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentPresentOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Mucus</Label>
                                    <Select value={stoolMucus} onValueChange={setStoolMucus}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select mucus status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentPresentOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Color</Label>
                                    <Select value={stoolColor} onValueChange={setStoolColor}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stoolColours.map((color) => (
                                                <SelectItem key={color} value={color}>{color}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Worm</Label>
                                    <Select value={stoolWorm} onValueChange={setStoolWorm}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select worm status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentPresentOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Odour</Label>
                                    <Select value={stoolOdour} onValueChange={setStoolOdour}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select odour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stoolOdours.map((odour) => (
                                                <SelectItem key={odour} value={odour}>{odour}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Fasciola</Label>
                                    <ValueSelector
                                        value={stoolFasciola}
                                        onValueChange={setStoolFasciola}
                                        className="flex-1"
                                        groupName="stool-fasciola"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Sch. Mansoni</Label>
                                    <ValueSelector
                                        value={stoolSchMansoni}
                                        onValueChange={setStoolSchMansoni}
                                        className="flex-1"
                                        groupName="stool-sch-mansoni"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">H. Nana</Label>
                                    <ValueSelector
                                        value={stoolHNana}
                                        onValueChange={setStoolHNana}
                                        className="flex-1"
                                        groupName="stool-h-nana"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Tinea</Label>
                                    <ValueSelector
                                        value={stoolTinea}
                                        onValueChange={setStoolTinea}
                                        className="flex-1"
                                        groupName="stool-tinea"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Ascaris</Label>
                                    <ValueSelector
                                        value={stoolAscaris}
                                        onValueChange={setStoolAscaris}
                                        className="flex-1"
                                        groupName="stool-ascaris"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">T. Trichuria</Label>
                                    <ValueSelector
                                        value={stoolTTrichuria}
                                        onValueChange={setStoolTTrichuria}
                                        className="flex-1"
                                        groupName="stool-t-trichuria"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Hook Worm</Label>
                                    <ValueSelector
                                        value={stoolHookWorm}
                                        onValueChange={setStoolHookWorm}
                                        className="flex-1"
                                        groupName="stool-hook-worm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Entrobious</Label>
                                    <ValueSelector
                                        value={stoolEntrobious}
                                        onValueChange={setStoolEntrobious}
                                        className="flex-1"
                                        groupName="stool-entrobious"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">E. Coli</Label>
                                    <ValueSelector
                                        value={stoolEColi}
                                        onValueChange={setStoolEColi}
                                        className="flex-1"
                                        groupName="stool-e-coli"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">E. Histolitica</Label>
                                    <ValueSelector
                                        value={stoolEHistolitica}
                                        onValueChange={setStoolEHistolitica}
                                        className="flex-1"
                                        groupName="stool-e-histolitica"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Giardia Micro</Label>
                                    <ValueSelector
                                        value={stoolGiardiaMicro}
                                        onValueChange={setStoolGiardiaMicro}
                                        className="flex-1"
                                        groupName="stool-giardia-micro"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Strongyloides Larvae</Label>
                                    <ValueSelector
                                        value={stoolStrongyloidesLarvae}
                                        onValueChange={setStoolStrongyloidesLarvae}
                                        className="flex-1"
                                        groupName="stool-strongyloides-larvae"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Giardia Trophozoite</Label>
                                    <ValueSelector
                                        value={stoolGiardiaTrophozoite}
                                        onValueChange={setStoolGiardiaTrophozoite}
                                        className="flex-1"
                                        groupName="stool-giardia-trophozoite"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">E. Histolitica Trophozoite</Label>
                                    <ValueSelector
                                        value={stoolEHistoliticaTrophozoite}
                                        onValueChange={setStoolEHistoliticaTrophozoite}
                                        className="flex-1"
                                        groupName="stool-e-histolitica-trophozoite"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Blastocyst Hominis</Label>
                                    <ValueSelector
                                        value={stoolBlastocystHominis}
                                        onValueChange={setStoolBlastocystHominis}
                                        className="flex-1"
                                        groupName="stool-blastocyst-hominis"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Candida Albicans</Label>
                                    <ValueSelector
                                        value={stoolCandidaAlbicans}
                                        onValueChange={setStoolCandidaAlbicans}
                                        className="flex-1"
                                        groupName="stool-candida-albicans"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">WBCs</Label>
                                    <ValueSelector
                                        value={stoolWBCs}
                                        onValueChange={setStoolWBCs}
                                        className="flex-1"
                                        groupName="stool-wbcs"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">RBCs</Label>
                                    <ValueSelector
                                        value={stoolRBCs}
                                        onValueChange={setStoolRBCs}
                                        className="flex-1"
                                        groupName="stool-rbcs"
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4">
                                        <Label className="text-left w-40">Notes</Label>
                                        <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Label className="text-left w-40">Technician</Label>
                                        <Input value={technician} onChange={(e) => setTechnician(e.target.value)} className="flex-1" />
                                    </div>
                                </div>

                            </div>
                            <DialogFooter>
                                <Button type="submit">{isEditing ? 'Update Stool Test' : 'Save Stool Test'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={labColumns} data={stoolTests} />
            </CardContent>
        </Card>
    );
}
