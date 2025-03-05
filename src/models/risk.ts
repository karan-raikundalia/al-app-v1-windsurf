
export interface Risk {
  id: string;
  category: string;
  description: string;
  consequence: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  mitigation: string;
  owner: string;
  status: "Not Started" | "In Progress" | "Completed";
  contingency: string;
}
