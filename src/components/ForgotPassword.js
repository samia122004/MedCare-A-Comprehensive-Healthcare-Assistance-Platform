import React, { useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import MedCare from './images/Med Care.png'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [errors, setError] = useState('');
  const emailRef = useRef(null);
  const navigate = useNavigate();
  

  const handleForgotPassword = async (e) => {
  
    e.preventDefault();
    
    console.log("Email submitted", emailRef.current?.value);
    const email = emailRef.current.value;
    
    if (!email) {
        setError('Email is required');
        
        return;
      }

    try {

      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
     
      const data = await response.json();
      console.log(data);
      //alert("inside the logic "+response.status);
      if (response.status === 200) {
       
        alert(data.message);
        console.log("Email Details:", data.emailDetails);
        setEmailDetails(data.emailDetails);
        //navigate('/reset-password');
      } else {
        setError(data.error);
        
      }
    } catch (error) {
        console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const [emailDetails, setEmailDetails] = React.useState(null);

  return (
    <div div className="forgot-password"
    style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", 
        backgroundColor: "#f4f4f4"
      }}
      > 
    <header className="navbar">
      <div className="image-logo">
             <img src={MedCare} alt="MedCare Logo" />
          </div>
        <div className="logo3">MEDCare</div>
        <nav className="nav">
        <Link to="/explore">Explore</Link>
        <Link to="/discovery">Drug Discovery</Link>
        <Link to="/symptom-checker">Symptom Checker</Link>
        <Link to="/medical-articles">Blogs</Link>
        
        </nav>
      </header>
    
      <h2>Forgot Password</h2>
      <form 
      onSubmit={handleForgotPassword}
      style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "350px",
      padding: "20px",
      backgroundColor: "#fff",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    }}
    >
        <input
          type="email"
          style={{ padding: "10px", margin: "10px 0", width: "100%" }}
          ref={emailRef}
          placeholder="Enter your email"
          required
        />
        {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
        <button 
        onClick={handleForgotPassword}
        type="submit"
        style={{
            padding: "10px",
            margin: "10px 0",
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          >
            Submit</button>
      </form>
      {emailDetails && (
    <div>
      <h3>Email Sent</h3>
      <p><strong>To:</strong> {emailDetails.to}</p>
      <p><strong>From:</strong> {emailDetails.from}</p>
      <p><strong>Subject:</strong> {emailDetails.subject}</p>
      <p><strong>Text:</strong> {emailDetails.text}</p>
    </div>
  )}
    </div>
    
  );
};

export default ForgotPassword;
