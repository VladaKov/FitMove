from fastapi import FastAPI
from routers import routeUsers as users, routeClients as clients
from model import init_db

app = FastAPI()

app.include_router(users.router)
app.include_router(clients.router)

init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)