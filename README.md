# DocPointify

## Description :

DocPointify is a web-based application designed to streamline patient and appointment management for doctors and their personal assistant. it works like an online calendar, a virtual agenda, enabling efficient handling of patient information and appointments in a user-friendly interface.

## Table of Content :

- [Description](#description)
- [Table of Content](#table-of-content)
- 

## Features :

1. **Patient Management** :
    - Add, update, and delete patient records.
    - Store details like name, date of birth, contact information, address and additional notes. 
    
2. **Appointment Management** : 
   - Book and cancel appointments.
   - View all scheduled appointments in an organized list.

3. **User Roles** : 
   - Separate login for doctors and assistants.

4. **Secure Login** : 
   - Role-based access with login for enhanced security.

## Technologies Used :

- Frontend : HTML, CSS, JavaScript
- Backend : Python with Flask
- Database: MongoDB
- Other Tools:
    - Flask-PyMongo for database integration.
    - UUID (Universally Unique Identifier) for generating unique IDs for patients and appointments.

## Installation and Setup :

- Install Python (3.8 or higher)
- Install MongoDB
- Install pip for managing Python packages

  ## Steps :

1. Clone the repository: 
git clone <repository-url>
cd DocPointify

2. Set up a virtual environment: 
python -m venv venv

3. Install required dependencies:  
pip install -r requirements.txt

4. Start the MongoDB server:
mongod

5. Run the Flask application: 
python app.py

6. Access the web application
Open your browser and go to http://localhost:5000


## API Endpoints

**Patients**:
- GET /api/patients - Retrieve all patients.
- POST /api/patients - Add a new patient.
- GET /api/patients/<patient_id> - Retrieve a specific patient by ID.
- PUT /api/patients/<patient_id> - Update patient details.
- DELETE /api/patients/<patient_id> - Delete a patient.

**Appointments** :
- GET /api/appointments - Retrieve all appointments.
- POST /api/appointments - Add a new appointment.
- DELETE /api/appointments/<appointment_id> - Delete an appointment.

## Contributors :

- zakaria bahlaoui [https://github.com/zakariabahlaoui]
- Mkenza [https://github.com/Qkenza]
- Chaimae [https://github.com/Chaiimae]




[def]: #description