import { useContext, useState, useEffect } from "react";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import { Questionnaire } from "../types/Questionnaire";

const Question = ({
  question,
  questionId,
  disabled = false,
}: {
  question: Questionnaire;
  questionId: number;
  disabled?: boolean;
}) => {
  const { questionnaire, updateQuestionnaire } =
    useContext(QuestionnaireContext);

  const [questionState, setQuestionState] = useState<Questionnaire>(question);

  useEffect(() => {
    setQuestionState(questionnaire[questionId]);
  }, [questionnaire]);

  const update = (answer: boolean, questionId: number) => {
    updateQuestionnaire(answer, questionId);
  };

  const margin = () => {
    let value = 0;
    let question = questionnaire[questionId];
    while (question && true) {
      if (
        question.parentQuestionId === null ||
        question.parentQuestionId === undefined
      ) {
        return value;
      } else {
        value += 20;
        question = questionnaire[question.parentQuestionId];
      }
    }
  };

  if (
    questionState.parentQuestionId === null ||
    (questionState.parentQuestionId &&
      questionnaire[questionState.parentQuestionId].answer === true)
  ) {
    return (
      <div className="flex flex-row" style={{ paddingLeft: margin() }}>
        {/* <h2 className="mb-3 mr-2 text-xl font-semibold opacity-50">
				{key})
			</h2> */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            {questionState.question}
          </h2>
          <div className="flex flex-row items-center gap-3 mb-5">
            <div className="flex items-center">
              <input
                disabled={disabled}
                type="radio"
                id={"yes--" + questionId}
                name={"answer--" + questionId}
                className="mr-2"
                checked={questionState.answer === true}
                onChange={() => update(true, questionId)}
              />
              <label
                htmlFor={"yes--" + questionId}
                className="mb-0.5 text-base font-semibold"
              >
                Yes
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id={"no--" + questionId}
                name={"answer--" + questionId}
                className="mr-2"
                checked={questionState.answer === false}
                onChange={() => update(false, questionId)}
              />
              <label
                htmlFor={"no--" + questionId}
                className="mb-0.5 text-base font-semibold"
              >
                No
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Question;
