from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import uuid

app = Flask(__name__)

# MongoDB URI setup 
app.config["MONGO_URI"] = "mongodb://localhost:27017/docpointify"
mongo = PyMongo(app)

@app.route('/add_patient', methods=['POST'])
def add_patient():
    # Get data from the request
    data = request.get_json()

    # Validate inputs (you can add more validation logic if necessary)
    if 'full_name' not in data or 'phone_number' not in data or 'address' not in data or 'note' not in data:
        return jsonify({'error': 'Missing fields in the request'}), 400

    # Generate a unique patient ID
    patient_id = str(uuid.uuid4())

    # Prepare the patient data to insert into MongoDB
    patient_data = {
        'patient_id': patient_id,
        'full_name': data['full_name'],
        'phone_number': data['phone_number'],
        'address': data['address'],
        'note': data['note']
    }

    # Insert the patient data into MongoDB
    patients_collection = mongo.db.patients
    patients_collection.insert_one(patient_data)

    return jsonify({'message': 'Patient added successfully', 'patient_id': patient_id}), 201

if __name__ == '__main__':
    app.run(debug=True)
