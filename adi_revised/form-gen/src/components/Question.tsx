import { useContext, useEffect, useState } from "react";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import { Questionnaire } from "../types/Questionnaire";

const Question = ({
  question,
  questionId,
  disabled = false,
}: {
  question: Questionnaire;
  questionId: string;
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
  ) => {
    updateQuestionnaire(answer, evidence, questionId);
  };

  const calculateScore = () => {
    if (!question.answer || Object.keys(question.subquestions).length === 0) {
      console.log("here", Object.keys(question.subquestions).length);
      return 0;
    } else {
      const total = Object.keys(question.subquestions).length;
      console.log(total);
      const answeredYes = Object.values(question.subquestions).filter(
        (subquestion) => subquestion.answer === true,
      ).length;
      return Math.round((answeredYes / total) * 3);
    }
  };

  return (
    <div className="flex flex-row w-full">
      <div className="w-full">
        <div className="mb-3">
          <h2 className="text-xl font-semibold">{question.question}</h2>
          {question.answer && (
            <h3 className="text-base font-semibold text-red-500">
              Score: {calculateScore()}
            </h3>
          )}
        </div>
        <div className="flex flex-row items-center gap-3 mb-5">
          <div className="flex items-center m-1">
            <input
              disabled={disabled}
              type="radio"
              id={"yes--" + questionId}
              name={"answer--" + questionId}
              className="mr-2"
              checked={question.answer === true}
              onChange={() => update(true, question.evidence, questionId)}
            />
            <label
              htmlFor={"yes--" + questionId}
              className="mb-0.5 text-base font-semibold"
            >
              Yes
            </label>
          </div>

          <div className="flex items-center m-1">
            <input
              disabled={disabled}
              type="radio"
              id={"no--" + questionId}
              name={"answer--" + questionId}
              className="mr-2"
              checked={question.answer === false}
              onChange={() => update(false, question.evidence, questionId)}
            />
            <label
              htmlFor={"no--" + questionId}
              className="mb-0.5 text-base font-semibold"
            >
              No
            </label>
          </div>

          {question.answer === true && (
            <div className="flex items-center gap-1 ml-4">
              <label
                htmlFor={"evidence--" + questionId}
                className="mb-0.5 text-base"
              >
                Evidence:{" "}
              </label>
              <input
                disabled={disabled}
                type="input"
                id={"evidence--" + questionId}
                name={"evidence--" + questionId}
                className="mr-2 px-2 py-1 mb-0.5"
                placeholder="Enter Evidence"
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                onBlur={() => update(true, evidence, questionId)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
