import React, {useContext, useEffect} from "react";
import Form from "./Form";
import {QuestionnaireContext} from "../context/QuestionnaireContext";
import {AuthContext} from "../context/AuthContext";

const FormWrapper = ({formId, closePopup}: { formId: number, closePopup: () => void }) => {
    const {questionnaire, fetchQuestionnaire} =
        useContext(QuestionnaireContext);
    const {getToken} = useContext(AuthContext);

    const handleSubmit = async () => {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:5000/api/responses/${formId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionnaire),
        });

        if (response.ok) {
            // Handle successful submission
            closePopup();
            alert("Form submitted successfully!");
        } else {
            // Handle error
            alert("Failed to submit form");
        }
    };

    useEffect(() => {
        fetchQuestionnaire(formId);
    }, []);

    return (
        <div className="p-8 max-h-[80vh] overflow-y-auto">
            <div className={"mb-4 flex justify-between items-center"}>
                <h2 className=" text-2xl font-bold">Form</h2>
                <button onClick={closePopup} className="text-gray-600 hover:text-gray-800 text-xl">
                    &times;
                </button>
            </div>
            <Form questions={questionnaire}/>
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
