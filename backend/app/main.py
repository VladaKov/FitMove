from fastapi import FastAPI, HTTPException
from routers import routeUsers, routeClients, routeWorkout, routeExercises, routeBlockExercises, routeCategory
from model import init_db
from databaseMain import get_db_connection
from pydantic import BaseModel

app = FastAPI()

class LoginRequest(BaseModel):
    login: str
    password: str

@app.post("/login")
def login(request: LoginRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, login FROM users WHERE login = %s AND password = %s",
        (request.login, request.password)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    return {
        "user_id": user["id"],
        "name": user["name"],
        "login": user["login"]
    }

app.include_router(routeUsers.router)
app.include_router(routeClients.router)
app.include_router(routeWorkout.router)
app.include_router(routeExercises.router)
app.include_router(routeBlockExercises.router)
app.include_router(routeCategory.router)

init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)