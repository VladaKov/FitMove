import psycopg2
from psycopg2.extras import RealDictCursor
import os

def get_db_connection():
    #* Подключение к БД
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'db'),
        database=os.environ.get('DB_NAME', 'notesdb'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASS', 'postgres'),
        cursor_factory=RealDictCursor
    )
    return conn
