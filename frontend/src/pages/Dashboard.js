import React, { useEffect, useState } from "react"

const Dashboard = ({firstName, lastName}) => {
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(
        () => {
            const fetchEvents = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
                        method: "GET",
                        credentials: "include"
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
                        credentials: "include"
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
        <div>
            <h1>Hello {firstName} {lastName}</h1>
            <h2>Upcoming Events:</h2>
            <ul>
                {!Array.isArray(events) || events.length === 0 ? (
                    <li>No events available</li>
                ) : (
                    events.map((event, index) => (
                        <li key={index}>
                            {event.name} - {event.description}
                        </li>
                    ))
                )
                }
            </ul>
            <h2>Your Tasks:</h2>
            <ul>
                {!Array.isArray(tasks) || tasks.length === 0 ? (
                    <li>No tasks available</li>
                ) : (
                    tasks.map((task, index) => (
                        <li key={index}>
                            {task.title} - {task.description}
                        </li>
                    ))
                )
                }
            </ul>
        </div>
    );
};

export default Dashboard