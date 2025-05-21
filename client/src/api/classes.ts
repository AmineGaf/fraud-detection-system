import type { AddClass, Class } from '@/types/classes';
import type { User } from '@/types/users';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


export const fetchClasses = async (): Promise<Class[]> => {
    const response = await axios.get(`${API_BASE_URL}/classes`);
    return response.data;
};

export const createClass = async (classData: AddClass) => {
    const response = await axios.post(`${API_BASE_URL}/classes`, classData);
    return response.data;
};

export const updateClass = async (classId: number, classData: AddClass) => {
    const response = await axios.put(`${API_BASE_URL}/classes/${classId}`, classData);
    return response.data;
};

export const deleteClass = async (classId: number) => {
    await axios.delete(`${API_BASE_URL}/classes/${classId}`);
};


export const fetchUsersByClass = async (classId: number): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/classes/${classId}/users`);
    return response.data;
  };