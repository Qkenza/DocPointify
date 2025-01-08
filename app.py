from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
import pymongo
from bson import ObjectId
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# MongoDB client setup

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['docpointify']
patient_collection = db['patients']
appointments_collection = db['appointments']

# Home Route - Serves the home page
@app.route('/')
def home():
    """ Serve the home page """
    return render_template('home.html')  # Serve home.html from the templates folder

# Appointments Route - Serves the appointments page
@app.route('/appointments')
def appointments():
    """ Serve the appointments page """
    return render_template('appointments.html')  # Serve appointments.html from templates folder

# Patients Route - Serves the patients page
@app.route('/patients')
def patients():
    """ Serve the patients page """
    return render_template('patients.html')  # Serve patients.html from templates folder

# API Route to get all patients
@app.route('/api/patients', methods=['GET'])
def get_patients():
    """ Retrieve all patients from the database """
    patients = list(patient_collection.find({}, {'_id': False}))  # Get all patients without '_id' field
    return jsonify({"patients": patients})

# API Route to add a new patient
@app.route('/api/patients', methods=['POST'])
def add_patient():
    """ Add a new patient to the database """
    patient_data = request.json
    patient = {
        "full_name": patient_data['full_name'],
        "dob": patient_data['dob'],
        "phone": patient_data['phone'],
        "address": patient_data['address'],
        "note": patient_data['note']
    }
    result = patient_collection.insert_one(patient)
    return jsonify({"message": "Patient added successfully!", "patient_id": str(result.inserted_id)}), 201

# API Route to get a specific patient by ID
@app.route('/api/patients/<string:patient_id>', methods=['GET'])
def get_patient_by_id(patient_id):
    """ Retrieve a specific patient by ID """
    patient = patient_collection.find_one({"_id": ObjectId(patient_id)}, {'_id': False})
    if patient:
        return jsonify({"patient": patient})
    else:
        return jsonify({"message": "Patient not found"}), 404
    
# API Route to update a patient
@app.route('/api/patients/<string:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """ Update an existing patient's details """
    patient_data = request.json
    updated_data = {
        "full_name": patient_data['full_name'],
        "dob": patient_data['dob'],
        "phone": patient_data['phone'],
        "address": patient_data['address'],
        "note": patient_data['note']
    }
    result = patient_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": updated_data})
    if result.matched_count > 0:
        return jsonify({"message": "Patient updated successfully!"})
    else:
        return jsonify({"message": "Patient not found"}), 404
    
# API Route to delete a patient
@app.route('/api/patients/<string:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """ Delete a patient from the database """
    result = patient_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Patient deleted successfully!"})
    else:
        return jsonify({"message": "Patient not found"}), 404
    
# API Route to get all appointments
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    """ Retrieve all appointments from the database """
    appointments = list(appointments_collection.find({}, {'_id': False}))  # Get all appointments without '_id' field
    return jsonify({"appointments": appointments})

# API Route to add a new appointment
@app.route('/api/appointments', methods=['POST'])
def add_appointment():
    """ Add a new appointment to the database """
    appointment_data = request.json
    appointment = {
        "patient_id": appointment_data['patient_id'],
        "doctor_name": appointment_data['doctor_name'],
        "date": appointment_data['date'],
        "time": appointment_data['time'],
        "notes": appointment_data['notes']
    }
    result = appointments_collection.insert_one(appointment)
    return jsonify({"message": "Appointment added successfully!", "appointment_id": str(result.inserted_id)}), 201

# API Route to delete an appointment
@app.route('/api/appointments/<string:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    """ Delete an appointment from the database """
    result = appointments_collection.delete_one({"_id": ObjectId(appointment_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Appointment deleted successfully!"})
    else:
        return jsonify({"message": "Appointment not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)

# credentials storage
users_db = {
    'doctor': {'username': 'doctor123', 'password': 'doctorpassword'},  # Doctor credentials
    'assistant': {'username': 'assistant123', 'password': 'assistantpassword'}  # Assistant credentials
}

# Sign-Up Route for Doctor
@app.route('/signup_doctor', methods=['GET', 'POST'])
def signup_doctor():
    """ Handle signup for doctor """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the username already exists
        existing_user = db.users.find_one({"username": username})
        if existing_user:
            flash('Username already taken. Please choose another one.', 'warning')
        else:
            # Create a new doctor user and store in the database
            db.users.insert_one({"username": username, "password": password, "role": "doctor"})
            flash('Doctor account created successfully!', 'success')
            return redirect(url_for('login'))

    return render_template('signup_doctor.html')

# Sign-Up Route for Assistant
@app.route('/signup_assistant', methods=['GET', 'POST'])
def signup_assistant():
    """ Handle signup for assistant """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the username already exists
        existing_user = db.users.find_one({"username": username})
        if existing_user:
            flash('Username already taken. Please choose another one.', 'warning')
        else:
            # Create a new assistant user and store in the database
            db.users.insert_one({"username": username, "password": password, "role": "assistant"})
            flash('Assistant account created successfully!', 'success')
            return redirect(url_for('login'))

    return render_template('signup_assistant.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    """ Handle login for doctor and assistant """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the username and password are correct (use hashed password for security in production)
        user = db.users.find_one({"username": username})
        if user and user['password'] == password:  # Replace with hashed password comparison in real applications
            session['user_id'] = str(user['_id'])
            session['role'] = user['role']
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid credentials. Please try again.', 'danger')

    return render_template('login.html')

# Logout Route           
@app.route('/logout')
def logout():
    """ Log the user out and clear the session """
    session.clear()  # This will remove all session data
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))  # Redirect back to the login page

