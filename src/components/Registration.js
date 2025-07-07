import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "./images/1.jpg";
import MedCare from './images/Med Care.png'
import './Registration.css'


const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const handleBackButton = (event) => {
        event.preventDefault();
        navigate("/"); // Redirect back to Home Page
      };
  
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
  
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }, [navigate]);

  const validate = () => {
    const newErrors = {};

    // Check if name is empty
    if (!formData.username.trim()) {
      newErrors.username = "Name is required";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate password length
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 15) {
      newErrors.password = "Password must be between 8 and 15 characters long";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({}); // Clear errors as the user types
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } 
    else {
      console.log("Registration Data:", formData); // Debugging
      alert("Registration Successful!");
      navigate("/login"); // Redirect to Login page
    }
  };*/
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate();

      // Validate Name
  if (!formData.name || formData.name.trim() === "") {
    validationErrors.name = "Name is required";
  }

  // Validate Email
  if (!formData.email || formData.email.trim() === "") {
    validationErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    validationErrors.email = "Invalid email format";
  }

  // Validate Password
  if (!formData.password || formData.password.trim() === "") {
    validationErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    validationErrors.password = "Password must be at least 6 characters long";
  }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }
  
    try {
      // Check if the email exists in the database
      const checkEmailResponse = await fetch("http://localhost:5000/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const emailCheckResult = await checkEmailResponse.json();
  
      if (checkEmailResponse.status === 409) {
        // Email already exists
        setErrors({ email: emailCheckResult.error });
        return;
      }
  
      // Proceed with registration
      setErrors({}); // Clear errors
      console.log("Registration Data:", formData); // Debugging
  
      alert("Registration Successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during email check or registration:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  */

  //Changes made here 
  const handleClose = () => {
    navigate("/"); // Redirects to Home Page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.setItem("username", formData.username);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("password", formData.password);
  
    //till here
    const validationErrors = validate();
  
    // Validate Name
    if (!formData.username || formData.username.trim() === "") {
      validationErrors.name = "Name is required";
    }
  
    // Validate Email
    if (!formData.email || formData.email.trim() === "") {
      validationErrors.email = "Email is required";
    } 
  
    // Validate Password
    if (!formData.password || formData.password.trim() === "") {
      validationErrors.password = "Password is required";
    } 
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop further processing if there are validation errors
    }
  
    setErrors({}); // Clear previous errors
  
    try {
      // Step 1: Check if the email exists in the database
      const checkEmailResponse = await fetch("http://localhost:5000/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const emailCheckResult = await checkEmailResponse.json();
  
      if (checkEmailResponse.status === 409) {
        // Email already exists
        setErrors({ email: emailCheckResult.error });
        return;
      }
  
      // Step 2: Proceed with registration if email is unique
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData to backend
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        // Registration success
        alert("Registration successful! Please log in");
        navigate("/login");
      } else if (response.status === 409) {
        // Email already exists
        setErrors({ email: data.error });
      } else {
        alert(`Registration failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  /*const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        // Send data to the backend
        const response = await axios.post("http://localhost:5000/register", formData);
  
        alert(response.data.message); // Show success message
        navigate("/login"); // Redirect to login
      } catch (error) {
        alert(error.response.data.message || "Registration failed");
      }
    }
  };*/
 /* const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Registration successful!');
        navigate("/login");
      } else {
        console.error("Error details:", data); // Log the error response from server
        alert(`Registration failed: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log any network-related errors
      alert("An unexpected error occurred. Please try again.");
    }
  };*/
  
  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", formData);
  
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      alert(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
    }
  };*/
  
  return (
    <>
    <header className="navbar">
      <div className="image-logo">
             <img src={MedCare} alt="MedCare Logo" />
          </div>
        <div className="logo">MEDCare</div>
        <nav className="nav">
        <Link to="/explore">Explore</Link>
        <Link to="/symptom-checker">Symptom Checker</Link>
        <Link to="/medical-articles">Blogs</Link>
        
        </nav>
      </header>
    <div className="registration-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div className="registration-box"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
          padding: "30px",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)", 
          borderRadius: "12px",
          border: "1px solid #007bff",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button 
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "none",
            fontSize: "18px",
            cursor: "pointer",
          }} 
          onClick={handleClose}
        >
          ✖
        </button>

        <h2>Registration</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Name Input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{
              padding: "10px",
              margin: "10px 0",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          {errors.username && <p style={{ color: "red", fontSize: "12px" }}>{errors.username}</p>}

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "10px",
              margin: "10px 0",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              padding: "10px",
              margin: "10px 0",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "10px",
              margin: "10px 0",
              width: "100%",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Register
          </button>

          {/* Login Link */}
          <a
            href="/login"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            Already Registered? Sign In
          </a>
        </form>
      </div>
    </div>
    </>
);
};
const styles = {
  container: {
    position: "relative",
    padding: "20px",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "red",
  },
};

export default Registration;
