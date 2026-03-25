from fastapi import FastAPI, HTTPException, APIRouter
from schemas import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from databaseMain import get_db_connection

router = APIRouter(tags=["exercise"])

@router.post("/exercise")
def create_exercise(exercise: ExerciseCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO exercises (id_category, name_exercises, repetitions, comment) VALUES (%s, %s, %s, %s)"
        , (exercise.id_category, exercise.name_exercises, exercise.repetitions, exercise.comment))
    conn.commit()
    return {"message": "Упражнение создано"}

@router.get("/exercise")
def get_exercises():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM exercises")
    exercises = cur.fetchall()
    if exercises is None:
        raise HTTPException(status_code=404, detail="Упражнения не найдены")
    return ExerciseResponse(**exercises)

@router.put("/exercise/{id_exercise}")
def update_exercise(id_exercise: int, exercise: ExerciseUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE exercises SET id_category = %s, name_exercises = %s, repetitions = %s, comment = %s WHERE id = %s"
        , (exercise.id_category, exercise.name_exercises, exercise.repetitions, exercise.comment, id_exercise))
    conn.commit()
    return {"message": "Упражнение обновлено"}

@router.delete("/exercise/{id_exercise}")
def delete_exercise(id_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM exercises WHERE id = %s", (id_exercise,))
    conn.commit()
    return {"message": "Упражнение удалено"}