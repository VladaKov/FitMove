import api from './api'
import {ExerciseCreate, ExerciseUpdate, ExerciseResponse} from './types'

export const createExercise = async (exercise: ExerciseCreate) => {
    const response = await api.post('/exercise', exercise)
    return response.data
}

export const updateExercise = async (id: number, exercise: ExerciseUpdate) => {
    const response = await api.put(`/exercise/${id}`, exercise)
    return response.data
}

export const deleteExercise = async (id: number) => {
    const response = await api.delete(`/exercise/${id}`)
    return response.data
}

export const getExercises = async (id: number): Promise<ExerciseResponse[]> => {
    const response = await api.get(`/exercise/client/${id}`)
    return response.data
}