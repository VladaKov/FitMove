from fastapi import FastAPI, HTTPException, APIRouter
from schemas import CategoryResponse
from databaseMain import get_db_connection

router = APIRouter(tags=["category"])

@router.get("/category")
async def get_categories():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT * FROM category")
    categories = cur.fetchall()
    cur.close()
    conn.close()
    if not categories:
        raise HTTPException(status_code=404, detail="Нету категорий упражнений")
    return [CategoryResponse(**categorie) for categorie in categories]

@router.get("/category/{category_id}")
def get_category(category_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM category WHERE id = %s", (category_id,))
    category = cur.fetchone()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return CategoryResponse(**category)