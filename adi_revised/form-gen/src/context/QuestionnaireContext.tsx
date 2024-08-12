import React, { useState, useEffect, createContext } from "react";
import { Questionnaire } from "../types/Questionnaire";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Define the context shape
interface QuestionnaireContextType {
  questionnaire: { [key: number]: Questionnaire };
  updateQuestionnaire: (
    answer: boolean,
    evidence: string | null,
    questionId: string,
    subQuestionId?: string,
  ) => void;
  fetchQuestionnaire: () => void;
}

// Create the context with a default value
const QuestionnaireContext = createContext<QuestionnaireContextType>({
  questionnaire: {},
  updateQuestionnaire: () => {},
  fetchQuestionnaire: () => {},
});

const QuestionnaireProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionnaire, setQuestionnaires] = useState<{
    [key: string]: Questionnaire;
  }>({});
  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestionnaire();
  }, [getToken]);

  const fetchQuestionnaire = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/responses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestionnaires(data);
      } else {
        console.error("Failed to fetch questionnaire");
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
    }
  };

  const updateQuestionnaire = (
    answer: boolean,
    evidence: string | null,
    questionId: string,
    subquestionId?: string,
  ) => {
    const updatedQuestionnaires: { [key: string]: Questionnaire } = {
      ...questionnaire,
    };
    if (subquestionId === undefined) {
      updatedQuestionnaires[questionId].answer = answer;
      updatedQuestionnaires[questionId].evidence = evidence;
      if (updatedQuestionnaires[questionId].answer === false) {
        Object.keys(updatedQuestionnaires[questionId].subquestions).forEach(
          (subQuestionId) => {
            updatedQuestionnaires[questionId].subquestions[
              subQuestionId
            ].answer = null;
            updatedQuestionnaires[questionId].subquestions[
              subQuestionId
            ].evidence = null;
          },
        );
      }
    } else {
      updatedQuestionnaires[questionId].subquestions[subquestionId].answer =
        answer;
      updatedQuestionnaires[questionId].subquestions[subquestionId].evidence =
        evidence;
    }
    setQuestionnaires(updatedQuestionnaires);
    console.log(updatedQuestionnaires);
  };

  return (
    <QuestionnaireContext.Provider
      value={{ questionnaire, updateQuestionnaire, fetchQuestionnaire }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export { QuestionnaireProvider, QuestionnaireContext };
