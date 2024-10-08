import { useContext, useEffect, useState } from "react";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import { Questionnaire } from "../types/Questionnaire";

const SubQuestion = ({
  question,
  questionId,
  subQuestionId,
  disabled = false,
}: {
  question: Questionnaire["subquestions"][keyof Questionnaire["subquestions"]];
  questionId: string;
  subQuestionId: string;
  disabled?: boolean;
}) => {
  const { updateQuestionnaire } = useContext(QuestionnaireContext);
  const [evidence, setEvidence] = useState(question.evidence || "");

  useEffect(() => {
    setEvidence(question.evidence || "");
  }, [question.evidence]);

  const update = (
    answer: boolean,
    evidence: string | null,
    questionId: string,
    subQuestionId: string,
  ) => {
    updateQuestionnaire(answer, evidence, questionId, subQuestionId);
  };

  return (
    <div className="flex flex-row">
      <div>
        <h2 className="mb-3 text-xl font-semibold">{question.question}</h2>
        <div className="flex flex-row items-center gap-3 mb-5">
          <div className="flex items-center m-1">
            <input
              disabled={disabled}
              type="radio"
              id={"sub--yes--" + subQuestionId}
              name={"sub--answer--" + subQuestionId}
              className="mr-2"
              checked={question.answer === true}
              onChange={() =>
                update(true, question.evidence, questionId, subQuestionId)
              }
            />
            <label
              htmlFor={"sub--yes--" + subQuestionId}
              className="mb-0.5 text-base font-semibold"
            >
              Yes
            </label>
          </div>

          <div className="flex items-center m-1">
            <input
              disabled={disabled}
              type="radio"
              id={"sub--no--" + subQuestionId}
              name={"sub--answer--" + subQuestionId}
              className="mr-2"
              checked={question.answer === false}
              onChange={() =>
                update(false, question.evidence, questionId, subQuestionId)
              }
            />
            <label
              htmlFor={"sub--no--" + subQuestionId}
              className="mb-0.5 text-base font-semibold"
            >
              No
            </label>
          </div>

          {question.answer === true && (
            <div className="flex items-center">
              <input
                disabled={disabled}
                type="input"
                id={"sub--evidence--" + subQuestionId}
                name={"sub--evidence--" + subQuestionId}
                className="mr-2 px-2 py-1 mb-0.5"
                placeholder="Enter Evidence"
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                onBlur={() => update(true, evidence, questionId, subQuestionId)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubQuestion;
