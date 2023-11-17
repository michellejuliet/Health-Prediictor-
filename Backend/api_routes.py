#!/usr/bin/python3
"""Flask app for CRUD operations on Hospital, Patient, and PatientHealthInfo models"""
from flask import Flask, jsonify, request, abort, make_response
from flask_cors import CORS
from models import storage
from models.hospital_db import Hospital
from models.patient_info import Patient
from models.health_info import PatientHealthInfo

import logging
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
    classes = ["Hospital", "Patient", "PatientHealthInfo"]
    names = ["Hospitals", "patients", "health_infos"]

    num_objs = {}
    for i in range(len(classes)):
        num_objs[names[i]] = storage.count(classes[i])
    return jsonify(num_objs)

# --- Hospital Routes ---


@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    try:
        hospitals = storage.all(Hospital).values()
        return jsonify([hospital.to_dict() for hospital in hospitals])
    finally:
        storage.close()


@app.route('/api/hospitals', methods=['POST'])
def create_hospital():
    try:
        if not request.json:
            abort(400, 'Not a JSON')
        hospital_data = request.get_json()
        hospital = Hospital(**hospital_data)
        storage.new(hospital)
        storage.save()
        return jsonify(hospital.to_dict()), 200
    finally:
        storage.close()


@app.route('/api/hospitals/<string:hospital_id>', methods=['PUT'])
def update_hospital(hospital_id):
    try:
        hospital = storage.get(Hospital, hospital_id)
        if not hospital:
            abort(404)
        if not request.json:
            abort(400, 'Not a JSON')

        data = request.get_json()
        ignore = ['id', 'created_at', 'updated_at']
        for key, value in data.items():
            if key not in ignore:
                setattr(hospital, key, value)
        storage.save()
        return jsonify(hospital.to_dict()), 200
    finally:
        storage.close()


@app.route('/api/hospitals/<string:hospital_id>', methods=['DELETE'])
def delete_hospital(hospital_id):
    try:
        hospital = storage.get(Hospital, hospital_id)
        if not hospital:
            abort(404)
        storage.delete(hospital)
        storage.save()
        return jsonify({}), 200
    finally:
        storage.close()


# --- Patient Routes ---


@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        patients = storage.all(Patient).values()
        return jsonify([patient.to_dict() for patient in patients])
    finally:
        storage.close()


@app.route('/api/patients/<patient_id>', methods=['GET'])
def get_patient_info(patient_id):
    # try:
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404
    return jsonify(patient.to_dict())
# finally:
        # storage.close()


@app.route('/api/<hospital_id>/patients', methods=['POST'])
def create_patient(hospital_id):
    try:
        if not request.json:
            abort(400, 'Not a JSON')
        patient_data = request.get_json()
        if not storage.get(Hospital, hospital_id):
            abort(404, 'Hospital not found')

        patient = Patient(hospital_id=hospital_id, **patient_data)
        storage.new(patient)
        storage.save()
        return jsonify(patient.to_dict()), 201
    finally:
        storage.close()


