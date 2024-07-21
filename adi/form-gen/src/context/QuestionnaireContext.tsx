import React, { useState, useEffect, createContext } from "react";
import { Questionnaire } from "../types/Questionnaire";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Define the context shape
interface QuestionnaireContextType {
  questionnaire: { [key: number]: Questionnaire };
  updateQuestionnaire: (answer: boolean, questionId: number) => void;
}

// Create the context with a default value
const QuestionnaireContext = createContext<QuestionnaireContextType>({
  questionnaire: {},
  updateQuestionnaire: () => {},
});

const QuestionnaireProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionnaire, setQuestionnaires] = useState<{
    [key: number]: Questionnaire;
  }>({});
  const { getToken } = useContext(AuthContext);

  useEffect(() => {
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

    fetchQuestionnaire();
  }, [getToken]);

  const updateQuestionnaire = (answer: boolean, questionId: number) => {
    const updatedQuestionnaires: { [key: number]: Questionnaire } = {
      ...questionnaire,
    };
    updatedQuestionnaires[questionId].answer = answer;
    if (updatedQuestionnaires[questionId].answer === false) {
      Object.keys(updatedQuestionnaires).forEach((question) => {
        if (updatedQuestionnaires[+question].parentQuestionId === questionId) {
          updatedQuestionnaires[+question].answer = null;
        }
      });
    }
    setQuestionnaires(updatedQuestionnaires);
  };

  return (
    <QuestionnaireContext.Provider
      value={{ questionnaire, updateQuestionnaire }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export { QuestionnaireProvider, QuestionnaireContext };
