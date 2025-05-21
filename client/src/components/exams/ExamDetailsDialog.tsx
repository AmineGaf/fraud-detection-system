import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import type { Exam } from "@/types/exams";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
  
  interface ExamDetailsDialogProps {
    exam: Exam | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export const ExamDetailsDialog = ({
    exam,
    open,
    onOpenChange,
  }: ExamDetailsDialogProps) => {
    if (!exam) return null;
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg font-semibold">{exam.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Class</h3>
                <p className="text-lg font-semibold">{exam.class_info.name}</p>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                <p className="text-lg font-semibold">
                  {format(new Date(exam.exam_date), "PPpp")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge variant={exam.status === "completed" ? "outline" : "default"}>
                  {exam.status}
                </Badge>
              </div>
            </div>
  
            {exam.fraud_status && (
              <div className="border rounded-lg p-4 bg-destructive/10">
                <h3 className="text-sm font-medium text-destructive">Fraud Detection</h3>
                <p className="mt-2 whitespace-pre-wrap">{exam.fraud_status}</p>
              </div>
            )}
  
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };