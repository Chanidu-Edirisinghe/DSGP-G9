import React, { useState, useEffect } from "react";
import "./classificationForm.css";

function DiabetesClassification() {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bmi: "",
    smoker: "",
    highBP: "",
    physActivity: "",
    highChol: "",
    fruits: "",
    veggies: "",
    age: "",
    ageValue: "",
    mentHlth: "",
    diffWalk: "",
    sex: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    height: "",
    weight: "",
    ageValue: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [predictionProbability, setPredictionProbability] = useState(null);

  // Calculate BMI from height (cm) and weight (kg)
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Map age to category value
  const mapAgeToCategoryValue = (ageInput) => {
    const age = parseInt(ageInput);
    if (age >= 18 && age <= 24) return 1;
    else if (age >= 25 && age <= 29) return 2;
    else if (age >= 30 && age <= 34) return 3;
    else if (age >= 35 && age <= 39) return 4;
    else if (age >= 40 && age <= 44) return 5;
    else if (age >= 45 && age <= 49) return 6;
    else if (age >= 50 && age <= 54) return 7;
    else if (age >= 55 && age <= 59) return 8;
    else if (age >= 60 && age <= 64) return 9;
    else if (age >= 65 && age <= 69) return 10;
    else if (age >= 70 && age <= 74) return 11;
    else if (age >= 75 && age <= 79) return 12;
    else if (age >= 80 && age <= 99) return 13;
    return "";
  };

  // Validate height
  const validateHeight = (height) => {
    const height_value = parseFloat(height);
    if (height_value <= 50 || height_value > 272) {
      return "Height must be between 51 and 272 cm";
    }
    return "";
  };

  // Validate weight
  const validateWeight = (weight) => {
    const weight_value = parseFloat(weight);
    if (weight_value <= 3 || weight_value > 635) {
      return "Weight must be between 4 and 635 kg";
    }
    return "";
  };

  // Update BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      // First validate height and weight
      const heightError = validateHeight(formData.height);
      const weightError = validateWeight(formData.weight);

      setValidationErrors((prev) => ({
        ...prev,
        height: heightError,
        weight: weightError,
      }));

      // Only calculate BMI if height and weight are valid
      if (!heightError && !weightError) {
        const calculatedBMI = calculateBMI(
          parseFloat(formData.height),
          parseFloat(formData.weight)
        );
        setFormData((prevData) => ({
          ...prevData,
          bmi: calculatedBMI,
        }));
      }
    }
  }, [formData.height, formData.weight]);

  // Update age category value whenever age changes
  useEffect(() => {
    if (formData.ageValue) {
      const ageCategoryValue = mapAgeToCategoryValue(formData.ageValue);
      setFormData((prevData) => ({
        ...prevData,
        age: ageCategoryValue,
      }));
    }
  }, [formData.ageValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error when user starts typing again
    if (name === "height" || name === "weight" || name === "ageValue") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const heightError = validateHeight(formData.height);
    const weightError = validateWeight(formData.weight);

    if (heightError || weightError) {
      setValidationErrors({
        height: heightError,
        weight: weightError,
        ageValue: "",
      });
      return;
    }

    // Create data object to send to API
    const dataToSend = {
      ...formData,
      // Don't send the ageValue field to the API
      ageValue: undefined,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/diabetesPredict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("API Response:", data);
      setPrediction(
        data.prediction === 2
          ? "Diabetes"
          : data.prediction === 1
          ? "Prediabetes"
          : data.prediction === 0
          ? "No Diabetes"
          : "Error in prediction"
      );

      if (data.probability !== undefined) {
        setPredictionProbability(data.probability);
      }
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error in prediction");
    }
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
                min="51"
                max="272"
                value={formData.height}
                onChange={handleChange}
                required
              />
              {validationErrors.height && (
                <div className="error-message">{validationErrors.height}</div>
              )}
            </div>

            {/* Weight */}
            <div className="input-group">
              <p>What is your weight in kilograms?</p>
              <input
                type="number"
                name="weight"
                min="4"
                max="635"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
              />
              {validationErrors.weight && (
                <div className="error-message">{validationErrors.weight}</div>
              )}
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

            {/* Age - Specific age input */}
            <div className="input-group">
              <p>What is your age?</p>
              <input
                type="number"
                name="ageValue"
                min="18"
                max="99"
                value={formData.ageValue}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Predict
            </button>
          </form>
        </div>
        {prediction && (
          <div className="result">
            <div>Prediction: {prediction}</div>
            {predictionProbability !== null && (
              <div>
                Probability: {(predictionProbability * 100).toFixed(2)}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiabetesClassification;
