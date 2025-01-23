from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(_name_)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///entries.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

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