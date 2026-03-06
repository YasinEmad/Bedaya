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
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@ui/select";
import { Separator } from "@ui/separator";


interface BloodLabsModuleProps {
    activeLabSection?: string;
}

// Helper options for common results
const defaultBloodResultOptions = ["Normal", "Abnormal", "Not Done"];
const absentPresentOptions = ["-ve", "+ve", "Absent", "Present", "Not Done"];

export function BloodLabsModule({ activeLabSection }: BloodLabsModuleProps) {
    const [isBloodDialogOpen, setIsBloodDialogOpen] = useState(false);
    const [bloodPatientName, setBloodPatientName] = useState("");

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

    const handleSubmitBlood = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Adding patient to blood lab:", {
            patientName: bloodPatientName,
            wbcs, lymphocytesHash, midRangeHash, granulocytesHash,
            lymphocytesPercentage, midRangePercentage, granulocytesPercentage,
            rbcs, hemoglobin, hematocrit, mcv, mch, mchc, rdwCv, rdwSd,
            platelets, mpv, pdw, pct, pLcc, pLcr, esr,
            altGpt, astGot, alkalinePhosphatase, albumin, totalBilirubin, directBilirubin,
            ptInr, ptTime, ptPercentage, ptt,
            creatinine, urea, uricAcid,
            cholesterol, tg, hdl, ldl,
            kPlus, caPlusPlus, naPlus,
            glucoseRandom, glucoseFasting, glucosePostPrandial, hba1c,
            hbv, hcv, alfaFetoprotein, psa, bHcg, antiD, rheumatoidFactor, asot, crp
        });
        setIsBloodDialogOpen(false);
        // Reset all states
        setBloodPatientName("");
        setWbcs(""); setLymphocytesHash(""); setMidRangeHash(""); setGranulocytesHash("");
        setLymphocytesPercentage(""); setMidRangePercentage(""); setGranulocytesPercentage("");
        setRbcs(""); setHemoglobin(""); setHematocrit(""); setMcv(""); setMch(""); setMchc(""); setRdwCv(""); setRdwSd("");
        setPlatelets(""); setMpv(""); setPdw(""); setPct(""); setPLcc(""); setPLcr(""); setEsr("");
        setAltGpt(""); setAstGot(""); setAlkalinePhosphatase(""); setAlbumin(""); setTotalBilirubin(""); setDirectBilirubin("");
        setPtInr(""); setPtTime(""); setPtPercentage(""); setPtt("");
        setCreatinine(""); setUrea(""); setUricAcid("");
        setCholesterol(""); setTg(""); setHdl(""); setLdl("");
        setKPlus(""); setCaPlusPlus(""); setNaPlus("");
        setGlucoseRandom(""); setGlucoseFasting(""); setGlucosePostPrandial(""); setHba1c("");
        setHbv(""); setHcv(""); setAlfaFetoprotein(""); setPsa(""); setBHcg(""); setAntiD(""); setRheumatoidFactor(""); setAsot(""); setCrp("");
    };

    const renderLabStatusBadge = (value: "empty" | "in" | "out") => {
        if (value === "in") {
            return <Badge variant="default" className="bg-red-500 hover:bg-red-500">In</Badge>;
        }
        if (value === "out") {
            return <Badge variant="default" className="bg-green-500 hover:bg-green-500">Out</Badge>;
        }
        return null;
    };

    const generatePatients = () => {
        const firstNames = ["Maria", "John", "Sarah", "Ahmed", "Emma", "David", "Lisa", "Robert", "Anna", "Michael", "Elena", "James", "Sofia", "Daniel", "Carmen"];
        const lastNames = ["Rodriguez", "Smith", "Johnson", "Hassan", "Wilson", "Brown", "Garcia", "Lee", "Martinez", "Taylor", "Anderson", "Thompson", "White", "Martin", "Clark"];

        const getRandomLabStatus = () => {
            const statuses = ["empty", "in", "out"];
            return statuses[Math.floor(Math.random() * statuses.length)];
        };

        const patients = [];
        for (let i = 1; i <= 200; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            const bloodStatus = getRandomLabStatus();

            patients.push({
                id: `P${String(i).padStart(3, '0')}`,
                name: `${firstName} ${lastName}`,
                blood: bloodStatus,
            });
        }
        return patients;
    };

    const allPatients = generatePatients();

    const filteredPatients = allPatients.filter(patient => {
        return patient.blood === "in" || patient.blood === "out";
    });

    const getDynamicLabColumns = () => {
        const commonColumns = [
            {
                key: 'id',
                header: 'ID',
                width: 'w-24',
                render: (value: string) => (
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{value}</span>
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
        ];

        return [
            ...commonColumns,
            {
                key: 'blood',
                header: 'Blood',
                width: 'w-16 text-center',
                render: (value: "empty" | "in" | "out") => renderLabStatusBadge(value)
            },
        ];
    };

    const labColumns = getDynamicLabColumns();

    const getLabSectionTitle = (section: string | undefined) => {
        if (!section || section === "labs") {
            return "Labs";
        }
        const sectionName = section.replace("labs-", "").replace(/_/g, ' ');
        return `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Lab`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{getLabSectionTitle(activeLabSection)}</CardTitle>
                <Dialog open={isBloodDialogOpen} onOpenChange={setIsBloodDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto">Add Patient to Blood Lab</Button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>Add Patient to Blood Lab</DialogTitle>
                            <DialogDescription>
                                Enter patient details and assign their blood lab status.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitBlood}>
                            <div className="flex flex-col gap-4 py-4">
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



                                    <Input value={lymphocytesPercentage} onChange={(e) => setLymphocytesPercentage(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Mid-range Percentage</Label>



                                    <Input value={midRangePercentage} onChange={(e) => setMidRangePercentage(e.target.value)} className="flex-1" />



                                </div>



                                <div className="flex items-center gap-4">



                                    <Label className="text-left w-40">Granulocytes Percentage</Label>



                                    <Input value={granulocytesPercentage} onChange={(e) => setGranulocytesPercentage(e.target.value)} className="flex-1" />



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



                                    <Input value={esr} onChange={(e) => setEsr(e.target.value)} className="flex-1" />



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
                                    <RadioGroup
                                        value={alfaFetoprotein}
                                        onValueChange={setAlfaFetoprotein}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="alfaFetoprotein-status-default" />
                                                <Label htmlFor="alfaFetoprotein-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="alfaFetoprotein-status-positive" />
                                                <Label htmlFor="alfaFetoprotein-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="alfaFetoprotein-status-negative" />
                                                <Label htmlFor="alfaFetoprotein-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">PSA</Label>
                                    <RadioGroup
                                        value={psa}
                                        onValueChange={setPsa}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="psa-status-default" />
                                                <Label htmlFor="psa-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="psa-status-positive" />
                                                <Label htmlFor="psa-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="psa-status-negative" />
                                                <Label htmlFor="psa-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">B HCG</Label>
                                    <RadioGroup
                                        value={bHcg}
                                        onValueChange={setBHcg}
                                        className="flex-1"
                                    >
                                        <div className="flex flex-row space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="" id="bHcg-status-default" />
                                                <Label htmlFor="bHcg-status-default">Select Value</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Positive" id="bHcg-status-positive" />
                                                <Label htmlFor="bHcg-status-positive">Positive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Negative" id="bHcg-status-negative" />
                                                <Label htmlFor="bHcg-status-negative">Negative</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
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
                                    <Select value={rheumatoidFactor} onValueChange={setRheumatoidFactor}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentPresentOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">ASOT</Label>
                                    <Select value={asot} onValueChange={setAsot}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {absentPresentOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">CRP</Label>
                                    <Input value={crp} onChange={(e) => setCrp(e.target.value)} className="flex-1" />
                                </div>

                                <Separator className="my-4" /> {/* <--- NEW SEPARATOR */}
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={labColumns} data={filteredPatients} />
            </CardContent>
        </Card>
    );
}