@app.route('/api/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    try:
        patient = storage.get(Patient, patient_id)
        if not patient:
            abort(404)
        if not request.json:
            abort(400, 'Not a JSON')

        data = request.get_json()
        ignore = ['id', 'hospital_id', 'created_at', 'updated_at']
        for key, value in data.items():
            if key not in ignore:
                setattr(patient, key, value)
        storage.save()
        return jsonify(patient.to_dict()), 200
    finally:
        storage.close()


@app.route('/api/patients/<string:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        patient = storage.get(Patient, patient_id)
        if not patient:
            abort(404)
        storage.delete(patient)
        storage.save()
        return jsonify({}), 200
    finally:
        storage.close()

# --- PatientHealthInfo Routes ---


@app.route('/api/health', methods=['GET'])
def get_health_infos():
    try:
        health_infos = storage.all(PatientHealthInfo).values()
        return jsonify([info.to_dict() for info in health_infos])
    finally:
        storage.close()


@app.route('/api/health/<patient_id>', methods=['GET'])
def get_health_info(patient_id):
    """Retrieves specific patient data."""
    # try:
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    health_info = patient.health_info
    if not health_info:
        return jsonify({'error': 'Health information not found'}), 404

    return jsonify(health_info.to_dict()), 200
    

@app.route('/api/<patient_id>/health', methods=['POST'])
def create_health_info(patient_id):
    if not request.json:
        abort(400, 'Not a JSON')
    health_info_data = request.get_json()
    if not storage.get(Patient, patient_id):
        abort(404, 'Patient not found')

    health_info = PatientHealthInfo(patient_id=patient_id)
    for key, value in health_info_data.items():
        if hasattr(health_info, key):
            setattr(health_info, key, value)

    storage.new(health_info)
    storage.save()
    return jsonify(health_info.to_dict()), 201


@app.route('/api/<patient_id>/health', methods=['GET'])
def get_patient_health_info(patient_id):
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    health_info = patient.health_info
    if not health_info:
        return jsonify({'error': 'Health information not found'}), 404

    return jsonify(health_info.to_dict()), 200



@app.route('/api/health/<string:health_id>', methods=['PUT'])
def update_health_info(health_id):
    try:
        health_info = storage.get(PatientHealthInfo, health_id)
        if not health_info:
            abort(404)
        if not request.json:
            abort(400, 'Not a JSON')

        data = request.get_json()
        ignore = ['id', 'patient_id', 'created_at', 'updated_at']
        for key, value in data.items():
            if key not in ignore:
                setattr(health_info, key, value)
        storage.save()
        return jsonify(health_info.to_dict()), 200
    finally:
        storage.close()


@app.route('/api/health/<string:health_id>', methods=['DELETE'])
def delete_health_info(health_id):
    try:
        health_info = storage.get(PatientHealthInfo, health_id)
        if not health_info:
            abort(404)
        storage.delete(health_info)
        storage.save()
        return jsonify({}), 200
    finally:
        storage.close()


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
        'gender': health_info.gender,
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
    gender = health_info.gender
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
        patient_data[f'bmi_category_{category}'] = int(
            bmi_category == category)
    for category in bp_categories:
        patient_data[f'bp_category_{category}'] = int(bp_category == category)

    # Remove the original categorical columns
    patient_data.pop('age_group', None)
    patient_data.pop('bmi_category', None)
    patient_data.pop('bp_category', None)

    return jsonify(patient_data)


@app.route('/api/patients/predict/<patient_id>', methods=['GET'])
def get_prediction(patient_id):
    """Retrieves specific patient data for ML and makes a prediction."""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Patient not found'}), 404)

    health_info = patient.health_info
    if health_info is None:
        return make_response(jsonify({'error': 'Health info not found'}), 404)

    # Process and categorize data similarly to get_mldata
    bmi_category = categorize_bmi(health_info.BMI)
    age_group = categorize_age(patient.Age)
    bp_category = categorize_bp(
        health_info.systolic_bp, health_info.diastolic_bp)

    # Prepare patient data for model prediction
    patient_data = {
        'age': int(patient.Age),
        'bmi': float(health_info.BMI),
        'height': int(health_info.height),
        'weight': int(health_info.weight),
        'gender': health_info.gender,
        'alco': int(health_info.alcohol),
        'smoke': int(health_info.smoking),
        'ap_hi': int(health_info.systolic_bp),
        'ap_lo': int(health_info.diastolic_bp),
        'active': int(health_info.activity_level),
        'gluc': int(health_info.glucose_level),
        'cholesterol': int(health_info.cholesterol_level),
        'age_group': age_group,
        'bmi_category': bmi_category,
        'bp_category': bp_category
    }

    # Assuming gender is either 'Male' or 'Female'
    gender = health_info.gender
    if gender == 'Female':
        patient_data['gender'] = 1
    elif gender == 'Male':
        patient_data['gender'] = 2
    else:
        # Handle unexpected gender value, if necessary
        patient_data['gender'] = 0  # or some other default value

    # One-hot encode categorical variables and ensure data format matches the model's expectation
    patient_df = pd.DataFrame([patient_data])
    patient_df = pd.get_dummies(patient_df)

    # Define expected features as per the model's training
    # replace with actual feature names expected by the model
    x_train_columns = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'bmi',
                       'bmi_category_Normal', 'bmi_category_Obese', 'bmi_category_Overweight', 'bmi_category_Underweight',
                       'age_group_Middle-aged', 'age_group_Senior', 'age_group_Young', 'bp_category_High-Normal',
                       'bp_category_Hypertension', 'bp_category_Normal']

    # Add missing columns with default values
    for col in x_train_columns:
        if col not in patient_df.columns:
            patient_df[col] = 0

    # Reorder columns to match model's expected input
    patient_df = patient_df[x_train_columns]

    # Make the prediction
    prediction = classifier_rf.predict(patient_df)

    # Interpret the prediction result
    likelihood = "Likely" if prediction[0] == 1 else "Unlikely"

    # Return the prediction result
    return jsonify({'prediction': likelihood})


# @app.teardown_appcontext
# def close_db(error):
#     """ Close Storage """
#     storage.close()


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
