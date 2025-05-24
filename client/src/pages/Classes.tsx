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
  useClassesData,
  useCreateClass,
  useDeleteClass,
  useUpdateClass,
} from "@/hooks/useClasses";
import { AddClassForm } from "@/components/classes/AddClassForm";
import { ClassTable } from "@/components/classes/ClassTable";
import { SearchBar } from "@/components/classes/SearchBar";
import type { Class, AddClass } from "@/types/classes";

export const Classes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [filters, setFilters] = useState<{
    program?: string;
    year?: string;
    status?: string;
  }>({});

  const { data: classes = [], isLoading: isClassesLoading } = useClassesData();
  const createClassMutation = useCreateClass();
  const deleteClassMutation = useDeleteClass();
  const updateClassMutation = useUpdateClass();

  const filteredClasses = classes.filter((cls: Class) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.studying_program && cls.studying_program.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProgram = !filters.program ||
      cls.studying_program === filters.program;

    const matchesYear = !filters.year ||
      String(cls.year) === filters.year;

    const matchesStatus = !filters.status ||
      (filters.status === "active" && cls.is_active) ||
      (filters.status === "inactive" && !cls.is_active);

    return matchesSearch && matchesProgram && matchesYear && matchesStatus;
  });

  const handleEditClass = (classId: number) => {
    setEditingClassId(classId);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: AddClass) => {
    try {
      if (editingClassId) {
        await updateClassMutation.mutateAsync({
          classId: editingClassId,
          classData: formData
        });
      } else {
        await createClassMutation.mutateAsync(formData);
      }
      setIsDialogOpen(false);
      setEditingClassId(null);
      setTableKey(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const programs = [...new Set(classes.map(cls => cls.studying_program))];

  if (isClassesLoading) return (
    <div className="p-6 flex items-center justify-center gap-3 h-[300px]">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading classes...</span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Class Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all classes in the system
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingClassId(null);
              setTableKey(prev => prev + 1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingClassId ? "Edit Class" : "Create New Class"}
              </DialogTitle>
            </DialogHeader>
            <AddClassForm
              onSubmit={handleSubmit}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingClassId(null);
              }}
              isLoading={editingClassId ? updateClassMutation.isPending : createClassMutation.isPending}
              error={editingClassId ? updateClassMutation.error : createClassMutation.error}
              classId={editingClassId}
              isEditMode={!!editingClassId}
              initialData={editingClassId ? classes.find((cls: Class) => cls.id === editingClassId) : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        currentFilters={filters}
        programs={programs}
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ClassTable
          key={`class-table-${tableKey}`}
          classes={filteredClasses}
          selectedClasses={selectedClasses}
          onSelectClasses={setSelectedClasses}
          onDelete={deleteClassMutation.mutate}
          onEdit={handleEditClass}
          isDeleting={deleteClassMutation.isPending}
          isEditing={updateClassMutation.isPending}
        />
      </div>

      {selectedClasses.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-muted/30">
          <div className="text-sm text-muted-foreground">
            {selectedClasses.length} class(es) selected
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              selectedClasses.forEach(id => deleteClassMutation.mutate(id));
              setSelectedClasses([]);
            }}
            disabled={deleteClassMutation.isPending}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            {deleteClassMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Delete Selected
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredClasses.length}</span> of{" "}
          <span className="font-medium">{classes.length}</span> classes
        </p>
      </div>
    </div>
  );
};