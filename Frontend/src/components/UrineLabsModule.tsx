import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUrineLabTests, createLabTest, updateLabTest, LabTest } from "../store/slices/labsSlice";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui/select";
import { Separator } from "@ui/separator";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";

interface UrineLabsModuleProps {
  activeLabSection?: string;
}

const urineColours = ["Yellow", "Straw", "Amber", "Orange", "Red", "Brown", "Green", "Blue"];
const urineClarity = ["Clear", "Slightly Cloudy", "Cloudy", "Turbid", "Flocculent"];
const absentPresentOptions = ["-ve", "+ve", "Absent", "Present", "Not Done"];
const urineOdours = ["Aromatic", "Fruity", "Ammoniacal", "Foul", "Maple Syrup"];
const urineWBCsRBCsOptions = ["0-2/HPF", "2-5/HPF", "5-10/HPF", ">10/HPF", "Present", "Absent"];
const urineGlucoseOptions = ["Negative", "+", "++", "+++"];
const urineProteinOptions = ["Negative", "Trace", "+", "++", "+++"];
const urineKetoneOptions = ["Negative", "+", "++", "+++"];
const urineBilirubinOptions = ["Negative", "+", "++", "+++"];
const urineSpecificGravityOptions = ["1.000", "1.005", "1.010", "1.015", "1.020", "1.025", "1.030"];
const urinePHOptions = ["4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"];

const normalizeWBCRBC = (value: string): number | undefined => {
  if (!value || value === "Present" || value === "Absent") return undefined;
  if (value.startsWith("0-2")) return 1;
  if (value.startsWith("2-5")) return 3.5;
  if (value.startsWith("5-10")) return 7.5;
  if (value.startsWith(">10")) return 12;
  return undefined;
};

