import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Explore.css";




const Explore = () => {
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5002/api/drugs")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // ✅ Log API response
        if (Array.isArray(data)) {
          setDrugs(data); // ✅ Set state only if it's an array
        } else {
          console.error("Unexpected API response format:", data);
          setDrugs([]); // ✅ Prevents errors
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setDrugs([]); // ✅ Ensure state is always an array
      });
  }, []);

  return (
    <div>
      

      {/* Drug Data Table */}
      <div className="table-container">
        <h2>Drug Data</h2>
        <table className="drug-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Side Effects</th>
              <th>Dosage Form</th>
              <th>Strength</th>
              <th>Warnings & Predictions</th>
              <th>Interactions</th>
            </tr>
          </thead>
          <tbody>
            {drugs.map((drug, index) => (
              <tr key={index}>
                <td>{drug.drug_name}</td>
                <td>{drug.side_effects || "N/A"}</td>
                <td>{drug.dosage_form || "N/A"}</td>
                <td>{drug.strength || "N/A"}</td>
                <td>{drug.warnings_and_precautions || "N/A"}</td>
                <td>{drug.interactions || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Explore;
