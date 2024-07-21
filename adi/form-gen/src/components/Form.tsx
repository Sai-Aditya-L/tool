import { Questionnaire } from "../types/Questionnaire";
import Question from "./Question";

const Form = ({
  questions,
  disabled = false,
}: {
  questions: { [key: number]: Questionnaire };
  disabled?: boolean;
}) => {
  return (
    <div className="">
      {Object.keys(questions).map((questionId, index) => {
        console.log(questions[+questionId]);
        return (
          <Question
            key={+index}
            question={questions[+questionId]}
            questionId={+questionId}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};

export default Form;
