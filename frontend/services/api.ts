import axios from 'axios';
import { Platform } from 'react-native';
import storage from './storage';

const getApiUrl = (): string => {
    if (Platform.OS === 'web') {
        return 'http://localhost:8000';
    }
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
};

const api = axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const userId = await storage.getItem('user_id');
    if (userId) {
        config.headers['X-User-Id'] = userId;
        console.log(`Заголовок X-User-Id: ${userId}`);
    }
    return config;
});

export default api;