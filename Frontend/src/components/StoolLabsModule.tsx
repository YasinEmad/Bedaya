import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { DataTable } from "./ui/data-table";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import ValueSelector from "./ui/ValueSelector";

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
    // Stool Test Dialog States
    const [isStoolDialogOpen, setIsStoolDialogOpen] = useState(false);
    const [stoolPatientName, setStoolPatientName] = useState("");
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

    const handleSubmitStool = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Adding patient to stool lab:", {
            patientName: stoolPatientName,
            consistency: stoolConsistency,
            blood: stoolBlood,
            mucus: stoolMucus,
            color: stoolColor,
            worm: stoolWorm,
            odour: stoolOdour,
            fasciola: stoolFasciola,
            schMansoni: stoolSchMansoni,
            hNana: stoolHNana,
            tinea: stoolTinea,
            ascaris: stoolAscaris,
            tTrichuria: stoolTTrichuria,
            hookWorm: stoolHookWorm,
            entrobious: stoolEntrobious,
            eColi: stoolEColi,
            eHistolitica: stoolEHistolitica,
            giardiaMicro: stoolGiardiaMicro,
            strongyloidesLarvae: stoolStrongyloidesLarvae,
            giardiaTrophozoite: stoolGiardiaTrophozoite,
            eHistoliticaTrophozoite: stoolEHistoliticaTrophozoite,
            blastocystHominis: stoolBlastocystHominis,
            candidaAlbicans: stoolCandidaAlbicans,
            wbcs: stoolWBCs,
            rbcs: stoolRBCs,
            hPylori: stoolHPylori,
        });
        setIsStoolDialogOpen(false);
        setStoolPatientName("");
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

            const stoolStatus = getRandomLabStatus();

            patients.push({
                id: `P${String(i).padStart(3, '0')}`,
                name: `${firstName} ${lastName}`,
                stool: stoolStatus,
            });
        }
        return patients;
    };

    const allPatients = generatePatients();

    const filteredPatients = allPatients.filter(patient => {
        return patient.stool === "in" || patient.stool === "out";
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
                key: 'stool',
                header: 'Stool',
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
                <Dialog open={isStoolDialogOpen} onOpenChange={setIsStoolDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto">Add Patient to Stool Lab</Button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>Add Patient to Stool Lab</DialogTitle>
                            <DialogDescription>
                                Enter patient details and assign their stool lab status.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitStool}>
                            <div className="grid gap-4 py-4">
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
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Sch. Mansoni</Label>
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">H. Nana</Label>
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Tinea</Label>
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Ascaris</Label>
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">T. Trichuria</Label>
                                    <ValueSelector />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-left w-40">Hook Worm</Label>
                                    <ValueSelector />
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
