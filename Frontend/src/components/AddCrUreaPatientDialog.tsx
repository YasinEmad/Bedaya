import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface AddCrUreaPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCrUreaPatientDialog: React.FC<AddCrUreaPatientDialogProps> = ({ isOpen, onClose }) => {
  const [createValue, setCreateValue] = useState("");
  const [ureaValue, setUreaValue] = useState("");

  const crUreaRatio =
    createValue && ureaValue ? (parseFloat(createValue) / parseFloat(ureaValue)).toFixed(2) : "N/A";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Adding patient to Cr/Urea lab:", {
      create: createValue,
      urea: ureaValue,
      ratio: crUreaRatio,
    });
    onClose();
    setCreateValue("");
    setUreaValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none p-0 translate-x-0 translate-y-0 overflow-y-auto bg-white">
        <DialogHeader className="px-4 flex justify-center">
          <DialogTitle>Add Patient to Cr/Urea Lab</DialogTitle>
          <DialogDescription>
            Enter Creatinine and Urea values to calculate the ratio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6 overflow-y-auto p-4 items-center">
          <div className="flex flex-col gap-2 w-full"> {/* Patient Search */}
            <Label htmlFor="create-value" className="text-left w-40">
              Creatinine
            </Label>
            <Input
              id="create-value"
              value={createValue}
              onChange={(e) => setCreateValue(e.target.value)}
              className="flex-1"
              type="number"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="urea-value" className="text-left w-40">
              Urea
            </Label>
            <Input
              id="urea-value"
              value={ureaValue}
              onChange={(e) => setUreaValue(e.target.value)}
              className="flex-1"
              type="number"
              step="0.01"
            />
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 w-full">
            <Label className="text-left w-40">Cr/Urea Ratio</Label>
            <div className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800">
              {crUreaRatio}
            </div>
          </div>

          <DialogFooter className="mt-6 w-full">
            <Button type="submit">Submit Values</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};