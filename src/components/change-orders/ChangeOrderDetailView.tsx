
import React from "react";
import { ChangeOrder } from "@/models/changeOrder";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  FileText, 
  MessageSquare, 
  Download, 
  Send, 
  Paperclip
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChangeOrderDetailViewProps {
  changeOrder: ChangeOrder;
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeOrderDetailView({ 
  changeOrder, 
  isOpen, 
  onClose 
}: ChangeOrderDetailViewProps) {
  const [newComment, setNewComment] = React.useState("");
  
  const handleAddComment = () => {
    // In a real app, this would send the comment to the server
    if (newComment.trim()) {
      alert("Comment added: " + newComment);
      setNewComment("");
    }
  };
  
  const handleDownloadDocument = () => {
    // In a real app, this would download the document
    alert("Downloading document: " + changeOrder.id);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>{changeOrder.id}: {changeOrder.title}</span>
            <Badge
              className={`
                ${changeOrder.severity === "critical" ? "bg-red-500" : 
                  changeOrder.severity === "major" ? "bg-orange-500" : "bg-blue-500"}
              `}
            >
              {changeOrder.severity}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {changeOrder.description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date Submitted</p>
                <p className="font-medium">{new Date(changeOrder.dateSubmitted).toLocaleDateString()}</p>
              </div>
            </div>
            
            {changeOrder.dateApproved && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date Approved</p>
                  <p className="font-medium">{new Date(changeOrder.dateApproved).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cost Impact</p>
                <p className="font-medium">{formatCurrency(changeOrder.costImpact)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Schedule Impact</p>
                <p className="font-medium">{changeOrder.scheduleImpact} days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Originator</p>
                <p className="font-medium">{changeOrder.originator}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Project Phase</p>
                <p className="font-medium capitalize">{changeOrder.projectPhase}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Status</h4>
            <Badge variant="outline" className={`
              ${changeOrder.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : 
                changeOrder.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : 
                changeOrder.status === "in-review" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                "bg-amber-50 text-amber-700 border-amber-200"}
            `}>
              {changeOrder.status === "in-review" ? "In Review" : 
               changeOrder.status.charAt(0).toUpperCase() + changeOrder.status.slice(1)}
            </Badge>
          </div>
          
          {changeOrder.documentUrl && (
            <div>
              <h4 className="font-medium mb-2">Documentation</h4>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleDownloadDocument}
              >
                <Download className="h-4 w-4" />
                Download Documentation
              </Button>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Comments ({changeOrder.comments.length})</h4>
            <div className="space-y-4 mb-4">
              {changeOrder.comments.length > 0 ? (
                changeOrder.comments.map(comment => (
                  <div key={comment.id} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />
              <div className="flex justify-between">
                <Button variant="outline" size="sm" type="button" className="gap-1">
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
                <Button 
                  size="sm" 
                  type="button" 
                  className="gap-1"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
