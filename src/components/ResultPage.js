import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import MedCare from './images/Med Care.png'
import { jsPDF } from 'jspdf';  // Import jsPDF

const ResultPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const location = useLocation();
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
    // If no email found, you can redirect the user to login page
      window.location.href = '/login'; // Or use React Router to navigate
    }
    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    setCurrentDateTime(formattedDateTime);
    }, []);

  const { 
    age, 
    gender, 
    selectedSymptom1, 
    selectedSymptom2, 
    selectedSymptom3, 
    prediction, 
    description, 
    precaution1,
    precaution2,
    precaution3,
    precaution4
  } = location.state || {}; // Default to empty if no state

  console.log(location.state);

  const symptomsAvailable = selectedSymptom1 && selectedSymptom2 && selectedSymptom3;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you really want to log out?");
    if (confirmLogout) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
    } // Stay on Home Page after logout
  };

   // Function to generate PDF
   const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(30);

    // Set document margins (top, left, bottom, right)
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const pageWidth1 = doc.internal.pageSize.getWidth();

    // Add Title to the PDF
    const text = "Medical Report";
    const textWidth = doc.getTextWidth(text); // Get text width
    const xPosition = (pageWidth1 - textWidth) / 2; // Calculate center position

    doc.text(text, xPosition, 20);

    // Add Patient Information
    doc.setFontSize(12);
    doc.text(`Date & Time: ${currentDateTime}`, margin, 30);
    doc.text(`Patient Name: ${username}`, margin, 40); 
    doc.text(`Age: ${age}`, margin, 50);
    doc.text(`Gender: ${gender}`, margin, 60);

    // Add Symptoms
    doc.text(`Symptom 1: ${selectedSymptom1}`, margin, 70);
    doc.text(`Symptom 2: ${selectedSymptom2}`, margin, 80);
    doc.text(`Symptom 3: ${selectedSymptom3}`, margin, 90);

    // Add Disease Prediction
    const descriptionLines = doc.splitTextToSize(description, pageWidth - 2 * margin);
    doc.text(`Predicted Disease: ${prediction}`, margin, 100);
    doc.text(`Description:`, margin, 110);  //${description}
    doc.text(descriptionLines, margin, 120);

    // Add Precautions (making sure to wrap the text if too long)
    const precautions = [precaution1, precaution2, precaution3, precaution4];
    doc.text("Precautions:", margin, 140);
    precautions.forEach((precaution, index) => {
      doc.text(`${index + 1}. ${precaution}`, margin, 150 + (index * 10));
    });

    // Save the PDF
    doc.save("medical_report.pdf");
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
        <span className="welcome-text">Hi, {username}!</span>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <button className="login-button" onClick={() => navigate("/login")}>Login</button>
    )}
  </div>
    </nav>
  </header>
    <Container className="my-1">
    <Row className="align-items-center mb-4" style={{ marginTop: "40px" }}>
  <Col xs={4}>
    <Button variant="primary" href="/" className="mt-0">
      Back to Symptom Checker
    </Button>
  </Col>
  <Col xs={4} className="text-center">
    <h2 className="mb-0">Medical Report</h2>
  </Col>
  <Col xs={4} className="text-end">
    <Button variant="secondary" onClick={generatePDF}>
      Download Report as PDF
    </Button>
  </Col>
</Row>
      
      {/* Display the report inside a Card component */}
      <Card className="shadow-lg p-4" style={{ maxWidth: '1200px', width: '100%', marginLeft: '40px', transition: 'box-shadow 0.3s ease-in-out', }}
      onMouseEnter={(e) => e.target.style.transform = 'none'} // Ensure no scale on hover
      onMouseLeave={(e) => e.target.style.transform = 'none'}>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <h5>Patient Information</h5>
              <ul>
              <li><strong>Date & Time:</strong> {currentDateTime}</li>
                <li><strong>Patient Name:</strong> {username}</li> 
                <li><strong>Age:</strong> {age}</li>
                <li><strong>Gender:</strong> {gender}</li>
              </ul>
            </Col>
          </Row>

          {symptomsAvailable ? (
          <Row className="mb-3">
            <Col>
              <h5>Symptoms</h5>
              <ul>
                <li><strong>Symptom 1:</strong> {selectedSymptom1}</li>
                <li><strong>Symptom 2:</strong> {selectedSymptom2}</li>
                <li><strong>Symptom 3:</strong> {selectedSymptom3}</li>
              </ul>
            </Col>
          </Row>
          ) : (
            <p><strong>No symptoms data available.</strong></p>
          )}

          <Row className="mb-3">
            <Col>
              <h5>Prediction</h5>
              <ul>
                <li><strong>Predicted Disease:</strong> {prediction}</li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Precautions:</strong></li>
                <li>1. {precaution1}</li>
                <li>2. {precaution2}</li>
                <li>3. {precaution3}</li>
                <li>4. {precaution4}</li>

              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default ResultPage;
