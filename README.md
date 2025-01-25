# DocPointify

## Description :

DocPointify is a web-based application designed to streamline patient and appointment management for doctors and their cabinet staff or assistant. it works like an online calendar, a virtual agenda, enabling efficient handling of patient information and appointments in a user-friendly interface. it allows users to add, update, delete, and search through patient records and appointments.

## Table of Content :

- [Description](#description-)
- [Table of Content](#table-of-content-)
- [Features](#features-)
- [Technologies Used](#technologies-used-)
- [Installation](#installation--)
- [Running the project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors-)


## Features :

1. **Patient Management** :
    - Add, update, and delete patient records.
    - Store details like name, contact information, address and additional notes.
    - Search for patients by name or ID. 
    
2. **Appointment Management** : 
   - Book, update and cancel appointments.
   - View all scheduled appointments in an organized list.
   - Search for appointments by ID or date.

3. **User Roles** : 
   - Secure login system for users.
   - Session-based authentication for access to the app.

   
## Technologies Used :

- **Frontend**: HTML, Advanced CSS, JS, ES6+
- **Backend**: Python with Flask
- **Database**: SQLite
- **Other Tools**: 
     - Flask-SQLAlchemy for database integration and ORM.
     - Flask-CORS for handling Cross-Origin Resource Sharing (CORS).
     - datetime for date and time handling, particularly in appointment scheduling.

## Installation  :

1. **Install Python**
   Ensure Python (3.8 or higher) is installed on your system.

2. **Clone the Repository**
   ```bash
   git clone https://github.com/zakariabahlaoui/DocPointify.git
   cd DocPointify
   ```

3. **Install Dependencies**
   - Install Flask-SQLAlchemy:
     ```bash
     pip install flask-sqlalchemy
     ```
   - Install Flask-CORS:
     ```bash
     pip install flask-cors
     ```

## Running the Project

To see the project in action, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/zakariabahlaoui/DocPointify.git
   cd DocPointify
   ```

2. **Install Python**
   Ensure Python (3.8 or higher) is installed on your system.

3. **Install Required Python Libraries**
   - Install Flask-SQLAlchemy:
     ```bash
     pip install flask-sqlalchemy
     ```
   - Install Flask-CORS:
     ```bash
     pip install flask-cors
     ```

4. **Run the Application**
   ```bash
   python app.py
   ```

5. **Verify the API**
   - Once the application is running, check the terminal to ensure the API is functioning correctly.

6. **View the Project in Browser**
   - Navigate to the `Templates` directory, open the **home.html** file in Visual Studio Code, and go live.
   - The project should now be accessible in your browser!


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