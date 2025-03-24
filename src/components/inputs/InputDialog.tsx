
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InputCategory } from "@/pages/InputsPage";
import { useInputs } from "@/hooks/use-inputs";
import { ExpenseType } from "./DataTypeToggle";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: InputCategory[];
  defaultCategory?: string;
}

export function InputDialog({ open, onOpenChange, categories, defaultCategory }: InputDialogProps) {
  const { addInput } = useInputs();
  const [inputType, setInputType] = useState<"constant" | "timeSeries">("constant");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategory || categories[0]?.id || "");
  const [expenseType, setExpenseType] = useState<ExpenseType>("other");
  const [timeSeriesData, setTimeSeriesData] = useState<string>(""); // CSV format or JSON
  
  const handleSubmit = () => {
    if (inputType === "constant") {
      addInput({
        name,
        description,
        categoryId,
        unit,
        dataType: "constant",
        expenseType,
        value: isNaN(Number(value)) ? value : Number(value),
      });
    } else {
      // For time series, we would parse the data into the appropriate format
      addInput({
        name,
        description,
        categoryId,
        unit,
        dataType: "timeSeries",
        expenseType,
        timeSeriesValues: timeSeriesData.split(",").map(v => Number(v.trim())),
      });
    }
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setUnit("");
    setValue("");
    setTimeSeriesData("");
    setInputType("constant");
    setExpenseType("other");
    setCategoryId(defaultCategory || categories[0]?.id || "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Input</DialogTitle>
          <DialogDescription>
            Create a new input parameter for your energy project analysis.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="constant" value={inputType} onValueChange={(value) => setInputType(value as "constant" | "timeSeries")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="constant">Constant Value</TabsTrigger>
            <TabsTrigger value="timeSeries">Time Series</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Battery Capacity"
                  className="mt-1.5"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this input"
                  className="mt-1.5"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., kWh, $, %"
                  className="mt-1.5"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="expenseType">Expense Type</Label>
                <Select value={expenseType} onValueChange={(value) => setExpenseType(value as ExpenseType)}>
                  <SelectTrigger id="expenseType" className="mt-1.5">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capex">Capital Expenditure (CAPEX)</SelectItem>
                    <SelectItem value="opex">Operating Expenditure (OPEX)</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="constant" className="mt-0 space-y-4">
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-1.5"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="timeSeries" className="mt-0 space-y-4">
              <div>
                <Label htmlFor="timeSeriesData">Time Series Data</Label>
                <Textarea
                  id="timeSeriesData"
                  value={timeSeriesData}
                  onChange={(e) => setTimeSeriesData(e.target.value)}
                  placeholder="Enter comma-separated values or paste CSV data"
                  className="mt-1.5 w-full min-h-[100px]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter comma-separated values or paste CSV data.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Input</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
