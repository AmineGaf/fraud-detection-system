import type { AddClass, Class } from '@/types/classes';
import type { User } from '@/types/users';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


export const fetchClasses = async (token?: string): Promise<Class[]> => {
    const response = await axios.get(`${API_BASE_URL}/classes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const createClass = async (classData: AddClass, token?: string) => {
    const response = await axios.post(`${API_BASE_URL}/classes`, classData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateClass = async (classId: number, classData: AddClass, token?: string) => {
    const response = await axios.put(`${API_BASE_URL}/classes/${classId}`, classData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteClass = async (classId: number, token?: string) => {
    await axios.delete(`${API_BASE_URL}/classes/${classId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


export const fetchUsersByClass = async (classId: number): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/classes/${classId}/users`);
    return response.data;
};