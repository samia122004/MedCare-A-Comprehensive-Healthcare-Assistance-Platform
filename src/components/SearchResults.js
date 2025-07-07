import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MedCare from './images/Med Care.png'
import axios from 'axios';
import './SearchResults.css';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5002/api/search', {
          params: { query },
          //headers: { 'Access-Control-Allow-Origin': '*' }
        });
        //setResults(response.data);
        const groupedData = groupByDrugName(response.data);

        setResults(groupedData);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const groupByDrugName = (data) => {
    const drugMap = {};

    data.forEach((item) => {
      const drugName = item.drug_name;

      if (!drugMap[drugName]) {
        drugMap[drugName] = { ...item, strength: [item.strength] };
      } else {
        drugMap[drugName].strength.push(item.strength);
      }
    });

    // Convert strength array to comma-separated string
    return Object.values(drugMap).map((item) => ({
      ...item,
      strength: item.strength.join(', '),
    }));
  };

  return (
    <>
    <header className="navbar">
      <div className="image-logo">
             <img src={MedCare} alt="MedCare Logo" />
          </div>
        <div className="logo3">MEDCare</div>
        <nav className="nav">
        <Link to="/explore">Explore</Link>
        <Link to="/symptom-checker">Symptom Checker</Link>
        <Link to="/medical-articles">Blogs</Link>
        
        </nav>
      </header>
    <div className="search-results">
      <h1>Search Results for: {query}</h1>
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="results">
          {results.map((result, index) => (
            <div key={index} className="result-box">
              <h3>{result.generic_name || 'Unknown Name'}</h3>
              <p><strong>Drug Name:</strong> {result.drug_name || 'Unknown'}</p>
              <p><strong>Drug Class:</strong> {result.drug_class || 'Unknown'}</p>
              <p><strong>Indications:</strong> {result.indications|| 'Unknown'}</p>
              <p><strong>Side Effects:</strong> {result.side_effects || 'No side effects listed'}</p>
              <p><strong>Dosage:</strong> {result.dosage_form || 'Unknown'}</p>
              <p><strong>Strength:</strong> {result.strength || 'Unknown'}</p>
              <p><strong>Actions:</strong> {result.mechanism_of_action || 'Unknown'}</p>
              <p><strong>Warnings and Precautions:</strong> {result.warnings_and_precautions !== undefined && result.warnings_and_precautions !== null ? result.warnings_and_precautions : 'Unknown'}</p>

              <p><strong>Interactions:</strong> {result.interactions || 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default SearchResults;
