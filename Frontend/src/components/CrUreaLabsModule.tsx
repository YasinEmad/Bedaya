import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchCrUreaLabTests, createLabTest, updateLabTest, LabTest } from "../store/slices/labsSlice";
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
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";

interface CrUreaLabsModuleProps {
  activeLabSection?: string;
}

export function CrUreaLabsModule({ activeLabSection }: CrUreaLabsModuleProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { crUreaTests, loading, error } = useSelector((state: RootState) => state.labs);
  const { adultPatients, pediatricPatients } = useSelector((state: RootState) => state.patients);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [selectedPatientCode, setSelectedPatientCode] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [urea, setUrea] = useState("");
  const [eGFR, setEGFR] = useState("");
  const [notes, setNotes] = useState("");
  const [technician, setTechnician] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCrUreaLabTests());
  }, [dispatch]);

  useEffect(() => {
    if (isDialogOpen) {
      dispatch(fetchAdultPatients({}));
      dispatch(fetchPediatricPatients({}));
    }
  }, [isDialogOpen, dispatch]);

  const calcEGFR = (cr: number, u: number): string => {
    if (!cr || !u) return "";
    if (u === 0) return "";
    return (cr / u).toFixed(2);
  };

  const handlePatientSelect = (patientCode: string) => {
    const allPatients: Array<AdultPatient | PediatricPatient> = [...adultPatients, ...pediatricPatients];
    const patient = allPatients.find((p) => p.patientCode === patientCode);
    if (patient) {
      setSelectedPatientCode(patientCode);
      setPatientId(patient.patientCode);
      setPatientName(patient.patientName);
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
    setPatientName("");
    setPatientId("");
    setSelectedPatientCode("");
    setCreatinine("");
    setUrea("");
    setEGFR("");
    setNotes("");
    setTechnician("");
    setIsEditing(false);
    setEditingTestId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!patientId || !patientName) {
      toast.error('Patient ID and name are required');
      return;
    }

    const crNum = creatinine ? parseFloat(creatinine) : undefined;
    const ureaNum = urea ? parseFloat(urea) : undefined;

    const testData: any = {
      patientId,
      patientName,
      testType: 'cr_urea' as const,
      crUrea: {
        creatinine: crNum,
        urea: ureaNum,
        eGFR: eGFR ? parseFloat(eGFR) : undefined,
      },
      notes: notes || undefined,
      technician: technician || undefined,
    };

    try {
      if (isEditing && editingTestId) {
        await dispatch(updateLabTest({ id: editingTestId, testData })).unwrap();
        toast.success('Cr/Urea test updated successfully');
      } else {
        await dispatch(createLabTest(testData)).unwrap();
        toast.success('Cr/Urea test added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} Cr/Urea test`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleViewPatientDetails = (test: LabTest) => {
    setPatientId(test.patientId);
    setPatientName(test.patientName);
    setSelectedPatientCode(test.patientId);
    setCreatinine(test.crUrea?.creatinine?.toString() || "");
    setUrea(test.crUrea?.urea?.toString() || "");
    setEGFR(test.crUrea?.eGFR?.toString() || "");
    setNotes(test.notes || "");
    setTechnician(test.technician || "");

    setIsEditing(true);
    setEditingTestId(test._id);
    setIsDialogOpen(true);
  };

  const getDynamicLabColumns = () => {
    const commonColumns = [
      {
        key: 'patientId',
        header: 'Patient ID',
        width: 'w-24',
        render: (value: string) => <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{value}</span>
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
          <p className="text-slate-600">Loading cr/urea lab tests...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchCrUreaLabTests())}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getLabSectionTitle(activeLabSection)}</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto" onClick={() => { resetForm(); setIsDialogOpen(true); }}>Add Patient to Cr/Urea Lab</Button>
          </DialogTrigger>
          <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Cr/Urea Test' : 'Add Cr/Urea Test'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update the patient\'s Cr/Urea results.' : 'Enter creatinine and urea values.'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
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
                  <Label className="text-left w-40">Patient Name</Label>
                  <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="flex-1" />
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-left w-40">Patient ID</Label>
                  <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} className="flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4"><Label className="w-40">Creatinine</Label><Input type="number" step="0.01" value={creatinine} onChange={(e) => { setCreatinine(e.target.value); setEGFR(calcEGFR(parseFloat(e.target.value||"0"), parseFloat(urea||"0"))); }} className="flex-1" /></div>
                  <div className="flex items-center gap-4"><Label className="w-40">Urea</Label><Input type="number" step="0.01" value={urea} onChange={(e) => { setUrea(e.target.value); setEGFR(calcEGFR(parseFloat(creatinine||"0"), parseFloat(e.target.value||"0"))); }} className="flex-1" /></div>
                  <div className="flex items-center gap-4"><Label className="w-40">eGFR</Label><Input type="text" readOnly value={eGFR} className="flex-1 bg-slate-100" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4"><Label className="w-40">Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1" /></div>
                  <div className="flex items-center gap-4"><Label className="w-40">Technician</Label><Input value={technician} onChange={(e) => setTechnician(e.target.value)} className="flex-1" /></div>
                </div>
              </div>
              <DialogFooter><Button type="submit">{isEditing ? 'Update Cr/Urea Test' : 'Save Cr/Urea Test'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent><DataTable columns={labColumns} data={crUreaTests} /></CardContent>
    </Card>
  );
}
