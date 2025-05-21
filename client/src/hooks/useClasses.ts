import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchClasses,
  createClass as apiCreateClass,
  updateClass as apiUpdateClass,
  deleteClass as apiDeleteClass,
} from "@/api/classes";
import type { AddClass } from "@/types/classes";

export const useClassesData = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCreateClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, classData }: { classId: number; classData: AddClass }) =>
      apiUpdateClass(classId, classData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classId: number) => apiDeleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};