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
import { HorizontalLine } from "./ui/horizontal-line";

interface UrineLabsModuleProps {
  activeLabSection?: string;
}

// Pre-defined options for urine fields
const urineColours = ["Yellow", "Straw", "Amber", "Orange", "Red", "Brown", "Green", "Blue"];
const urineClarity = ["Clear", "Slightly Cloudy", "Cloudy", "Turbid", "Flocculent"];
const absentPresentOptions = ["-ve", "+ve", "Absent", "Present"];
const urineOdours = ["Aromatic", "Fruity", "Ammoniacal", "Foul", "Maple Syrup"];
const urineWBCsRBCsOptions = ["0-2/HPF", "2-5/HPF", "5-10/HPF", ">10/HPF", "Present", "Absent"];
const urineGlucoseOptions = ["Negative", "+", "++", "+++", "++++"];
const urineProteinOptions = ["Negative", "Trace", "+", "++", "+++", "++++"];
const urineKetoneOptions = ["Negative", "+", "++", "+++"];
const urineBilirubinOptions = ["Negative", "+", "++", "+++"];
const urineUrobilinogenOptions = ["Normal", "Increased", "Decreased"];
const urineNitriteOptions = ["Negative", "Positive"];
const urineLeukocyteOptions = ["Negative", "Trace", "+", "++", "+++"];
const urineBloodOptions = ["Negative", "Trace", "+", "++", "+++"];
const urineSpecificGravityOptions = ["1.000", "1.005", "1.010", "1.015", "1.020", "1.025", "1.030"];
const urinePHOptions = ["4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"];
const urineCrystalsOptions = ["Absent", "Present (Calcium Oxalate)", "Present (Triple Phosphate)", "Present (Uric Acid)", "Present (Cystine)"];
const urineCastsOptions = ["Absent", "Hyaline", "RBC Casts", "WBC Casts", "Granular", "Waxy"];
const urineBacteriaOptions = ["Absent", "Few", "Moderate", "Many"];
const urineYeastOptions = ["Absent", "Present"];

