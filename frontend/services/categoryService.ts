import api from './api'
import {CategoryResponse} from './types'

export const getCategories = async (): Promise<CategoryResponse[]> => {
    const response = await api.get('/categories')
    return response.data
}