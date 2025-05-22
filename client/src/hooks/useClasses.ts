import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchClasses,
  createClass as apiCreateClass,
  updateClass as apiUpdateClass,
  deleteClass as apiDeleteClass,
} from "@/api/classes";
import type { AddClass } from "@/types/classes";
import { useAuth } from "@/context/AuthContext";

export const useClassesData = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["classes"],
    queryFn: () => fetchClasses(user?.token),
  });
};

export const useCreateClass = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classeData: AddClass) => apiCreateClass(classeData, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, classData }: { classId: number; classData: AddClass }) =>
      apiUpdateClass(classId, classData, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useDeleteClass = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classId: number) => apiDeleteClass(classId, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};