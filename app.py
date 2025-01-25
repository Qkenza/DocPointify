from flask import Flask, request, jsonify, render_template
from models import db, User, Entry
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///entries.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Initialize the database with the app
db.init_app(app)
CORS(app)

# Register route for new users
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    email = data['email']
    password = data['password']

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User with this email already exists"}), 400
    
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data['email']
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    if user:
        if user.password == password:
            return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
        else:
            return jsonify({"error": "This is not the correct password"}), 401
    else:
        return jsonify({"error": "Please sign up first to access your account."}), 401


# Add this to the existing Appointment model section
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'dateTime': self.date_time.isoformat()
        }
    
  
    
@app.route('/')
def index():
    # Serve the main index page
    return render_template('index.html')

@app.route('/entries', methods=['GET'])
def get_entries():
    # Retrieve all entries and return them as JSON
    entries = Entry.query.all()
    return jsonify([entry.to_dict() for entry in entries])

@app.route('/entries', methods=['POST'])
def add_entry():
    # Add a new entry to the database
    data = request.json
    new_entry = Entry(
        input1=data['input1'],
        input2=data['input2'],
        input3=data['input3'],
        input4=data['input4']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify(new_entry.to_dict()), 201

@app.route('/entries/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    # Retrieve a single entry by ID
    entry = Entry.query.get_or_404(entry_id)
    return jsonify(entry.to_dict())

@app.route('/entries/<int:entry_id>', methods=['PUT'])
def update_entry(entry_id):
    # Update an existing entry by ID
    entry = Entry.query.get_or_404(entry_id)
    data = request.json
    entry.input1 = data['input1']
    entry.input2 = data['input2']
    entry.input3 = data['input3']
    entry.input4 = data['input4']
    db.session.commit()
    return jsonify(entry.to_dict())

@app.route('/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    # Delete an entry by ID
    entry = Entry.query.get_or_404(entry_id)
    db.session.delete(entry)
    db.session.commit()
    return '', 204

@app.route('/entries/search', methods=['GET'])
def search_entries():
    # Search entries by a query string in 'input1'
    query = request.args.get('q', '').lower()
    entries = Entry.query.filter(Entry.input1.ilike(f'%{query}%')).all()
    return jsonify([entry.to_dict() for entry in entries])

@app.route('/appointments', methods=['GET'])
def get_appointments():
    # Retrieve all appointments and return them as JSON
    appointments = Appointment.query.all()
    return jsonify([appointment.to_dict() for appointment in appointments])

@app.route('/appointments', methods=['POST'])
def create_appointment():
    # Create a new appointment
    data = request.json
    try:
        # Parse the datetime string from the request data
        date_time = datetime.fromisoformat(data['dateTime'])
        
        new_appointment = Appointment(
            name=data['name'],
            date_time=date_time
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify(new_appointment.to_dict()), 201
    except ValueError as e:
        # Return an error if the datetime format is invalid
        return jsonify({'error': str(e)}), 400

@app.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    # Delete an appointment by its ID
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return '', 204

@app.route('/appointments/search', methods=['GET'])
def search_appointments():
    # Search appointments by a partial match on the name
    query = request.args.get('name', '').lower()
    appointments = Appointment.query.filter(
        Appointment.name.ilike(f'%{query}%')
    ).all()
    return jsonify([appointment.to_dict() for appointment in appointments])    

if __name__ == '__main__':
    # Initialize the database and start the Flask app
    with app.app_context():
        db.create_all()
    app.run(debug=True)
