from fastapi import APIRouter, HTTPException
from schemas import BlockExerciseCreate, BlockExerciseResponse, BlockExerciseUpdate
from databaseMain import get_db_connection

router = APIRouter(tags=["block_exercises"])

@router.post("/block_exercises")
def create_block_exercise(block_exercise: BlockExerciseCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO blockExercises (id_workout, number_block) VALUES (%s, %s) RETURNING id",
        (block_exercise.id_workout, block_exercise.number_block))
    result = cur.fetchone()
    block_id = result['id'] if isinstance(result, dict) else result[0]
    conn.commit()
    return {"id": block_id, "message": "Блок создан"}

@router.put("/block_exercises/{id_block_exercise}")
def update_block_exercise(id_block_exercise: int, block_exercise: BlockExerciseUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE blockExercises SET number_block = %s WHERE id = %s",
        (block_exercise.number_block, id_block_exercise))
    conn.commit()
    return {"message": "Блок обновлен"}

@router.delete("/block_exercises/{id_block_exercise}")
def delete_block_exercise(id_block_exercise: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM blockExercises WHERE id = %s", (id_block_exercise,))
    conn.commit()
    return {"message": "Блок удален"}

@router.get("/block_exercises/{id_workout}")
def get_block_exercises(id_workout: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM blockExercises WHERE id_workout = %s", (id_workout,))
    block_exercises = cur.fetchall()
    return [BlockExerciseResponse(**b) for b in block_exercises]