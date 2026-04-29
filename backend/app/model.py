import psycopg2
from databaseMain import get_db_connection

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    # Сиквенс для всех таблиц
    cur.execute("""
        CREATE SEQUENCE IF NOT EXISTS global_id_seq
        START WITH 1
        INCREMENT BY 1;
    """)

    # Таблицы с пользователем и все для клиентов
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            name VARCHAR(50) NOT NULL,
            login VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(50) NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            id_users BIGINT REFERENCES users(id),
            name VARCHAR(50) NOT NULL,
            contact VARCHAR(255) NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS workout (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            id_client BIGINT REFERENCES clients(id),
            id_users BIGINT REFERENCES users(id),
            name_workout VARCHAR(50) NOT NULL,
            date DATE NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS category (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            name_category VARCHAR(50) NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS blockExercises (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            id_workout BIGINT REFERENCES workout(id),
            number_block INT NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS exercises (
            id BIGINT PRIMARY KEY DEFAULT nextval('global_id_seq'),
            id_category BIGINT REFERENCES category(id),
            id_block BIGINT REFERENCES blockExercises(id),
            name_exercises VARCHAR(50) NOT NULL,
            repetitions INT NOT NULL,
            comment VARCHAR(255) NOT NULL
        );
    """)
    # Заполнение таблицы категорий
    cur.execute("""
        INSERT INTO category (name_category)
        SELECT * FROM (VALUES
            ('Большая грудная'),
            ('Широчайшая'),
            ('Бицепс'),
            ('Трицепс'),
            ('Квадрицепс'),
            ('Бицепс бедра'),
            ('Прямая мышца живота'),
            ('Косые мышцы живота'),
            ('Большая ягодичная')
        ) AS v(name_category)
        WHERE NOT EXISTS (SELECT 1 FROM category WHERE category.name_category = v.name_category);
    """)
    conn.commit()
    cur.close()
    conn.close()

"""
Таблицы с пользователем и все для клиентов
users - пользователи
clients - клиенты
workout - тренировки
category - категории упражнений
exercises - упражнения
blockExercises - блоки упражнений
"""
