export interface UserInClass {
  id: number;
  full_name: string;
  email: string;
  is_professor: boolean;
  joined_at: string;
}

export interface Class {
  id: number;
  name: string;
  studying_program: string;
  year: number;
  capacity: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  student_count?: number;
  teacher_count?: number;
  users: UserInClass[];
}

export interface AddClass {
  name: string;
  studying_program: string;
  year: number;
  capacity: number;
  description?: string;
  is_active: boolean;
}