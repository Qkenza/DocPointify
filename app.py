from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
import pymongo
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # The secret key is part of Falsk's security

# Connect to MongoDB 
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['docpointify']

# Collections
patients = db['patients']
appointments = db['appointments'] # Deleted 'doctor' and ' assistant' users and united it to 'cabinet' since both users have the same roles

# For now, we have one only cabinet, we may add more later
cabinet = {
    "cabinet_name": "cabinet",
    "password": hashlib.sha256("default_password".encode()).hexdigest()
}

def hash_password(password):
    """Turn the password into a hash for security"""
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def home():
    """Show the home page if logged in"""
    if 'cabinet_id' not in session:
        return redirect(url_for('login'))
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle login for the single cabinet"""
    if request.method == 'POST':
        cabinet_name = request.form['cabinet_name']
        password = request.form['password']
        hashed_password = hash_password(password)

        if cabinet_name == cabinet['cabinet_name'] and hashed_password == cabinet['password']:
            session['cabinet_id'] = "1"  # We use a dummy ID since there's only one cabinet
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Wrong Cabinet name or password.', 'error')
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Log out from the cabinet"""
    session.clear()
    flash('Logged out.', 'success')
    return redirect(url_for('login'))

@app.route('/api/patients', methods=['GET', 'POST'])
def manage_patients():
    """Get or add patient data"""
    if request.method == 'GET':
        all_patients = list(patients.find({}, {'_id': 0}))
        return jsonify({"patients": all_patients})
    else:  # POST
        new_patient = {
            "full_name": request.form['full_name'],
            "dob": request.form['dob'],
            "phone": request.form['phone'],
            "address": request.form['address'],
            "note": request.form['note']
        }
        result = patients.insert_one(new_patient)
        flash('Patient added!', 'success')
        return redirect(url_for('home'))
    
@app.route('/api/patients/<string:patient_id>', methods=['PUT', 'DELETE'])
def update_or_delete_patient(patient_id):
    """Update or delete a patient"""
    if request.method == 'PUT':
        # Update patient
        update_data = request.form  # Assuming all data comes from form
        result = patients.update_one({"_id": patient_id}, {"$set": update_data})
        if result.modified_count > 0:
            flash('Patient updated!', 'success')
        else:
            flash('Patient not found or no changes made.', 'error')
        return redirect(url_for('home'))
    elif request.method == 'DELETE':
        # Delete patient
        result = patients.delete_one({"_id": patient_id})
        if result.deleted_count > 0:
            flash('Patient deleted!', 'success')
        else:
            flash('Patient not found.', 'error')
        return redirect(url_for('home'))

@app.route('/api/appointments', methods=['GET', 'POST'])
def manage_appointments():
    """Get or add appointment data"""
    if request.method == 'GET':
        all_appointments = list(appointments.find({}, {'_id': 0}))
        return jsonify({"appointments": all_appointments})
    else:  # POST
        new_appointment = {
            "patient_id": request.form['patient_id'],
            "date": request.form['date'],
            "time": request.form['time'],
            "notes": request.form['notes']
        }
        appointments.insert_one(new_appointment)
        flash('Appointment added!', 'success')
        return redirect(url_for('home'))
    
@app.route('/api/appointments/<string:appointment_id>', methods=['PUT', 'DELETE'])
def update_or_delete_appointment(appointment_id):
    """Update or delete an appointment"""
    if request.method == 'PUT':
        # Update appointment
        update_data = request.form
        result = appointments.update_one({"_id": appointment_id}, {"$set": update_data})
        if result.modified_count > 0:
            flash('Appointment updated!', 'success')
        else:
            flash('Appointment not found or no changes made.', 'error')
        return redirect(url_for('home'))
    elif request.method == 'DELETE':
        # Delete appointment
        result = appointments.delete_one({"_id": appointment_id})
        if result.deleted_count > 0:
            flash('Appointment deleted!', 'success')
        else:
            flash('Appointment not found.', 'error')
        return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)