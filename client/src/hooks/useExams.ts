// src/hooks/useExams.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExams,
  fetchExamsByClass,
  fetchExam,
  createExam as apiCreateExam,
  updateExam as apiUpdateExam,
  deleteExam as apiDeleteExam,
} from "@/api/exams";
import type { Exam, AddExam, UpdateExam } from "@/types/exams";
import { useAuth } from "@/context/AuthContext";

export const useExamsData = (classId?: number, skip: number = 0, limit: number = 100) => {
  const { user } = useAuth();
  return useQuery<Exam[]>({
    queryKey: classId ? ["exams", classId, skip, limit] : ["exams", skip, limit],
    queryFn: classId
      ? () => fetchExamsByClass(classId, skip, limit)
      : () => fetchExams(skip, limit, user?.token),
  });
};

// Add error handling to other hooks as needed
export const useExamData = (examId: number) => {
  return useQuery<Exam, Error>({
    queryKey: ["exams", examId],
    queryFn: () => fetchExam(examId),
    enabled: !!examId,
  });
};

export const useCreateExam = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<Exam, Error, AddExam>({
    mutationFn: (examData: AddExam) => apiCreateExam(examData, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation<Exam, Error, { examId: number; examData: UpdateExam }>({
    mutationFn: ({ examId, examData }) => apiUpdateExam(examId, examData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", data.id] });
      if (data.class_id) {
        queryClient.invalidateQueries({ queryKey: ["exams", data.class_id] });
      }
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: apiDeleteExam,
    onSuccess: (_, examId) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.removeQueries({ queryKey: ["exams", examId] });
    },
  });
};