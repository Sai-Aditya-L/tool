import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FormPreview from "./FormPreview";

interface FormType {
    id?: number;
    name: string;
    questions: { id?: number; question: string; subquestions: { id?: number; question: string }[] }[];
}

const FormManagement: React.FC = () => {
    const [forms, setForms] = useState<FormType[]>([]);
    const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { getToken } = useContext(AuthContext);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        const token = getToken();
        const response = await fetch("http://127.0.0.1:5000/api/forms", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            setForms(await response.json());
        }
    };

    const fetchFormDetails = async (formId: number) => {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:5000/api/forms/${formId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            setSelectedForm({
                id: formId,
                name: data.name,
                questions: data.questions.map((q: any) => ({
                    id: q.id,
                    question: q.question,
                    subquestions: q.subquestions.map((sq: any) => ({
                        id: sq.id,
                        question: sq.question,
                    })),
                })),
            });
            setIsEditing(true);
            setIsOpen(true);
        }
    };

    const handleAddForm = () => {
        setSelectedForm({ name: "", questions: [] });
        setIsEditing(false);
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
        setSelectedForm(null);
    };

    const saveForm = async () => {
        const token = getToken();

        if (!selectedForm?.name || selectedForm.questions.length === 0) {
            alert("Please enter a form name and at least one question.");
            return;
        }

        const url = isEditing
            ? `http://127.0.0.1:5000/api/forms/${selectedForm.id}`
            : `http://127.0.0.1:5000/api/forms`;

        const method = isEditing ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedForm),
        });

        if (response.ok) {
            fetchForms();
            closePopup();
        } else {
            alert("Failed to save form.");
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Manage Forms</h2>

            <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={handleAddForm}>
                + Add Form
            </button>

            {/* Forms List */}
            <ul className="mt-4">
                {forms.map((form) => (
                    <li
                        key={form.id}
                        className="flex justify-between border p-2 mb-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => fetchFormDetails(form.id!)}
                    >
                        <span>{form.name}</span>
                        <button
                            className="text-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                fetch(`http://127.0.0.1:5000/api/forms/${form.id}`, {
                                    method: "DELETE",
                                    headers: { Authorization: `Bearer ${getToken()}` },
                                }).then(() => fetchForms());
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {/* Popover for Adding/Editing Form */}
            {isOpen && selectedForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                className="border p-2 w-full text-lg font-bold"
                                placeholder="Form Name"
                                value={selectedForm.name}
                                onChange={(e) => setSelectedForm({ ...selectedForm, name: e.target.value })}
                            />
                            <button onClick={closePopup} className="text-gray-600 hover:text-gray-800 text-xl">
                                &times;
                            </button>
                        </div>

                        {/* Render FormPreview for Editing */}
                        <FormPreview form={selectedForm} setForm={setSelectedForm} />

                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-500 text-white px-4 py-2 mr-2" onClick={closePopup}>
                                Cancel
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2" onClick={saveForm}>
                                {isEditing ? "Update Form" : "Create Form"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormManagement;
