import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Class } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BulkAssignToolbarProps {
  selectedUsers: number[];
  classes: Class[];
  onAssign: (classId: number) => Promise<void>;
  onCancel: () => void;
  isAssigning?: boolean;
}

export function BulkAssignToolbar({
  selectedUsers = [],
  classes,
  onAssign,
  onCancel,
  isAssigning = false,
}: BulkAssignToolbarProps) {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [localIsAssigning, setLocalIsAssigning] = useState(false);
  const selectedClass = classes.find((cls) => cls.id === selectedClassId);

  if (selectedUsers.length === 0) {
    return null;
  }

  const handleAssign = async () => {
    if (!selectedClassId) return;
    
    setLocalIsAssigning(true);
    try {
      await onAssign(selectedClassId);
      toast.success(`Assigned ${selectedUsers.length} users to class`);
      setSelectedClassId(null);
    } catch (error) {
      toast.error("Failed to assign users to class");
    } finally {
      setLocalIsAssigning(false);
    }
  };

  const totalIsAssigning = isAssigning || localIsAssigning;

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bg-background p-3 shadow-lg rounded-md border flex items-center gap-3 z-50">
      <Badge variant="secondary" className="px-2 py-1">
        {selectedUsers.length} selected
      </Badge>

      <select
        className="border rounded-md px-3 py-1.5 text-sm min-w-[200px]"
        value={selectedClassId || ""}
        onChange={(e) => setSelectedClassId(Number(e.target.value) || null)}
        disabled={totalIsAssigning}
      >
        <option value="">Select class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name} ({cls.studying_program} - {cls.year})
          </option>
        ))}
      </select>

      <Button
        size="sm"
        disabled={!selectedClassId || totalIsAssigning}
        onClick={handleAssign}
      >
        {totalIsAssigning ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Assigning...
          </span>
        ) : (
          <>
            <CheckIcon className="mr-2 h-4 w-4" />
            Assign
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={totalIsAssigning}
      >
        <XIcon className="h-4 w-4" />
      </Button>

      {selectedClass && (
        <div className="ml-2 text-sm text-muted-foreground">
          Capacity: {selectedClass.capacity} students
        </div>
      )}
    </div>
  );
}