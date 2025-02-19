import React from "react";

interface Form {
    name: string;
    questions: { id?: number; question: string; subquestions: { id?: number; question: string }[] }[];
}

const FormPreview = ({ form, setForm }: { form: Form; setForm: (f: Form) => void }) => {
    const addQuestion = () => {
        setForm({
            ...form,
            questions: [...form.questions, { question: "", subquestions: [] }],
        });
    };

    const updateQuestion = (index: number, value: string) => {
        const updatedQuestions = [...form.questions];
        updatedQuestions[index].question = value;
        setForm({ ...form, questions: updatedQuestions });
    };

    const deleteQuestion = (index: number) => {
        const updatedQuestions = form.questions.filter((_, qIndex) => qIndex !== index);
        setForm({ ...form, questions: updatedQuestions });
    };

    const addSubQuestion = (qIndex: number) => {
        const updatedQuestions = [...form.questions];
        updatedQuestions[qIndex].subquestions.push({ question: "" });
        setForm({ ...form, questions: updatedQuestions });
    };

    const updateSubQuestion = (qIndex: number, sIndex: number, value: string) => {
        const updatedQuestions = [...form.questions];
        updatedQuestions[qIndex].subquestions[sIndex].question = value;
        setForm({ ...form, questions: updatedQuestions });
    };

    const deleteSubQuestion = (qIndex: number, sIndex: number) => {
        const updatedQuestions = [...form.questions];
        updatedQuestions[qIndex].subquestions = updatedQuestions[qIndex].subquestions.filter(
            (_, subIndex) => subIndex !== sIndex
        );
        setForm({ ...form, questions: updatedQuestions });
    };

    return (
        <div>
            {form.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-4 border-b pb-2">
                    <div className="flex justify-between">
                        <input
                            type="text"
                            className="border p-2 w-full"
                            placeholder="Enter question"
                            value={q.question}
                            onChange={(e) => updateQuestion(qIndex, e.target.value)}
                        />
                        <button
                            className="text-red-500 ml-2"
                            onClick={() => deleteQuestion(qIndex)}
                        >
                            Delete
                        </button>
                    </div>

                    <div className="ml-8 mt-2">
                        {q.subquestions.map((subq, sIndex) => (
                            <div key={sIndex} className="flex justify-between items-center">
                                <input
                                    type="text"
                                    className="border p-2 w-full mt-2"
                                    placeholder="Enter sub-question"
                                    value={subq.question}
                                    onChange={(e) => updateSubQuestion(qIndex, sIndex, e.target.value)}
                                />
                                <button
                                    className="text-red-500 ml-2"
                                    onClick={() => deleteSubQuestion(qIndex, sIndex)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        <button className="text-blue-500 mt-2" onClick={() => addSubQuestion(qIndex)}>
                            + Add Sub-Question
                        </button>
                    </div>
                </div>
            ))}
            <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={addQuestion}>
                + Add Question
            </button>
        </div>
    );
};

export default FormPreview;
