from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# User model to store email and password
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email
        }
    
# Entry model to store form input data
class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    input1 = db.Column(db.String(200), nullable=False)
    input2 = db.Column(db.String(200), nullable=False)
    input3 = db.Column(db.String(200), nullable=False)
    input4 = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'input1': self.input1,
            'input2': self.input2,
            'input3': self.input3,
            'input4': self.input4
        }
