import React, { useState } from "react";
import "./classificationForm.css";

function DiabetesClassification() {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    smoker: "",
    highBP: "",
    physActivity: "",
    highChol: "",
    fruits: "",
    veggies: "",
    age: "",
    mentHlth: "",
    diffWalk: "",
    sex: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate BMI from height (cm) and weight (kg)
  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const calculateDiabetesRisk = () => {
    // Calculate BMI from height and weight
    const bmi = calculateBMI(
      parseFloat(formData.height),
      parseFloat(formData.weight)
    );

    // Convert inputs to numeric values for calculation
    const riskFactors = {
      highBP: formData.highBP === "Yes" ? 1 : 0,
      highChol: formData.highChol === "Yes" ? 1 : 0,
      bmi: bmi > 30 ? 1 : 0,
      smoker: formData.smoker === "Yes" ? 1 : 0,
      physActivity: formData.physActivity === "Yes" ? 0 : 1, // Inverse: no physical activity is a risk
      fruits: formData.fruits === "Yes" ? 0 : 1, // Inverse: no fruits is a risk
      veggies: formData.veggies === "Yes" ? 0 : 1, // Inverse: no veggies is a risk
      age: parseInt(formData.age) > 45 ? 1 : 0,
      mentHlth: parseInt(formData.mentHlth) > 7 ? 1 : 0,
      diffWalk: formData.diffWalk === "Yes" ? 1 : 0,
    };

    // Calculate total risk score
    const riskScore = Object.values(riskFactors).reduce(
      (sum, factor) => sum + factor,
      0
    );

    // Determine risk level
    if (riskScore <= 2) {
      return "Low risk of diabetes";
    } else if (riskScore <= 5) {
      return "Moderate risk of diabetes";
    } else {
      return "High risk of diabetes";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const riskAssessment = calculateDiabetesRisk();
      setPrediction(riskAssessment);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Height */}
            <div className="input-group">
              <p>What is your height in centimeters?</p>
              <input
                type="number"
                name="height"
                min="120"
                max="220"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>

            {/* Weight */}
            <div className="input-group">
              <p>What is your weight in kilograms?</p>
              <input
                type="number"
                name="weight"
                min="30"
                max="200"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            {/* High Blood Pressure */}
            <div className="input-group">
              <p>Do you have high blood pressure?</p>
              <select
                name="highBP"
                value={formData.highBP}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* High Cholesterol */}
            <div className="input-group">
              <p>Do you have high cholesterol?</p>
              <select
                name="highChol"
                value={formData.highChol}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Smoker */}
            <div className="input-group">
              <p>Have you smoked at least 100 cigarettes in your life?</p>
              <select
                name="smoker"
                value={formData.smoker}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Physical Activity */}
            <div className="input-group">
              <p>Have you done physical activity in the past 30 days?</p>
              <select
                name="physActivity"
                value={formData.physActivity}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Fruits Consumption */}
            <div className="input-group">
              <p>Do you consume fruits daily?</p>
              <select
                name="fruits"
                value={formData.fruits}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Vegetables Consumption */}
            <div className="input-group">
              <p>Do you consume vegetables daily?</p>
              <select
                name="veggies"
                value={formData.veggies}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Mental Health */}
            <div className="input-group">
              <p>Days of poor mental health in past month (0-30)?</p>
              <input
                type="number"
                name="mentHlth"
                min="0"
                max="30"
                value={formData.mentHlth}
                onChange={handleChange}
                required
              />
            </div>

            {/* Difficulty Walking */}
            <div className="input-group">
              <p>Do you have difficulty walking or climbing stairs?</p>
              <select
                name="diffWalk"
                value={formData.diffWalk}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Biological Sex */}
            <div className="input-group">
              <p>Select your biological sex:</p>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Age Selection */}
            <div className="input-group">
              <p>What is your age?</p>
              <select
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="18">18-24</option>
                <option value="25">25-34</option>
                <option value="35">35-44</option>
                <option value="45">45-54</option>
                <option value="55">55-64</option>
                <option value="65">65+</option>
              </select>
            </div>
          </form>
        </div>
        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Predict"}
        </button>
        {prediction && <div className="result">Result: {prediction}</div>}
      </div>
    </div>
  );
}

export default DiabetesClassification;
