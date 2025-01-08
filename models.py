from flask_pymongo import PyMongo
import uuid

# The database connection starts as nothing, will be set up later
mongo = None

# Set up the database when we start our app
def setup_db(app):
    global mongo  # We're saying this variable can be used anywhere
    mongo = PyMongo(app)

# Patient Model
class Patient:
    def __init__(self, full_name, dob, phone, address, note):
        self.patient_id = str(uuid.uuid4())  # Unique identifier for each patient
        self.full_name = full_name
        self.dob = dob  # Date of birth
        self.phone = phone
        self.address = address
        self.note = note

    def add_to_db(self):
        """ Adds a patient to the database """
        patient_info = {
            'patient_id': self.patient_id,
            'full_name': self.full_name,
            'dob': self.dob,
            'phone': self.phone,
            'address': self.address,
            'note': self.note
        }
        mongo.db.patients.insert_one(patient_info)

    @staticmethod
    def fetch_all_patients():
        """ Fetch all patients from the database """
        return list(mongo.db.patients.find({}, {'_id': False}))

    @staticmethod
    def find_patient_by_id(patient_id):
        """ Fetch a single patient by their patient_id """
        return mongo.db.patients.find_one({"patient_id": patient_id}, {'_id': False})

    @staticmethod
    def update_patient(patient_id, new_info):
        """ Update a patient's data in the database """
        mongo.db.patients.update_one({"patient_id": patient_id}, {"$set": new_info})

    @staticmethod
    def remove_patient(patient_id):
        """ Remove a patient from the database """
        mongo.db.patients.delete_one({"patient_id": patient_id})

# Appointment Model
class Appointment:
    def __init__(self, patient_id, doctor_name, date, time, notes):
        self.appointment_id = str(uuid.uuid4())  # Unique identifier for each appointment
        self.patient_id = patient_id
        self.doctor_name = doctor_name
        self.date = date
        self.time = time
        self.notes = notes

    def add_to_db(self):
        """ Adds an appointment to the database """
        appointment_info = {
            'appointment_id': self.appointment_id,
            'patient_id': self.patient_id,
            'doctor_name': self.doctor_name,
            'date': self.date,
            'time': self.time,
            'notes': self.notes
        }
        mongo.db.appointments.insert_one(appointment_info)

    @staticmethod
    def fetch_all_appointments():
        """ Fetch all appointments from the database """
        return list(mongo.db.appointments.find({}, {'_id': False}))

    @staticmethod
    def find_appointment_by_id(appointment_id):
        """ Fetch a single appointment by their appointment_id """
        return mongo.db.appointments.find_one({"appointment_id": appointment_id}, {'_id': False})

    @staticmethod
    def update_appointment(appointment_id, new_info):
        """ Update an appointment's information """
        mongo.db.appointments.update_one({"appointment_id": appointment_id}, {"$set": new_info})

    @staticmethod
    def remove_appointment(appointment_id):
        """ Remove an appointment from the database """
        mongo.db.appointments.delete_one({"appointment_id": appointment_id})
