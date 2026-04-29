import api from './api'
import {CategoryResponse} from './types'

export const getCategories = async (): Promise<CategoryResponse[]> => {
    const response = await api.get('/category')
    return response.data
}

export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
    const response = await api.get(`/category/${id}`)
    return response.data
}