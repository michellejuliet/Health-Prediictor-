#!/usr/bin/python3

"""
This module is an API that performs various operations on the database.
"""

from flask import Flask, jsonify, request, make_response, abort
from models import storage
from models.main_patient_data import Patient
from flask_cors import CORS
import logging

# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
import pandas as pd
import joblib

# Load the trained model from the file
classifier_rf = joblib.load('model.pkl')


app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False


@app.route('/api/status', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"status": "OK"})


@app.route('/api/stats', methods=['GET'], strict_slashes=False)
def number_objects():
    """ Retrieves the number of each objects by type """
    classes = ["Patient"]
    names = ["patients"]

    num_objs = {}
    for i in range(len(classes)):
        num_objs[names[i]] = storage.count(classes[i])
    return jsonify(num_objs)


@app.route('/api/patients', methods=['GET'])
def get_all_patients():
    """Retrieves all patients"""
    # all_patients = storage.all(Patient).values()

    # patients_lst = []
    # for patient in all_patients:
    #     patients_lst.append(patient.to_dict())

    # return jsonify(patients_lst)
    try:
        # Retrieve all patients
        all_patients = storage.all(Patient).values()

        patients_lst = []
        for patient in all_patients:
            patients_lst.append(patient.to_dict())

        return jsonify(patients_lst)
    except Exception as e:
        # Properly handle exceptions and log them
        logging.error(f"Error in get_all_patients: {e}")
        # Rollback the transaction if an exception occurs
        storage.rollback()
        return make_response(jsonify({'error': 'An error occurred'}), 500)


@app.route('/api/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Retrieves a specific patient"""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Not found'}), 404)
    return jsonify(patient.to_dict())


@app.route('/api/patients', methods=['POST'])
def add_patient():
    """Add patient data to the database"""
    if not request.json:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'first_name' not in request.get_json():
        abort(400, description="Missing name")
    data = request.get_json()
    instance = Patient(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 200)


@app.route('/api/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """Update patient data in the database"""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Not found'}), 404)
    if not request.json:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    data = request.get_json()
    for key, value in data.items():
        setattr(patient, key, value)
    patient.save()
    # storage.save()
    # storage.commit()
    # storage.close()
    return jsonify(patient.to_dict())


@app.route('/api/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """Delete patient data in the database"""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Not found'}), 404)
    patient.delete()
    storage.save()
    # storage.commit()
    # storage.close()
    return make_response(jsonify({'success': 'Successfully deleted'}), 200)


@app.route('/api/patients/ml/<patient_id>', methods=['GET'])
def get_mldata(patient_id):
    """Retrieves specific patient data for ML, including categorized information."""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Patient not found'}), 404)

    # Assuming health_info is a related object in Patient model
    health_info = patient.health_info

    if health_info is None:
        return make_response(jsonify({'error': 'Health info not found'}), 404)

    # Categorize BMI, age, and blood pressure
    bmi_category = categorize_bmi(health_info.BMI)
    age_group = categorize_age(patient.Age)
    bp_category = categorize_bp(
        health_info.systolic_bp, health_info.diastolic_bp)

    # Extract patient data
    patient_data = {
        'age': int(patient.Age),
        'bmi': float(health_info.BMI),
        'height': int(health_info.height),
        'weight': int(health_info.weight),
        'cardio': int(health_info.cardio),
        'gender': patient.gender,
        'alco': int(health_info.alcohol),
        'smoke': int(health_info.smoking),
        'ap_hi': int(health_info.diastolic_bp),
        'ap_lo': int(health_info.systolic_bp),
        'active': int(health_info.activity_level),
        'gluc': int(health_info.glucose_level),
        'cholesterol': int(health_info.cholesterol_level),
        'age_group': age_group,
        'bmi_category': bmi_category,
        'bp_category': bp_category
    }

    # Define possible categories for each categorical field
    age_group_categories = ['Young', 'Middle-aged', 'Senior']
    bmi_categories = ['Normal', 'Obese', 'Overweight', 'Underweight']
    bp_categories = ['High-Normal', 'Hypertension', 'Normal']

    # Assuming gender is either 'Male' or 'Female'
    gender = patient.gender
    if gender == 'Female':
        patient_data['gender'] = 1
    elif gender == 'Male':
        patient_data['gender'] = 2
    else:
        # Handle unexpected gender value, if necessary
        patient_data['gender'] = 0  # or some other default value



    # Initialize all category columns to 0 and set the appropriate ones to 1
    for category in age_group_categories:
        patient_data[f'age_group_{category}'] = int(age_group == category)
    for category in bmi_categories:
        patient_data[f'bmi_category_{category}'] = int(bmi_category == category)
    for category in bp_categories:
        patient_data[f'bp_category_{category}'] = int(bp_category == category)

    # Remove the original categorical columns
    patient_data.pop('age_group', None)
    patient_data.pop('bmi_category', None)
    patient_data.pop('bp_category', None)

    return jsonify(patient_data)


