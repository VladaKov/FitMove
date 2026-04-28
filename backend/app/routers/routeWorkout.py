from fastapi import FastAPI, HTTPException, APIRouter
from schemas import WorkoutCreate, WorkoutUpdate, WorkoutResponse, WorkoutResponseName
from databaseMain import get_db_connection

router = APIRouter(tags=["workout"])

@router.post("/workout")
def create_workout(workout: WorkoutCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO workout (id_client, name_workout, date) VALUES (%s, %s, %s)"
        ,(workout.id_client, workout.name_workout, workout.date))
    conn.commit()
    return {"message": "Тренировка создана"}


# TODO client
@router.get("/workout/client/{client_id}")
def get_workout_client(client_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workout WHERE id_client = %s", (client_id,))
    workout = cur.fetchall()
    if not workout:
        # raise HTTPException(status_code=404, detail="Тренировка не найдена")
        return []
    return [WorkoutResponse(**workout) for workout in workout]

@router.get("/workout/client/name/{client_id}")
def get_workout_name_client(client_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name_workout, date FROM workout WHERE id_client = %s", (client_id,))
    workout = cur.fetchall()
    if not workout:
        raise HTTPException(status_code=404, detail="Тренировка не найдена")
    return [WorkoutResponseName(**workout) for workout in workout]


# TODO user
@router.get("/workout/user/{users_id}")
def get_workout_user(users_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workout WHERE id_user = %s", (users_id,))
    workout = cur.fetchall()
    if not workout:
        raise HTTPException(status_code=404, detail="Тренировка не найдена")
    return [WorkoutResponse(**workout) for workout in workout]

@router.get("/workout/user/name/{users_id}")
def get_workout_name_user(users_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name_workout, date FROM workout WHERE id_user = %s", (users_id,))
    workout = cur.fetchall()
    if not workout:
        raise HTTPException(status_code=404, detail="Тренировка не найдена")
    return [WorkoutResponseName(**workout) for workout in workout]


@router.put("/workout/{workout_id}")
def update_workout(workout_id: int, workout: WorkoutUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE workout SET name_workout = %s, date = %s WHERE id = %s"
        ,(workout.name_workout, workout.date, workout_id))
    conn.commit()
    return {"message": "Тренировка обновлена"}


@router.delete("/workout/{workout_id}")
def delete_workout(workout_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM workout WHERE id = %s", (workout_id,))
    conn.commit()
    return {"message": "Тренировка удалена"}