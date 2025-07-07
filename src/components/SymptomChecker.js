import React, { useState, useEffect } from 'react';
import './SymptomChecker.css';
import SystemCheckerImage from './images/SystemChecker.png';
import animationData from "./animation.json"; // ✅ Corrected import path
import MedCare from './images/Med Care.png'
import Lottie from "lottie-react";
import { useNavigate, Link } from 'react-router-dom';



/*const SymptomChecker = () => {
  const [showForm, setShowForm] = useState(false);

  const startInterview = () => {
    setShowForm(true);
  };*/
    
  const SymptomChecker = () => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [username, setUsername] = useState("");
      const [email, setEmail] = useState('');
    
      useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        const storedUsername = localStorage.getItem("username");
    
        if (storedAuth === "true" && storedUsername) {
          setIsAuthenticated(true);
          setUsername(storedUsername);
        }
      }, []);

      useEffect(() => {
        // Retrieve the email from localStorage
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
          setEmail(savedEmail);
        } else {
          // If no email found, you can redirect the user to login page
          window.location.href = '/register'; // Or use React Router to navigate
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

    const goToQuestions = () => {
      navigate("/questions"); // Navigate to the "/questions" route (the next page)
    };
    const names = ["you", "women", "men", "adults", "parents"]; // List of names to cycle through
    const [currentName, setCurrentName] = useState(names[0]); // Initial name
  
    /*useEffect(() => {
      const token = localStorage.getItem("token"); // Check if user is logged in
      if (!token) {
        navigate("/login", { replace: true }); // Redirect if not authenticated
      }
  }, []);*/

  /*useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); // Prevent default back action
      navigate("/"); // Redirect to home page
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);*/

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/register"); // Redirect if not logged in
    }
  }, [navigate]);
    
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentName((prevName) => {
        const currentIndex = names.indexOf(prevName);
        const nextIndex = (currentIndex + 1) % names.length;
        return names[nextIndex];
      });
    }, 2000);
  
    return () => clearInterval(interval);
  }, []);
  

/*function SymptomChecker({ predictSymptoms }) {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prediction = await predictSymptoms(symptoms);
    setResult(prediction);
  };*/

  /*return (
    <div className="symptom-checker">
      <h2>Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your symptoms (e.g., fever, cough, headache)..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button type="submit">Check Symptoms</button>
      </form>
      {result && (
        <div className="result">
          <h3>Possible Diagnosis:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );*/
  return (
    <div className="app-container">
        {/* Navbar */}
        <header className="navbar">
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
            <span className="welcome-text">Welcome, {username}!</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
        </nav>
      </header>
  
        {/* Hero Section <h2>Welcome, {email ? email : 'Guest'}</h2>*/}
        <div className="hero-section">
          <div className="text-section">
            <h1>The Symptom Checker </h1>
              <h1>Designed to help </h1>
              <div className="dynamic-text-container">
                <div className="dynamic-text"><h1>
                <span className="highlight">{currentName}</span>
                </h1> 
                </div>
              </div>
              
            <ul>
              <li>✔ Analyze your symptoms</li>
              <li>✔ Identify possible diseases</li>
              <li>✔ Get useful precautions</li>
              <li>✔ Take steps for better health</li>
            </ul>
            <button onClick={goToQuestions} className="start-button">Start interview</button>
          </div>
          {/*<div className="image-section">
             <img src={SystemCheckerImage} alt="Symptom Checker UI" />
          </div>*/}
           {/* Lottie Animation Section */}
      <div className="animation-section">
        <Lottie animationData={animationData} style={{ width: 400, height: 400 }} />
      </div>
        </div>
      </div>
    );
}

export default SymptomChecker;
