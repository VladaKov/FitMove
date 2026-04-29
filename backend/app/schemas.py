from pydantic import BaseModel
from typing import Optional
from datetime import date

#* Пользователь
class UserCreate(BaseModel):
    name: str
    login: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    login: str

class UserUpdateName(BaseModel):
    name: str

#* Клиент
class ClientCreate(BaseModel):
    id_users: int
    name: str
    contact: str

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None

class ClientResponse(BaseModel):
    id: int
    name: str
    contact: str
    id_users: int


#* Тренировки
class WorkoutCreate(BaseModel):
    id_client: Optional[int] = None
    id_users: Optional[int] = None
    name_workout: str
    date: date

class WorkoutUpdate(BaseModel):
    name_workout: Optional[str] = None
    date: Optional[date] = None

class WorkoutResponse(BaseModel):
    id: int
    name_workout: str
    date: date
    id_client: Optional[int] = None
    id_users: Optional[int] = None

class WorkoutResponseName(BaseModel):
    name_workout: str
    date: date


#* категории
class CategoryResponse(BaseModel):
    id: int
    name_category: str


#* Упражнения
class ExerciseCreate(BaseModel):
    id_category: Optional[int] = None
    name_exercises: str
    repetitions: int
    comment: Optional[str] = None
    id_block: int

class ExerciseUpdate(BaseModel):
    name_exercises: Optional[str] = None
    repetitions: Optional[int] = None
    comment: Optional[str] = None
    id_category: Optional[int] = None

class ExerciseResponse(BaseModel):
    id: int
    name_exercises: str
    repetitions: int
    comment: Optional[str] = None
    id_category: Optional[int] = None
    id_block: Optional[int] = None


#* Блоки
class BlockExerciseCreate(BaseModel):
    id_workout: int
    number_block: int

class BlockExerciseResponse(BaseModel):
    id: int
    id_workout: int
    number_block: int

class BlockExerciseUpdate(BaseModel):
    number_block: Optional[int] = None