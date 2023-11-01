#!/usr/bin/python3

"""
This module is an API that performs various operations on the database.
"""

from flask import Flask, jsonify, request, make_response, abort
from models import storage
from models.main_patient_data import Patient
from flask_cors import CORS

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
    all_patients = storage.all(Patient).values()
    patients_lst = []
    for patient in all_patients:
        patients_lst.append(patient.to_dict())

    return jsonify(patients_lst)


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
    return jsonify(patient.to_dict())


@app.route('/api/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """Delete patient data in the database"""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Not found'}), 404)
    patient.delete()
    storage.save()
    return make_response(jsonify({}), 200)


@app.route('/api/patients/ml/<patient_id>', methods=['GET'])
def get_mldata(patient_id):
    """Retrieves specific patient data for ML"""
    patient = storage.get(Patient, patient_id)
    if patient is None:
        return make_response(jsonify({'error': 'Patient not found'}), 404)

    # Define the list of keys to extract
    keys_to_extract = [
        'id', 'age', 'gender', 'height', 'weight',
        'blood_pressure', 'cholesterol', 'glucose',
        'smoke', 'alcohol', 'active',
    ]
    # Extract data for the specified keys
    extracted_data = {key: getattr(patient, key, '')
                      for key in keys_to_extract}

    return jsonify(extracted_data)


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
