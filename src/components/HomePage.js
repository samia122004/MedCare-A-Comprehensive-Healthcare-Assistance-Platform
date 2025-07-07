import React, { useState, useEffect } from 'react';
import './HomePage.css'; // Import your CSS file
import ChatWidget from './ChatWidget';
import './ChatWidget.css';
import HealthTips from "./HealthTips";
import { FaSearch } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SymptomChecker from "./SymptomChecker";
import MedCare from './images/Med Care.png'
import { useNavigate } from 'react-router-dom';
import Explore from './Explore.js';


function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  //Changes made here
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

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
//...Till here
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/results?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const scrollToMore = () => {
    document.getElementById('health-section').scrollIntoView({ behavior: 'smooth' });
  };

  /*const handleBlogClick = (blogId) => {
    //navigate(`/blog${blogId}`);
    if (blogId === 1) {
      navigate("/medical-articles");
    }else {
      console.log(`Redirecting to Blog ${blogId}`);
    }
  };*/

  return (
    <div className="homepage">
      <header className="navbar">
      <div className="image-logo">
             <img src={MedCare} alt="MedCare Logo" />
          </div>
        <div className="logo1">MEDCare</div>
        <nav className="nav">
        <Link to="/explore">Explore</Link>
        <Link to="/symptom-checker">Symptom Checker</Link>
        <Link to="/medical-articles">Blogs</Link>
        
        <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">Welcome, {username ? username : "User"}!</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
        </nav>
      </header>

      {/* Main Image Section */}
      <div className="main-image">
        <div className="overlay">
          <h1 className="main-heading" style={{ color: '#FDAB95' }}>Welcome to MEDCare</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              onKeyPress={handleKeyPress}
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </div>
        </div>
      </div>

      {/* Scroll to know more */}
      <div className="scroll-section">
        <p className="scroll-text" onClick={scrollToMore}>
          Scroll to see more
        </p>
        <div className="down-arrow" onClick={scrollToMore}>
          ↓
        </div>
      </div>

      
      {/* Health Tips Section Appearing on Scroll */}
      <div className="health-section" id="health-section"><HealthTips /></div>
      {/*ChatWidget*/}
      <ChatWidget />
      
    </div>
  );
}

export default HomePage;
