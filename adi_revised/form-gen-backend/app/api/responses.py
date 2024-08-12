import csv
import io

from flask import jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Question, SubQuestion, Response
from app.api import bp


@bp.route('/responses', methods=['GET'])
@jwt_required()
def get_responses():
    user_id = get_jwt_identity()
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


@bp.route('/responses', methods=['PUT'])
@jwt_required()
def update_responses():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    for question_id, response_obj in data.items():
        response = Response.query.filter_by(user_id=user_id, question_id=question_id, subquestion_id=None).first()
        if response:
            response.answer = response_obj["answer"]
            response.evidence = response_obj["evidence"]
        else:
            new_response = Response(user_id=user_id, question_id=question_id, answer=response_obj["answer"],
                                    evidence=response_obj["evidence"])
            db.session.add(new_response)

        for subquestion_id, subquestion_obj in response_obj['subquestions'].items():
            response = Response.query.filter_by(user_id=user_id, question_id=question_id,
                                                subquestion_id=subquestion_id).first()
            if response:
                response.answer = subquestion_obj["answer"]
                response.evidence = subquestion_obj["evidence"]
            else:
                new_response = Response(user_id=user_id, question_id=question_id, subquestion_id=subquestion_id,
                                        answer=subquestion_obj["answer"], evidence=subquestion_obj["evidence"])
                db.session.add(new_response)

    db.session.commit()
    return jsonify({'message': 'Responses updated successfully'}), 200


@bp.route('/responses/export', methods=['GET'])
def export_responses():
    users = User.query.all()
    data = []

    for user in users:
        responses = Response.query.filter_by(user_id=user.id)
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
                    'subquestions': {}
                }
            else:
                result[question_id] = {
                    'answer': None,
                    'evidence': None,
                    'question': question.question,
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
                }
            else:
                result[f"{subquestion.parent_question_id}"]["subquestions"][f"{subquestion_id}"] = {
                    'answer': None,
                    'evidence': None,
                    'question': subquestion.question,
                }

        data.append([*build_question_text(user.name, result)])

    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Username', 'Question and Answer', 'Total Score'])
    writer.writerows(data)
    output.seek(0)

    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=data.csv"
    response.headers["Content-type"] = "text/csv"

    return response


def calculate_score(question):
    if not question["answer"] or len(question["subquestions"].keys()) == 0:
        return 0
    else:
        return round((len([True for subquestion in question["subquestions"].values() if subquestion["answer"]]) / len(
            question["subquestions"].keys())) * 3)


def build_question_text(username, result):
    response_text = ""
    score = 0
    for question in result.values():
        if response_text != "":
            response_text += "\n"

        question_text = question['question']
        answer = question['answer']
        evidence = question['evidence']

        # Build the question text
        response_text += question_text
        if answer:
            response_text += f": {answer}"
            if evidence:
                response_text += f" (Evidence: {evidence})"
        else:
            response_text += f": No answer"

        score += calculate_score(question)
        response_text += f" (Score: {calculate_score(question)})"

        if answer:  # remove this if you need answers of subquestions even if parent is answered false.
            # Add nested subquestions
            for subquestion in question['subquestions'].values():
                question_text = subquestion['question']
                answer = subquestion['answer']
                evidence = subquestion['evidence']

                # Build the question text
                response_text += f"\n    {question_text}"
                if answer:
                    response_text += f": {answer}"
                    if evidence:
                        response_text += f" (Evidence: {evidence})"
                else:
                    response_text += f": No answer"

    return username, response_text, score
