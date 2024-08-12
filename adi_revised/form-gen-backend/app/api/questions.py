from flask import jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.models import Question, SubQuestion
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
        question=data['question']
    )
    db.session.add(question)
    db.session.commit()
    response = {str(question.id): question.to_dict()}
    return jsonify(response), 201


@bp.route('/subquestions', methods=['POST'])
@jwt_required()
def create_subquestion():
    data = request.get_json() or {}
    if 'question' not in data or 'parentQuestionId' not in data:
        return jsonify({'error': 'Bad request'}), 400
    subquestion = SubQuestion(
        question=data['question'],
        parent_question_id=data['parentQuestionId']
    )
    db.session.add(subquestion)
    db.session.commit()
    response = {str(subquestion.id): subquestion.to_dict()}
    return jsonify(response), 201
