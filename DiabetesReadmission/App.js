import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: "",
    time_in_hospital: "",
    num_lab_procedures: "",
    num_procedures: "",
    num_medications: "",
    number_outpatient: "",
    number_emergency: "",
    number_inpatient: "",
    metformin: "",
    glipizide: "",
    pioglitazone: "",
    rosiglitazone: "",
    acarbose: "",
    insulin: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for API call
    setPrediction("Likely to be readmitted"); // Replace with real API response
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="logo">DiaTrack</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Classification</a></li>
          <li><a href="#">Readmission</a></li>
          <li><a href="#">Mortality</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container">
        <h1>Diabetes Readmission Prediction</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div className="input-group" key={key}>
                <label>{key.replace(/_/g, " ")}</label>
                <input type="text" name={key} value={formData[key]} onChange={handleChange} required />
              </div>
            ))}
            <button type="submit" className="submit-btn">Predict</button>
          </form>
        </div>
        {prediction && <div className="result">Prediction: {prediction}</div>}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Diabetes Prediction | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
