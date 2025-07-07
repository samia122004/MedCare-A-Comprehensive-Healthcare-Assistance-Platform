/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React from 'react';
//import { Switch, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Registration from './components/Registration';
import Login from './components/Login';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from './components/ResetPassword';
import SymptomChecker from './components/SymptomChecker';
import Questions from './components/Questions';
import ResultPage from './components/ResultPage';
import MedicalArticles from './components/MedicalArticles';
import HealthTips from './components/HealthTips';
import History from './components/History';
import SearchResults from './components/SearchResults';
import ChatWidget from './components/ChatWidget';
import Explore from './components/Explore';


//import Chatbot from './components/Chatbot';
import './App.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/medical-articles" element={<MedicalArticles />} />
        <Route path="/health-tips" element={<HealthTips />} />
        <Route path="/history" element={<History />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/navbar" element={<navbar />} />
        <Route path="/chat" element={<ChatWidget />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
  
}

export default App;

