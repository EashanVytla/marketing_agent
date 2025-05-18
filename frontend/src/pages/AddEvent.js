import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/csrf";

const AddEvent = () => {
    const [formParams, setFormParams] = useState({
        name: "",
        description: "",
        date: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleAddEvent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const csrfToken = getCookie("csrftoken");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({
                    name: formParams.name,
                    description: formParams.description,
                    date: formParams.date
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Success: Event created!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                setMessage(`Error: ${data.message || "Failed to create event"}`);
            }
        } catch (error) {
            setMessage("Error: Failed to connect to the server");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Event</h1>
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Dashboard
                </button>
            </div>
            {message && (
                <div className={`p-3 mb-4 rounded ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <form onSubmit={handleAddEvent}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Event Name:</label>
                        <input 
                            type="text"
                            value={formParams.name}
                            onChange={(e) => setFormParams({...formParams, name: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Event Date:</label>
                        <input 
                            type="datetime-local"
                            value={formParams.date}
                            onChange={(e) => setFormParams({...formParams, date: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium">Description:</label>
                        <textarea 
                            value={formParams.description}
                            onChange={(e) => setFormParams({...formParams, description: e.target.value})}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                            placeholder="Describe the event"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Event..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
