import axios from 'axios';
import { Platform } from 'react-native';

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

export default api;