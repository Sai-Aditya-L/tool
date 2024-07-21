from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(128))
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question = db.Column(db.String(256), nullable=False)
    parent_question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=True)
    parent_question = db.relationship('Question', remote_side=[id], backref='subquestions')

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'parentQuestionId': self.parent_question_id
        }

    def __repr__(self):
        return f'<Question {self.question}>'


class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    answer = db.Column(db.Boolean, nullable=True)
    evidence = db.Column(db.String(256), nullable=True)
    user = db.relationship('User', backref='responses')
    question = db.relationship('Question', backref='responses')

    def __repr__(self):
        return f'<Response {self.answer} for Question {self.question_id} by User {self.user_id}>'
