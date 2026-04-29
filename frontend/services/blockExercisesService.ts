import api from './api'
import {BlockExerciseCreate, BlockExerciseUpdate, BlockExerciseResponse} from './types'

export const createBlockExercise = async (blockExercise: BlockExerciseCreate) => {
    const response = await api.post('/block_exercises', blockExercise)
    return response.data
}

export const updateBlockExercise = async (id: number, blockExercise: BlockExerciseUpdate) => {
    const response = await api.put(`/block_exercises/${id}`, blockExercise)
    return response.data
}

export const deleteBlockExercise = async (id: number) => {
    const response = await api.delete(`/block_exercises/${id}`)
    return response.data
}

export const getBlockExercises = async (id_workout: number): Promise<BlockExerciseResponse[]> => {
    const response = await api.get(`/block_exercises/${id_workout}`)
    return response.data
}