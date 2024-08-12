import { Questionnaire } from "../types/Questionnaire";
import Question from "./Question";
import SubQuestion from "./SubQuestion";

const Form = ({
  questions,
  disabled = false,
}: {
  questions: { [key: string]: Questionnaire };
  disabled?: boolean;
}) => {
  return (
    <div className="">
      {Object.keys(questions).map((questionId, index) => {
        return (
          <div className="">
            <Question
              key={+index}
              question={questions[questionId]}
              questionId={questionId}
              disabled={disabled}
            />
            {questions[questionId].answer === true && (
              <div className="ml-5">
                {Object.keys(questions[questionId].subquestions).map(
                  (subquestionId, subQuestionIndex) => {
                    return (
                      <SubQuestion
                        key={+subQuestionIndex}
                        question={
                          questions[questionId].subquestions[subquestionId]
                        }
                        questionId={questionId}
                        subQuestionId={subquestionId}
                        disabled={disabled}
                      />
                    );
                  },
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Form;
