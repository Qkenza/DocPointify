from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from pymongo import MongoClient
import hashlib
import re
import datetime
from models import Patients, Appointments # Import the models from 

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  

# Setting up MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['docpointify']

# MongoDB Collections
patients = db['patients']
appointments = db['appointments']
users = db['users'] # Collection for user data

# Simple password hashing function
def hash_password(password):
    """Make the password safe by turning it into a hash"""
    return hashlib.sha256(password.encode()).hexdigest()

# Home route: Redirects to login or appointments page based on session
@app.route('/')
def home():
    """Redirect to login or appointments page based on session"""
    if not is_logged_in():
        return redirect(url_for('login'))  # Redirect to login if not logged in
    return redirect(url_for('appointments_page'))  # Redirect to appointments page if logged in

def is_logged_in():
    """Check if the user is logged in by checking if 'user_id' is in session"""
    return 'user_id' in session

# Sign-up route: Allows users to create an account
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Register a new user account"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hashed_password = hash_password(password)

        # Check if email is already in use
        if users.find_one({"email": email}):
            flash('This email is already used. Please log in.', 'error')
        else:
            # Insert the new user into the database
            users.insert_one({
                "email": email,
                "password": hashed_password
            })
            flash('Your account has been created! You can now log in.', 'success')
            return redirect(url_for('login'))
    return render_template('signup.html')  # Render sign-up form if not POST

# Login route: Allows users to log into their account
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Log in to the user account"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hashed_password = hash_password(password)  # Hash the password before comparing

        user = users.find_one({"email": email})
        if user and user['password'] == hashed_password:  # Check email and password
            session['user_id'] = email  # Store email as user ID in session
            flash('You are logged in!', 'success')
            return redirect(url_for('appointments'))  # Redirect to the appointments page
        else:
            flash('Wrong email or password.', 'error')  # Flash an error message if login fails
    return render_template('login.html')  # Render login page if not POST


# Logout route: Logs out the current user by clearing the session
@app.route('/logout')
def logout():
    """Log out the current user"""
    session.clear()  # Clear all session data
    flash('You have logged out.', 'success')
    return redirect(url_for('login'))  # Redirect to the login page after logout
 
 # Patients Management routes
@app.route('/api/patients', methods=['GET', 'POST'])
def manage_patients():
    """Manage patients - list all or add a new one"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))  # Make sure user is logged in
    if request.method == 'GET':
        all_patients = list(patients.find({}, {'_id': 0}))  # Get all patients, hide ID
        return jsonify({"patients": all_patients})
    else:  # POST
        new_patient = {
            "full_name": request.form['full_name'],
            "dob": request.form['dob'],
            "phone": request.form['phone'],
            "address": request.form['address'],
            "note": request.form['note']
        }
        patients.insert_one(new_patient)
        flash('New patient added!', 'success')
        return redirect(url_for('home'))

@app.route('/api/patients/<string:patient_id>', methods=['PUT', 'DELETE'])
def update_or_delete_patient(patient_id):
    """Update or delete a patient's information"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))
    if request.method == 'PUT':
        # Update patient info
        update_data = request.form  # New data for the patient
        result = patients.update_one({"_id": patient_id}, {"$set": update_data})
        if result.modified_count > 0:
            flash('Patient information updated!', 'success')
        else:
            flash('Patient not found or no updates made.', 'error')
        return redirect(url_for('home'))
    elif request.method == 'DELETE':
        # Remove patient
        result = patients.delete_one({"_id": patient_id})
        if result.deleted_count > 0:
            flash('Patient removed!', 'success')
        else:
            flash('Patient not found.', 'error')
        return redirect(url_for('home'))

@app.route('/api/patients/search', methods=['GET'])
def search_patients():
    """Search for patients by name or ID"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))

    search_query = request.args.get('q')  # Get search query from URL

    if search_query:
        # Use regex to search for patients by name (case-insensitive) or ID
        regex = re.compile(search_query, re.IGNORECASE)
        patients_found = list(patients.find({"$or": [
            {"full_name": {"$regex": regex}}, 
            {"_id": search_query} 
        ]}))
    else:
        patients_found = []

    return jsonify({"patients": patients_found})

# Appointments Management routes
@app.route('/api/appointments', methods=['GET', 'POST'])
def manage_appointments():
    """Manage appointments - list all or add a new one"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))  # Check user is logged in
    if request.method == 'GET':
        all_appointments = list(appointments.find({}, {'_id': 0}))  # Get all appointments, hide ID
        return jsonify({"appointments": all_appointments})
    else:  # POST
        new_appointment = {
            "patient_id": request.form['patient_id'],
            "date": request.form['date'],
            "time": request.form['time'],
            "notes": request.form['notes']
        }

        # Check if this appointment time is already booked
        if list(appointments.find({"date": new_appointment["date"], "time": new_appointment["time"]})):
            flash("This appointment time is already taken.", "error")
            return redirect(url_for('home'))

        appointments.insert_one(new_appointment)
        flash('Appointment added!', 'success')
        return redirect(url_for('home'))

@app.route('/api/appointments/<string:appointment_id>', methods=['PUT', 'DELETE'])
def update_or_delete_appointment(appointment_id):
    """Update or cancel an appointment"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))
    if request.method == 'PUT':
        # Update appointment details
        update_data = request.form
        result = appointments.update_one({"_id": appointment_id}, {"$set": update_data})
        if result.modified_count > 0:
            flash('Appointment updated!', 'success')
        else:
            flash('Appointment not found or no updates made.', 'error')
        return redirect(url_for('home'))
    elif request.method == 'DELETE':
        # Cancel appointment
        result = appointments.delete_one({"_id": appointment_id})
        if result.deleted_count > 0:
            flash('Appointment cancelled!', 'success')
        else:
            flash('Appointment not found.', 'error')
        return redirect(url_for('home'))

@app.route('/api/appointments/search', methods=['GET'])
def search_appointments():
    """Search for appointments by ID or date"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))

    search_query = request.args.get('q')  # Get search query from URL

    if search_query:
        try:
            # Try to convert the search query to a date
            search_date = datetime.datetime.strptime(search_query, "%Y-%m-%d")
            appointments_found = list(appointments.find({"date": search_date}))
        except ValueError:
            # If it's not a date, assume it's an ID
            appointments_found = list(appointments.find({"_id": search_query}))
    else:
        appointments_found = []

    return jsonify({"appointments": appointments_found})

if __name__ == '__main__':
    app.run(debug=True)