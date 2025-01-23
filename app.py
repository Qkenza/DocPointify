from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from pymongo import MongoClient
import hashlib
import re
import datetime
from models import patients, appointments  # Import the models from models.py

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Setting up MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['docpointify']

# MongoDB Collections
patients = db['patients']
appointments = db['appointments']
users = db['users']  # Collection for user data

# Simple password hashing function
def hash_password(password):
    """Make the password safe by turning it into a hash"""
    return hashlib.sha256(password.encode()).hexdigest()

# Home route: Redirects to login or appointments page based on session
@app.route('/')
def home():
    """Redirect to login or appointments page based on session"""
    if not is_logged_in():
        return render_template('home.html')  # Show login/signup page if not logged in
    return redirect(url_for('appointments_page'))  # Redirect to appointments page if logged in

def is_logged_in():
    """Check if the user is logged in by checking if 'user_id' is in session"""
    return 'user_id' in session

# Sign-up route: Allows users to create an account
@app.route('/signup', methods=['POST'])
def signup():
    """Register a new user account"""
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
        return redirect(url_for('home'))
    return render_template('home.html')

# Login route: Allows users to log into their account
@app.route('/login', methods=['POST'])
def login():
    """Log in to the user account"""
    email = request.form['email']
    password = request.form['password']
    hashed_password = hash_password(password)  # Hash the password before comparing

    user = users.find_one({"email": email})
    if user and user['password'] == hashed_password:  # Check email and password
        session['user_id'] = email  # Store email as user ID in session
        flash('You are logged in!', 'success')
        return redirect(url_for('appointments_page'))  # Redirect to the appointments page
    else:
        flash('Wrong email or password.', 'error')  # Flash an error message if login fails
    return render_template('home.html')

# Logout route: Logs out the current user by clearing the session
@app.route('/logout')
def logout():
    """Log out the current user"""
    session.clear()  # Clear all session data
    flash('You have logged out.', 'success')
    return redirect(url_for('home'))  # Redirect to the login page after logout

# Patients Management routes

@app.route('/patients')
def patients_page():
    """Display the patients page"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in
    all_patients = list(patients.find({}, {'_id': 0}))  # Get all patients, hide ID
    return render_template('patients.html', patients=all_patients)


@app.route('/patients/add', methods=['POST'])
def add_patient():
    """Add a new patient"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in
    new_patient = {
        "full_name": request.form['full_name'],
        "dob": request.form['dob'],
        "phone": request.form['phone'],
        "address": request.form['address'],
        "note": request.form['note']
    }
    patients.insert_one(new_patient)
    flash('New patient added!', 'success')
    return redirect(url_for('patients_page'))


@app.route('/patients/delete/<string:patient_id>', methods=['GET'])
def delete_patient(patient_id):
    """Delete a patient"""
    if not is_logged_in():
        return redirect(url_for('home'))
    result = patients.delete_one({"_id": patient_id})
    if result.deleted_count > 0:
        flash('Patient removed!', 'success')
    else:
        flash('Patient not found.', 'error')
    return redirect(url_for('patients_page'))


# Update Patient Route
@app.route('/patients/update/<string:patient_id>', methods=['GET', 'POST'])
def update_patient(patient_id):
    """Update a patient's information"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in

    patient = patients.find_one({"_id": patient_id})  # Get patient by ID

    if not patient:
        flash('Patient not found.', 'error')
        return redirect(url_for('patients_page'))  # Redirect to patients page if not found

    if request.method == 'POST':
        updated_patient = {
            "full_name": request.form['full_name'],
            "dob": request.form['dob'],
            "phone": request.form['phone'],
            "address": request.form['address'],
            "note": request.form['note']
        }

        patients.update_one({"_id": patient_id}, {"$set": updated_patient})  # Update the patient
        flash('Patient updated successfully!', 'success')
        return redirect(url_for('patients_page'))  # Redirect to the patients page

    return render_template('patients.html', patient=patient)  # Render the patients page with the patient data

# Appointments Management routes

@app.route('/appointments')
def appointments_page():
    """Display the appointments page"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in
    all_appointments = list(appointments.find({}, {'_id': 0}))  # Get all appointments, hide ID
    return render_template('appointments.html', appointments=all_appointments)


@app.route('/appointments/add', methods=['POST'])
def add_appointment():
    """Add a new appointment"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in
    new_appointment = {
        "patient_id": request.form['patient_id'],
        "date": request.form['date'],
        "time": request.form['time'],
        "notes": request.form['notes']
    }

    # Check if this appointment time is already booked
    if list(appointments.find({"date": new_appointment["date"], "time": new_appointment["time"]})):
        flash("This appointment time is already taken.", "error")
        return redirect(url_for('appointments_page'))

    appointments.insert_one(new_appointment)
    flash('Appointment added!', 'success')
    return redirect(url_for('appointments_page'))


@app.route('/appointments/delete/<string:appointment_id>', methods=['GET'])
def delete_appointment(appointment_id):
    """Delete an appointment"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect to home if not logged in
    result = appointments.delete_one({"_id": appointment_id})
    if result.deleted_count > 0:
        flash('Appointment cancelled!', 'success')
    else:
        flash('Appointment not found.', 'error')
    return redirect(url_for('appointments_page'))


# Update Appointment Route
@app.route('/appointments/update/<string:appointment_id>', methods=['GET', 'POST'])
def update_appointment(appointment_id):
    """Update an appointment's details"""
    if not is_logged_in():
        return redirect(url_for('home'))  # Redirect if not logged in

    appointment = appointments.find_one({"_id": appointment_id})  # Get appointment by ID

    if not appointment:
        flash('Appointment not found.', 'error')
        return redirect(url_for('appointments_page'))  # Redirect to appointments page if not found

    if request.method == 'POST':
        updated_appointment = {
            "patient_id": request.form['patient_id'],
            "date": request.form['date'],
            "time": request.form['time'],
            "notes": request.form['notes']
        }

        appointments.update_one({"_id": appointment_id}, {"$set": updated_appointment})  # Update the appointment
        flash('Appointment updated successfully!', 'success')
        return redirect(url_for('appointments_page'))  # Redirect to the appointments page

    return render_template('appointments.html', appointment=appointment)  # Render the appointments page with the appointment data


# Search routes (for patients and appointments)
@app.route('/patients/search', methods=['GET'])
def search_patients():
    """Search for patients by name or ID"""
    if not is_logged_in():
        return redirect(url_for('home'))

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

    return render_template('patients.html', patients=patients_found)

@app.route('/appointments/search', methods=['GET'])
def search_appointments():
    """Search for appointments by ID or date"""
    if not is_logged_in():
        return redirect(url_for('home'))

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

    return render_template('appointments.html', appointments=appointments_found)


if __name__ == '__main__':
    app.run(debug=True)