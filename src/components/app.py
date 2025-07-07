from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Log request information
@app.before_request
def log_request_info():
    print(f"Request Path: {request.path}, Args: {request.args}")

# Database connection parameters
db_config = {
    'dbname': 'drug_databases',  # Replace with your database name
    'user': 'postgres',          # Replace with your PostgreSQL username
    'password': '1234',          # Replace with your PostgreSQL password
    'host': 'localhost',         # Replace with your host if not localhost
    'port': 5432                 # Default PostgreSQL port
}

# Test database connection
try:
    conn = psycopg2.connect(**db_config)
    print("Connected to the database successfully!")
    conn.close()
except Exception as e:
    print(f"Error connecting to the database: {e}")
    exit(1)

# Search API endpoint
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query', '')

    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        sql_query = """
        SELECT drug_name, generic_name, drug_class, indications, dosage_form, strength, 
               mechanism_of_action, side_effects, contraindications, interactions, warnings_and_precautions, 
               pregnancy_category, storage_conditions
        FROM public.drugs
        WHERE drug_name ILIKE %s
        """
        cursor.execute(sql_query, (f'%{query}%',))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        if not results:
            return jsonify({'message': 'No results found'}), 404

        return jsonify(results)
    except psycopg2.Error as e:
        return jsonify({'error': 'Database query error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
