import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AgentRequest = () => {
    const [formParams, setFormParams] = useState({
        event_id: "",
        description: ""
    });
    const [events, setEvents] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Fetch events for the dropdown when component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
                    method: "GET",
                    credentials: "include"
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                    // Set default event if available
                    if (data.length > 0) {
                        setFormParams(prevParams => ({
                            ...prevParams,
                            event_id: data[0].id
                        }));
                    }
                } else {
                    setMessage("Error: Failed to load events");
                }
            } catch (error) {
                console.error("HTTP request failed", error);
                setMessage("Error: Failed to connect to the server");
            }
        };
        
        fetchEvents();
    }, []);

    const handleAgentRequest = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");
        
        if (!formParams.event_id) {
            setMessage("Error: Please select an event");
            setIsSubmitting(false);
            return;
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/agent/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action_type: "create_job",
                    params: {
                        event_id: formParams.event_id,
                        description: formParams.description
                    }
                }),
                credentials: "include"
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage(`Success: ${data.message}`);
                // Reset form
                setFormParams({
                    event_id: events.length > 0 ? events[0].id : "",
                    description: ""
                });
                
                // Navigate back to dashboard after short delay
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                setMessage(`Error: ${data.message || "Failed to create job"}`);
            }
        } catch (error) {
            console.error("HTTP request failed", error);
            setMessage("Error: Failed to connect to the server");
        }
        
        setIsSubmitting(false);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Create Job</h1>
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
                <form onSubmit={handleAgentRequest}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Select Event:</label>
                        {events.length === 0 ? (
                            <div className="p-3 bg-yellow-100 text-yellow-700 rounded">
                                No events available. Please create an event first.
                            </div>
                        ) : (
                            <select 
                                value={formParams.event_id}
                                onChange={(e) => setFormParams({...formParams, event_id: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            >
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.name} ({new Date(event.date).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block mb-2 font-medium">Job Description:</label>
                        <textarea 
                            value={formParams.description}
                            onChange={(e) => setFormParams({...formParams, description: e.target.value})}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                            placeholder="Describe the job requirements"
                        />
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                            disabled={isSubmitting || events.length === 0}
                        >
                            {isSubmitting ? "Creating Job..." : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentRequest;