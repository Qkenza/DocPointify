# DocPointify

## Description :

DocPointify is a web-based application designed to streamline patient and appointment management for doctors and their cabinet staff or assistant. it works like an online calendar, a virtual agenda, enabling efficient handling of patient information and appointments in a user-friendly interface.

## Table of Content :

- [Description](#description-)
- [Table of Content](#table-of-content-)
- [Features](#features-)
- [Technologies Used](#technologies-used-)
- [Installation and Setup](#installation-and-setup-)
    - [Steps](#steps-)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors-)


## Features :

1. **Patient Management** :
    - Add, update, and delete patient records.
    - Store details like name, date of birth, contact information, address and additional notes.
    - Search for patients by name or ID. 
    
2. **Appointment Management** : 
   - Book, update and cancel appointments.
   - View all scheduled appointments in an organized list.
   - Search for appointments by ID or date.

3. **User Roles** : 
   - Secure login system for users.
   - Session-based authentication for access to the app.

4. **Patient and Appointment Search** :
   - Search for patients and appointments using flexible search queries.
   

## Technologies Used :

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Database**: MongoDB
- **Other Tools**: 
     - Flask-PyMongo for MongoDB integration.
     - hashlib for secure password hashing.
     - re for regular expressions in search functionality.
     - datetime for date handling in appointment searches.

## Installation and Setup :

- Install Python (3.8 or higher)
- Install MongoDB
- Install pip for managing Python packages

  ## Steps :

1. Clone the repository:
    ```bash
    git clone < https://github.com/zakariabahlaoui/DocPointify.git >
    cd DocPointify
    ```

2. Set up a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Install required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Start the MongoDB server:
    ```bash
    mongod
    ```

5. Run the Flask application:
    ```bash
    python app.py
    ```

6. Access the web application:
    Open your browser and go to http://localhost:5000

## API Endpoints

### Patients:
- **GET /api/patients** - Retrieve all patients.
- **POST /api/patients** - Add a new patient.
- **GET /api/patients/<patient_id>** - Retrieve a specific patient by ID.
- **PUT /api/patients/<patient_id>** - Update patient details.
- **DELETE /api/patients/<patient_id>** - Delete a patient.
- **GET /api/patients/search** - Search for patients by name or ID.

### Appointments:
- **GET /api/appointments** - Retrieve all appointments.
- **POST /api/appointments** - Add a new appointment.
- **PUT /api/appointments/<appointment_id>** - Update appointment details.
- **DELETE /api/appointments/<appointment_id>** - Cancel an appointment.
- **GET /api/appointments/search** - Search for appointments by ID or date.

## Contributors :

- Zakaria Bahlaoui : Frontend devoloper [https://github.com/zakariabahlaoui]
- Kenza Merouar : Frontend devoloper  [https://github.com/Qkenza]
- Chaimae Lahdili  : Backend devoloper [https://github.com/Chaiimae]
