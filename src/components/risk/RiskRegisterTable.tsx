
import { useState } from "react";
import { Plus, Edit, Trash, Check, X } from "lucide-react";
import { Risk } from "@/models/risk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const RISK_CATEGORIES = [
  "Financial",
  "Technical",
  "Operational",
  "Legal",
  "Market",
  "Environmental",
  "Regulatory",
  "Strategic",
  "Other",
];

const DEFAULT_RISK: Risk = {
  id: "",
  category: "Financial",
  description: "",
  consequence: "",
  likelihood: "Medium",
  impact: "Medium",
  mitigation: "",
  owner: "",
  status: "Not Started",
  contingency: "",
};

interface RiskRegisterTableProps {
  risks: Risk[];
  onRiskAdded: (risk: Risk) => void;
  onRiskUpdated: (risk: Risk) => void;
  onRiskDeleted: (riskId: string) => void;
}

export function RiskRegisterTable({
  risks,
  onRiskAdded,
  onRiskUpdated,
  onRiskDeleted,
}: RiskRegisterTableProps) {
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [newRisk, setNewRisk] = useState<Risk>({...DEFAULT_RISK, id: `RISK-${risks.length + 1}`});
  const [editRisk, setEditRisk] = useState<Risk | null>(null);

  const handleAddRisk = () => {
    setIsAddingRisk(true);
    setNewRisk({...DEFAULT_RISK, id: `RISK-${risks.length + 1}`});
  };

  const handleCancelAdd = () => {
    setIsAddingRisk(false);
  };

  const handleSaveNewRisk = () => {
    onRiskAdded(newRisk);
    setIsAddingRisk(false);
    setNewRisk({...DEFAULT_RISK, id: `RISK-${risks.length + 2}`});
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRiskId(risk.id);
    setEditRisk({...risk});
  };

  const handleCancelEdit = () => {
    setEditingRiskId(null);
    setEditRisk(null);
  };

  const handleSaveEdit = () => {
    if (editRisk) {
      onRiskUpdated(editRisk);
      setEditingRiskId(null);
      setEditRisk(null);
    }
  };

  const handleDeleteRisk = (riskId: string) => {
    onRiskDeleted(riskId);
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Not Started":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Risk Register</h2>
        <Button onClick={handleAddRisk} disabled={isAddingRisk}>
          <Plus className="mr-2 h-4 w-4" />
          Add Risk
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Risk ID</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[180px]">Risk Description</TableHead>
              <TableHead className="w-[180px]">Potential Consequence</TableHead>
              <TableHead className="w-[110px]">Likelihood</TableHead>
              <TableHead className="w-[110px]">Impact</TableHead>
              <TableHead className="w-[180px]">Mitigation Strategy</TableHead>
              <TableHead className="w-[120px]">Risk Owner</TableHead>
              <TableHead className="w-[140px]">Mitigation Status</TableHead>
              <TableHead className="w-[180px]">Contingency Plan</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingRisk && (
              <TableRow>
                <TableCell>
                  <Input 
                    value={newRisk.id} 
                    onChange={(e) => setNewRisk({...newRisk, id: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={newRisk.category} 
                    onValueChange={(value) => setNewRisk({...newRisk, category: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    value={newRisk.description} 
                    onChange={(e) => setNewRisk({...newRisk, description: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newRisk.consequence} 
                    onChange={(e) => setNewRisk({...newRisk, consequence: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={newRisk.likelihood} 
                    onValueChange={(value: "Low" | "Medium" | "High") => setNewRisk({...newRisk, likelihood: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    value={newRisk.impact} 
                    onValueChange={(value: "Low" | "Medium" | "High") => setNewRisk({...newRisk, impact: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    value={newRisk.mitigation} 
                    onChange={(e) => setNewRisk({...newRisk, mitigation: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newRisk.owner} 
                    onChange={(e) => setNewRisk({...newRisk, owner: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={newRisk.status} 
                    onValueChange={(value: "Not Started" | "In Progress" | "Completed") => setNewRisk({...newRisk, status: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    value={newRisk.contingency} 
                    onChange={(e) => setNewRisk({...newRisk, contingency: e.target.value})}
                    className="w-full"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleSaveNewRisk}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {risks.map((risk) => (
              <TableRow key={risk.id}>
                {editingRiskId === risk.id ? (
                  // Edit mode
                  <>
                    <TableCell>
                      <Input 
                        value={editRisk?.id || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, id: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={editRisk?.category || ''} 
                        onValueChange={(value) => setEditRisk(editRisk ? {...editRisk, category: value} : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editRisk?.description || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, description: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editRisk?.consequence || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, consequence: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={editRisk?.likelihood || 'Medium'} 
                        onValueChange={(value: "Low" | "Medium" | "High") => setEditRisk(editRisk ? {...editRisk, likelihood: value} : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Likelihood" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={editRisk?.impact || 'Medium'} 
                        onValueChange={(value: "Low" | "Medium" | "High") => setEditRisk(editRisk ? {...editRisk, impact: value} : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editRisk?.mitigation || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, mitigation: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editRisk?.owner || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, owner: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={editRisk?.status || 'Not Started'} 
                        onValueChange={(value: "Not Started" | "In Progress" | "Completed") => setEditRisk(editRisk ? {...editRisk, status: value} : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editRisk?.contingency || ''} 
                        onChange={(e) => setEditRisk(editRisk ? {...editRisk, contingency: e.target.value} : null)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  // View mode
                  <>
                    <TableCell>{risk.id}</TableCell>
                    <TableCell>{risk.category}</TableCell>
                    <TableCell className="max-w-[180px] truncate" title={risk.description}>
                      {risk.description}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate" title={risk.consequence}>
                      {risk.consequence}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLikelihoodColor(risk.likelihood)}>
                        {risk.likelihood}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getImpactColor(risk.impact)}>
                        {risk.impact}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate" title={risk.mitigation}>
                      {risk.mitigation}
                    </TableCell>
                    <TableCell>{risk.owner}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate" title={risk.contingency}>
                      {risk.contingency}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRisk(risk)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRisk(risk.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {risks.length === 0 && !isAddingRisk && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4 text-muted-foreground">
                  No risks have been added to the register yet. Click "Add Risk" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
