export type Questionnaire = {
  question: string;
  answer: boolean | null;
  evidence: string | null;
  questionId: string;
  subquestions: {
    [key: string]: {
      question: string;
      answer: boolean | null;
      evidence: string | null;
      subquestionId: string;
    };
  };
};
