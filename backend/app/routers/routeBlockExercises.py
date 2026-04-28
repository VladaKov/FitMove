from fastapi import FastAPI, HTTPException, APIRouter
from schemas import BlockExerciseCreate, BlockExerciseResponse, BlockExerciseUpdate
from databaseMain import get_db_connection

router = APIRouter(tags=["block_exercises"])

@router.post("/block_exercises")
def create_block_exercise(block_exercise: BlockExerciseCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO block_exercises (id_workout, number_block) VALUES (%s, %s,)"
        ,(block_exercise.id_workout, block_exercise.number_block))
    conn.commit()
    return {"message": "блок создан"}


@router.put("/block_exercises/{id_block_exercise}")
def update_block_exercise(id_block_exercise: int, block_exercise: BlockExerciseUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE block_exercises SET id_exercises = %s WHERE id = %s", (block_exercise.id_exercises, id_block_exercise))
    conn.commit()
    return {"message": "блок обновлен"}


@router.delete("/block_exercises/{id_block_exercise}")
def delete_block_exercise(id_block_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM block_exercises WHERE id = %s", (id_block_exercise,))
    conn.commit()
    return {"message": "блок удален"}


@router.get("/block_exercises/{id_workout}")
def get_block_exercise(workout_id_block_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM block_exercises WHERE id_workout = %s", (workout_id_block_exercise,))
    block_exercises = cur.fetchone()
    if block_exercises is None:
        raise HTTPException(status_code=404, detail="блок не найден")
    return [BlockExerciseResponse(**block_exercise) for block_exercise in block_exercises]