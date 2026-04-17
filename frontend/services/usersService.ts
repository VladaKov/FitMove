import api from './api';
import { UserCreate, UserUpdate, UserResponse, UserUpdateName } from './types';

export const createUser = async (user: UserCreate) => {
    const response = await api.post('/users', user);
    return response.data;
}

export const updateUser = async (id: number, user: UserUpdate) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
}

export const updateUserName = async (id: number, user: UserUpdateName) => {
    const response = await api.patch(`/users/name/${id}`, user);
    return response.data;
}

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

export const getUser = async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data as UserResponse;
}
