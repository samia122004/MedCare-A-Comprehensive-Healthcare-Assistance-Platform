from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from rapidfuzz import process, fuzz
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Log request information
@app.before_request
def log_request_info():
    print(f"Request Path: {request.path}, Args: {request.args}")

# Database connection parameters
db_config = {
    'dbname': 'Users',  # Replace with your database name  "drug_databases"
    'user': 'postgres',          # Replace with your PostgreSQL username
    'password': 'postgresql',          # Replace with your PostgreSQL password "1234"
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

        # Fetch all drug names for fuzzy matching
        cursor.execute("SELECT drug_name FROM public.drugs")
        all_drug_names = [row["drug_name"] for row in cursor.fetchall()]

        # Apply fuzzy matching
        best_match_result = process.extractOne(query, all_drug_names, scorer=fuzz.WRatio)

        if not best_match_result:
            return jsonify({'error': 'No close match found'}), 404
        
        best_match = best_match_result[0]   # Safe unpacking
        score = best_match_result[1] if len(best_match_result) > 1 else None

         # Set a threshold for considering a suggestion (e.g., 80% similarity)
        '''SUGGESTION_THRESHOLD = 80  

        if score and score < SUGGESTION_THRESHOLD:
            return jsonify({'message': f'Did you mean "{best_match}"?'}), 200'''
        
        sql_query = """
        SELECT drug_name, generic_name, drug_class, indications, dosage_form, strength, 
               mechanism_of_action, side_effects, contraindications, interactions, warnings_and_precautions, 
               pregnancy_category, storage_conditions
        FROM public.drugs
        WHERE drug_name ILIKE %s
        """
        #cursor.execute(sql_query, (f'%{query}%',))
        cursor.execute(sql_query, (best_match,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        if not results:
            return jsonify({'message': 'No results found'}), 404

        return jsonify(results)
    
    except psycopg2.Error as e:
        return jsonify({'error': 'Database query error', 'details': str(e)}), 500
    

# Search Suggestions API endpoint (Autocomplete)
@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    query = request.args.get('query', '')

    if not query:
        return jsonify([])

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cursor:
                sql_query = """
                SELECT DISTINCT drug_name FROM public.drugs
                WHERE drug_name ILIKE %s
                ORDER BY drug_name
                LIMIT 10
                """
                cursor.execute(sql_query, (f'{query}%',))
                results = [row[0] for row in cursor.fetchall()]

        return jsonify(results)
    except psycopg2.Error as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Database query error', 'details': str(e)}), 500

# Fetch all drug data for the Explore Page
@app.route('/api/drugs', methods=['GET'])
def get_all_drugs():
    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                sql_query = """
                SELECT drug_name, side_effects, dosage_form, strength, 
                       warnings_and_precautions, interactions       
                FROM public.drugs
                """
                cursor.execute(sql_query)
                results = cursor.fetchall()

        return jsonify(results)
    except psycopg2.Error as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Database query error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)
