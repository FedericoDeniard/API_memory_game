import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
def start_connection():
    connected = None
    try:
        connection = psycopg2.connect(
            host="localhost",
            user="postgres",
            database="memory_game",
            password="Piazzolla123"
        )
        print('Connection established')
        connected = connection
    except Exception as e:
        print(e)

    return connected

def save_record(conection, score: dict):
    cursor = conection.cursor(cursor_factory=RealDictCursor)
    id, username, time, date = score.values()
    if not check_id(cursor, id):
        cursor.execute(
        """
            INSERT INTO scores (id, username, time, date) 
            VALUES (%s, %s, %s, %s);
            """, (id, username, time, date)
        )
    else:
        cursor.execute(
                    """
                    UPDATE scores
                    SET time = %s, date = %s
                    WHERE id = %s;
                    """, (time, date, id)
                )
    conection.commit()
    conection.close()

def get_scores(conection):
    result = []
    cursor = conection.cursor()
    cursor.execute("SELECT * FROM scores")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description] 
    for row in rows:
        row_dict = dict(zip(columns, row))
        if isinstance(row_dict.get('date'), datetime):
            row_dict['date'] = row_dict['date'].strftime('%Y/%m/%d %H:%M')
        result.append(row_dict)
    conection.close()
    print(result)
    return result




def check_id(cursor, id):
    cursor.execute(
        "SELECT id FROM scores WHERE id = %s", (id,)
    )
    result = cursor.fetchone()
    print(result is not None)
    return result is not None

