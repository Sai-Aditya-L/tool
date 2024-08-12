from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Response, SubQuestion, Question
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
    responses = Response.query.filter_by(user_id=user_id)
    question_responses = {str(response.question_id): response for response in responses if
                          response.subquestion_id is None}
    subquestion_responses = {str(response.subquestion_id): response for response in responses if
                             response.subquestion_id is not None}

    questions = Question.query.all()
    subquestions = SubQuestion.query.all()
    result = {}

    for question in questions:
        question_id = str(question.id)
        if question_id in question_responses:
            response_obj = question_responses[question_id]
            result[question_id] = {
                'answer': response_obj.answer,
                'evidence': response_obj.evidence,
                'question': question.question,
                'questionId': question_id,
                'subquestions': {}
            }
        else:
            result[question_id] = {
                'answer': None,
                'evidence': None,
                'question': question.question,
                'questionId': question_id,
                'subquestions': {}
            }

    for subquestion in subquestions:
        subquestion_id = str(subquestion.id)
        if subquestion_id in subquestion_responses:
            response_obj = subquestion_responses[subquestion_id]
            result[f"{subquestion.parent_question_id}"]["subquestions"][f"{subquestion_id}"] = {
                'answer': response_obj.answer,
                'evidence': response_obj.evidence,
                'question': subquestion.question,
                'subquestionId': subquestion_id
            }
        else:
            result[f"{subquestion.parent_question_id}"]["subquestions"][f"{subquestion_id}"] = {
                'answer': None,
                'evidence': None,
                'question': subquestion.question,
                'subquestionId': subquestion_id
            }

    return jsonify(result)