export function UrineLabsModule({ activeLabSection }: UrineLabsModuleProps) {
  // Urine Test Dialog States
  const [isUrineDialogOpen, setIsUrineDialogOpen] = useState(false);
  const [urinePatientName, setUrinePatientName] = useState("");

  // Physical data
  const [urineColour, setUrineColour] = useState("");
  const [urineClarityState, setUrineClarityState] = useState("");
  const [urineOdour, setUrineOdour] = useState("");

  // Chemical data
  const [urineGlucose, setUrineGlucose] = useState("");
  const [urineProtein, setUrineProtein] = useState("");
  const [urineKetone, setUrineKetone] = useState("");
  const [urineBilirubin, setUrineBilirubin] = useState("");
  const [urineUrobilinogen, setUrineUrobilinogen] = useState("");
  const [urineNitrite, setUrineNitrite] = useState("");
  const [urineLeukocyteEsterase, setUrineLeukocyteEsterase] = useState("");
  const [urineBlood, setUrineBlood] = useState("");
  const [urineSpecificGravity, setUrineSpecificGravity] = useState("");
  const [urinePH, setUrinePH] = useState("");

  // Microscopic data
  const [urineWBCs, setUrineWBCs] = useState("");
  const [urineRBCs, setUrineRBCs] = useState("");
  const [urineEpithelialCells, setUrineEpithelialCells] = useState("");
  const [urineCrystals, setUrineCrystals] = useState("");
  const [urineCasts, setUrineCasts] = useState("");
  const [urineBacteria, setUrineBacteria] = useState("");
  const [urineYeast, setUrineYeast] = useState("");
  const [urineMucusThreads, setUrineMucusThreads] = useState("");

  const handleSubmitUrine = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Adding patient to urine lab:", {
      patientName: urinePatientName,
      colour: urineColour,
      clarity: urineClarityState,
      odour: urineOdour,
      glucose: urineGlucose,
      protein: urineProtein,
      ketone: urineKetone,
      bilirubin: urineBilirubin,
      urobilinogen: urineUrobilinogen,
      nitrite: urineNitrite,
      leukocyteEsterase: urineLeukocyteEsterase,
      blood: urineBlood,
      specificGravity: urineSpecificGravity,
      pH: urinePH,
      wbcs: urineWBCs,
      rbcs: urineRBCs,
      epithelialCells: urineEpithelialCells,
      crystals: urineCrystals,
      casts: urineCasts,
      bacteria: urineBacteria,
      yeast: urineYeast,
      mucusThreads: urineMucusThreads,
    });
    setIsUrineDialogOpen(false);
    setUrinePatientName("");
    setUrineColour("");
    setUrineClarityState("");
    setUrineOdour("");
    setUrineGlucose("");
    setUrineProtein("");
    setUrineKetone("");
    setUrineBilirubin("");
    setUrineUrobilinogen("");
    setUrineNitrite("");
    setUrineLeukocyteEsterase("");
    setUrineBlood("");
    setUrineSpecificGravity("");
    setUrinePH("");
    setUrineWBCs("");
    setUrineRBCs("");
    setUrineEpithelialCells("");
    setUrineCrystals("");
    setUrineCasts("");
    setUrineBacteria("");
    setUrineYeast("");
    setUrineMucusThreads("");
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
      
      const urineStatus = getRandomLabStatus();

      patients.push({
        id: `P${String(i).padStart(3, '0')}`,
        name: `${firstName} ${lastName}`,
        urine: urineStatus,
      });
    }
    return patients;
  };

  const allPatients = generatePatients();

  const filteredPatients = allPatients.filter(patient => {
    return patient.urine === "in" || patient.urine === "out";
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
        key: 'urine',
        header: 'Urine',
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
        <Dialog open={isUrineDialogOpen} onOpenChange={setIsUrineDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">Add Patient to Urine Lab</Button>
          </DialogTrigger>
          <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>Add Patient to Urine Lab</DialogTitle>
              <DialogDescription>
                Enter patient details and assign their urine lab status.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUrine}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="urine-patient-name" className="text-left w-40">
                    Patient Name
                  </Label>
                  <Input
                    id="urine-patient-name"
                    value={urinePatientName}
                    onChange={(e) => setUrinePatientName(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* Physical Examination */}
                <h3 className="text-md font-semibold mt-4 w-full">Physical Examination</h3>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Colour</Label>
                  <Select value={urineColour} onValueChange={setUrineColour}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select colour" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineColours.map((colour) => (
                        <SelectItem key={colour} value={colour}>{colour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Clarity</Label>
                  <Select value={urineClarityState} onValueChange={setUrineClarityState}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select clarity" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineClarity.map((clarity) => (
                        <SelectItem key={clarity} value={clarity}>{clarity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Odour</Label>
                  <Select value={urineOdour} onValueChange={setUrineOdour}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select odour" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineOdours.map((odour) => (
                        <SelectItem key={odour} value={odour}>{odour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chemical Examination */}
                <HorizontalLine className="my-4" />
                <h3 className="text-md font-semibold mt-4 w-full">Chemical Examination</h3>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Glucose</Label>
                  <Select value={urineGlucose} onValueChange={setUrineGlucose}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select glucose status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineGlucoseOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Protein</Label>
                  <Select value={urineProtein} onValueChange={setUrineProtein}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select protein status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineProteinOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Ketone</Label>
                  <Select value={urineKetone} onValueChange={setUrineKetone}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select ketone status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineKetoneOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Bilirubin</Label>
                  <Select value={urineBilirubin} onValueChange={setUrineBilirubin}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select bilirubin status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineBilirubinOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Urobilinogen</Label>
                  <Select value={urineUrobilinogen} onValueChange={setUrineUrobilinogen}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select urobilinogen status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineUrobilinogenOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Nitrite</Label>
                  <Select value={urineNitrite} onValueChange={setUrineNitrite}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select nitrite status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineNitriteOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Leukocyte Esterase</Label>
                  <Select value={urineLeukocyteEsterase} onValueChange={setUrineLeukocyteEsterase}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select leukocyte esterase status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineLeukocyteOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Blood</Label>
                  <Select value={urineBlood} onValueChange={setUrineBlood}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select blood status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineBloodOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Specific Gravity</Label>
                  <Select value={urineSpecificGravity} onValueChange={setUrineSpecificGravity}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select specific gravity" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineSpecificGravityOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">pH</Label>
                  <Select value={urinePH} onValueChange={setUrinePH}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select pH" />
                    </SelectTrigger>
                    <SelectContent>
                      {urinePHOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Microscopic Examination */}
                <h3 className="text-md font-semibold mt-4 w-full">Microscopic Examination</h3>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">WBCs</Label>
                  <Select value={urineWBCs} onValueChange={setUrineWBCs}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select WBCs status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineWBCsRBCsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">RBCs</Label>
                  <Select value={urineRBCs} onValueChange={setUrineRBCs}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select RBCs status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineWBCsRBCsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Epithelial Cells</Label>
                  <Select value={urineEpithelialCells} onValueChange={setUrineEpithelialCells}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select epithelial cells status" />
                    </SelectTrigger>
                    <SelectContent>
                      {absentPresentOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Crystals</Label>
                  <Select value={urineCrystals} onValueChange={setUrineCrystals}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select crystals status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineCrystalsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Casts</Label>
                  <Select value={urineCasts} onValueChange={setUrineCasts}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select casts status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineCastsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Bacteria</Label>
                  <Select value={urineBacteria} onValueChange={setUrineBacteria}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select bacteria status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineBacteriaOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Yeast</Label>
                  <Select value={urineYeast} onValueChange={setUrineYeast}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select yeast status" />
                    </SelectTrigger>
                    <SelectContent>
                      {urineYeastOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Mucus Threads</Label>
                  <Select value={urineMucusThreads} onValueChange={setUrineMucusThreads}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select mucus threads status" />
                    </SelectTrigger>
                    <SelectContent>
                      {absentPresentOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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