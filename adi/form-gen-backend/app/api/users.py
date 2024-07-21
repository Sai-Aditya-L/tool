from flask import jsonify, request
from app import db
from app.models import User, Response
from app.api import bp


@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.name for user in users])


@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'email' not in data or 'name' not in data:
        return jsonify({'error': 'Bad request'}), 400
    user = User(email=data['email'], name=data['name'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.name), 201


@bp.route('/users/submitted', methods=['GET'])
def get_users_submitted():
    users = User.query.join(Response).all()
    return jsonify([{
        'id': user.id,
        'name': user.name,
        'email': user.email
    } for user in users])
