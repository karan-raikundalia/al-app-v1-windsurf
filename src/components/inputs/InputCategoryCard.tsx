
import { useState } from "react";
import { Check, ChevronRight, Clock, Equal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputDialog } from "./InputDialog";
import { InputCategory, InputDataType } from "@/pages/InputsPage";
import { InputValue, useInputs } from "@/hooks/use-inputs";

// Map of icon names to Lucide icon components
import * as LucideIcons from "lucide-react";

interface InputCategoryCardProps {
  category: InputCategory;
  dataTypeFilter: InputDataType | "all";
}

export function InputCategoryCard({ category, dataTypeFilter }: InputCategoryCardProps) {
  const [showAddInput, setShowAddInput] = useState(false);
  const { inputs, addInput } = useInputs();

  const categoryInputs = inputs.filter(
    input => input.categoryId === category.id && 
    (dataTypeFilter === "all" || input.dataType === dataTypeFilter)
  );

  const constantInputs = categoryInputs.filter(input => input.dataType === "constant");
  const timeSeriesInputs = categoryInputs.filter(input => input.dataType === "timeSeries");

  // Dynamically get the icon component from Lucide icons
  const IconComponent = (LucideIcons as any)[
    category.icon.charAt(0).toUpperCase() + category.icon.slice(1)
  ] || LucideIcons.CircleDot;

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("p-4 pb-2")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconComponent className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">{category.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-1.5">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-2 space-y-1">
          {constantInputs.length > 0 && (
            <div className="text-sm">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Equal className="h-3 w-3" />
                <span>Constant Inputs</span>
                <span className="ml-auto rounded-full bg-muted px-1.5 text-[10px]">
                  {constantInputs.length}
                </span>
              </div>
              <ul className="space-y-1 pl-5">
                {constantInputs.slice(0, 3).map((input) => (
                  <li key={input.id} className="flex items-center text-xs">
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-primary/50"></span>
                    {input.name}
                    <span className="ml-1.5 text-muted-foreground">
                      {typeof input.value === "number" ? input.value.toFixed(2) : input.value}
                    </span>
                  </li>
                ))}
                {constantInputs.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    + {constantInputs.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {timeSeriesInputs.length > 0 && (
            <div className="text-sm">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Time Series Inputs</span>
                <span className="ml-auto rounded-full bg-muted px-1.5 text-[10px]">
                  {timeSeriesInputs.length}
                </span>
              </div>
              <ul className="space-y-1 pl-5">
                {timeSeriesInputs.slice(0, 3).map((input) => (
                  <li key={input.id} className="flex items-center text-xs">
                    <span className="mr-1.5 h-1 w-1 rounded-full bg-primary/50"></span>
                    {input.name}
                  </li>
                ))}
                {timeSeriesInputs.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    + {timeSeriesInputs.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {categoryInputs.length === 0 && (
            <div className="py-2 text-center text-sm text-muted-foreground">
              No inputs added yet
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs w-full justify-between"
          onClick={() => setShowAddInput(true)}
        >
          <span className="flex items-center">
            <Plus className="mr-1 h-3 w-3" />
            Add Input
          </span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </CardFooter>

      <InputDialog 
        open={showAddInput} 
        onOpenChange={setShowAddInput}
        categories={[category]}
        defaultCategory={category.id}
      />
    </Card>
  );
}
