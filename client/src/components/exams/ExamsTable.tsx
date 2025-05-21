import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, Eye } from "lucide-react";
import type { Exam, ExamStatus } from "@/types/exams";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { ExamState } from "@/types/exams";
import { ExamDetailsDialog } from "./ExamDetailsDialog";

interface ExamTableProps {
  exams: Exam[];
  selectedExams: number[];
  onSelectExams: (ids: number[]) => void;
  onDelete: (examId: number) => void;
  onEdit: (examId: number) => void;
  isDeleting: boolean;
  isEditing?: boolean;
}

export const ExamTable = ({
  exams,
  selectedExams,
  onSelectExams,
  onDelete,
  onEdit,
  isDeleting,
  isEditing = false,
}: ExamTableProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);

  const getStatusBadgeVariant = (status: ExamStatus) => {
    switch (status) {
      case ExamState.UPCOMING:
        return "secondary";
      case ExamState.ONGOING:
        return "default";
      case ExamState.COMPLETED:
        return "outline";
      default:
        return "outline";
    }
  };
  const handleEdit = (examId: number) => {
    setOpenDropdownId(null);
    onEdit(examId);
  };

  const handleSelectAll = (checked: boolean) => {
    onSelectExams(checked ? exams.map(exam => exam.id) : []);
  };

  const handleSelectExam = (checked: boolean, examId: number) => {
    const newSelection = checked
      ? [...selectedExams, examId]
      : selectedExams.filter(id => id !== examId);
    onSelectExams(newSelection);
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedExams.length === exams.length && exams.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all exams"
              />
            </TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length > 0 ? (
            exams.map((exam) => (
              <TableRow key={exam.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedExams.includes(exam.id)}
                    onCheckedChange={(checked) => handleSelectExam(!!checked, exam.id)}
                    aria-label={`Select exam ${exam.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{exam.name}</TableCell>
                <TableCell>{`Class ${exam.class_info.name}`}</TableCell>
                <TableCell>
                  {format(new Date(exam.exam_date), "PPpp")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(exam.status)}>
                    {exam.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu
                    open={openDropdownId === exam.id}
                    onOpenChange={(open) => setOpenDropdownId(open ? exam.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenDropdownId(null);
                          setViewingExam(exam);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(exam.id)}
                        disabled={isEditing}
                      >
                        {isEditing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setOpenDropdownId(null);
                          onDelete(exam.id);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No exams found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {exams.length > 0 && (
          <TableCaption>
            Showing {exams.length} exam{exams.length !== 1 ? 's' : ''}
          </TableCaption>
        )}
      </Table>
      <ExamDetailsDialog
        exam={viewingExam}
        open={!!viewingExam}
        onOpenChange={(open) => !open && setViewingExam(null)}
      />
    </div>
  );
};