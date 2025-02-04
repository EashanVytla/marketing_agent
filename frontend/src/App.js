import logo from './logo.svg';
import './App.css';
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import React from "react"
import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  return (
    <div className="md:h-screen bg-purple-100">
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="login" exact
              element={
                <Login
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                /> 
              }
            />
            <Route path="dashboard" exact
              element={
                <Dashboard
                  firstName={firstName}
                  lastName={lastName}
                />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
