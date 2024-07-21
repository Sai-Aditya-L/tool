from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Question
from app.api import bp


@bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    questions = Question.query.all()
    questions_dict = {str(question.id): question.to_dict() for question in questions}
    return jsonify(questions_dict)


@bp.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    data = request.get_json() or {}
    if 'question' not in data:
        return jsonify({'error': 'Bad request'}), 400
    question = Question(
        question=data['question'],
        answer=data.get('answer'),
        evidence=data.get('evidence'),
        parent_question_id=data.get('parentQuestionId')
    )
    db.session.add(question)
    db.session.commit()
    response = {str(question.id): question.to_dict()}
    return jsonify(response), 201
