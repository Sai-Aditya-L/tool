import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Form from "./Form";

interface Submission {
  id: number;
  name: string;
  email: string;
}

const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [questionnaire, setQuestionnaire] = useState<{
    [key: number]: any;
  } | null>(null);

  const { getToken } = useContext(AuthContext);

  const fetchSubmissions = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://127.0.0.1:5000/api/submissions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        console.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchQuestionnaireForSubmission = async (id: number) => {
    try {
      const token = getToken();

      const response = await fetch(
        `http://127.0.0.1:5000/api/submissions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setQuestionnaire(data);
      } else {
        console.error("Failed to fetch questionnaire for submission");
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    fetchQuestionnaireForSubmission(submission.id);
  };

  const handleClosePopup = () => {
    setSelectedSubmission(null);
    setQuestionnaire(null);
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold">Submissions</h2>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex justify-between p-4 border border-gray-300 rounded"
          >
            <span>{submission.name}</span>
            <button
              onClick={() => handleSubmissionClick(submission)}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedSubmission && questionnaire && (
        <Popup onClose={handleClosePopup} questionnaire={questionnaire} />
      )}
    </div>
  );
};

interface PopupProps {
  onClose: () => void;
  questionnaire: { [key: number]: any };
}

const Popup: React.FC<PopupProps> = ({ onClose, questionnaire }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 w-4 h-4"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
        <Form questions={questionnaire} disabled={true} />
      </div>
    </div>
  );
};

export default Submissions;
