
export interface OutputValue {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  category: "developer" | "equity" | "debt";
  format?: "percentage" | "currency" | "ratio" | "number" | "years";
  createdAt: Date;
  updatedAt: Date;
}

export interface OutputCategory {
  id: "developer" | "equity" | "debt";
  name: string;
  description: string;
  outputs: OutputValue[];
}

export interface OutputsState {
  categories: OutputCategory[];
  selectedCategory: string | null;
}
