from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Form, Question, SubQuestion, Response
from app.api import bp


@bp.route('/forms', methods=['GET'])
@jwt_required()
def get_forms():
    forms = Form.query.all()
    return jsonify([{'id': form.id, 'name': form.name} for form in forms])


@bp.route('/forms/<int:form_id>', methods=['GET'])
@jwt_required()
def get_form(form_id):
    form = Form.query.get(form_id)
    if not form:
        return jsonify({'error': 'Form not found'}), 404

    questions = Question.query.filter_by(form_id=form.id).all()
    form_data = {
        "id": form.id,
        "name": form.name,
        "questions": []
    }

    for question in questions:
        subquestions = SubQuestion.query.filter_by(parent_question_id=question.id).all()
        form_data["questions"].append({
            "id": question.id,
            "question": question.question,
            "subquestions": [{"id": subq.id, "question": subq.question} for subq in subquestions]
        })

    return jsonify(form_data), 200


@bp.route('/forms', methods=['POST'])
@jwt_required()
def create_form():
    data = request.get_json() or {}

    if "name" not in data or "questions" not in data:
        return jsonify({"error": "Form name and questions are required"}), 400

    # Create form
    form = Form(name=data["name"])
    db.session.add(form)
    db.session.flush()  # Ensure form ID is generated before adding questions

    # Add questions
    questions = []
    for q_data in data["questions"]:
        question = Question(question=q_data["question"], form_id=form.id)
        db.session.add(question)
        db.session.flush()  # Ensure question ID is generated before adding subquestions

        # Add subquestions if provided
        subquestions = []
        for subq in q_data.get("subquestions", []):
            subquestion = SubQuestion(
                question=subq, parent_question_id=question.id
            )
            db.session.add(subquestion)
            subquestions.append({"id": subquestion.id, "question": subq})

        questions.append({
            "id": question.id,
            "question": question.question,
            "subquestions": subquestions
        })

    db.session.commit()

    return jsonify({
        "id": form.id,
        "name": form.name,
        "questions": questions
    }), 201


@bp.route('/forms/<int:form_id>', methods=['PUT'])
@jwt_required()
def update_form(form_id):
    data = request.get_json() or {}

    if "name" not in data or "questions" not in data:
        return jsonify({"error": "Form name and questions are required"}), 400

    form = Form.query.get(form_id)
    if not form:
        return jsonify({"error": "Form not found"}), 404

    # Update form name
    form.name = data["name"]

    # Get existing question IDs
    existing_questions = {q.id: q for q in Question.query.filter_by(form_id=form.id).all()}
    received_questions = {q.get("id"): q for q in data["questions"] if "id" in q}

    # Remove questions that are no longer in the request
    for question_id in list(existing_questions.keys()):
        if question_id not in received_questions:
            responses = Response.query.filter_by(question_id=question_id).all()
            for response in responses:
                db.session.delete(response)
            db.session.delete(existing_questions[question_id])

    # Add or update questions
    for question_data in data["questions"]:
        if "id" in question_data and question_data["id"] in existing_questions:
            # Update existing question
            question = existing_questions[question_data["id"]]
            question.question = question_data["question"]
        else:
            # Add new question
            question = Question(question=question_data["question"], form_id=form.id)
            db.session.add(question)
            db.session.flush()  # Get question ID for subquestions

        # Manage subquestions
        existing_subquestions = {sq.id: sq for sq in SubQuestion.query.filter_by(parent_question_id=question.id).all()}
        received_subquestions = {sq.get("id"): sq for sq in question_data.get("subquestions", []) if "id" in sq}

        # Remove subquestions not in request
        for subq_id in list(existing_subquestions.keys()):
            if subq_id not in received_subquestions:
                responses = Response.query.filter_by(subquestion_id=subq_id).all()
                for response in responses:
                    db.session.delete(response)
                db.session.delete(existing_subquestions[subq_id])

        # Add or update subquestions
        for subq_data in question_data.get("subquestions", []):
            if "id" in subq_data and subq_data["id"] in existing_subquestions:
                subq = existing_subquestions[subq_data["id"]]
                subq.question = subq_data["question"]
            else:
                subq = SubQuestion(question=subq_data["question"], parent_question_id=question.id)
                db.session.add(subq)

    db.session.commit()

    return jsonify({"message": "Form updated successfully"}), 200


@bp.route('/forms/<int:form_id>', methods=['DELETE'])
@jwt_required()
def delete_form(form_id):
    form = Form.query.get(form_id)
    if not form:
        return jsonify({'error': 'Form not found'}), 404
    db.session.delete(form)
    db.session.commit()
    return jsonify({'message': 'Form deleted successfully'}), 200