import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import MedCare from './images/Med Care.png'
import './Questions.css';

const Questions = () => {
    const navigate = useNavigate();
    /*const goToNextPage = () => {
      navigate("/predict"); // Navigate to the "/questions" route (the next page)
    };*/
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   
     useEffect(() => {
       const storedAuth = localStorage.getItem("isAuthenticated");
       const storedUsername = localStorage.getItem("username");
   
       if (storedUsername) {
         setIsAuthenticated(true);
         setUsername(storedUsername);
       }
     }, []);
  /*const [symptom1, setSymptom1] = useState("");
  const [symptom2, setSymptom2] = useState("");
  const [symptom3, setSymptom3] = useState("");*/
  const [prediction, setPrediction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    // State to track selected symptoms
    const [selectedSymptom1, setSelectedSymptom1] = useState('');
    const [selectedSymptom2, setSelectedSymptom2] = useState('');
    const [selectedSymptom3, setSelectedSymptom3] = useState('');

    useEffect(() => {
      // Retrieve the email from localStorage
      const savedEmail = localStorage.getItem('email');
      const storedUsername = localStorage.getItem("username");
      if (savedEmail && storedUsername) {
        setEmail(savedEmail);
        setUsername(storedUsername);
      } else {
      // If no email found, you can redirect the user to login page
        window.location.href = '/login'; // Or use React Router to navigate
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

  const symptomsList1 = [
    "Itching", "Skin Rash", "Continuous Sneezing", "Shivering", "Stomach Pain", "Acidity",
    "Vomiting", "Indigestion", "Muscle Wasting", "Patches in Throat", "Sunken Eyes", "Fatigue",
    "Cough", "Back Pain", "Weakness in Limbs", "Headache", "Chills", "Joint Pain", "Yellowish Skin",
    "Breathlessness", "Cramps", "Weight Gain", "Mood Swings", "Neck Pain", "Muscle Weakness",
    "Stiff Neck", "Pus Filled Pimples", "Burning Micturition", "Bladder Discomfort", "High Fever"
  ];

  const symptomsList2 = [
    "Skin Rash", "Nodal Skin Eruptions", "Chills", "Shivering", "Acidity", "Ulcers on Tongue",
    "Vomiting", "Yellowish Skin", "Stomach Pain", "Loss of Appetite", "Indigestion", "High Fever",
    "Patches in Throat", "Sunken Eyes", "Dehydration", "Cough", "Headache", "Weakness in Limbs",
    "Neck Pain", "Weakness of One Body Side", "Fatigue", "Joint Pain", "Lethargy", "Nausea",
    "Abdominal Pain", "Breathlessness", "Sweating", "Cramps", "Bruising", "Weight Gain",
    "Cold Hands and Feet", "Mood Swings", "Weight Loss", "Anxiety", "Knee Pain", "Swelling Joints",
    "Stiff Neck", "Pus Filled Pimples", "Blackheads", "Bladder Discomfort", "Foul Smell of Urine",
    "Joint Pain", "Skin Peeling", "Blister"
  ];

  const symptomsList3 = [
    "Nodal Skin Eruptions", "Chills", "Vomiting", "Ulcers on Tongue", "Watering from Eyes", "Nausea",
    "Yellowish Skin", "Stomach Pain", "Abdominal Pain", "Burning Micturition", "Loss of Appetite",
    "High Fever", "Extra Marital Contacts", "Dehydration", "Diarrhoea", "Breathlessness",
    "Headache", "Blurred and Distorted Vision", "Neck Pain", "Dizziness", "Weakness of One Body Side",
    "Altered Sensorium", "Fatigue", "Weight Loss", "Sweating", "Lethargy", "Joint Pain", "Dark Urine",
    "Swelling of Stomach", "Cough", "Chest Pain", "Bruising", "Obesity", "Cold Hands and Feet",
    "Mood Swings", "Restlessness", "Anxiety", "Knee Pain", "Hip Joint Pain", "Swelling Joints",
    "Movement Stiffness", "Spinning Movements", "Blackheads", "Scurring", "Foul Smell of Urine",
    "Continuous Feel of Urine", "Skin Peeling", "Silver Like Dusting", "Blister", "Red Sore Around Nose",
    "Dischromic Patches"
  ];
    // Function to filter out selected symptoms from other lists
    const getFilteredList = (list, selectedSymptoms) => {
      return list.filter(symptom => !selectedSymptoms.includes(symptom));
    };

    // Get the available options for each dropdown
    const availableSymptoms1 = getFilteredList([...symptomsList1, ...symptomsList2, ...symptomsList3], [selectedSymptom2, selectedSymptom3]);
    const availableSymptoms2 = getFilteredList([...symptomsList1, ...symptomsList2, ...symptomsList3], [selectedSymptom1, selectedSymptom3]);
    const availableSymptoms3 = getFilteredList([...symptomsList1, ...symptomsList2, ...symptomsList3], [selectedSymptom1, selectedSymptom2]);
    
    const formatSymptoms = (symptoms) => {
      return symptoms.map(symptom => {
        // Check if the symptom is 'dischromic patches'
        if (symptom.toLowerCase() === 'dischromic patches') {
          return symptom.trim().toLowerCase().replace(/\s+/g, '__'); // Replace spaces with double underscores
        }
        // Otherwise, replace spaces with single underscores for all other symptoms
        return symptom.trim().toLowerCase().replace(/\s+/g, '_');
      });
    };
    //handleSaveToDatabase
    const handleSaveToDatabase = async (prediction) => {
      const symptoms = formatSymptoms([selectedSymptom1, selectedSymptom2, selectedSymptom3]);
      
      try {
          const response = await fetch("http://localhost:5000/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, age, gender, symptoms, predicted_disease: prediction })
          });
  
          const data = await response.json();
          alert("Database Save Response: " + JSON.stringify(data));
  
          if (!response.ok) {
              throw new Error(data.error || "Failed to save data.");
          }
  
      } catch (error) {
          console.error("Error saving data:", error);
          alert("Error saving data: " + error.message);
      }
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !age || !gender || !selectedSymptom1 || !selectedSymptom2 || !selectedSymptom3) {
      setErrorMessage("Please fill out all fields.");
      return;
  }
 
  setErrorMessage("");
  const symptoms = formatSymptoms([selectedSymptom1, selectedSymptom2, selectedSymptom3]);

     // Check if the symptoms exist in the symptoms list (optional validation step)
  //const isValid = symptoms.every(symptom => symptomsList.map(s => s.toLowerCase().replace(/\s+/g, '_')).includes(symptom));
  
  /*if (!isValid) {
    setErrorMessage("Invalid symptoms: " + symptoms.join(", "));
    return;
  }*/
    console.log("Submitting Form:", { email, age, gender, symptoms });

    // Send the data to the backend
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, age, gender, symptoms }),
      });
      //alert("Received response from /predict"); 

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response, but got non-JSON.");
      }
      
      const data = await response.json();
      //alert("Response: " + JSON.stringify(data));
      //console.log("API Response:", data);
      if (response.ok) {
        setPrediction(data.prediction);
        alert(`Predicted Disease: ${data.prediction}`);

        handleSaveToDatabase(data.prediction);

        navigate('/result', {
          state: {
            username,
            age,
            gender,
            selectedSymptom1,
            selectedSymptom2,
            selectedSymptom3,
            prediction: data.prediction,
            description: data.description,
            precaution1: data.precaution1,
            precaution2: data.precaution2,
            precaution3: data.precaution3,
            precaution4: data.precaution4,
          }
        });
        //navigate("/predict", { state: { prediction: data.prediction } });
      } else {
        alert(`Error: ${data.error}`);
        setErrorMessage(data.message || "Failed to get prediction.");
      }
      console.log({ email, age, gender, selectedSymptom1, selectedSymptom2, selectedSymptom3, prediction: data.prediction });
    } catch (error) {
      console.error("Error:", error);
       setErrorMessage("Something went wrong. Please try again.");
       alert(`Error: ${error.message || "Something went wrong. Please try again."}`);
    }
    
  };


  return (
    <><header className="navbar">
    <div className="image-logo">
         <img src={MedCare} alt="MedCare Logo" />
      </div>
    <div className="logo4" style={{ marginRight:"auto" }}>MEDCare</div>
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
    <Container className="my-5 symptom-container">
      {/* Main Heading Outside Card */}
      <h2 className="text-center symptom-title">Symptom Checker</h2>
      <h3 className="text-center symptom-welcome">Hi {username ? username : 'Guest'}, Please fill all the details</h3>

      <Row className="justify-content-center">
        <Col md={6}>
          {/* Card for Form */}
          <Card className="symptom-card">
            <Card.Body>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              
              <Form onSubmit={handleSubmit}>
                {/* Age Field */}
                <Form.Group controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Gender Field */}
                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>

                {/* Symptom 1 Dropdown */}
                <Form.Group controlId="formSymptom1" className="mb-3">
                  <Form.Label>Select Symptom 1</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSymptom1}
                    onChange={(e) => setSelectedSymptom1(e.target.value)}
                  >
                    <option value="">Select a symptom</option>
                    {availableSymptoms1.map((symptom, index) => (
                      <option key={index} value={symptom}>{symptom}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Symptom 2 Dropdown */}
                <Form.Group controlId="formSymptom2" className="mb-3">
                  <Form.Label>Select Symptom 2</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSymptom2}
                    onChange={(e) => setSelectedSymptom2(e.target.value)}
                  >
                    <option value="">Select a symptom</option>
                    {availableSymptoms2.map((symptom, index) => (
                      <option key={index} value={symptom}>{symptom}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Symptom 3 Dropdown */}
                <Form.Group controlId="formSymptom3" className="mb-3">
                  <Form.Label>Select Symptom 3</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSymptom3}
                    onChange={(e) => setSelectedSymptom3(e.target.value)}
                  >
                    <option value="">Select a symptom</option>
                    {availableSymptoms3.map((symptom, index) => (
                      <option key={index} value={symptom}>{symptom}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" block>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Questions;
