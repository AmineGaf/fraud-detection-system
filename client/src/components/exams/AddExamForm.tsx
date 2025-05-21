import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import type { AddExam, Exam, ExamStatus } from "@/types/exams";
import { ExamState } from "@/types/exams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";

interface AddExamFormProps {
  onSubmit: (data: AddExam) => Promise<void>;
  isLoading: boolean;
  error: unknown;
  isEditMode?: boolean;
  initialData?: Exam;
  classOptions: { id: number; name: string }[];
}

export const AddExamForm = ({
  onSubmit,
  isLoading,
  error,
  isEditMode = false,
  initialData,
  classOptions,
}: AddExamFormProps) => {
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<AddExam>({
    defaultValues: initialData || {
      name: "",
      exam_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      class_id: classOptions[0]?.id || 0,
      status: ExamState.UPCOMING,
    },
  });

  const errorMessage = typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "An error occurred";

  const submitHandler = async (data: AddExam) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
      {error as string && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Exam Name*</Label>
        <Input
          id="name"
          {...register("name", { required: "Exam name is required" })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class_id">Class*</Label>
          <Select
            onValueChange={(value) => setValue("class_id", Number(value))}
            defaultValue={initialData?.class_id.toString() || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class_id && (
            <p className="text-sm text-red-500">{errors.class_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select
            onValueChange={(value) => setValue("status", value as ExamStatus)}
            defaultValue={initialData?.status || ExamState.UPCOMING}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ExamState).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exam_date">Exam Date and Time*</Label>
        <Input
          id="exam_date"
          type="datetime-local"
          {...register("exam_date", { required: "Exam date is required" })}
        />
        {errors.exam_date && (
          <p className="text-sm text-red-500">{errors.exam_date.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full mt-6">
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isEditMode ? "Update Exam" : "Create Exam"}
      </Button>
    </form>
  );
};