from fastapi import FastAPI, HTTPException, APIRouter
from schemas import CategoryResponse
from databaseMain import get_db_connection

router = APIRouter(tags=["category"])

@router.get("/category")
async def get_categories():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM category")
    categories = cur.fetchall()
    cur.close()
    conn.close()
    if not categories:
        raise HTTPException(status_code=404, detail="Нету категорий упражнений")
    return CategoryResponse(categories=categories)