from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Response, SubQuestion, Question
from app.api import bp


# app/api/submissions.py

@bp.route('/submissions/<int:form_id>', methods=['GET'])
@jwt_required()
def get_submissions(form_id):
    # This endpoint returns a list of users who have submitted responses.
    responses = Response.query.join(Question, Response.question_id == Question.id).filter(
        Question.form_id == form_id).all()
    user_ids = set(response.user_id for response in responses)
    users = User.query.filter(User.id.in_(user_ids)).all()
    submissions = [{'id': user.id, 'email': user.email, 'name': user.name} for user in users]
    return jsonify(submissions)


@bp.route('/submissions/<int:form_id>/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_responses(form_id, user_id):
    # This endpoint returns responses for a specific user.
    responses = Response.query.filter_by(user_id=user_id)
    question_responses = {str(response.question_id): response for response in responses if
                          response.subquestion_id is None}
    subquestion_responses = {str(response.subquestion_id): response for response in responses if
                             response.subquestion_id is not None}

    questions = Question.query.filter_by(form_id=form_id).all()
    subquestions = SubQuestion.query.filter(SubQuestion.parent_question_id.in_([q.id for q in questions])).all()
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
            print(result[f"{subquestion.parent_question_id}"]["subquestions"])
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
