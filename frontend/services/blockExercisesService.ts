import api from './api'
import {BlockExerciseCreate, BlockExerciseUpdate, BlockExerciseResponse} from './types'

export const createBlockExercise = async (blockExercise: BlockExerciseCreate) => {
    const response = await api.post('/block-exercises', blockExercise)
    return response.data
}

export const updateBlockExercise = async (id: number, blockExercise: BlockExerciseUpdate) => {
    const response = await api.put(`/block-exercises/${id}`, blockExercise)
    return response.data
}

export const deleteBlockExercise = async (id: number) => {
    const response = await api.delete(`/block-exercises/${id}`)
    return response.data
}

export const getBlockExercise = async (id: number): Promise<BlockExerciseResponse[]> => {
    const response = await api.get(`/block-exercises/${id}`)
    return response.data
}