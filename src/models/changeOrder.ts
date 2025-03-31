
export type ChangeOrderSeverity = "critical" | "major" | "minor";
export type ChangeOrderStatus = "pending" | "approved" | "rejected" | "in-review";
export type ProjectPhase = "planning" | "design" | "procurement" | "construction" | "commissioning";

export interface ChangeOrderCause {
  id: string;
  name: string;
  count: number;
  percentageOfTotal: number;
}

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  dateSubmitted: string;
  dateApproved?: string;
  severity: ChangeOrderSeverity;
  status: ChangeOrderStatus;
  originator: string;
  projectPhase: ProjectPhase;
  costImpact: number;
  scheduleImpact: number; // in days
  cause: string;
  documentUrl?: string;
  comments: ChangeOrderComment[];
}

export interface ChangeOrderComment {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface MonthlyChangeOrderData {
  month: string;
  changeOrderCount: number;
  costImpact: number;
  cumulativeCostImpact: number;
}

export interface SeverityDistribution {
  severity: ChangeOrderSeverity;
  count: number;
  percentage: number;
}

export interface ChangeOrderSummary {
  currentMonthCount: number;
  yearToDateCount: number;
  currentMonthImpact: number;
  yearToDateImpact: number;
  percentageChangeCount: number;
  percentageChangeImpact: number;
  industryBenchmarkCount: number;
  industryBenchmarkImpact: number;
  averageApprovalDays: number;
  topCauses: ChangeOrderCause[];
  severityDistribution: SeverityDistribution[];
  monthlyData: MonthlyChangeOrderData[];
  statusDistribution: { status: ChangeOrderStatus; count: number }[];
  forecastedCount: number;
  budgetAmount: number;
}
