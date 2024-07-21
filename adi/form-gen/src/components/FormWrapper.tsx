import React, { useContext, useEffect } from "react";
import Form from "./Form";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import { AuthContext } from "../context/AuthContext";

const FormWrapper = () => {
  const { questionnaire } = useContext(QuestionnaireContext);
  const { getToken } = useContext(AuthContext);

  const handleSubmit = async () => {
    const token = getToken();
    const response = await fetch("http://127.0.0.1:5000/api/responses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionnaire),
    });

    if (response.ok) {
      // Handle successful submission
      alert("Form submitted successfully!");
    } else {
      // Handle error
      alert("Failed to submit form");
    }
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold">Form</h2>
      <Form questions={questionnaire} />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

export default FormWrapper;
