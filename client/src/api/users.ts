import type { Class } from '@/types/users';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const createUser = async (userData: {
  full_name: string;
  email: string;
  institutional_id?: string;
  role_id: number;
  password?: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  await axios.delete(`${API_BASE_URL}/users/${userId}`);
};


export const fetchClasses = async (): Promise<Class[]> => {
  const response = await axios.get(`${API_BASE_URL}/classes`);
  return response.data.map((classItem: any) => ({
    id: classItem.id,
    name: classItem.name,
    studying_program: classItem.studying_program,
    year: classItem.year,
    capacity: classItem.capacity,
    description: classItem.description,
    is_active: classItem.is_active,
    created_at: classItem.created_at
  }));
};

export const assignClassToUser = async ({
  userId,
  classId
}: {
  userId: number;
  classId: number;
}): Promise<{ success: boolean }> => {
  const response = await axios.post(
    `${API_BASE_URL}/users/${userId}/assign-class?class_id=${classId}`
  );
  return response.data;
};

export const bulkAssignClass = async ({
  userIds,
  classId
}: {
  userIds: number[];
  classId: number;
}): Promise<{ success: boolean; count: number }> => {
  const response = await axios.post(
    `${API_BASE_URL}/users/bulk-assign`,
    { 
      user_ids: userIds,
      class_id: classId
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const removeUserFromClass = async ({
  userId,
  classId
}: {
  userId: number;
  classId: number;
}): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}/remove-class/${classId}`
  );
  return response.data;
};