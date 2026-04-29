from fastapi import APIRouter, HTTPException
from schemas import WorkoutCreate, WorkoutUpdate, WorkoutResponse, WorkoutResponseName
from databaseMain import get_db_connection
from typing import List

router = APIRouter(tags=["workout"])

@router.post("/workout")
def create_workout(workout: WorkoutCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Разные запросы в зависимости от переданных полей
    if workout.id_client is not None and workout.id_users is not None:
        cur.execute("""
            INSERT INTO workout (id_client, id_users, name_workout, date) 
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (workout.id_client, workout.id_users, workout.name_workout, workout.date))
    elif workout.id_client is not None:
        cur.execute("""
            INSERT INTO workout (id_client, name_workout, date) 
            VALUES (%s, %s, %s) RETURNING id
        """, (workout.id_client, workout.name_workout, workout.date))
    elif workout.id_users is not None:
        cur.execute("""
            INSERT INTO workout (id_users, name_workout, date) 
            VALUES (%s, %s, %s) RETURNING id
        """, (workout.id_users, workout.name_workout, workout.date))
    else:
        cur.execute("""
            INSERT INTO workout (name_workout, date) 
            VALUES (%s, %s) RETURNING id
        """, (workout.name_workout, workout.date))
    
    # Исправлено: получаем id как словарь
    result = cur.fetchone()
    workout_id = result['id'] if isinstance(result, dict) else result[0]
    conn.commit()
    return {"id": workout_id, "message": "Тренировка создана"}

# Остальные методы без изменений...
@router.get("/workout/client/{client_id}")
def get_workout_client(client_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workout WHERE id_client = %s", (client_id,))
    workouts = cur.fetchall()
    return [WorkoutResponse(**w) for w in workouts]

@router.get("/workout/client/name/{client_id}")
def get_workout_name_client(client_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name_workout, date FROM workout WHERE id_client = %s", (client_id,))
    workouts = cur.fetchall()
    return [WorkoutResponseName(**w) for w in workouts]

@router.get("/workout/user/{users_id}")
def get_workout_user(users_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workout WHERE id_users = %s", (users_id,))
    workouts = cur.fetchall()
    return [WorkoutResponse(**w) for w in workouts]

@router.get("/workout/user/name/{users_id}")
def get_workout_name_user(users_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name_workout, date FROM workout WHERE id_users = %s", (users_id,))
    workouts = cur.fetchall()
    return [WorkoutResponseName(**w) for w in workouts]

@router.put("/workout/{workout_id}")
def update_workout(workout_id: int, workout: WorkoutUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE workout SET name_workout = %s, date = %s WHERE id = %s",
        (workout.name_workout, workout.date, workout_id))
    conn.commit()
    return {"message": "Тренировка обновлена"}

@router.delete("/workout/{workout_id}")
def delete_workout(workout_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM workout WHERE id = %s", (workout_id,))
    conn.commit()
    return {"message": "Тренировка удалена"}