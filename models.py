from pymongo import MongoClient

# Setting up MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['docpointify']

# MongoDB Collections
patients = db['patients']
appointments = db['appointments']
users = db['users']

class Patient:
    """Model for Patient"""
    def __init__(self, full_name, dob, phone, address, note):
        self.full_name = full_name
        self.dob = dob
        self.phone = phone
        self.address = address
        self.note = note

    def save(self):
        """Insert new patient into the 'patients' collection"""
        patient_data = {
            "full_name": self.full_name,
            "dob": self.dob,
            "phone": self.phone,
            "address": self.address,
            "note": self.note
        }
        result = patients.insert_one(patient_data)
        return result.inserted_id
    
    @classmethod
    def get_all(cls):
        """Get all patients"""
        return list(patients.find({}, {'_id': 0}))
    
    @classmethod
    def get_by_id(cls, patient_id):
        """Get a patient by their ID"""
        return patients.find_one({"_id": patient_id})
    

class Appointment:
    """Model for Appointment"""
    def __init__(self, patient_id, date, time, notes):
        self.patient_id = patient_id
        self.date = date
        self.time = time
        self.notes = notes

    def save(self):
        """Insert a new appointment into the 'appointments' collection"""
        appointment_data = {
            "patient_id": self.patient_id,
            "date": self.date,
            "time": self.time,
            "notes": self.notes
        }
        result = appointments.insert_one(appointment_data)
        return result.inserted_id

    @classmethod
    def get_all(cls):
        """Get all appointments"""
        return list(appointments.find({}, {'_id': 0}))

    @classmethod
    def get_by_id(cls, appointment_id):
        """Get an appointment by its ID"""
        return appointments.find_one({"_id": appointment_id})


class User:
    """Model for User (for login and registration)"""
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def save(self):
        """Insert a new user into the 'users' collection"""
        user_data = {
            "email": self.email,
            "password": self.password
        }
        result = users.insert_one(user_data)
        return result.inserted_id

    @classmethod
    def get_by_email(cls, email):
        """Get a user by email"""
        return users.find_one({"email": email})
