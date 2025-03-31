
import React, { useState } from "react";
import { ChangeOrder } from "@/models/changeOrder";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  FileText, 
  AlertTriangle, 
  Check, 
  Clock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ChangeOrderTableProps {
  changeOrders: ChangeOrder[];
  onRowClick: (id: string) => void;
}

export function ChangeOrderTable({ changeOrders, onRowClick }: ChangeOrderTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof ChangeOrder>("dateSubmitted");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Handle sort change
  const handleSort = (field: keyof ChangeOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Filter change orders based on search query
  const filteredOrders = changeOrders.filter(order => 
    order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: ChangeOrder["status"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" /> Approved
        </Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Rejected
        </Badge>;
      case "in-review":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <FileText className="h-3 w-3" /> In Review
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get severity badge styling
  const getSeverityBadge = (severity: ChangeOrder["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500">{severity}</Badge>;
      case "major":
        return <Badge className="bg-orange-500">{severity}</Badge>;
      case "minor":
        return <Badge className="bg-blue-500">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search change orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <button 
                  className="flex items-center"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortField === "id" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center"
                  onClick={() => handleSort("title")}
                >
                  Title
                  {sortField === "title" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center"
                  onClick={() => handleSort("dateSubmitted")}
                >
                  Date
                  {sortField === "dateSubmitted" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>
                <button 
                  className="flex items-center"
                  onClick={() => handleSort("costImpact")}
                >
                  Cost Impact
                  {sortField === "costImpact" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>Originator</TableHead>
              <TableHead>Phase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No change orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(order.id)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>{new Date(order.dateSubmitted).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getSeverityBadge(order.severity)}</TableCell>
                  <TableCell>{formatCurrency(order.costImpact)}</TableCell>
                  <TableCell>{order.originator}</TableCell>
                  <TableCell className="capitalize">{order.projectPhase}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
