import axios from 'axios';
import type { Exam, AddExam, UpdateExam } from '@/types/exams';

const API_BASE_URL = 'http://localhost:8000';

export const fetchExams = async (skip: number = 0, limit: number = 100): Promise<Exam[]> => {
  const response = await axios.get(`${API_BASE_URL}/exams`, {
    params: { skip, limit }
  });
  return response.data;
};

export const fetchExamsByClass = async (
  classId: number,
  skip: number = 0,
  limit: number = 100
): Promise<Exam[]> => {
  const response = await axios.get(`${API_BASE_URL}/exams/class/${classId}`, {
    params: { skip, limit }
  });
  return response.data;
};

export const fetchExam = async (examId: number): Promise<Exam> => {
  const response = await axios.get(`${API_BASE_URL}/exams/${examId}`);
  return response.data;
};
export const createExam = async (examData: AddExam): Promise<Exam> => {
  const response = await axios.post(`${API_BASE_URL}/exams`, examData);
  return response.data;
};

export const updateExam = async (examId: number, examData: UpdateExam): Promise<Exam> => {
  const response = await axios.put(`${API_BASE_URL}/exams/${examId}`, examData);
  return response.data;
};

export const deleteExam = async (examId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/exams/${examId}`);
};