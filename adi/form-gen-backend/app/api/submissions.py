from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Response
from app.api import bp


# app/api/submissions.py

@bp.route('/submissions', methods=['GET'])
@jwt_required()
def get_submissions():
    # This endpoint returns a list of users who have submitted responses.
    responses = Response.query.all()
    user_ids = set(response.user_id for response in responses)
    users = User.query.filter(User.id.in_(user_ids)).all()
    submissions = [{'id': user.id, 'email': user.email, 'name': user.name} for user in users]
    return jsonify(submissions)


@bp.route('/submissions/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_responses(user_id):
    # This endpoint returns responses for a specific user.
    responses = Response.query.filter_by(user_id=user_id).all()
    if not responses:
        return jsonify({'message': 'No responses found for this user'}), 404

    result = {}
    for response in responses:
        question_id = str(response.question_id)
        result[question_id] = {
            'answer': response.answer,
            'evidence': response.evidence,
            'question': response.question.question,
            'parentQuestionId': response.question.parent_question_id
        }

    return jsonify(result)
