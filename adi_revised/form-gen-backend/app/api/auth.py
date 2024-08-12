from flask import jsonify, request
from flask_jwt_extended import create_access_token
from app import db
from app.models import User
from app.api import bp


@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data or 'name' not in data or 'bu' not in data or 'prod' not in data:
        return jsonify({'error': 'Bad request'}), 400
    if User.query.filter_by(email=data['email']).first() is not None:
        return jsonify({'error': 'Email already registered'}), 400
    user = User(email=data['email'], name=data['name'], bu=data['bu'], prod=data['prod'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({'message': 'User registered successfully', 'token': token}), 201


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Bad request'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if user is None or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = create_access_token(identity=user.id)
    return jsonify({'token': token}), 200
