# flask_script.py (Flask backend)

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import json
import joblib
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the frontend

# Load the trained model
try:
    model = joblib.load('Symptom_Based_Disease_Prediction.pkl')
except Exception as e:
    print(f"Error loading model: {str(e)}")

# Load symptom mapping from JSON
try:
    with open('symptomMap.json', 'r') as file:
        symptomMapping = json.load(file)
        print(f"Loaded symptom mapping: {symptomMapping}")
    #print(f"Available symptoms in the mapping: {list(symptomMapping.keys())}")
except Exception as e:
    print(f"Error loading symptomMapping.json: {str(e)}")
    symptomMapping = {}

disease_info_df = pd.read_csv('combined_df1.csv')

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', [])

        # Validate symptoms input
        if not symptoms or len(symptoms) != 3:
            return jsonify({"error": "Invalid symptoms input. Exactly 3 features are required."}), 400
        print(f"Received symptoms: {symptoms}")
        
        normalized_symptoms = [symptom.strip().lower().replace(' ', '_') for symptom in symptoms]
        
         # Map symptoms to numeric values
        symptoms_encoded = [symptomMapping.get(symptom, 0) for symptom in symptoms]

        print(f"Original symptoms: {symptoms}")
        print(f"Normalized symptoms: {normalized_symptoms}")
        print(f"Mapped symptoms: {symptoms_encoded}")

        # Check if any symptom couldn't be mapped
        '''if 0 in symptoms_encoded:
            return jsonify({"error": "One or more symptoms are invalid or not in the mapping."}), 400'''
         # Check if any symptom couldn't be mapped
        if 0 in symptoms_encoded:
            invalid_symptoms = [symptom for symptom, encoded in zip(symptoms, symptoms_encoded) if encoded == 0]
            return jsonify({"error": f"Invalid symptoms: {', '.join(invalid_symptoms)}. Please check if they are correctly mapped."}), 400
        

        # Extract features from request
        age = data.get('age')
        gender = data.get('gender')
        symptoms = data.get('symptoms')

        # Validate input (can be customized)
        if not age or not gender or len(symptoms) != 3:
            return jsonify({'error': 'Invalid input data'}), 400

        # Convert gender to numeric (example: Male = 1, Female = 0)
        #gender_numeric = 1 if gender.lower() == 'male' else 0'''

        # Assuming symptoms are in a predefined order, encode them
        # You should map the symptoms to corresponding feature values (example: one-hot encoding, numerical values, etc.)
        #symptom_mapping = {'itching': 1, 'skin_rash': 2, 'nodal_skin_eruptions': 3}  # Example mapping
        #symptoms_encoded = [symptom_mapping.get(symptom, 0) for symptom in symptoms]

        # Combine all features
        #features = np.array([age, gender_numeric] + symptoms_encoded).reshape(1, -1)
        # Convert symptoms to a 2D array for prediction

        symptoms_encoded.sort()
        print(f"Sorted symptoms encoding: {symptoms_encoded}")

        features = np.array(symptoms_encoded).reshape(1, -1)  # Ensure it's a 2D array
        print(f"Prepared features for prediction: {features}")


        # Get prediction from model
        prediction = model.predict(features)
        predicted_disease = prediction[0]

       # Fetch description and precaution from the CSV based on the predicted disease
        disease_row = disease_info_df[disease_info_df['Disease'].str.lower() == predicted_disease.lower()]

        if not disease_row.empty:
            description = disease_row.iloc[0]['Description']
            precaution1 = disease_row.iloc[0]['Precaution_1']
            precaution2 = disease_row.iloc[0]['Precaution_2']
            precaution3 = disease_row.iloc[0]['Precaution_3']
            precaution4 = disease_row.iloc[0]['Precaution_4']
        else:
            description = "No description available."
            precaution1 = "No precautions available."
            precaution2 = "No precautions available."
            precaution3 = "No precautions available."
            precaution4 = "No precautions available."

        print(f"Prediction: {predicted_disease}")
        print(f"Description: {description}")
        print(f"Precaution 1: {precaution1}")
        print(f"Precaution 2: {precaution2}")
        print(f"Precaution 3: {precaution3}")
        print(f"Precaution 4: {precaution4}")

        # Return prediction result along with description and precautions
        return jsonify({
            'prediction': predicted_disease,
            'description': description,
            'precaution1': precaution1,
            'precaution2': precaution2,
            'precaution3': precaution3,
            'precaution4': precaution4
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/')
def home():
    return "Flask is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
