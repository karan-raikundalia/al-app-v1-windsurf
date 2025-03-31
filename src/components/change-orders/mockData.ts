
import { ChangeOrder, ChangeOrderSummary } from "@/models/changeOrder";

// Generate dates for the past 12 months
const generateMonthlyDates = () => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    dates.push(date.toISOString().slice(0, 10));
  }
  
  return dates;
};

const monthlyDates = generateMonthlyDates();

// Mock change orders data
export const mockChangeOrders: ChangeOrder[] = [
  {
    id: "CO-2023-001",
    title: "Solar Panel Mounting Redesign",
    description: "Structural reinforcement required for solar panel mounting due to higher wind load calculations",
    dateSubmitted: "2023-08-15",
    dateApproved: "2023-08-28",
    severity: "major",
    status: "approved",
    originator: "Engineering",
    projectPhase: "design",
    costImpact: 125000,
    scheduleImpact: 14,
    cause: "Design Error",
    documentUrl: "/documents/CO-2023-001.pdf",
    comments: [
      {
        id: "com-001",
        author: "John Smith",
        date: "2023-08-16",
        content: "Wind load calculations need to be verified by third party."
      },
      {
        id: "com-002",
        author: "Mary Johnson",
        date: "2023-08-20",
        content: "Third party verification complete. Redesign necessary."
      }
    ]
  },
  {
    id: "CO-2023-002",
    title: "Inverter Specification Change",
    description: "Upgrade to higher efficiency inverters to meet updated performance requirements",
    dateSubmitted: "2023-08-20",
    dateApproved: "2023-09-05",
    severity: "major",
    status: "approved",
    originator: "Client",
    projectPhase: "procurement",
    costImpact: 87500,
    scheduleImpact: 21,
    cause: "Client Request",
    documentUrl: "/documents/CO-2023-002.pdf",
    comments: [
      {
        id: "com-003",
        author: "Jennifer Lee",
        date: "2023-08-22",
        content: "Higher efficiency models are available from Supplier B at similar cost."
      }
    ]
  },
  {
    id: "CO-2023-003",
    title: "Substation Layout Modification",
    description: "Adjustment to substation layout due to underground utility discovery",
    dateSubmitted: "2023-09-05",
    severity: "critical",
    status: "approved",
    originator: "Construction",
    projectPhase: "construction",
    costImpact: 210000,
    scheduleImpact: 30,
    cause: "Site Condition",
    documentUrl: "/documents/CO-2023-003.pdf",
    comments: []
  },
  {
    id: "CO-2023-004",
    title: "Cable Trenching Route Change",
    description: "Rerouting of underground cables due to discovery of rock formation",
    dateSubmitted: "2023-09-15",
    dateApproved: "2023-09-25",
    severity: "minor",
    status: "approved",
    originator: "Construction",
    projectPhase: "construction",
    costImpact: 45000,
    scheduleImpact: 7,
    cause: "Site Condition",
    documentUrl: "/documents/CO-2023-004.pdf",
    comments: []
  },
  {
    id: "CO-2023-005",
    title: "Switchgear Upgrade",
    description: "Upgrade of switchgear specifications to meet utility requirements",
    dateSubmitted: "2023-10-01",
    severity: "major",
    status: "in-review",
    originator: "Engineering",
    projectPhase: "design",
    costImpact: 95000,
    scheduleImpact: 14,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2023-005.pdf",
    comments: []
  },
  {
    id: "CO-2023-006",
    title: "Access Road Widening",
    description: "Widening of access roads to accommodate larger equipment delivery",
    dateSubmitted: "2023-10-10",
    dateApproved: "2023-10-18",
    severity: "minor",
    status: "approved",
    originator: "Construction",
    projectPhase: "construction",
    costImpact: 35000,
    scheduleImpact: 5,
    cause: "Design Omission",
    documentUrl: "/documents/CO-2023-006.pdf",
    comments: []
  },
  {
    id: "CO-2023-007",
    title: "Control Building Expansion",
    description: "Increase size of control building to accommodate additional equipment",
    dateSubmitted: "2023-10-20",
    severity: "major",
    status: "pending",
    originator: "Operations",
    projectPhase: "design",
    costImpact: 115000,
    scheduleImpact: 21,
    cause: "Client Request",
    documentUrl: "/documents/CO-2023-007.pdf",
    comments: []
  },
  {
    id: "CO-2023-008",
    title: "Battery Storage Integration",
    description: "Addition of battery storage system to enhance grid stability",
    dateSubmitted: "2023-11-01",
    severity: "critical",
    status: "in-review",
    originator: "Client",
    projectPhase: "design",
    costImpact: 350000,
    scheduleImpact: 45,
    cause: "Client Request",
    documentUrl: "/documents/CO-2023-008.pdf",
    comments: []
  },
  {
    id: "CO-2023-009",
    title: "Transformer Replacement",
    description: "Replace transformers with higher capacity models due to load analysis",
    dateSubmitted: "2023-11-10",
    dateApproved: "2023-11-25",
    severity: "major",
    status: "approved",
    originator: "Engineering",
    projectPhase: "procurement",
    costImpact: 185000,
    scheduleImpact: 28,
    cause: "Design Error",
    documentUrl: "/documents/CO-2023-009.pdf",
    comments: []
  },
  {
    id: "CO-2023-010",
    title: "Drainage System Enhancement",
    description: "Additional drainage required after hydrological study findings",
    dateSubmitted: "2023-11-22",
    severity: "minor",
    status: "pending",
    originator: "Environmental",
    projectPhase: "design",
    costImpact: 55000,
    scheduleImpact: 10,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2023-010.pdf",
    comments: []
  },
  {
    id: "CO-2023-011",
    title: "Monitoring System Upgrade",
    description: "Enhanced monitoring capabilities requested by operations team",
    dateSubmitted: "2023-12-05",
    dateApproved: "2023-12-15",
    severity: "minor",
    status: "approved",
    originator: "Operations",
    projectPhase: "commissioning",
    costImpact: 65000,
    scheduleImpact: 7,
    cause: "Client Request",
    documentUrl: "/documents/CO-2023-011.pdf",
    comments: []
  },
  {
    id: "CO-2023-012",
    title: "Security System Expansion",
    description: "Additional security cameras and access control points",
    dateSubmitted: "2023-12-12",
    severity: "minor",
    status: "in-review",
    originator: "Security",
    projectPhase: "construction",
    costImpact: 48000,
    scheduleImpact: 5,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2023-012.pdf",
    comments: []
  },
  {
    id: "CO-2024-001",
    title: "Foundation Reinforcement",
    description: "Additional foundation work required after geotechnical analysis",
    dateSubmitted: "2024-01-08",
    dateApproved: "2024-01-20",
    severity: "major",
    status: "approved",
    originator: "Engineering",
    projectPhase: "construction",
    costImpact: 135000,
    scheduleImpact: 18,
    cause: "Site Condition",
    documentUrl: "/documents/CO-2024-001.pdf",
    comments: []
  },
  {
    id: "CO-2024-002",
    title: "Communication Infrastructure Change",
    description: "Fiber optic backbone upgrade for enhanced monitoring",
    dateSubmitted: "2024-01-15",
    severity: "minor",
    status: "pending",
    originator: "IT",
    projectPhase: "design",
    costImpact: 42000,
    scheduleImpact: 10,
    cause: "Technology Upgrade",
    documentUrl: "/documents/CO-2024-002.pdf",
    comments: []
  },
  {
    id: "CO-2024-003",
    title: "Weather Station Addition",
    description: "Installation of on-site weather monitoring station",
    dateSubmitted: "2024-01-25",
    severity: "minor",
    status: "rejected",
    originator: "Operations",
    projectPhase: "commissioning",
    costImpact: 28000,
    scheduleImpact: 5,
    cause: "Client Request",
    documentUrl: "/documents/CO-2024-003.pdf",
    comments: []
  },
  {
    id: "CO-2024-004",
    title: "Grounding System Enhancement",
    description: "Additional grounding required after electrical safety audit",
    dateSubmitted: "2024-02-05",
    dateApproved: "2024-02-15",
    severity: "critical",
    status: "approved",
    originator: "Safety",
    projectPhase: "construction",
    costImpact: 75000,
    scheduleImpact: 12,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2024-004.pdf",
    comments: []
  },
  {
    id: "CO-2024-005",
    title: "Fire Suppression System Upgrade",
    description: "Enhanced fire suppression system for battery storage area",
    dateSubmitted: "2024-02-18",
    severity: "major",
    status: "in-review",
    originator: "Safety",
    projectPhase: "design",
    costImpact: 95000,
    scheduleImpact: 15,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2024-005.pdf",
    comments: []
  },
  {
    id: "CO-2024-006",
    title: "Spare Parts Inventory Increase",
    description: "Additional spare parts requested for maintenance purposes",
    dateSubmitted: "2024-03-01",
    dateApproved: "2024-03-10",
    severity: "minor",
    status: "approved",
    originator: "Operations",
    projectPhase: "procurement",
    costImpact: 32000,
    scheduleImpact: 0,
    cause: "Client Request",
    documentUrl: "/documents/CO-2024-006.pdf",
    comments: []
  },
  {
    id: "CO-2024-007",
    title: "Transmission Line Rerouting",
    description: "Rerouting of transmission lines due to environmental concerns",
    dateSubmitted: "2024-03-15",
    severity: "critical",
    status: "pending",
    originator: "Environmental",
    projectPhase: "design",
    costImpact: 280000,
    scheduleImpact: 30,
    cause: "Regulatory Requirement",
    documentUrl: "/documents/CO-2024-007.pdf",
    comments: []
  },
  {
    id: "CO-2024-008",
    title: "SCADA System Enhancement",
    description: "Additional control points and monitoring capabilities",
    dateSubmitted: "2024-04-02",
    dateApproved: "2024-04-12",
    severity: "major",
    status: "approved",
    originator: "Operations",
    projectPhase: "commissioning",
    costImpact: 110000,
    scheduleImpact: 14,
    cause: "Technology Upgrade",
    documentUrl: "/documents/CO-2024-008.pdf",
    comments: []
  }
];

