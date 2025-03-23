import React, { useState } from "react";
import axios from "axios";
import "./mortalityForm.css";
import { validateField, calculateBMI } from "./validate.js";
import { getRiskColor, getRiskLevel } from "./color.js";
import { renderFormFields } from "./formRendering.jsx";

function MortalityForm({ selectedPatient }) {
  
  const [formData, setFormData] = useState({
    age: "", // Patient's Age at Unit Admission
    weight: "", // Add weight input
    height: "", // Add height input
    bmi: 0, // Keep Body Mass Index but compute it dynamically
    pre_icu_los_days: "", // Length of Stay Before ICU Admission
    d1_diasbp_max: "", // Highest Diastolic Blood Pressure in First 24 Hours
    d1_diasbp_min: "", // Lowest Diastolic Blood Pressure in First 24 Hours
    d1_heartrate_max: "", // Highest Heart Rate in First 24 Hours
    d1_heartrate_min: "", // Lowest Heart Rate in First 24 Hours
    d1_mbp_max: "", // Highest Mean Blood Pressure in First 24 Hours
    d1_mbp_min: "", // Lowest Mean Blood Pressure in First 24 Hours
    d1_resprate_max: "", // Highest Respiratory Rate in First 24 Hours
    d1_resprate_min: "", // Lowest Respiratory Rate in First 24 Hours
    d1_spo2_min: "", // Lowest Oxygen Saturation in First 24 Hours
    d1_sysbp_max: "", // Highest Systolic Blood Pressure in First 24 Hours
    d1_sysbp_min: "", // Lowest Systolic Blood Pressure in First 24 Hours
    d1_temp_max: "", // Highest Core Temperature in First 24 Hours
    d1_temp_min: "", // Lowest Core Temperature in First 24 Hours
    h1_diasbp_max: "", // Highest Diastolic Blood Pressure in First 24 Hours (Hospital)
    h1_diasbp_min: "", // Lowest Diastolic Blood Pressure in First 24 Hours (Hospital)
    h1_heartrate_max: "", // Highest Heart Rate in First 24 Hours (Hospital)
    h1_heartrate_min: "", // Lowest Heart Rate in First 24 Hours (Hospital)
    h1_mbp_max: "", // Highest Mean Blood Pressure in First 24 Hours (Hospital)
    h1_mbp_min: "", // Lowest Mean Blood Pressure in First 24 Hours (Hospital)
    h1_resprate_max: "", // Highest Respiratory Rate in First 24 Hours (Hospital)
    h1_resprate_min: "", // Lowest Respiratory Rate in First 24 Hours (Hospital)
    h1_spo2_max: "", // Highest Oxygen Saturation in First 24 Hours (Hospital)
    h1_spo2_min: "", // Lowest Oxygen Saturation in First 24 Hours (Hospital)
    h1_sysbp_max: "", // Highest Systolic Blood Pressure in First 24 Hours (Hospital)
    h1_sysbp_min: "", // Lowest Systolic Blood Pressure in First 24 Hours (Hospital)
    d1_glucose_max: "", // Highest Glucose Concentration in First 24 Hours
    d1_glucose_min: "", // Lowest Glucose Concentration in First 24 Hours
    d1_potassium_max: "", // Highest Potassium Concentration in First 24 Hours
    d1_potassium_min: "", // Lowest Potassium Concentration in First 24 Hours
  });

  const [prediction, setPrediction] = useState(null);
  const [predictionProbability, setPredictionProbability] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    let updatedErrors = { ...formErrors };
    
    // Validate the field
    const error = validateField(name, value);
    
    if (error) {
      updatedErrors[name] = error;
    } else {
      delete updatedErrors[name];
    }
    
    // recalculate BMI
    if (name === "weight" || name === "height") {
      updatedFormData.bmi = calculateBMI(updatedFormData.weight, updatedFormData.height);

    }
    
    setFormData(updatedFormData);
    setFormErrors(updatedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a patient is selected
    if (!selectedPatient) {
      alert("Please select a patient before making a prediction");
      return;
    }

    // Check for validation errors
    if (Object.keys(formErrors).length > 0) {
      alert("Please correct the errors in the form before submitting");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      // Include patient ID in the request
      const dataWithPatient = {
        ...formData,
        patientName: selectedPatient.name,
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/predict-mortality",
        dataWithPatient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrediction(response.data.hospital_death);
      setPredictionProbability(response.data.death_probability);
    } catch (error) {
      setPrediction("error");
      console.error("Error making prediction", error);
    }
  };


  return (
    // <div className="form-container">
    <div className="form-box">
      <form onSubmit={handleSubmit} className="form-grid">
        {renderFormFields(formData, formErrors, handleChange)}
        <button type="submit" className="submit-btn1">
          Predict
        </button>
      </form>

      {prediction !== null && (
        <div className="prediction-result">
          <div
            className="prediction-result-box"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px",
              borderRadius: "8px",
              color: getRiskColor(predictionProbability), // Using the imported function
              transition: "color 0.5s ease-in-out",
            }}
          >
            {`Risk Probability: ${(predictionProbability * 100).toFixed(2)}% (${getRiskLevel(predictionProbability)})`}
          </div>
        </div>
      )}
    </div>
  );
}

export default MortalityForm;
