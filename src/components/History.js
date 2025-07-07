import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import MedCare from './images/Med Care.png'
import "./History.css";

function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
           const storedAuth = localStorage.getItem("isAuthenticated");
           const storedUsername = localStorage.getItem("username");
       
           if (storedUsername) {
             setIsAuthenticated(true);
             setUsername(storedUsername);
           }
         }, []);

         const handleLogout = () => {
            const confirmLogout = window.confirm("Do you really want to log out?");
            if (confirmLogout) {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            navigate("/login");
            } // Stay on Home Page after logout
          };

    useEffect(() => {
        // Retrieve the email from localStorage
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            setEmail(savedEmail);

            // Fetch user history from backend
            fetch("http://localhost:5000/history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: savedEmail }),
            })
                .then((response) => response.json())
                .then((data) => setHistory(data))
                .catch((error) => console.error("Error fetching history:", error));
        } else {
            // Redirect to login if no email is found
            window.location.href = "/login";
        }
    }, []);

    return (
        <><header className="navbar">
    <div className="image-logo">
         <img src={MedCare} alt="MedCare Logo" />
      </div>
    <div className="logo4">MEDCare</div>
    <nav className="nav">
    <Link to="/explore">Explore</Link>
    <Link to="/symptom-checker">Symptom Checker</Link>
    <Link to="/medical-articles">Blogs</Link>
    <Link to="/history">History</Link>
  
    <div className="auth-buttons">
    {isAuthenticated ? (
      <>
        <span className="welcome-text">Hi, {username}!</span>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <button className="login-button" onClick={() => navigate("/login")}>Login</button>
    )}
  </div>
    </nav>
  </header>
        <div className="history-container">
            <div className="history-wrapper">
                <h2 className="history-title">{username}'s Health History</h2>
                {/*<p className="history-email">Showing records for: <strong>{email}</strong></p>*/}

                {history.length > 0 ? (
                    <div className="history-grid">
                        {history.map((record, index) => (
                            <div key={index} className="history-card">
                                <h3 className="history-disease">{record.predicted_disease}</h3>
                                <p className="history-symptoms">{record.symptoms}</p>
                                <p className="history-date">{new Date(record.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="history-no-data">No history found.</p>
                )}
            </div>
        </div>
        </>
    );
}

export default History;
