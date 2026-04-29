from fastapi import APIRouter, HTTPException
from schemas import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from databaseMain import get_db_connection

router = APIRouter(tags=["exercise"])

@router.post("/exercise")
def create_exercise(exercise: ExerciseCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO exercises (id_category, name_exercises, repetitions, comment, id_block) 
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """, (exercise.id_category, exercise.name_exercises, exercise.repetitions, exercise.comment, exercise.id_block))
    
    # Исправлено: получаем id как словарь
    result = cur.fetchone()
    exercise_id = result['id'] if isinstance(result, dict) else result[0]
    conn.commit()
    return {"id": exercise_id, "message": "Упражнение создано"}

@router.get("/exercise/block/{id_block}")
def get_exercises_by_block(id_block: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM exercises WHERE id_block = %s", (id_block,))
    exercises = cur.fetchall()
    return [ExerciseResponse(**e) for e in exercises]

@router.get("/exercise/{id_exercise}")
def get_exercise(id_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM exercises WHERE id = %s", (id_exercise,))
    exercise = cur.fetchone()
    if not exercise:
        raise HTTPException(status_code=404, detail="Упражнение не найдено")
    return ExerciseResponse(**exercise)

@router.put("/exercise/{id_exercise}")
def update_exercise(id_exercise: int, exercise: ExerciseUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE exercises
        SET id_category = %s, name_exercises = %s, repetitions = %s, comment = %s
        WHERE id = %s
    """, (exercise.id_category, exercise.name_exercises, exercise.repetitions, exercise.comment, id_exercise))
    conn.commit()
    return {"message": "Упражнение обновлено"}

@router.delete("/exercise/{id_exercise}")
def delete_exercise(id_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM exercises WHERE id = %s", (id_exercise,))
    conn.commit()
    return {"message": "Упражнение удалено"}