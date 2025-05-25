import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, Eye } from "lucide-react";
import type { Exam, ExamStatus } from "@/types/exams";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { ExamState } from "@/types/exams";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();


  const getStatusBadgeColor = (status: ExamStatus) => {
    switch (status) {
      case ExamState.UPCOMING:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case ExamState.ONGOING:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case ExamState.COMPLETED:
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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

  const handleViewDetails = (examId: number) => {
    setOpenDropdownId(null);
    navigate(`/exams/${examId}`);
  };

  return (
    <Table className="border-collapse">
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-muted/30">
          <TableHead className="w-[40px] px-4">
            <Checkbox
              checked={selectedExams.length === exams.length && exams.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all exams"
              className="border-muted-foreground/30"
              disabled={user?.role_id !== 3}
            />
          </TableHead>
          <TableHead className="w-[200px] px-4">Name</TableHead>
          <TableHead className="px-4">Class</TableHead>
          <TableHead className="px-4">Date</TableHead>
          <TableHead className="px-4">Status</TableHead>
          <TableHead className="text-right px-4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <TableRow key={exam.id} className="hover:bg-muted/10 border-t border-muted/20">
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedExams.includes(exam.id)}
                  onCheckedChange={(checked) => handleSelectExam(!!checked, exam.id)}
                  aria-label={`Select exam ${exam.name}`}
                  className="border-muted-foreground/30"
                  disabled={user?.role_id !== 3}
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{exam.name}</span>
                  {exam.fraud_status && (
                    <span className="text-xs text-red-500 mt-1">Fraud Detected</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-4 text-muted-foreground">
                {exam.class_info.name}
              </TableCell>
              <TableCell className="px-4">
                {format(new Date(exam.exam_date), "PPpp")}
              </TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className={getStatusBadgeColor(exam.status)}
                >
                  {exam.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right px-4">
                <DropdownMenu
                  open={openDropdownId === exam.id}
                  onOpenChange={(open) => setOpenDropdownId(open ? exam.id : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(exam.id)}
                      className="px-3 py-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEdit(exam.id)}
                      disabled={isEditing}
                      className="px-3 py-2"
                    >
                      {isEditing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      className="text-destructive px-3 py-2 focus:text-destructive"
                      onClick={() => {
                        setOpenDropdownId(null);
                        onDelete(exam.id);
                      }}
                      disabled={isDeleting || user?.role_id !== 3}
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
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground py-8">
              No exams found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};