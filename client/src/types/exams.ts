export const ExamState = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;
export type ExamStatus = (typeof ExamState)[keyof typeof ExamState];

interface ClassInfo {
  name: string;
  studying_program: string;
}

export interface Exam {
  id: number;
  name: string;
  exam_date: string;
  class_id: number;
  status: ExamStatus;
  fraud_status?: string;
  created_at: string; 
  class_info: ClassInfo;
}

export interface AddExam {
  name: string;
  exam_date: string;
  class_id: number;
  status?: ExamStatus; 
}

export interface UpdateExam {
  name?: string;
  exam_date?: string;
  status?: ExamStatus;
  fraud_status?: string;
}