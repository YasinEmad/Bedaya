import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import { Badge } from "@ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui/select";

interface InventoryItem {
  id: string;
  barcode: string;
  medicineName: string;
  type: "pills" | "ampules" | "bottle";
  stockType: "pills" | "strip";
  pillsPerStrip?: number; // Only for 'strip' stockType
  currentStock: number;
  dispensed: number;
  lastAdded: string;
}

export function InventoryControl() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "med1",
      barcode: "1234567890",
      medicineName: "Paracetamol 500mg",
      type: "pills",
      stockType: "pills",
      currentStock: 1000,
      dispensed: 200,
      lastAdded: "2024-01-15",
    },
    {
      id: "med2",
      barcode: "0987654321",
      medicineName: "Amoxicillin 250mg",
      type: "pills",
      stockType: "strip",
      pillsPerStrip: 10,
      currentStock: 500, // 50 strips
      dispensed: 50, // 5 strips
      lastAdded: "2024-01-20",
    },
    {
      id: "med3",
      barcode: "1122334455",
      medicineName: "Insulin 100IU",
      type: "ampules",
      stockType: "pills", // Treat ampules as single units for simplicity here
      currentStock: 50,
      dispensed: 10,
      lastAdded: "2024-01-22",
    },
    {
      id: "med4",
      barcode: "6677889900",
      medicineName: "Cough Syrup",
      type: "bottle",
      stockType: "pills", // Treat bottles as single units
      currentStock: 30,
      dispensed: 5,
      lastAdded: "2024-01-18",
    },
  ]);

  // State for Add Stock Dialog
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineType, setNewMedicineType] = useState<"pills" | "ampules" | "bottle">("pills");
  const [newStockType, setNewStockType] = useState<"pills" | "strip">("pills");
  const [newPillsPerStrip, setNewPillsPerStrip] = useState<string>(""); // Store as string, parse to number
  const [newNumber, setNewNumber] = useState(""); // Quantity to add

  const handleAddStock = (event: React.FormEvent) => {
    event.preventDefault();

    const stockToAdd = parseInt(newNumber, 10);
    const pillsPerStripNum = newStockType === "strip" ? parseInt(newPillsPerStrip, 10) : undefined;

    if (isNaN(stockToAdd) || stockToAdd <= 0) {
      alert("Please enter a valid number for stock.");
      return;
    }
    if (newStockType === "strip" && (isNaN(pillsPerStripNum as number) || (pillsPerStripNum as number) <= 0)) {
      alert("Please enter a valid number for pills per strip.");
      return;
    }

    const existingItemIndex = inventory.findIndex(
      (item) => item.barcode === newBarcode
    );

    if (existingItemIndex > -1) {
      // Update existing stock
      const updatedInventory = [...inventory];
      const existingItem = updatedInventory[existingItemIndex];

      let quantityToAdd = stockToAdd;
      if (newStockType === "strip" && pillsPerStripNum) {
        quantityToAdd = stockToAdd * pillsPerStripNum; // Convert strips to pills
      } else if (existingItem.stockType === "strip" && existingItem.pillsPerStrip) {
        // If existing is strip, but new is pills, convert existing stock to pills for addition
        existingItem.currentStock = (existingItem.currentStock / existingItem.pillsPerStrip);
      }
      
      existingItem.currentStock += quantityToAdd;
      existingItem.lastAdded = new Date().toISOString().split('T')[0]; // Current date
      setInventory(updatedInventory);

    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: `med${inventory.length + 1}`,
        barcode: newBarcode,
        medicineName: newMedicineName,
        type: newMedicineType,
        stockType: newStockType,
        pillsPerStrip: newStockType === "strip" ? pillsPerStripNum : undefined,
        currentStock: stockToAdd,
        dispensed: 0,
        lastAdded: new Date().toISOString().split('T')[0], // Current date
      };
      if (newStockType === "strip" && pillsPerStripNum) {
        newItem.currentStock = stockToAdd * pillsPerStripNum; // Store total pills
      }
      setInventory([...inventory, newItem]);
    }

    // Reset form and close dialog
    setNewBarcode("");
    setNewMedicineName("");
    setNewMedicineType("pills");
    setNewStockType("pills");
    setNewPillsPerStrip("");
    setNewNumber("");
    setIsAddStockDialogOpen(false);
  };

  const inventoryColumns = [
    {
      key: "barcode",
      header: "Barcode",
      render: (value: string) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: "medicineName",
      header: "Medicine Name",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "currentStock",
      header: "Stock Left",
      render: (value: number, item: InventoryItem) => (
        <span>
          {item.stockType === "strip" && item.pillsPerStrip
            ? `${Math.floor(value / item.pillsPerStrip)} strips (${value} pills)`
            : `${value} ${item.type}`}
        </span>
      ),
    },
    {
      key: "dispensed",
      header: "Dispensed",
      render: (value: number, item: InventoryItem) => (
        <span>
          {item.stockType === "strip" && item.pillsPerStrip
            ? `${Math.floor(value / item.pillsPerStrip)} strips (${value} pills)`
            : `${value} ${item.type}`}
        </span>
      ),
    },
    {
      key: "lastAdded",
      header: "Last Added",
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 px-6 py-5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Inventory Control</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Manage stock levels and track expiration</p>
          </div>
          <Dialog open={isAddStockDialogOpen} onOpenChange={setIsAddStockDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200">
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-0 w-screen h-screen max-w-none rounded-none bg-slate-50/95 backdrop-blur-sm p-0 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="px-8 py-6 border-b border-slate-100 bg-white">
                  <DialogTitle className="text-2xl font-bold text-center text-slate-900">Add New/Existing Stock</DialogTitle>
                  <DialogDescription className="text-center text-slate-500">
                    Fill in the details to add new medicine stock or update existing items.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStock} className="flex flex-col gap-6 p-8 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="barcode" className="text-sm font-semibold text-slate-700">Barcode</Label>
                      <Input
                        id="barcode"
                        value={newBarcode}
                        onChange={(e) => setNewBarcode(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        placeholder="Scan or enter barcode"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="medicineName" className="text-sm font-semibold text-slate-700">Medicine Name</Label>
                      <Input
                        id="medicineName"
                        value={newMedicineName}
                        onChange={(e) => setNewMedicineName(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        placeholder="e.g. Paracetamol 500mg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="text-sm font-semibold text-slate-700">Type</Label>
                    <div className="flex flex-wrap gap-3">
                      {(["pills", "ampules", "bottle"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewMedicineType(type)}
                          className={`cursor-pointer text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 border
                                     ${newMedicineType === type 
                                       ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                       : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="text-sm font-semibold text-slate-700">Stock Unit</Label>
                    <div className="flex flex-wrap gap-3">
                      {(["pills", "strip"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewStockType(type)}
                          className={`cursor-pointer text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 border
                                     ${newStockType === type 
                                       ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                       : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
                        >
                          {type === "pills" ? "Individual Units (Pills/Bottles)" : "Strips/Blisters"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {newStockType === "strip" && (
                      <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="pillsPerStrip" className="text-sm font-semibold text-slate-700">Units per Strip</Label>
                        <Input
                          id="pillsPerStrip"
                          type="number"
                          value={newPillsPerStrip}
                          onChange={(e) => setNewPillsPerStrip(e.target.value)}
                          required
                          className="bg-slate-50 border-slate-200"
                          placeholder="e.g. 10"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="number" className="text-sm font-semibold text-slate-700">Quantity to Add</Label>
                      <Input
                        id="number"
                        type="number"
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200"
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-2">
                    <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-green-200 rounded-xl">
                      Confirm Addition
                    </Button>
                  </div>
                </form>
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center">
                    <Button variant="ghost" onClick={() => setIsAddStockDialogOpen(false)} className="text-slate-500 hover:text-slate-800">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

      </CardHeader>
      <CardContent className="p-0">
        <DataTable columns={inventoryColumns} data={inventory} />
      </CardContent>
    </Card>
    </div>
  );
}
