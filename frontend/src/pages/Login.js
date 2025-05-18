import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = ({ setIsLoggedIn, setFirstName, setLastName }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log("Username: ", username)
            console.log("Password: ", password)

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.token);
                console.log(data.user)
                setIsLoggedIn(true);
                setFirstName(data.user.first_name)
                setLastName(data.user.last_name)
                navigate("/dashboard")
            } else {
                alert("Login failed: " + data.message)
            }
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;