// Function to generate the Change Order Summary
export const generateChangeOrderSummary = (): ChangeOrderSummary => {
  // Get current month change orders
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const currentMonthOrders = mockChangeOrders.filter(order => {
    const orderDate = new Date(order.dateSubmitted);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  
  // Get year-to-date change orders
  const ytdOrders = mockChangeOrders.filter(order => {
    const orderDate = new Date(order.dateSubmitted);
    return orderDate.getFullYear() === currentYear;
  });
  
  // Calculate top causes
  const causes = mockChangeOrders.reduce((acc, order) => {
    if (!acc[order.cause]) {
      acc[order.cause] = 0;
    }
    acc[order.cause]++;
    return acc;
  }, {} as Record<string, number>);
  
  const topCauses = Object.entries(causes)
    .map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
      percentageOfTotal: (count / mockChangeOrders.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Calculate severity distribution
  const severityCount = mockChangeOrders.reduce((acc, order) => {
    if (!acc[order.severity]) {
      acc[order.severity] = 0;
    }
    acc[order.severity]++;
    return acc;
  }, {} as Record<string, number>);
  
  const severityDistribution = Object.entries(severityCount)
    .map(([severity, count]) => ({
      severity: severity as any,
      count,
      percentage: (count / mockChangeOrders.length) * 100
    }));
  
  // Calculate status distribution
  const statusCount = mockChangeOrders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = 0;
    }
    acc[order.status]++;
    return acc;
  }, {} as Record<string, number>);
  
  const statusDistribution = Object.entries(statusCount)
    .map(([status, count]) => ({
      status: status as any,
      count
    }));
  
  // Calculate monthly data
  const monthlyData = monthlyDates.map((date, index) => {
    const [year, month] = date.split('-').map(Number);
    
    // Get orders for this month
    const monthOrders = mockChangeOrders.filter(order => {
      const orderDate = new Date(order.dateSubmitted);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month - 1;
    });
    
    const changeOrderCount = monthOrders.length;
    const costImpact = monthOrders.reduce((sum, order) => sum + order.costImpact, 0);
    
    // Calculate cumulative cost impact
    const previousMonths = monthlyDates.slice(0, index);
    let cumulativeCostImpact = costImpact;
    
    previousMonths.forEach(prevDate => {
      const [prevYear, prevMonth] = prevDate.split('-').map(Number);
      const prevMonthOrders = mockChangeOrders.filter(order => {
        const orderDate = new Date(order.dateSubmitted);
        return orderDate.getFullYear() === prevYear && orderDate.getMonth() === prevMonth - 1;
      });
      cumulativeCostImpact += prevMonthOrders.reduce((sum, order) => sum + order.costImpact, 0);
    });
    
    return {
      month: new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' }),
      changeOrderCount,
      costImpact,
      cumulativeCostImpact
    };
  });
  
  // Calculate average approval time
  const approvedOrders = mockChangeOrders.filter(order => order.dateApproved);
  const totalApprovalDays = approvedOrders.reduce((sum, order) => {
    const submittedDate = new Date(order.dateSubmitted);
    const approvedDate = new Date(order.dateApproved!);
    const days = Math.floor((approvedDate.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  const averageApprovalDays = totalApprovalDays / approvedOrders.length;
  
  // Previous period for comparison (previous month)
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const prevMonthOrders = mockChangeOrders.filter(order => {
    const orderDate = new Date(order.dateSubmitted);
    return orderDate.getMonth() === prevMonth && orderDate.getFullYear() === prevYear;
  });
  
  const percentageChangeCount = prevMonthOrders.length > 0 
    ? ((currentMonthOrders.length - prevMonthOrders.length) / prevMonthOrders.length) * 100 
    : 100;
  
  const currentMonthImpact = currentMonthOrders.reduce((sum, order) => sum + order.costImpact, 0);
  const prevMonthImpact = prevMonthOrders.reduce((sum, order) => sum + order.costImpact, 0);
  
  const percentageChangeImpact = prevMonthImpact > 0 
    ? ((currentMonthImpact - prevMonthImpact) / prevMonthImpact) * 100 
    : 100;
  
  return {
    currentMonthCount: currentMonthOrders.length,
    yearToDateCount: ytdOrders.length,
    currentMonthImpact,
    yearToDateImpact: ytdOrders.reduce((sum, order) => sum + order.costImpact, 0),
    percentageChangeCount,
    percentageChangeImpact,
    industryBenchmarkCount: 15, // Mock benchmark data
    industryBenchmarkImpact: 1200000, // Mock benchmark data
    averageApprovalDays,
    topCauses,
    severityDistribution,
    monthlyData,
    statusDistribution,
    forecastedCount: 12, // Mock forecasted count
    budgetAmount: 25000000 // Mock total project budget
  };
};

export const mockChangeOrderSummary = generateChangeOrderSummary();
