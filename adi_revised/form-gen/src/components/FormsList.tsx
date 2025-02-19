import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FormWrapper from "./FormWrapper";

interface FormType {
    id: number;
    name: string;
}

const FormsList = () => {
    const [forms, setForms] = useState<FormType[]>([]);
    const { getToken } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);


    useEffect(() => {
        fetchForms();
    }, []);

    const handleOpenForm = (form_id: number) => {
        setSelectedFormId(form_id);
        setIsOpen(true);
    };

    const fetchForms = async () => {
        const token = getToken();
        const response = await fetch("http://127.0.0.1:5000/api/forms", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            setForms(await response.json());
        }
    };

    const closePopup = () => {
        setIsOpen(false);
        setSelectedFormId(null);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Available Forms</h2>
            <ul className="mt-4">
                {forms.map((form) => (
                    <li
                        key={form.id}
                        className="flex justify-between border p-2 mb-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOpenForm(form.id)}
                    >
                        <span>{form.name}</span>
                    </li>
                ))}
            </ul>

            {isOpen && selectedFormId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-full overflow-y-auto">
                        <FormWrapper formId={selectedFormId} closePopup={closePopup} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormsList;
