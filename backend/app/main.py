from fastapi import FastAPI
from routers import routeUsers, routeClients, routeWorkout, routeExercises, routeBlockExercises, routeCategory
from model import init_db

app = FastAPI()

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