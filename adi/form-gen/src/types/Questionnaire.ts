export type Questionnaire = {
  question: string;
  answer: boolean | null;
  parentQuestionId?: number;
  evidence?: string;
};
