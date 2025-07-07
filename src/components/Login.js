import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MedCare from './images/Med Care.png'
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/");
    }
  }, []);

  const validate = () => {
    const newErrors = {};

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: undefined,
    })); // Clear errors as the user types
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Login Data:", formData); // Debugging
      alert("Login Successful!");
      navigate("/dashboard"); // Redirect to Dashboard
    }
  };*/
  const handleClose = () => {
    navigate("/"); // Redirects to Home Page
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    //const storedUsername = localStorage.getItem("username");
    

    if (formData.email === storedEmail && formData.password === storedPassword) {
      localStorage.setItem("isAuthenticated", "true");// Set login flag 
      //localStorage.setItem("username", storedUsername);
      /*setTimeout(() => {
        navigate("/"); // Redirect to Home after 500ms
    }, 1000);*/
    }
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setErrors({}); // Clear previous errors
  
    try {
      // Send login data to the backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData to backend
      });
  
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("Server error: Unable to process the response. Please try again.");
        return;
      }

      if (response.status === 200) {
        localStorage.setItem("isAuthenticated", "true"); 
        localStorage.setItem("username", data.username);  // Store username
        localStorage.setItem("email", data.email);
        //alert(`Welcome back, ${data.username}!`);
        // Login successful
        alert("Login Successful!");
        setTimeout(() => navigate("/"), 1000);

        //localStorage.setItem("username", storedUsername);
        //localStorage.setItem("isAuthenticated", "true");

        //navigate("/symptom-checker"); // Redirect to Symptom Checker
      } else if (response.status === 404) {
        // Email not registered
        setErrors({ email: "Email not registered" });
      } else if (response.status === 401) {
        // Invalid credentials
        setErrors({ password: "Invalid password" });
      } else {
        alert(`Login failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred. Please try again later.");

    }
  };
  
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
    <div className="login-container" 
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4"
      }}>
      
      <div className="login-box" 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",  // Increased size
          padding: "30px",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)", 
          borderRadius: "12px",
          border: "1px solid #007bff",  // 🔵 Thick Blue Border
        }}>

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
        
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}>
          
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

          {/* Forgot Password Link */}
          <a href="/forgot-password"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontSize: "14px",
              marginTop: "10px",
            }}>
            Forgot Password?
          </a>

          {/* Submit Button */}
          <button type="submit"
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
            }}>
            Login
          </button>

          {/* Register Link */}
          <a href="/register"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontSize: "14px",
              marginTop: "10px",
            }}>
            Not yet Registered? Register!
          </a>
          
        </form>
      </div>
    </div>
    </>
);
};

export default Login;