# Define your categorization functions (same as in your training script)


def categorize_bmi(BMI):
    bmi = float(BMI)
    if bmi < 18.5:
        return 'Underweight'
    elif 18.5 <= bmi < 25:
        return 'Normal'
    elif 25 <= bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'


def categorize_age(Age):
    age = int(Age)
    if age < 40:
        return 'Young'
    elif 40 <= age < 60:
        return 'Middle-aged'
    else:
        return 'Senior'


def categorize_bp(ap_hi, ap_lo):
    ap_hi = int(ap_hi)
    ap_lo = int(ap_lo)
    if ap_hi < 120 and ap_lo < 80:
        return 'Normal'
    elif ap_hi >= 140 or ap_lo >= 90:
        return 'Hypertension'
    else:
        return 'High-Normal'


@app.route('/api/patients/predict/<patient_id>', methods=['GET'])
def get_prediction(patient_id):
    """Retrieves specific patient data for ML and makes a prediction."""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Patient not found'}), 404)

    # Categorize BMI, age, and blood pressure
    bmi_category = categorize_bmi(patient.BMI)
    age_group = categorize_age(patient.Age)
    bp_category = categorize_bp(patient.systolic_bp, patient.diastolic_bp)

    # Extract patient data and convert types
    patient_data = {
        'age': int(patient.Age),
        'bmi': float(patient.BMI),
        'height': int(patient.height),
        'weight': int(patient.weight),
        'gender': patient.gender,
        'alco': int(patient.alcohol),
        'smoke': int(patient.smoking),
        'ap_hi': int(patient.diastolic_bp),
        'ap_lo': int(patient.systolic_bp),
        'active': int(patient.activity_level),
        'gluc': int(patient.glucose_level),
        'cholesterol': int(patient.cholesterol_level),
        'age_group': age_group,
        'bmi_category': bmi_category,
        'bp_category': bp_category
    }

    # One-hot encode categorical variables
    patient_df = pd.DataFrame([patient_data])
    patient_df = pd.get_dummies(patient_df)
    
    # Remove one-hot encoded gender columns if they exist
    patient_df.drop(columns=['gender_Female', 'gender_Male'], errors='ignore', inplace=True)

    # Define the expected features
    x_train_columns = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'bmi', 
                    'bmi_category_Normal', 'bmi_category_Obese', 'bmi_category_Overweight', 'bmi_category_Underweight', 
                    'age_group_Middle-aged', 'age_group_Senior', 'age_group_Young', 'bp_category_High-Normal', 
                    'bp_category_Hypertension', 'bp_category_Normal']

    # Add any missing columns from x_train_columns to patient_df
    for col in x_train_columns:
        if col not in patient_df.columns:
            patient_df[col] = 0  # Add missing columns with default value 0

    # Reorder columns in patient_df to match x_train_columns
    patient_df = patient_df[x_train_columns]

    # Predict using the classifier
    prediction = classifier_rf.predict(patient_df)

    # Interpret the prediction result
    likelihood = "Likely" if prediction[0] == 1 else "Unlikely"

    # Return the prediction result
    return jsonify({'prediction': likelihood})

@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
