import storage from './storage';
import api from './api';

const USER_ID_KEY = 'user_id';
const USER_NAME_KEY = 'user_name';

// Функция входа
export const loginUser = async (login: string, password: string): Promise<boolean> => {
    try {
        const response = await api.post('/login', { login, password });
        const { user_id, name } = response.data;

        await storage.setItem(USER_ID_KEY, String(user_id));
        await storage.setItem(USER_NAME_KEY, name);
        console.log('ID пользователя сохранен:', user_id);
        return true;
    } catch (error: any) {
        console.error('Ошибка входа:', error?.response?.data || error.message);
        return false;
    }
};

// Функция регистрации
export const registerUser = async (name: string, login: string, password: string): Promise<boolean> => {
    try {
        await api.post('/users', { name, login, password });
        return await loginUser(login, password);
    } catch (error: any) {
        console.error('Ошибка регистрации:', error?.response?.data || error.message);
        return false;
    }
};

// Получить сохраненный ID пользователя
export const getUserId = async (): Promise<number | null> => {
    const userId = await storage.getItem(USER_ID_KEY);
    return userId ? parseInt(userId) : null;
};

// Получить имя пользователя
export const getUserName = async (): Promise<string | null> => {
    return await storage.getItem(USER_NAME_KEY);
};

// Проверить, авторизован ли пользователь
export const isAuthenticated = async (): Promise<boolean> => {
    const userId = await getUserId();
    return userId !== null;
};

// Выход из аккаунта
export const logoutUser = async (): Promise<void> => {
    await storage.removeItem(USER_ID_KEY);
    await storage.removeItem(USER_NAME_KEY);
    console.log('Пользователь вышел');
};

// Изменение имя аккаунта
export const updateUserName = async (name: string): Promise<boolean> => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('Пользователь не авторизован');
        }
        await api.put(`/users/${userId}`, { name });
        await storage.setItem(USER_NAME_KEY, name);
        return true;
    } catch (error: any) {
        console.error('Ошибка обновления имени:', error?.response?.data || error.message);
        return false;
    }
}