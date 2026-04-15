
// Пользователь
export interface UserCreate {
    name: string;
    login: string;
    password: string;
}

export interface UserUpdate {
    name?: string;
    login?: string;
    password?: string;
}

export interface UserResponse {
    id: number;
    name: string;
    login: string;
}

// Клиент
export interface ClientCreate {
    id_users: number;
    name: string;
    contact: string;
}

export interface ClientUpdate {
    name?: string;
    contact?: string;
}

export interface ClientResponse {
    id: number;
    name: string;
    contact: string;
    id_users: number;
}

// Тренировка
export interface WorkoutCreate {
    id_client: number;
    name_workout: string;
    date: string;
}

export interface WorkoutUpdate {
    name_workout?: string;
    date?: string;
}

export interface WorkoutResponse {
    id: number;
    name_workout: string;
    date: string;
    id_client: number;
}

// Категория
export interface CategoryResponse {
    id: number;
    name_category: string;
}

// Упражнение
export interface ExerciseCreate {
    id_category?: number | null;
    name_exercises: string;
    repetitions: number;
    comment?: string | null;
}

export interface ExerciseUpdate {
    name_exercises?: string;
    repetitions?: number;
    comment?: string | null;
}

export interface ExerciseResponse {
    id: number;
    name_exercises: string;
    repetitions: number;
    comment: string | null;
    id_category: number | null;
}

// Блок упражнений
export interface BlockExerciseCreate {
    id_workout: number;
    id_exercises: number;
    number_block: number;
}

export interface BlockExerciseUpdate {
    number_block?: number;
    id_exercises?: number;
}

export interface BlockExerciseResponse {
    id: number;
    id_workout: number;
    id_exercises: number;
    number_block: number;
}