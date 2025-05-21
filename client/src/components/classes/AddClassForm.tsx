import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import type { AddClass, Class } from "@/types/classes";

interface AddClassFormProps {
  onSubmit: (data: AddClass) => Promise<void>;
  onSuccess: () => void;
  isLoading: boolean;
  error: unknown;
  classId?: number | null;
  isEditMode?: boolean;
  initialData?: Class;
}

export const AddClassForm = ({
  onSubmit,
  onSuccess,
  isLoading,
  error,
  classId,
  isEditMode = false,
  initialData,
}: AddClassFormProps) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<AddClass>({
    defaultValues: initialData || {
      name: "",
      studying_program: "",
      year: new Date().getFullYear(),
      capacity: 30,
      description: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : "An error occurred";

  const submitHandler = async (data: AddClass) => {
    try {
      await onSubmit(data);
      onSuccess();
      reset();
    } catch (error) {
      throw error
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
      {error as string && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name*</Label>
          <Input
            id="name"
            {...register("name", { required: "Class name is required" })}
            placeholder="Enter class name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studying_program">Program*</Label>
          <Input
            id="studying_program"
            {...register("studying_program", { required: "Program is required" })}
            placeholder="Enter program name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year*</Label>
          <Input
            id="year"
            type="number"
            {...register("year", { 
              required: "Year is required",
              valueAsNumber: true,
              min: { value: 2000, message: "Year must be after 2000" },
              max: { value: 2100, message: "Year must be before 2100" }
            })}
            placeholder="Enter year"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity*</Label>
          <Input
            id="capacity"
            type="number"
            {...register("capacity", { 
              required: "Capacity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Capacity must be at least 1" }
            })}
            placeholder="Enter capacity"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter class description (optional)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
        />
        <Label htmlFor="is_active">Active Class</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditMode ? "Update Class" : "Create Class"
          )}
        </Button>
      </div>
    </form>
  );
};