from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Question, Response
from app.api import bp


@bp.route('/responses', methods=['GET'])
@jwt_required()
def get_responses():
    user_id = get_jwt_identity()
    responses = {str(response.question_id): response for response in Response.query.filter_by(user_id=user_id).all()}
    questions = Question.query.all()
    result = {}

    for question in questions:
        question_id = str(question.id)
        if question_id in responses:
            response_obj = responses[question_id]
            result[question_id] = {
                'answer': response_obj.answer,
                'evidence': response_obj.evidence,
                'question': question.question,
                'parentQuestionId': question.parent_question_id
            }
        else:
            result[question_id] = {
                'answer': None,
                'evidence': None,
                'question': question.question,
                'parentQuestionId': question.parent_question_id
            }

    return jsonify(result)


@bp.route('/responses', methods=['PUT'])
@jwt_required()
def update_responses():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    for question_id, response_obj in data.items():
        answer = response_obj.get('answer')
        evidence = response_obj.get('evidence')
        response = Response.query.filter_by(user_id=user_id, question_id=question_id).first()
        if response:
            response.answer = answer
            response.evidence = evidence
        else:
            new_response = Response(user_id=user_id, question_id=question_id, answer=answer, evidence=evidence)
            db.session.add(new_response)
    db.session.commit()
    return jsonify({'message': 'Responses updated successfully'}), 200
