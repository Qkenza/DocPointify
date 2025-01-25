# DocPointify

## Description :

![home](image.png)

**DocPointify** is a modern, web-based application designed to streamline the management of patient appointments for healthcare providers. This platform enables doctors and their assistants to log in, organize appointments, and manage patient information efficiently.​

**DocPointify** aims to simplify repetitive daily operations, reduce administrative burden, and enhance the overall workflow of healthcare professionals. By providing an intuitive interface and robust features, the application empowers medical staff to focus more on patient care and less on paperwork.​

## Table of Content :

- [Description](#description-)
- [Table of Content](#table-of-content-)
- [Features](#features-)
- [Technologies Used](#technologies-used-)
- [Running the project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors-)


## Features :

1. **Patient Management** :
    - Add, update, and delete patient records.
    - Store details like name, contact information, address and additional notes.
    - Search for patients by patient's name. 
    
2. **Appointment Management** : 
   - Book, and cancel appointments.
   - View all scheduled appointments in an organized list.
   
3. **User Roles** : 
   - The User model in the code is designed to store user credentials (email and password).
   - No explicit roles (e.g., admin, assistant, doctor) are defined.
   - All users appear to have the same level of access.


## Technologies Used :

- **Frontend**: HTML, Advanced CSS, JS, ES6+
- **Backend**: Python with Flask
- **Database**: SQLite
- **Other Tools**: 
     - Flask-SQLAlchemy for database integration and ORM.
     - Flask-CORS for handling Cross-Origin Resource Sharing (CORS).
     - datetime for date and time handling, particularly in appointment scheduling.


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

5. **View the Project in Browser**
   - Navigate to the `Templates` directory, open the **home.html** file in Visual Studio Code, and go live.
   - The project should now be accessible in your browser!


## API Endpoints

### Patients:
- **GET /entries** - Retrieves a list of all patient entries.
- **POST /entries** - Adds a new patient entry (e.g., new patient record).
- **GET /entries/<entry_id>** - Retrieves a specific patient entry using its unique ID.
- **PUT /entries/<entry_id>** -  Updates an existing patient entry.
- **DELETE /entries/<entry_id>** - Deletes a specific patient entry.
- **GET /entries/search** - Searches for patient entries by name.

### Appointments:
- **GET /appointments** - Retrieves a list of all appointments.
- **POST /appointments** - Adds a new appointment for a patient.
- **DELETE /appointments/<appointment_id>** - Cancels an appointment.

### Authentication :
- **POST /register** - Registers a new user
- **POST /login** -  Logs in an existing user.

## Contributors :

- Zakaria Bahlaoui : Frontend devoloper [https://github.com/zakariabahlaoui]
- Kenza Merouar : Full-Stack devoloper  [https://github.com/Qkenza]
- Chaimae Lahdili  : Backend devoloper [https://github.com/Chaiimae]