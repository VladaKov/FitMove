from fastapi import FastAPI, HTTPException, APIRouter
from schemas import ClientCreate, ClientUpdate, ClientResponse
from databaseMain import get_db_connection

router = APIRouter(tags=["clients"])

@router.post("/clients")
def create_client(client: ClientCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO clients (name, contact, id_users) VALUES (%s, %s, %s)"
        ,(client.id_users ,client.name, client.contact))
    conn.commit()
    return {"message": "Клиент создан"}

@router.get("/clients/{client_id}")
def get_client(client_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
    client = cursor.fetchone()
    if client is None:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return ClientResponse(**client)

@router.patch("/clients/{client_id}")
def update_client(client_id: int, client: ClientUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE clients SET name = %s, contact = %s WHERE id = %s"
        ,(client.name, client.contact, client_id))
    conn.commit()
    return {"message": "Клиент обновлен"}

@router.delete("/clients/{client_id}")
def delete_client(client_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clients WHERE id = %s", (client_id,))
    conn.commit()
    return {"message": "Клиент удален"}