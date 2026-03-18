import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBloodLabTests, createLabTest, updateLabTest, LabTest } from "../store/slices/labsSlice";
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
import { Separator } from "@ui/separator";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";


interface BloodLabsModuleProps {
    activeLabSection?: string;
}

// Helper options for common results
const defaultBloodResultOptions = ["Normal", "Abnormal", "Not Done"];
const absentPresentOptions = ["-ve", "+ve", "Absent", "Present", "Not Done"];

export function BloodLabsModule({ activeLabSection }: BloodLabsModuleProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { bloodTests, loading, error } = useSelector((state: RootState) => state.labs);
    const { adultPatients, pediatricPatients, loading: patientsLoading } = useSelector((state: RootState) => state.patients);
    const [isBloodDialogOpen, setIsBloodDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTestId, setEditingTestId] = useState<string | null>(null);
    const [bloodPatientName, setBloodPatientName] = useState("");
    const [bloodPatientId, setBloodPatientId] = useState("");
    const [selectedPatientCode, setSelectedPatientCode] = useState("");

    // Test name
    const [cbc, setCbc] = useState("");
    const [esr, setEsr] = useState("");
    const [wbcs, setWbcs] = useState("");
    const [lymphocytesHash, setLymphocytesHash] = useState("");
    const [midRangeHash, setMidRangeHash] = useState("");
    const [granulocytesHash, setGranulocytesHash] = useState("");
    const [lymphocytesPercentage, setLymphocytesPercentage] = useState("");
    const [midRangePercentage, setMidRangePercentage] = useState("");
    const [granulocytesPercentage, setGranulocytesPercentage] = useState("");
    const [rbcs, setRbcs] = useState("");
    const [hemoglobin, setHemoglobin] = useState("");
    const [hematocrit, setHematocrit] = useState("");
    const [mcv, setMcv] = useState("");
    const [mch, setMch] = useState("");
    const [mchc, setMchc] = useState("");
    const [rdwCv, setRdwCv] = useState("");
    const [rdwSd, setRdwSd] = useState("");
    const [platelets, setPlatelets] = useState("");
    const [mpv, setMpv] = useState("");
    const [pdw, setPdw] = useState("");
    const [pct, setPct] = useState("");
    const [pLcc, setPLcc] = useState("");
    const [pLcr, setPLcr] = useState("");

    // Liver Function tests
    const [altGpt, setAltGpt] = useState("");
    const [astGot, setAstGot] = useState("");
    const [alkalinePhosphatase, setAlkalinePhosphatase] = useState("");
    const [albumin, setAlbumin] = useState("");
    const [totalBilirubin, setTotalBilirubin] = useState("");
    const [directBilirubin, setDirectBilirubin] = useState("");

    // Coagulation Tests
    const [ptInr, setPtInr] = useState("");
    const [ptTime, setPtTime] = useState("");
    const [ptPercentage, setPtPercentage] = useState("");
    const [ptt, setPtt] = useState("");

    // Kidney Function Tests
    const [creatinine, setCreatinine] = useState("");
    const [urea, setUrea] = useState("");
    const [uricAcid, setUricAcid] = useState("");

    // Lipid Profile
    const [cholesterol, setCholesterol] = useState("");
    const [tg, setTg] = useState("");
    const [hdl, setHdl] = useState("");
    const [ldl, setLdl] = useState("");

    // Ions
    const [kPlus, setKPlus] = useState("");
    const [caPlusPlus, setCaPlusPlus] = useState("");
    const [naPlus, setNaPlus] = useState("");

    // Glucose
    const [glucoseRandom, setGlucoseRandom] = useState("");
    const [glucoseFasting, setGlucoseFasting] = useState("");
    const [glucosePostPrandial, setGlucosePostPrandial] = useState("");
    const [hba1c, setHba1c] = useState("");

    // Others
    const [hbv, setHbv] = useState("");
    const [hcv, setHcv] = useState("");
    const [alfaFetoprotein, setAlfaFetoprotein] = useState("");
    const [psa, setPsa] = useState("");
    const [bHcg, setBHcg] = useState("");
    const [antiD, setAntiD] = useState("");
    const [rheumatoidFactor, setRheumatoidFactor] = useState("");
    const [asot, setAsot] = useState("");
    const [crp, setCrp] = useState("");
    const [notes, setNotes] = useState("");
    const [technician, setTechnician] = useState("");

    const handleSubmitBlood = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!bloodPatientId || !bloodPatientName) {
            toast.error('Patient ID and name are required');
            return;
        }

        const testData = {
            patientId: bloodPatientId,
            patientName: bloodPatientName,
            testType: 'blood' as const,
            CBC: {
                WBCs: wbcs ? parseFloat(wbcs) : undefined,
                lymphocytes: lymphocytesHash ? parseFloat(lymphocytesHash) : undefined,
                lymphocytesPercentage: lymphocytesPercentage ? parseFloat(lymphocytesPercentage) : undefined,
                midRange: midRangeHash ? parseFloat(midRangeHash) : undefined,
                midRangePercentage: midRangePercentage ? parseFloat(midRangePercentage) : undefined,
                granulocytes: granulocytesHash ? parseFloat(granulocytesHash) : undefined,
                granulocytesPercentage: granulocytesPercentage ? parseFloat(granulocytesPercentage) : undefined,
                RBCs: rbcs ? parseFloat(rbcs) : undefined,
                hemoglobin: hemoglobin ? parseFloat(hemoglobin) : undefined,
                hematocrit: hematocrit ? parseFloat(hematocrit) : undefined,
                MCV: mcv ? parseFloat(mcv) : undefined,
                MCH: mch ? parseFloat(mch) : undefined,
                MCHC: mchc ? parseFloat(mchc) : undefined,
                RDW_CV: rdwCv ? parseFloat(rdwCv) : undefined,
                RDW_SD: rdwSd ? parseFloat(rdwSd) : undefined,
                platelets: platelets ? parseFloat(platelets) : undefined,
                MPV: mpv ? parseFloat(mpv) : undefined,
                PDW: pdw ? parseFloat(pdw) : undefined,
                PCT: pct ? parseFloat(pct) : undefined,
                ESR: esr ? parseFloat(esr) : undefined,
                PLCC: pLcc ? parseFloat(pLcc) : undefined,
                PLCR: pLcr ? parseFloat(pLcr) : undefined,
            },
            liverFunction: {
                ALT: altGpt ? parseFloat(altGpt) : undefined,
                AST: astGot ? parseFloat(astGot) : undefined,
                alkalinePhosphatase: alkalinePhosphatase ? parseFloat(alkalinePhosphatase) : undefined,
                totalBilirubin: totalBilirubin ? parseFloat(totalBilirubin) : undefined,
                directBilirubin: directBilirubin ? parseFloat(directBilirubin) : undefined,
                albumin: albumin ? parseFloat(albumin) : undefined,
            },
            coagulation: {
                PTInr: ptInr ? parseFloat(ptInr) : undefined,
                PTTime: ptTime ? parseFloat(ptTime) : undefined,
                PTPercentage: ptPercentage ? parseFloat(ptPercentage) : undefined,
                PTT: ptt ? parseFloat(ptt) : undefined,
            },
            kidneyFunction: {
                creatinine: creatinine ? parseFloat(creatinine) : undefined,
                urea: urea ? parseFloat(urea) : undefined,
                uricAcid: uricAcid ? parseFloat(uricAcid) : undefined,
            },
            lipidProfile: {
                cholesterol: cholesterol ? parseFloat(cholesterol) : undefined,
                triglycerides: tg ? parseFloat(tg) : undefined,
                HDL: hdl ? parseFloat(hdl) : undefined,
                LDL: ldl ? parseFloat(ldl) : undefined,
            },
            electrolytes: {
                potassium: kPlus ? parseFloat(kPlus) : undefined,
                calcium: caPlusPlus ? parseFloat(caPlusPlus) : undefined,
                sodium: naPlus ? parseFloat(naPlus) : undefined,
            },
            glucose: {
                random: glucoseRandom ? parseFloat(glucoseRandom) : undefined,
                fasting: glucoseFasting ? parseFloat(glucoseFasting) : undefined,
                postPrandial: glucosePostPrandial ? parseFloat(glucosePostPrandial) : undefined,
                HbA1C: hba1c ? parseFloat(hba1c) : undefined,
            },
            serology: {
                HBV: hbv || undefined,
                HCV: hcv || undefined,
                alphaFetoprotein: alfaFetoprotein ? parseFloat(alfaFetoprotein) : undefined,
                PSA: psa ? parseFloat(psa) : undefined,
                betaHCG: bHcg ? parseFloat(bHcg) : undefined,
                antiD: antiD || undefined,
            },
            inflammatory: {
                rheumatoidFactor: rheumatoidFactor ? parseFloat(rheumatoidFactor) : undefined,
                ASOT: asot ? parseFloat(asot) : undefined,
                CRP: crp ? parseFloat(crp) : undefined,
            },
            notes: notes || undefined,
            technician: technician || undefined,
        };

        try {
            if (isEditing && editingTestId) {
                await dispatch(updateLabTest({ id: editingTestId, testData })).unwrap();
                toast.success('Blood test updated successfully');
            } else {
                await dispatch(createLabTest(testData)).unwrap();
                toast.success('Blood test added successfully');
            }
            setIsBloodDialogOpen(false);
            // Reset form
            resetForm();
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'add'} blood test`, {
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };

    const resetForm = () => {
        setBloodPatientName("");
        setBloodPatientId("");
        setSelectedPatientCode("");
        setWbcs("");
        setEsr("");
        setLymphocytesHash("");
        setLymphocytesPercentage("");
        setMidRangeHash("");
        setMidRangePercentage("");
        setGranulocytesHash("");
        setGranulocytesPercentage("");
        setRbcs("");
        setHemoglobin("");
        setHematocrit("");
        setMcv("");
        setMch("");
        setMchc("");
        setRdwCv("");
        setRdwSd("");
        setPlatelets("");
        setMpv("");
        setPdw("");
        setPct("");
        setPLcc("");
        setPLcr("");
        setAltGpt("");
        setAstGot("");
        setAlkalinePhosphatase("");
        setAlbumin("");
        setTotalBilirubin("");
        setDirectBilirubin("");
        setPtInr("");
        setPtTime("");
        setPtPercentage("");
        setPtt("");
        setCreatinine("");
        setUrea("");
        setUricAcid("");
        setCholesterol("");
        setTg("");
        setHdl("");
        setLdl("");
        setKPlus("");
        setCaPlusPlus("");
        setNaPlus("");
        setGlucoseRandom("");
        setGlucoseFasting("");
        setGlucosePostPrandial("");
        setHba1c("");
        setHbv("");
        setHcv("");
        setAlfaFetoprotein("");
        setPsa("");
        setBHcg("");
        setAntiD("");
        setRheumatoidFactor("");
        setAsot("");
        setCrp("");
        setNotes("");
        setTechnician("");
        setIsEditing(false);
        setEditingTestId(null);
    };

    const handlePatientSelect = (patientCode: string) => {
        const allPatients = [...adultPatients, ...pediatricPatients];
        const patient = allPatients.find(p => p.patientCode === patientCode);
        if (patient) {
            setSelectedPatientCode(patientCode);
            setBloodPatientId(patient.patientCode);
            setBloodPatientName(patient.patientName);
        }
    };

    // Fetch blood tests on component mount
    useEffect(() => {
        dispatch(fetchBloodLabTests());
    }, [dispatch]);

    // Fetch patients when dialog opens
    useEffect(() => {
        if (isBloodDialogOpen) {
            dispatch(fetchAdultPatients({}));
            dispatch(fetchPediatricPatients({}));
        }
    }, [isBloodDialogOpen, dispatch]);

    const renderLabStatusBadge = (status: LabTest['status']) => {
        if (status === "in") {
            return <Badge variant="default" className="bg-red-500 hover:bg-red-500">In</Badge>;
        }
        if (status === "out") {
            return <Badge variant="default" className="bg-green-500 hover:bg-green-500">Out</Badge>;
        }
        if (status === "pending") {
            return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-500">Pending</Badge>;
        }
        if (status === "completed") {
            return <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">Completed</Badge>;
        }
        return null;
    };

    const handleViewPatientDetails = (test: LabTest) => {
        // Populate form fields with existing test data
        setBloodPatientId(test.patientId);
        setBloodPatientName(test.patientName);
        setSelectedPatientCode(test.patientId);

        // CBC fields
        setWbcs(test.CBC?.WBCs?.toString() || "");
        setLymphocytesHash(test.CBC?.lymphocytes?.toString() || "");
        setLymphocytesPercentage(test.CBC?.lymphocytesPercentage?.toString() || "");
        setMidRangeHash(test.CBC?.midRange?.toString() || "");
        setMidRangePercentage(test.CBC?.midRangePercentage?.toString() || "");
        setGranulocytesHash(test.CBC?.granulocytes?.toString() || "");
        setGranulocytesPercentage(test.CBC?.granulocytesPercentage?.toString() || "");
        setRbcs(test.CBC?.RBCs?.toString() || "");
        setHemoglobin(test.CBC?.hemoglobin?.toString() || "");
        setHematocrit(test.CBC?.hematocrit?.toString() || "");
        setMcv(test.CBC?.MCV?.toString() || "");
        setMch(test.CBC?.MCH?.toString() || "");
        setMchc(test.CBC?.MCHC?.toString() || "");
        setRdwCv(test.CBC?.RDW_CV?.toString() || "");
        setRdwSd(test.CBC?.RDW_SD?.toString() || "");
        setPlatelets(test.CBC?.platelets?.toString() || "");
        setMpv(test.CBC?.MPV?.toString() || "");
        setPdw(test.CBC?.PDW?.toString() || "");
        setPct(test.CBC?.PCT?.toString() || "");
        setEsr(test.CBC?.ESR?.toString() || "");
        setPLcc(test.CBC?.PLCC?.toString() || "");
        setPLcr(test.CBC?.PLCR?.toString() || "");

        // Liver Function fields
        setAltGpt(test.liverFunction?.ALT?.toString() || "");
        setAstGot(test.liverFunction?.AST?.toString() || "");
        setAlkalinePhosphatase(test.liverFunction?.alkalinePhosphatase?.toString() || "");
        setAlbumin(test.liverFunction?.albumin?.toString() || "");
        setTotalBilirubin(test.liverFunction?.totalBilirubin?.toString() || "");
        setDirectBilirubin(test.liverFunction?.directBilirubin?.toString() || "");

        // Coagulation fields
        setPtInr(test.coagulation?.PTInr?.toString() || "");
        setPtTime(test.coagulation?.PTTime?.toString() || "");
        setPtPercentage(test.coagulation?.PTPercentage?.toString() || "");
        setPtt(test.coagulation?.PTT?.toString() || "");

        // Kidney Function fields
        setCreatinine(test.kidneyFunction?.creatinine?.toString() || "");
        setUrea(test.kidneyFunction?.urea?.toString() || "");
        setUricAcid(test.kidneyFunction?.uricAcid?.toString() || "");

        // Lipid Profile fields
        setCholesterol(test.lipidProfile?.cholesterol?.toString() || "");
        setTg(test.lipidProfile?.triglycerides?.toString() || "");
        setHdl(test.lipidProfile?.HDL?.toString() || "");
        setLdl(test.lipidProfile?.LDL?.toString() || "");

        // Electrolytes fields
        setKPlus(test.electrolytes?.potassium?.toString() || "");
        setCaPlusPlus(test.electrolytes?.calcium?.toString() || "");
        setNaPlus(test.electrolytes?.sodium?.toString() || "");

        // Glucose fields
        setGlucoseRandom(test.glucose?.random?.toString() || "");
        setGlucoseFasting(test.glucose?.fasting?.toString() || "");
        setGlucosePostPrandial(test.glucose?.postPrandial?.toString() || "");
        setHba1c(test.glucose?.HbA1C?.toString() || "");

        // Serology fields
        setHbv(test.serology?.HBV || "");
        setHcv(test.serology?.HCV || "");
        setAlfaFetoprotein(test.serology?.alphaFetoprotein?.toString() || "");
        setPsa(test.serology?.PSA?.toString() || "");
        setBHcg(test.serology?.betaHCG?.toString() || "");
        setAntiD(test.serology?.antiD || "");

        // Inflammatory fields
        setRheumatoidFactor(test.inflammatory?.rheumatoidFactor?.toString() || "");
        setAsot(test.inflammatory?.ASOT?.toString() || "");
        setCrp(test.inflammatory?.CRP?.toString() || "");

        // Additional fields
        setNotes(test.notes || "");
        setTechnician(test.technician || "");

        // Set editing state
        setIsEditing(true);
        setEditingTestId(test._id);
        setIsBloodDialogOpen(true);
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
                render: (value: LabTest['status']) => renderLabStatusBadge(value)
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

    // Loading state
    if (loading) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading blood lab tests...</p>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => dispatch(fetchBloodLabTests())}>
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
                <Dialog open={isBloodDialogOpen} onOpenChange={setIsBloodDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto" onClick={() => { resetForm(); setIsBloodDialogOpen(true); }}>Add Patient to Blood Lab</Button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Blood Lab Test' : 'Add Patient to Blood Lab'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update the patient\'s blood lab test results.' : 'Enter patient details and assign their blood lab status.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitBlood}>
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
                                    <Label htmlFor="blood-patient-name" className="text-left w-40">
                                        Patient Name
                                    </Label>
                                    <Input
                                        id="blood-patient-name"
                                        value={bloodPatientName}
                                        onChange={(e) => setBloodPatientName(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label htmlFor="blood-patient-id" className="text-left w-40">
                                        Patient ID
                                    </Label>
                                    <Input
                                        id="blood-patient-id"
                                        value={bloodPatientId}
                                        onChange={(e) => setBloodPatientId(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>

                                
                                <div className="h-px bg-slate-200 my-6" />

                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Complete Blood Count (CBC)</h3>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">WBCs</Label>



                                    <Input value={wbcs} onChange={(e) => setWbcs(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Lymphocytes Hash</Label>



                                    <Input value={lymphocytesHash} onChange={(e) => setLymphocytesHash(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Mid-range Hash</Label>



                                    <Input value={midRangeHash} onChange={(e) => setMidRangeHash(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Granulocytes Hash</Label>



                                    <Input value={granulocytesHash} onChange={(e) => setGranulocytesHash(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Lymphocytes Percentage</Label>



                                    <Input
                                        type="number"
                                        value={lymphocytesPercentage}
                                        onChange={(e) => setLymphocytesPercentage(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter percentage"
                                    />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Mid-range Percentage</Label>



                                    <Input
                                        type="number"
                                        value={midRangePercentage}
                                        onChange={(e) => setMidRangePercentage(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter percentage"
                                    />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Granulocytes Percentage</Label>



                                    <Input
                                        type="number"
                                        value={granulocytesPercentage}
                                        onChange={(e) => setGranulocytesPercentage(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter percentage"
                                    />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">RBCs</Label>



                                    <Input value={rbcs} onChange={(e) => setRbcs(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Hemoglobin</Label>



                                    <Input value={hemoglobin} onChange={(e) => setHemoglobin(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Hematocrit</Label>



                                    <Input value={hematocrit} onChange={(e) => setHematocrit(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">MCV</Label>



                                    <Input value={mcv} onChange={(e) => setMcv(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">MCH</Label>



                                    <Input value={mch} onChange={(e) => setMch(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">MCHC</Label>



                                    <Input value={mchc} onChange={(e) => setMchc(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">RDW-CV</Label>



                                    <Input value={rdwCv} onChange={(e) => setRdwCv(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">RDW-SD</Label>



                                    <Input value={rdwSd} onChange={(e) => setRdwSd(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Platelets</Label>



                                    <Input value={platelets} onChange={(e) => setPlatelets(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">MPV</Label>



                                    <Input value={mpv} onChange={(e) => setMpv(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">PDW</Label>



                                    <Input value={pdw} onChange={(e) => setPdw(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">PCT</Label>



                                    <Input value={pct} onChange={(e) => setPct(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">P-LCC</Label>



                                    <Input value={pLcc} onChange={(e) => setPLcc(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">P-LCR</Label>



                                    <Input value={pLcr} onChange={(e) => setPLcr(e.target.value)} className="flex-1" />



                                </div>







                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">ESR</Label>



                                    <Input
                                        type="number"
                                        value={esr}
                                        onChange={(e) => setEsr(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />



                                </div>

                                {/* Liver Function tests */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Liver Function Tests</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">ALT(GPT)</Label>
                                    <Input value={altGpt} onChange={(e) => setAltGpt(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">AST(GOT)</Label>
                                    <Input value={astGot} onChange={(e) => setAstGot(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Alkaline phosphatase</Label>
                                    <Input value={alkalinePhosphatase} onChange={(e) => setAlkalinePhosphatase(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Albumin</Label>
                                    <Input value={albumin} onChange={(e) => setAlbumin(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Total bilirubin</Label>
                                    <Input value={totalBilirubin} onChange={(e) => setTotalBilirubin(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Direct bilirubin</Label>
                                    <Input value={directBilirubin} onChange={(e) => setDirectBilirubin(e.target.value)} className="flex-1" />
                                </div>

                                {/* Coagulation Tests */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Coagulation Tests</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PT: INR</Label>
                                    <Input value={ptInr} onChange={(e) => setPtInr(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PT: Time</Label>
                                    <Input value={ptTime} onChange={(e) => setPtTime(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PT: %</Label>
                                    <Input value={ptPercentage} onChange={(e) => setPtPercentage(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PTT</Label>
                                    <Input value={ptt} onChange={(e) => setPtt(e.target.value)} className="flex-1" />
                                </div>

                                {/* Kidney Function Tests */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Kidney Function Tests</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Creatinine</Label>
                                    <Input value={creatinine} onChange={(e) => setCreatinine(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Urea</Label>
                                    <Input value={urea} onChange={(e) => setUrea(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Uric acid</Label>
                                    <Input value={uricAcid} onChange={(e) => setUricAcid(e.target.value)} className="flex-1" />
                                </div>

                                {/* Lipid Profile */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Lipid Profile</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Cholesterol</Label>
                                    <Input value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">TG</Label>
                                    <Input value={tg} onChange={(e) => setTg(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">HDL</Label>
                                    <Input value={hdl} onChange={(e) => setHdl(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">LDL</Label>
                                    <Input value={ldl} onChange={(e) => setLdl(e.target.value)} className="flex-1" />
                                </div>

                                {/* Ions */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Ions</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">K+</Label>
                                    <Input value={kPlus} onChange={(e) => setKPlus(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Ca++</Label>
                                    <Input value={caPlusPlus} onChange={(e) => setCaPlusPlus(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Na+</Label>
                                    <Input value={naPlus} onChange={(e) => setNaPlus(e.target.value)} className="flex-1" />
                                </div>

                                {/* Glucose */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Glucose</h3>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Random</Label>
                                    <Input value={glucoseRandom} onChange={(e) => setGlucoseRandom(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Fasting</Label>
                                    <Input value={glucoseFasting} onChange={(e) => setGlucoseFasting(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Post Prandial</Label>
                                    <Input value={glucosePostPrandial} onChange={(e) => setGlucosePostPrandial(e.target.value)} className="flex-1" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">HbA1C</Label>
                                    <Input value={hba1c} onChange={(e) => setHba1c(e.target.value)} className="flex-1" />
                                </div>

                                {/* Others */}
                                <div className="h-px bg-slate-200 my-6" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Others</h3>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">HBV</Label>
                                    <RadioGroup
                                        value={hbv}
                                        onValueChange={setHbv}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="hbv-status-default" />
                                                <Label htmlFor="hbv-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="hbv-status-positive" />
                                                <Label htmlFor="hbv-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="hbv-status-negative" />
                                                <Label htmlFor="hbv-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">HCV</Label>
                                    <RadioGroup
                                        value={hcv}
                                        onValueChange={setHcv}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="hcv-status-default" />
                                                <Label htmlFor="hcv-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="hcv-status-positive" />
                                                <Label htmlFor="hcv-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="hcv-status-negative" />
                                                <Label htmlFor="hcv-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Alfa fetoprotein</Label>
                                    <Input
                                        type="number"
                                        value={alfaFetoprotein}
                                        onChange={(e) => setAlfaFetoprotein(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PSA</Label>
                                    <Input
                                        type="number"
                                        value={psa}
                                        onChange={(e) => setPsa(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">B HCG</Label>
                                    <Input
                                        type="number"
                                        value={bHcg}
                                        onChange={(e) => setBHcg(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Anti D</Label>
                                    <RadioGroup
                                        value={antiD}
                                        onValueChange={setAntiD}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="antiD-status-default" />
                                                <Label htmlFor="antiD-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="antiD-status-positive" />
                                                <Label htmlFor="antiD-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="antiD-status-negative" />
                                                <Label htmlFor="antiD-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Rheumatoid factor</Label>
                                    <Input
                                        type="number"
                                        value={rheumatoidFactor}
                                        onChange={(e) => setRheumatoidFactor(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">ASOT</Label>
                                    <Input
                                        type="number"
                                        value={asot}
                                        onChange={(e) => setAsot(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">CRP</Label>
                                    <Input
                                        type="number"
                                        value={crp}
                                        onChange={(e) => setCrp(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter value"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Notes</Label>
                                    <Input
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter notes"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Technician</Label>
                                    <Input
                                        value={technician}
                                        onChange={(e) => setTechnician(e.target.value)}
                                        className="flex-1"
                                        placeholder="Enter technician name"
                                    />
                                </div>

                                <Separator className="my-4" /> {/* <--- NEW SEPARATOR */}
                            </div>
                            <DialogFooter>
                                <Button type="submit">{isEditing ? 'Update Test' : 'Add Test'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={labColumns} data={bloodTests} />
            </CardContent>
        </Card>
    );
}
