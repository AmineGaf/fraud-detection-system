export const ExamState = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;
export type ExamStatus = (typeof ExamState)[keyof typeof ExamState];

interface ClassInfo {
  id: number;
  name: string;
  studying_program: string;
}

export interface FraudEvidence {
  id?: number;
  examId: number;
  timestamp: string;
  screenshot: string;
  detections: Array<{
    class_id: number;
    class_name: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
}

export interface Exam {
  id: number;
  name: string;
  exam_date: string;
  class_id: number;
  status: ExamStatus;
  sale?: string;
  fraud_status?: string | null;
  fraud_evidence?: FraudEvidence[] | null;
  created_at: string;
  updated_at?: string;
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
  sale?: string;
  fraud_status?: string | null;
  fraud_evidence?: FraudEvidence[] | null;
}

// For API responses
export interface ExamApiResponse {
  data: Exam;
  message?: string;
}

export interface ExamsApiResponse {
  data: Exam[];
  count?: number;
}