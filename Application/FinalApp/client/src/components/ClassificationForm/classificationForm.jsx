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

      const predictionText =
        data.prediction === 2
          ? "Diabetes"
          : data.prediction === 1
          ? "Prediabetes"
          : data.prediction === 0
          ? "No Diabetes"
          : "Error in prediction";

      const probabilityText = data.probability;

      // Add advice based on prediction
      let advice = "";
      if (data.prediction === 0) {
        advice =
          "You are not at risk for diabetes. Maintain a healthy lifestyle with a balanced diet, regular exercise, and routine checkups.";
      } else if (data.prediction === 1) {
        advice =
          "You may have prediabetes. Prevent diabetes by eating healthy, exercising regularly, managing weight, and reducing sugar intake. Consult a doctor for guidance.";
      } else if (data.prediction === 2) {
        advice =
          "You may have diabetes. Consult a doctor for a treatment plan. Manage your blood sugar through diet, exercise, medication (if needed), and regular monitoring.";
      }

      setPrediction(
        <div className="diabetes-prediction-results">
          <div className="diabetes-prediction-text">
            <strong>Prediction:</strong> {predictionText}
          </div>
          <div className="diabetes-probabilities">
            <strong>Confidence: </strong>
            {(probabilityText * 100).toFixed(2)}%
          </div>
          <div className="diabetes-advice">
            <strong>Advice:</strong> {advice}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error in prediction");
    }
  };

  return (
    <div className="diabetes-app-container">
      <div className="diabetes-container">
        <div className="diabetes-form-container">
          <form onSubmit={handleSubmit}>
            <div className="diabetes-form-row">
              {/* Biological Sex */}
              <div className="diabetes-form-field">
                <label>Biological Sex</label>
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
              <div className="diabetes-form-field">
                <label>Age</label>
                <input
                  type="number"
                  name="ageValue"
                  min="18"
                  max="99"
                  value={formData.ageValue}
                  onChange={handleChange}
                  placeholder="18-99"
                  required
                />
              </div>
            </div>

            <div className="diabetes-form-row">
              {/* Height */}
              <div className="diabetes-form-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="51"
                  max="272"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="51-272 cm"
                  required
                />
                {validationErrors.height && (
                  <div className="diabetes-error-message">
                    {validationErrors.height}
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="diabetes-form-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="4"
                  max="635"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="4-635 kg"
                  required
                />
                {validationErrors.weight && (
                  <div className="diabetes-error-message">
                    {validationErrors.weight}
                  </div>
                )}
              </div>
            </div>

            <div className="diabetes-form-row">
              {/* High Blood Pressure */}
              <div className="diabetes-form-field">
                <label>Do you have high blood pressure?</label>
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
              <div className="diabetes-form-field">
                <label>Do you have high cholesterol?</label>
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
            </div>

            <div className="diabetes-form-row">
              {/* Smoker */}
              <div className="diabetes-form-field">
                <label>
                  Have you smoked at least 100 cigarettes in your life?
                </label>
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
              <div className="diabetes-form-field">
                <label>Any physical activity in past 30 days?</label>
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
            </div>

            <div className="diabetes-form-row">
              {/* Fruits Consumption */}
              <div className="diabetes-form-field">
                <label>Do you consume fruits daily?</label>
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
              <div className="diabetes-form-field">
                <label>Do you consume vegetables daily?</label>
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
            </div>

            <div className="diabetes-form-row">
              {/* Mental Health */}
              <div className="diabetes-form-field">
                <label>Days of poor mental health in past 30 days</label>
                <input
                  type="number"
                  name="mentHlth"
                  min="0"
                  max="30"
                  value={formData.mentHlth}
                  onChange={handleChange}
                  placeholder="0-30 days"
                  required
                />
              </div>

              {/* Difficulty Walking */}
              <div className="diabetes-form-field">
                <label>
                  Do you have difficulty walking or climbing stairs?
                </label>
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
            </div>

            <div className="diabetes-form-submit">
              <button type="submit" className="diabetes-submit-btn">
                Predict Risk
              </button>
            </div>
          </form>
        </div>
        {prediction && <div className="diabetes-result">{prediction}</div>}
      </div>
    </div>
  );
}

export default DiabetesClassification;
