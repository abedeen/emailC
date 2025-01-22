from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from sqlite3 import Error

#app = Flask(__name__)
app = Flask(__name__, static_folder='emailC/dist/email-c/browser')

def create_connection():
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect('database.db')
        return conn
    except Error as e:
        print(e)
    return conn

def create_table():
    """ create a table if not exists """
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()



@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_static_file(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/renderAndDownloadTemplate', methods=['POST'])
def add_data():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Extract fields from JSON data
        '''name = data['name']
        age = data['age']

        # Create a database connection
        conn = create_connection()
        cursor = conn.cursor()
        
        # Insert data into the table
        cursor.execute("INSERT INTO data (name, age) VALUES (?, ?)", (name, age))
        conn.commit()
        conn.close()'''

        return jsonify({"message": "Data inserted successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    create_table()
    app.run(debug=True)