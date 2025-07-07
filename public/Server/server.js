const express = require("express");
const https = require('https');
const fs = require('fs');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const client = require('./models/db');
const crypto = require('crypto');
const moment = require('moment');
//const User = require("./models/User"); 
//const cors = require('cors');
const app = express();
const { Pool } = require("pg");
const nodemailer = require("nodemailer");
//const router = express.Router();
const { spawn } = require('child_process');
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

/*const privateKey = fs.readFileSync("C:/Users/Samia Kazi/private-key.pem", 'utf8');
const certificate = fs.readFileSync("C:/Users/Samia Kazi/certificate.pem", 'utf8');
const credentials = { key: privateKey, cert: certificate };

https.createServer(credentials, app).listen(5000, () => {
  console.log('Server running on https://localhost:5000');
});*/
// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Users",
  password: "postgresql",
  port: 5432, // Default PostgreSQL port
});
// Connect to MongoDB
/*mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Create User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const User = mongoose.model("User", userSchema);
module.exports = User;*/

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received data:", req.body);
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields (username, email, password) are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [
      username,
      email,
      hashedPassword //password
    ]);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/check-email", async (req, res) => {
    const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(200).json({ message: "Email is unique" });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Check if email already exists
/*router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists!" });
    }
    res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Server error occurred. Please try again." });
  }
});

module.exports = router;*/

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists in the database
    //const user = await User.findOne({ email });
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
     if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If email and password are correct, send success response
    res.status(200).json({ 
      message: "Login successful",
      username: user.username,  // Sending username
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/*
// Your transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
  debug: true,
});
*/
// Forgot password route (sending the email)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
try{
  //const user = await User.findOne({ email });
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(404).json({ error: "User with this email doesn't exist" });
  }

  const token = crypto.randomBytes(32).toString('hex');
  //user.resetPasswordToken = resetToken;
  const resetTokenExpiration = moment().add(1, 'hour').toDate();
  //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  //await user.save();
  await client.query(
    'UPDATE users SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3',
    [token, resetTokenExpiration, email]
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'samiakazi2004@gmail.com',
      pass: 'lssmabivpbyqyiyu', // Use an app-specific password
    },
  });

  const resetUrl = `http://localhost:5000/reset-password/${token}`; //For Laptop
  const resetUrl1 = ` https://a515-42-111-97-29.ngrok-free.app/reset-password/${token}`; //For Laptop and Mobile


  const mailOptions = {
    to: email,
    from: 'samiakazi2004@gmail.com',
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl1}`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'Password reset link sent to your email' });
  console.log('Password reset token sent '+ token )
  
 // console.log(resetUrl);
  
 //mailOptions and transporter for sending emails needs to be added
}

catch (error) {
  console.error('Error during forgot password:', error);
  res.status(500).json({ message: 'Server error' });
}
  //const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

  /*const mailOptions = {
    to: email,
    from: 'your-email@gmail.com',
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password: \n\n${resetUrl}`,
  };

  try {
    console.log(`Password reset requested for email: ${email}`);
    console.log(mailOptions);  // Log the email options before sending
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link has been sent to your email. Please check your inbox.",emailDetails: mailOptions, });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email." });
  }*/
});


