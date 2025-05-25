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
import { useAuth } from "@/context/AuthContext";

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

  const { user } = useAuth();
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
    <div className="p-6 flex items-center justify-center gap-3 h-[300px]">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading exams data...</span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Exam Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all system exams
          </p>
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
          {
            user?.role_id === 3 && (
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="h-4 w-4" />
                  Add Exam
                </Button>
              </DialogTrigger>
            )
          }

          <DialogContent className="sm:max-w-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
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

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ExamTable
          key={`exam-table-${tableKey}`}
          exams={filteredExams}
          selectedExams={selectedExams}
          onSelectExams={setSelectedExams}
          onDelete={deleteExamMutation.mutate}
          onEdit={handleEditExam}
          isDeleting={deleteExamMutation.isPending}
        />
      </div>

      {selectedExams.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-muted/30">
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
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            {deleteExamMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Delete Selected
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredExams.length}</span> of{" "}
          <span className="font-medium">{exams.length}</span> exams
        </p>
      </div>
    </div>
  );
};