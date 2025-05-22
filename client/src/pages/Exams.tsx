import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useExamsData,
  useCreateExam,
  useDeleteExam,
  useUpdateExam,
} from "@/hooks/useExams";
import { AddExamForm } from "@/components/exams/AddExamForm";
import { ExamTable } from "@/components/exams/ExamsTable";
import { ExamsSearchBar } from "@/components/exams/SearchBar";
import type { Exam, AddExam } from "@/types/exams";
import { ExamState } from "@/types/exams";
import { useClassesData } from "@/hooks/useClasses";

export const Exams = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [filters, setFilters] = useState<{
    class_id?: string;
    status?: string;
  }>({});

  const { data: exams = [], isLoading: isExamsLoading } = useExamsData();
  const { data: classes = [], isLoading: isClassesLoading } = useClassesData();

  const createExamMutation = useCreateExam();
  const deleteExamMutation = useDeleteExam();
  const updateExamMutation = useUpdateExam();


  const filteredExams = exams.filter((exam: Exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filters.class_id || String(exam.class_id) === filters.class_id;
    const matchesStatus = !filters.status || exam.status === filters.status;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleEditExam = (examId: number) => {
    setEditingExamId(examId);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: AddExam) => {
    try {
      if (editingExamId) {
        await updateExamMutation.mutateAsync({
          examId: editingExamId,
          examData: formData
        });
      } else {
        await createExamMutation.mutateAsync(formData);
      }
      setIsDialogOpen(false);
      setEditingExamId(null);
      setTableKey(prev => prev + 1);
    } catch (error) {
      console.error("Exam operation failed:", error);
      throw error;
    }
  };

  const classOptions = classes.map(cls => ({
    id: cls.id,
    name: cls.name
  }));

  const statusOptions = Object.entries(ExamState).map(([key, value]) => ({
    id: value,
    name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
  }));

  if (isExamsLoading || isClassesLoading) return (
    <div className="p-4 flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading data...
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Exam Management</h1>
          <p className="text-muted-foreground">Manage all exams in the system</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingExamId(null);
              setTableKey(prev => prev + 1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExamId ? "Edit Exam" : "Create New Exam"}
              </DialogTitle>
            </DialogHeader>
            <AddExamForm
              onSubmit={handleSubmit}
              isLoading={editingExamId ? updateExamMutation.isPending : createExamMutation.isPending}
              error={editingExamId ? updateExamMutation.error : createExamMutation.error}
              isEditMode={!!editingExamId}
              initialData={editingExamId ? exams.find((exam: Exam) => exam.id === editingExamId) : undefined}
              classOptions={classOptions}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ExamsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        currentFilters={filters}
        classOptions={classOptions}
        statusOptions={statusOptions}
      />

      <ExamTable
        key={`exam-table-${tableKey}`}
        exams={filteredExams}
        selectedExams={selectedExams}
        onSelectExams={setSelectedExams}
        onDelete={deleteExamMutation.mutate}
        onEdit={handleEditExam}
        isDeleting={deleteExamMutation.isPending}
      />

      {selectedExams.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            {selectedExams.length} exam(s) selected
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              selectedExams.forEach(id => deleteExamMutation.mutate(id));
              setSelectedExams([]);
            }}
            disabled={deleteExamMutation.isPending}
          >
            {deleteExamMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};