import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const passwordRef = useRef();
  const confirmPasswordRef = useRef(); 

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 15) {
      return "Password must be between 8 and 15 characters long.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return null; // No errors
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPassword = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

     // Check if passwords match
     if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      console.log(data);
      //alert("inside the logic "+response.status);
      if (response.status === 200) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect to login page after 2 seconds
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          ref={passwordRef}
          placeholder="Enter new password"
          required
        />
        <input 
        type="password" 
        ref={confirmPasswordRef} 
        placeholder="Confirm new password" 
        required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button 
        type="submit">Reset Password</button>
          {message && <p>{message}</p>}  {/* Show success message */}
         {error && <p>{error}</p>} 
      </form>
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