export function UrineLabsModule({ activeLabSection }: UrineLabsModuleProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { urineTests, loading, error } = useSelector((state: RootState) => state.labs);
  const { adultPatients, pediatricPatients } = useSelector((state: RootState) => state.patients);

  const [isUrineDialogOpen, setIsUrineDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  const [urinePatientName, setUrinePatientName] = useState("");
  const [urinePatientId, setUrinePatientId] = useState("");
  const [selectedPatientCode, setSelectedPatientCode] = useState("");

  // Physical
  const [urineColour, setUrineColour] = useState("");
  const [urineClarityState, setUrineClarityState] = useState("");
  const [urineOdour, setUrineOdour] = useState("");

  // Chemical
  const [urineGlucose, setUrineGlucose] = useState("");
  const [urineProtein, setUrineProtein] = useState("");
  const [urineKetone, setUrineKetone] = useState("");
  const [urineBilirubin, setUrineBilirubin] = useState("");
  const [urineNitrite, setUrineNitrite] = useState("");
  const [urineLeukocyteEsterase, setUrineLeukocyteEsterase] = useState("");
  const [urineBlood, setUrineBlood] = useState("");
  const [urineSpecificGravity, setUrineSpecificGravity] = useState("");
  const [urinePH, setUrinePH] = useState("");

  // Microscopic
  const [urineWBCs, setUrineWBCs] = useState("");
  const [urineRBCs, setUrineRBCs] = useState("");
  const [urineEpithelialCells, setUrineEpithelialCells] = useState("");
  const [urineCrystals, setUrineCrystals] = useState("");
  const [urineCasts, setUrineCasts] = useState("");
  const [urineBacteria, setUrineBacteria] = useState("");
  const [urineYeast, setUrineYeast] = useState("");
  const [urineMucusThreads, setUrineMucusThreads] = useState("");

  const [notes, setNotes] = useState("");
  const [technician, setTechnician] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUrineLabTests());
  }, [dispatch]);

  useEffect(() => {
    if (isUrineDialogOpen) {
      dispatch(fetchAdultPatients({}));
      dispatch(fetchPediatricPatients({}));
    }
  }, [isUrineDialogOpen, dispatch]);

  const handlePatientSelect = (patientCode: string) => {
    const allPatients: Array<AdultPatient | PediatricPatient> = [...adultPatients, ...pediatricPatients];
    const patient = allPatients.find((p) => p.patientCode === patientCode);
    if (patient) {
      setSelectedPatientCode(patientCode);
      setUrinePatientId(patient.patientCode);
      setUrinePatientName(patient.patientName);
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
    setUrinePatientName("");
    setUrinePatientId("");
    setSelectedPatientCode("");
    setUrineColour("");
    setUrineClarityState("");
    setUrineOdour("");
    setUrineGlucose("");
    setUrineProtein("");
    setUrineKetone("");
    setUrineBilirubin("");
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
    setNotes("");
    setTechnician("");
    setIsEditing(false);
    setEditingTestId(null);
  };

  const handleSubmitUrine = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!urinePatientId || !urinePatientName) {
      toast.error('Patient ID and name are required');
      return;
    }

    const testData = {
      patientId: urinePatientId,
      patientName: urinePatientName,
      testType: 'urine' as const,
      urine: {
        color: urineColour || undefined,
        odour: urineOdour || undefined,
        consistency: urineClarityState || undefined,
        mucus: urineMucusThreads || undefined,
        blood: urineBlood || undefined,
        WBCs: urineWBCs || undefined,
        RBCs: urineRBCs || undefined,
        protein: urineProtein || undefined,
        glucose: urineGlucose || undefined,
        ketones: urineKetone || undefined,
        bilirubin: urineBilirubin || undefined,
        specificGravity: urineSpecificGravity || undefined,
        pH: urinePH || undefined,
      },
      notes: notes || undefined,
      technician: technician || undefined,
    };

    try {
      if (isEditing && editingTestId) {
        await dispatch(updateLabTest({ id: editingTestId, testData })).unwrap();
        toast.success('Urine test updated successfully');
      } else {
        await dispatch(createLabTest(testData)).unwrap();
        toast.success('Urine test added successfully');
      }
      setIsUrineDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} urine test`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleViewPatientDetails = (test: LabTest) => {
    setUrinePatientId(test.patientId);
    setUrinePatientName(test.patientName);
    setSelectedPatientCode(test.patientId);

    setUrineColour(test.urine?.color || "");
    setUrineClarityState(test.urine?.consistency || "");
    setUrineOdour(test.urine?.odour || "");

    setUrineGlucose(test.urine?.glucose || "");
    setUrineProtein(test.urine?.protein || "");
    setUrineKetone(test.urine?.ketones || "");
    setUrineBilirubin(test.urine?.bilirubin || "");
    setUrineBlood(test.urine?.blood || "");
    setUrineSpecificGravity(test.urine?.specificGravity ? test.urine?.specificGravity.toString() : "");
    setUrinePH(test.urine?.pH ? test.urine?.pH.toString() : "");
    setUrineWBCs(test.urine?.WBCs != null ? test.urine.WBCs.toString() : "");
    setUrineRBCs(test.urine?.RBCs != null ? test.urine.RBCs.toString() : "");

    setUrineEpithelialCells("");
    setUrineCrystals("");
    setUrineCasts("");
    setUrineBacteria("");
    setUrineYeast("");
    setUrineMucusThreads(test.urine?.mucus || "");

    setNotes(test.notes || "");
    setTechnician(test.technician || "");

    setIsEditing(true);
    setEditingTestId(test._id);
    setIsUrineDialogOpen(true);
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
        render: (value: string) => <span className="font-medium text-sm text-slate-900">{value}</span>
      },
      {
        key: 'testDate',
        header: 'Test Date',
        width: 'w-32',
        render: (value: string) => <span className="text-sm text-slate-600">{new Date(value).toLocaleDateString()}</span>
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
          <Button variant="outline" size="sm" onClick={() => handleViewPatientDetails(row)} className="h-8 px-2">
            <Eye className="w-4 h-4" />
          </Button>
        )
      },
    ];

    return commonColumns;
  };

  const labColumns = getDynamicLabColumns();

  const getLabSectionTitle = (section: string | undefined) => {
    if (!section || section === "labs") return "Labs";
    const sectionName = section.replace("labs-", "").replace(/_/g, ' ');
    return `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Lab`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading urine lab tests...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchUrineLabTests())}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getLabSectionTitle(activeLabSection)}</CardTitle>
        <Dialog open={isUrineDialogOpen} onOpenChange={setIsUrineDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">{isEditing ? 'Edit Urine Lab Test' : 'Add Patient to Urine Lab'}</Button>
          </DialogTrigger>
          <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Urine Lab Test' : 'Add Patient to Urine Lab'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update patient urine lab results.' : 'Enter patient details and urine lab results.'}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitUrine}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="patient-select" className="text-left w-40">Select Patient</Label>
                  <Select value={selectedPatientCode} onValueChange={handlePatientSelect}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Choose a patient..." /></SelectTrigger>
                    <SelectContent>
                      {[...adultPatients, ...pediatricPatients].map((patient) => (
                        <SelectItem key={patient.patientCode} value={patient.patientCode}>{patient.patientCode} - {patient.patientName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="urine-patient-name" className="text-left w-40">Patient Name</Label>
                  <Input id="urine-patient-name" value={urinePatientName} onChange={(e) => setUrinePatientName(e.target.value)} className="flex-1" />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="urine-patient-id" className="text-left w-40">Patient ID</Label>
                  <Input id="urine-patient-id" value={urinePatientId} onChange={(e) => setUrinePatientId(e.target.value)} className="flex-1" />
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold text-slate-800 mb-4">Physical Examination</h3>

                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Colour</Label>
                  <Select value={urineColour} onValueChange={setUrineColour}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select colour" /></SelectTrigger>
                    <SelectContent>{urineColours.map((colour) => <SelectItem key={colour} value={colour}>{colour}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Clarity</Label>
                  <Select value={urineClarityState} onValueChange={setUrineClarityState}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select clarity" /></SelectTrigger>
                    <SelectContent>{urineClarity.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Odour</Label>
                  <Select value={urineOdour} onValueChange={setUrineOdour}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select odour" /></SelectTrigger>
                    <SelectContent>{urineOdours.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold text-slate-800 mb-4">Chemical Examination</h3>

                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Glucose</Label>
                  <Select value={urineGlucose} onValueChange={setUrineGlucose}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select glucose" /></SelectTrigger>
                    <SelectContent>{urineGlucoseOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Protein</Label>
                  <Select value={urineProtein} onValueChange={setUrineProtein}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select protein" /></SelectTrigger>
                    <SelectContent>{urineProteinOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Ketone</Label>
                  <Select value={urineKetone} onValueChange={setUrineKetone}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select ketone" /></SelectTrigger>
                    <SelectContent>{urineKetoneOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Blood</Label>
                  <Select value={urineBlood} onValueChange={setUrineBlood}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select blood" /></SelectTrigger>
                    <SelectContent>{absentPresentOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Specific Gravity</Label>
                  <Select value={urineSpecificGravity} onValueChange={setUrineSpecificGravity}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select specific gravity" /></SelectTrigger>
                    <SelectContent>{urineSpecificGravityOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">pH</Label>
                  <Select value={urinePH} onValueChange={setUrinePH}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select pH" /></SelectTrigger>
                    <SelectContent>{urinePHOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold text-slate-800 mb-4">Microscopic Examination</h3>

                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">WBCs</Label>
                  <Select value={urineWBCs} onValueChange={setUrineWBCs}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select WBCs" /></SelectTrigger>
                    <SelectContent>{urineWBCsRBCsOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">RBCs</Label>
                  <Select value={urineRBCs} onValueChange={setUrineRBCs}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select RBCs" /></SelectTrigger>
                    <SelectContent>{urineWBCsRBCsOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Mucus Threads</Label>
                  <Select value={urineMucusThreads} onValueChange={setUrineMucusThreads}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select mucus threads" /></SelectTrigger>
                    <SelectContent>{absentPresentOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
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
                <Button type="submit" className="w-full">{isEditing ? 'Update Urine Test' : 'Save Urine Test'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable columns={labColumns} data={urineTests} />
      </CardContent>
    </Card>
  );
}
