from fastapi import FastAPI, HTTPException, APIRouter
from schemas import UserCreate, UserUpdate, UserResponse, UserUpdateName
from databaseMain import get_db_connection

router = APIRouter(tags=["users"])

@router.post("/users")
def create_user(user: UserCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name, login, password) VALUES (%s, %s, %s)"
        ,(user.name, user.login, user.password))
    conn.commit()
    return {"message": "Пользователь создан"}

@router.get("/users/{user_id}")
def get_user(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return UserResponse(**user)

@router.put("/users/{user_id}")
def update_user(user_id: int, user: UserUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET name = %s, login = %s, password = %s WHERE id = %s"
        ,(user.name, user.login, user.password, user_id))
    conn.commit()
    return {"message": "Данные пользователя обновлены"}

@router.put("/users/name/{user_id}")
def update_user_name(user_id: int, user: UserUpdateName):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET name = %s WHERE id = %s", (user.name, user_id,))
    conn.commit()
    return {"message": "Имя пользователя обновлено"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    return {"message": "Пользователь удален"}