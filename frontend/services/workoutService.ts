import api from './api';
import {WorkoutCreate, WorkoutUpdate, WorkoutResponse} from './types';

export const createWorkout = async (workout: WorkoutCreate) => {
    const response = await api.post('/workout', workout);
    return response.data
}

export const updateWorkout = async (id: number, workout: WorkoutUpdate) => {
    const response = await api.put(`/workout/${id}`, workout);
    return response.data
}

export const deleteWorkout = async (id: number) => {
    const response = await api.delete(`/workout/${id}`);
    return response.data
}

export const getWorkoutClient = async (client_id: number): Promise<WorkoutResponse[]> => {
    const response = await api.get(`/workout/client/${client_id}`);
    return response.data
}

export const getWorkoutUser = async (user_id: number): Promise<WorkoutResponse[]> => {
    const response = await api.get(`/workout/user/${user_id}`);
    return response.data
}