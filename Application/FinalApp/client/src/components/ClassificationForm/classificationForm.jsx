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
  const [resultColor, setResultColor] = useState("#f8f9fa"); // Default color

  // Function to map prediction to colors
  const getPredictionColor = (prediction) => {
    if (prediction === 2) return "#dc3545"; // Red for Diabetes
    if (prediction === 1) return "#ffc107"; // Yellow for Prediabetes
    return "#28a745"; // Green for No Diabetes
  };

  useEffect(() => {
    if (prediction) {
      setResultColor(getPredictionColor(prediction.prediction));
    }
  }, [prediction]);

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const validateHeight = (height) => {
    const height_value = parseFloat(height);
    if (height_value <= 50 || height_value > 272) {
      return "Height must be between 51 and 272 cm";
    }
    return "";
  };

  const validateWeight = (weight) => {
    const weight_value = parseFloat(weight);
    if (weight_value <= 3 || weight_value > 635) {
      return "Weight must be between 4 and 635 kg";
    }
    return "";
  };

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightError = validateHeight(formData.height);
      const weightError = validateWeight(formData.weight);

      setValidationErrors((prev) => ({
        ...prev,
        height: heightError,
        weight: weightError,
      }));

      if (!heightError && !weightError) {
        setFormData((prevData) => ({
          ...prevData,
          bmi: calculateBMI(parseFloat(formData.height), parseFloat(formData.weight)),
        }));
      }
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "height" || name === "weight" || name === "ageValue") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const heightError = validateHeight(formData.height);
    const weightError = validateWeight(formData.weight);

    if (heightError || weightError) {
      setValidationErrors({ height: heightError, weight: weightError, ageValue: "" });
      return;
    }

    const dataToSend = { ...formData, ageValue: undefined };

    try {
      const response = await fetch("http://127.0.0.1:5000/diabetesPredict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("API Response:", data);

      const predictionText =
        data.prediction === 2 ? "Diabetes" :
        data.prediction === 1 ? "Prediabetes" :
        data.prediction === 0 ? "No Diabetes" :
        "Error in prediction";

      const probabilityText = (data.probability * 100).toFixed(2) + "%";
      let advice = "";

      if (data.prediction === 0) {
        advice = "You are not at risk for diabetes. Maintain a healthy lifestyle.";
      } else if (data.prediction === 1) {
        advice = "You may have prediabetes. Consider lifestyle changes and consult a doctor.";
      } else if (data.prediction === 2) {
        advice = "You may have diabetes. Please consult a doctor for proper guidance.";
      }

      setPrediction({ prediction: data.prediction, predictionText, probabilityText, advice });
      setResultColor(getPredictionColor(data.prediction));
    } catch (error) {
      console.error("Error:", error);
      setPrediction({ predictionText: "Error in prediction", probabilityText: "", advice: "" });
    }
  };

  return (
    <div className="diabetes-app-container">
      <div className="diabetes-container">
        <div className="diabetes-form-container">
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="diabetes-form-row">
              <div className="diabetes-form-field">
                <label>Biological Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="diabetes-form-field">
                <label>Age</label>
                <input type="number" name="ageValue" min="18" max="99" value={formData.ageValue} onChange={handleChange} required />
              </div>
            </div>
            <div className="diabetes-form-submit">
              <button type="submit" className="diabetes-submit-btn">Predict Risk</button>
            </div>
          </form>
        </div>

        {prediction && (
          <div className="diabetes-result" style={{ backgroundColor: resultColor, color: "#fff" }}>
            <div className="diabetes-prediction-results">
              <div className="diabetes-prediction-text"><strong>Prediction:</strong> {prediction.predictionText}</div>
              <div className="diabetes-probabilities"><strong>Confidence:</strong> {prediction.probabilityText}</div>
              <div className="diabetes-advice"><strong>Advice:</strong> {prediction.advice}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiabetesClassification;