app.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  console.log('Received reset token:', token);

  try {
    // Find the user by reset token
    const result = await client.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > NOW()',
      [token]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Display the reset password form
    res.send(`
      <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      h2 {
        margin-bottom: 20px;
      }
      input {
        padding: 10px;
        margin: 10px 0;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
      }
      button {
        padding: 10px;
        margin: 10px 0;
        width: 100%;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background-color: #0056b3;
      }
      .error {
        color: red;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Reset Password</h2>
      <form action="/reset-password/${token}" method="POST">
        <input type="password" name="newPassword" placeholder="Enter new password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm password" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  </body>
  </html>
    `);
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Reset password route (update password)
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  console.log('Request Body:', req.body);
  //console.log('Reset Password token:', token);

  // Password validation regex (8-15 chars, one uppercase, one lowercase, one number, one special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 300px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          h2 {
            margin-bottom: 10px;
          }
          input {
            padding: 10px;
            margin: 10px 0;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }
          button {
            padding: 10px;
            margin: 10px 0;
            width: 100%;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #0056b3;
          }
          .error {
            color: red;
            font-size: 12px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Password</h2>
          <p class="error">⚠ Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
          <form action="/reset-password/${token}" method="POST">
            <input type="password" name="newPassword" placeholder="Enter new password" required />
            <input type="password" name="confirmPassword" placeholder="Confirm password" required />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </body>
      </html>
    `);
  }

  if (newPassword !== confirmPassword) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 300px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          h2 {
            margin-bottom: 10px;
          }
          input {
            padding: 10px;
            margin: 10px 0;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }
          button {
            padding: 10px;
            margin: 10px 0;
            width: 100%;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #0056b3;
          }
          .error {
            color: red;
            font-size: 12px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Password</h2>
          <p class="error">⚠ Passwords do not match. Please try again.</p>
          <form action="/reset-password/${token}" method="POST">
            <input type="password" name="newPassword" placeholder="Enter new password" required />
            <input type="password" name="confirmPassword" placeholder="Confirm password" required />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </body>
      </html>
    `);
  }
  //const { resetToken, newPassword } = req.body;

 /* const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });*/
  try {
    // Find the user by reset token
    const result = await client.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > NOW()',
      [token]
    );
    const user = result.rows[0];

  if (!user) {
    return res.send(`
      <div class="container">
        <h2>Reset Password</h2>
        <p class="error">⚠ Invalid or expired token.</p>
      </div>
    `);
  }
  console.log('New password before hashing:', newPassword);

  // Hash the new password
  //const hashedPassword = await bcrypt.hash(newPassword, 10);
  //console.log('Hashed password:', hashedPassword);


  // Update the password in the database and clear the reset token
  await client.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = $2',
    [newPassword, token]
  );

  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Success</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          text-align: center;
        }
        .success {
          color: green;
          font-size: 14px;
          margin-bottom: 10px;
        }
        a {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Successful</h2>
        <p class="success">✅ Your password has been reset successfully.</p>
      </div>
    </body>
    </html>
  `);

 /* user.password = newPassword; // Hash it before saving in production
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();*/

  res.status(200).json({ message: "Password has been reset successfully." });

  /*const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'samiakazi2004@gmail.com',
      pass: 'lssmabivpbyqyiyu',
    },
  });

  const mailOptions = {
    to: user.email,
    from: 'samiakazi2004@gmail.com',
    subject: 'Password Reset Confirmation',
    text: 'Your password has been successfully reset.',
  };

  await transporter.sendMail(mailOptions);*/

}catch (error) {
  console.error('Error during password reset:', error);
  return res.send('<p class="error">⚠ Server error. Please try again later.</p>');
}
});

/*app.post('/predict', (req, res) => {
  const symptoms = req.body.symptoms;

  // Call the trained model (assuming it's a Python script)
  const pythonProcess = spawn('python', ['models/model_script.py', JSON.stringify(symptoms)]);

  pythonProcess.stdout.on('data', (data) => {
    const prediction = data.toString();
    res.json({ prediction: prediction });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      res.status(500).send('Error processing the prediction');
    }
  });
});*/

/*app.post('/predict', (req, res) => {
  const symptoms = req.body.symptoms;

  // Validate the input
  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ error: 'Invalid symptoms input' });
  }

  // Call the Python script
  const pythonProcess = spawn('python', ['models/model_script.py', JSON.stringify(symptoms)]);

  let prediction = '';
  let errorOutput = '';

  // Capture Python script's stdout
  pythonProcess.stdout.on('data', (data) => {
    prediction += data.toString();
  });

  // Capture Python script's stderr
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`stderr: ${data}`);
  });

  // Handle script close event
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        // Parse prediction to ensure it's valid
        const parsedPrediction = JSON.parse(prediction.trim());
        return res.json({ prediction: parsedPrediction });
      } catch (err) {
        console.error('Error parsing prediction output:', err.message);
        return res.status(500).json({ error: 'Invalid prediction output' });
      }
    } else {
      console.error('Python script failed:', errorOutput);
      return res.status(500).json({ error: 'Error processing the prediction' });
    }
  });

  // Handle unexpected errors
  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python script:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  });
});*/

const symptomMapping = {'itching': 1, 'skin_rash': 3, 'nodal_skin_eruptions': 4, 'continuous_sneezing': 4, 'shivering': 5, 'chills': 3, 
  'joint_pain': 3, 'stomach_pain': 5, 'acidity': 3, 'ulcers_on_tongue': 4, 'muscle_wasting': 3, 'vomiting': 5, 'burning_micturition': 6, 
  'spotting_urination': 6, 'fatigue': 4, 'weight_gain': 3, 'anxiety': 4, 'cold_hands_and_feets': 5, 'mood_swings': 3, 'weight_loss': 3, 
  'restlessness': 5, 'lethargy': 2, 'patches_in_throat': 6, 'irregular_sugar_level': 5, 'cough': 4, 'high_fever': 7, 'sunken_eyes': 3, 
  'breathlessness': 4, 'sweating': 3, 'dehydration': 4, 'indigestion': 5, 'headache': 3, 'yellowish_skin': 3, 'dark_urine': 4, 'nausea': 5,
  'loss_of_appetite': 4, 'pain_behind_the_eyes': 4, 'back_pain': 3, 'constipation': 4, 'abdominal_pain': 4, 'diarrhoea': 6, 'mild_fever': 5,
  'yellow_urine': 4, 'yellowing_of_eyes': 4, 'acute_liver_failure': 6, 'fluid_overload': 4, 'swelling_of_stomach': 7, 
  'swelled_lymph_nodes': 6, 'malaise': 6, 'blurred_and_distorted_vision': 5, 'phlegm': 5, 'throat_irritation': 4, 'redness_of_eyes': 5, 
  'sinus_pressure': 4, 'runny_nose': 5, 'congestion': 5, 'chest_pain': 7, 'weakness_in_limbs': 7, 'fast_heart_rate': 5, 
  'pain_during_bowel_movements': 5, 'pain_in_anal_region': 6, 'bloody_stool': 5, 'irritation_in_anus': 6, 'neck_pain': 5, 'dizziness': 4, 
  'cramps': 4, 'bruising': 4, 'obesity': 4, 'swollen_legs': 5, 'swollen_blood_vessels': 5, 'puffy_face_and_eyes': 5, 'enlarged_thyroid': 6, 
  'brittle_nails': 5, 'swollen_extremeties': 5, 'excessive_hunger': 4, 'extra_marital_contacts': 5, 'drying_and_tingling_lips': 4, 
  'slurred_speech': 4, 'knee_pain': 3, 'hip_joint_pain': 2, 'muscle_weakness': 2, 'stiff_neck': 4, 'swelling_joints': 5, 
  'movement_stiffness': 5, 'spinning_movements': 6, 'loss_of_balance': 4, 'unsteadiness': 4, 'weakness_of_one_body_side': 4, 
  'loss_of_smell': 3, 'bladder_discomfort': 4, 'foul_smell_ofurine': 5, 'continuous_feel_of_urine': 6, 'passage_of_gases': 5, 
  'internal_itching': 4, 'toxic_look_(typhos)': 5, 'depression': 3, 'irritability': 2, 'muscle_pain': 2, 
  'altered_sensorium': 2, 'red_spots_over_body': 3, 'belly_pain': 4, 'abnormal_menstruation': 6, 'dischromic_patches': 6, 
  'watering_from_eyes': 4, 'increased_appetite': 5, 'polyuria': 4, 'family_history': 5, 'mucoid_sputum': 4, 'rusty_sputum': 4, 
  'lack_of_concentration': 3, 'visual_disturbances': 3, 'receiving_blood_transfusion': 5, 'receiving_unsterile_injections': 2, 
  'coma': 7, 'stomach_bleeding': 6, 'distention_of_abdomen': 4, 'history_of_alcohol_consumption': 5, 'blood_in_sputum': 5, 
  'prominent_veins_on_calf': 6, 'palpitations': 4, 'painful_walking': 2, 'pus_filled_pimples': 2, 'blackheads': 2, 'scurring': 2, 
  'skin_peeling': 3, 'silver_like_dusting': 2, 'small_dents_in_nails': 2, 'inflammatory_nails': 2, 'blister': 4, 'red_sore_around_nose': 2,
  'yellow_crust_ooze': 3, 'prognosis': 5};
/*app.post('/predict', (req, res) => {
  try{
  const symptoms = req.body.symptoms;
  console.log("Symptoms received:", symptoms); // Debug log

  // Ensure symptoms is not null or undefined
  if (!symptoms) {
    return res.status(400).json({ error: "No symptoms provided" });
  }

  const result = model.predict(symptoms);
  res.json({ prediction: result });
}
  catch(error){ 
  console.error('Error during prediction:', error);
  res.status(500).json({ error: 'Failed to process the request.' });}

  // Call the Python script
  const pythonProcess = spawn('python', ['models/model_script.py', JSON.stringify(symptoms)]);

  pythonProcess.stdout.on('data', (data) => {
    const prediction = data.toString();
    console.log("Python script output:", prediction); // Debug log
    res.json(JSON.parse(prediction)); // Return the prediction to the client
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error("Python script error:", data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      res.status(500).send("Error processing the prediction");
    }
  });
});*/

// Sample POST route to handle prediction
app.post('/predict', (req, res) => {
  //alert("POST /predict hit")
  console.log("POST /predict hit")
  
  //const symptoms = req.body.symptoms;  // Assuming symptoms are sent in the body of the request
  //const symptomWeights = {};
  const { email, age, gender, symptoms } = req.body;
  console.log('Request body:', req.body);

  if (!symptoms || symptoms.length !== 3) {
    return res.status(400).json({ error: 'Exactly 3 symptoms are required' });
  }
  const sortedSymptoms = symptoms.sort(); // Sort alphabetically 
  const symptomWeights = sortedSymptoms.map((symptom) => symptomMapping[symptom] || 0);

  console.log('Mapped Symptoms with Weights:', symptomWeights);

  // Map the symptoms to their respective values
 /* const symptomValues = Object.keys(symptoms).reduce((mappedSymptoms, symptom) => {
    if (symptomMapping[symptom] !== undefined) {
      mappedSymptoms[symptom] = symptomMapping[symptom];
    }
    return mappedSymptoms;
  }, {});*/

  /*symptoms.forEach(symptom => {
    if (symptomMapping.hasOwnProperty(symptom)) {
      symptomWeights[symptom] = symptomMapping[symptom];
    }
  });

  console.log("Mapped Symptoms with Weights: ", symptomWeights);*/

  // Now you can pass the mapped symptom values to your prediction model
  // Example: const prediction = model.predict(symptomValues);
  // Prepare arguments for Python script
  const pythonArgs = [JSON.stringify({ age, gender, symptomWeights })];
  const pythonProcess = spawn('python', ['models/flask_script.py', ...pythonArgs]);   //JSON.stringify(symptomValues)

  pythonProcess.stdout.on('data', async (data) => {
    try {
      alert("Python stdout: ", data.toString());
      console.log("Python stdout: ", data.toString());
      const prediction = JSON.parse(data.toString());
      console.log('Prediction from Python:', prediction);
      //res.json({ prediction: prediction.result });

      if (!prediction.result) {
        console.error('Prediction result is missing:', prediction);
        alert('Prediction result is missing:', prediction)
        return res.status(500).json({ error: 'Prediction result is missing' });
      }
      
      /*console.log('Inserting data into DB: ', { email, age, gender, symptoms: symptoms.join(', '), predictedDisease: prediction.result });
      const createdAt = new Date().toISOString(); 
      // Save details in the database
      const insertResult = await pool.query(
        "INSERT INTO user_health_details (email, age, gender, symptoms, predicted_disease, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [email, age, gender, symptoms.join(', '), prediction.result, createdAt]
      );
      if (insertResult.rowCount === 0) {
        console.error('Error inserting data:', insertResult);
        res.status(500).json({ error: 'Failed to save data to database' });
      }
      else {
        console.log('Data inserted successfully:', insertResult);
        res.json({ prediction: prediction.result, message: "Details saved successfully!" });
      }*/

      // Send response with prediction and confirmation of data saving
      
    } catch (error) {
      console.error("Error parsing Python response: ", error);
      res.status(500).json({ error: 'Prediction failed' });
    }
  });

  pythonProcess.stderr.on('data', (error) => {
    console.error(`Python error: ${error.toString()}`);
    res.status(500).json({ error: 'Internal server error' });
  });

   pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      res.status(500).json({ error: 'Python script execution failed' });
    }
  });
});

app.post('/save', async (req, res) => {
  try {
      console.log("POST /save hit");
      const { email, age, gender, symptoms, predicted_disease } = req.body;

      console.log('Inserting into DB:', { email, age, gender, symptoms, predicted_disease });

      const createdAt = new Date().toISOString();
      const insertResult = await pool.query(
          "INSERT INTO user_health_details (email, age, gender, symptoms, predicted_disease, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
          [email, age, gender, symptoms.join(', '), predicted_disease]
      );

      if (insertResult.rowCount === 0) {
          console.error('Error inserting data:', insertResult);
          return res.status(500).json({ error: 'Failed to save data to database' });
      }

      console.log('Data inserted successfully:', insertResult);
      res.json({ message: "Details saved successfully!" });

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database insertion failed' });
  }
});

app.post('/history', async (req, res) => {
  try {
      const { email } = req.body;

      if (!email) {
          return res.status(400).json({ error: 'Email is required' });
      }

      const result = await pool.query(
          "SELECT * FROM user_health_details WHERE email = $1 ORDER BY created_at DESC",
          [email]
      );

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
  }
});




app.get('/', (req, res) => {
  res.send('Welcome to the HTTPS backend server!');
});
app.use(cors({
  origin: 'http://localhost:3000' // Allow only React app on port 3000
}));


// Start the Server
/*app.listen(5000, '192.168.56.1', () => {
  console.log("Server is running on http://192.168.56.1:5000");
});*/
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
