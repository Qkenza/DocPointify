# We need these tools to work with a MongoDB database
from flask_pymongo import PyMongo
import uuid

# The database connection starts as nothing, will be set up later
mongo = None

# Set up the database when we start our app
def setup_db(app):
    global mongo  # We're saying this variable can be used anywhere
    mongo = PyMongo(app)

# This class handles patient information and database operations
class Patient:
    def __init__(self, name, phone, address, note):
        # Every patient gets a unique ID
        self.patient_id = str(uuid.uuid4())
        self.full_name = name
        self.phone_number = phone
        self.address = address
        self.note = note

    def add_to_db(self):
        # Add this patient to our database
        patient_info = {
            'patient_id': self.patient_id,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'address': self.address,
            'note': self.note
        }
        mongo.db.patients.insert_one(patient_info)

    @staticmethod
    def fetch_all_patients():
        # Get all patient records from the database
        return list(mongo.db.patients.find())

    @staticmethod
    def find_patient_by_id(patient_id):
        # Look up a patient with their ID
        return mongo.db.patients.find_one({"patient_id": patient_id})

    @staticmethod
    def find_patient_by_name(full_name):
        # Find a patient using their full name
        return mongo.db.patients.find_one({"full_name": full_name})

    @staticmethod
    def update_patient(patient_id, new_info):
        # Change a patient's information in the database
        mongo.db.patients.update_one({"patient_id": patient_id}, {"$set": new_info})

    @staticmethod
    def remove_patient(patient_id):
        # Remove a patient from the database
        mongo.db.patients.delete_one({"patient_id": patient_id})