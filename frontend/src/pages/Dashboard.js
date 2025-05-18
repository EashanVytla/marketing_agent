import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Dashboard = ({firstName, lastName}) => {
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    
    useEffect(
        () => {
            const fetchEvents = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
                        method: "GET",
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setEvents(data)
                    } else {
                        console.error("Failed to fetch events");
                    }
                } catch (error) {
                    console.error("HTTP request failed", error)
                }
            }
            const fetchTasks = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/task`, {
                        method: "GET",
                        credentials: 'include'
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setTasks(data);
                    } else {
                        console.error("Failed to fetch tasks");
                    }
                } catch (error) {
                    console.error("HTTP request failed", error)
                }
            };

            fetchTasks();
            fetchEvents();
        }
    , []);
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hello {firstName} {lastName}</h1>
            
            {/* Agent Request Button */}
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
                onClick={() => navigate('/agent-request')}
            >
                Create Agent Request
            </button>
            <button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6 ml-4"
                onClick={() => navigate('/add-event')}
            >
                Add Event
            </button>
            
            <h2 className="text-xl font-semibold mb-2">Upcoming Events:</h2>
            <ul className="mb-6 list-disc pl-5">
                {!Array.isArray(events) || events.length === 0 ? (
                    <li>No events available</li>
                ) : (
                    events.map((event, index) => (
                        <li key={index} className="mb-1">
                            <span className="font-medium">{event.name}</span> - {event.description}
                        </li>
                    ))
                )}
            </ul>
            
            <h2 className="text-xl font-semibold mb-2">Your Tasks:</h2>
            <ul className="list-disc pl-5">
                {!Array.isArray(tasks) || tasks.length === 0 ? (
                    <li>No tasks available</li>
                ) : (
                    tasks.map((task, index) => (
                        <li key={index} className="mb-1">
                            <span className="font-medium">{task.title}</span> - {task.description}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Dashboard