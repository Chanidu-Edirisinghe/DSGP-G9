import React, { useState } from "react";
import axios from "axios";
import "./mortalityForm.css";

function MortalityForm() {
  const [formData, setFormData] = useState({
    age: "", // Patient's Age at Unit Admission
    weight: "", // Add weight input
    height: "", // Add height input
    bmi: "", // Keep Body Mass Index but compute it dynamically
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "weight" || name === "height") {
      const weight = parseFloat(updatedFormData.weight);
      const height = parseFloat(updatedFormData.height) / 100; // Convert cm to meters

      if (weight > 0 && height > 0) {
        updatedFormData.bmi = (weight / (height * height)).toFixed(2);
      } else {
        updatedFormData.bmi = "";
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
  console.log("Sending formData:", formData);
  
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/predict-mortality",
      formData
    );

    console.log("Received response:", response.data); // 

    setPrediction(response.data.hospital_death ?? "N/A");
    const probability = parseFloat(response.data.death_probability) || 0

    console.log(probability)

    setPredictionProbability((probability));
  } catch (error) {
    setPrediction("error");
    console.error("Error making prediction", error);
  }
};

  const getRiskColor = (probability) => {
    const colors = [
      { stop: 0, color: "#00ff00" }, // Green (0%)
      { stop: 0.3, color: "#ffff00" }, // Yellow (30%)
      { stop: 0.5, color: "#ff8000" }, // Orange (50%)
      { stop: 0.7, color: "#ff4000" }, // Dark Orange-Red (70%)
      { stop: 1, color: "#ff0000" }, // Red (100%)
    ];

    let startColor = colors[0].color;
    let endColor = colors[colors.length - 1].color;
    let startStop = 0;
    let endStop = 1;

    for (let i = 0; i < colors.length - 1; i++) {
      if (probability >= colors[i].stop && probability <= colors[i + 1].stop) {
        startColor = colors[i].color;
        endColor = colors[i + 1].color;
        startStop = colors[i].stop;
        endStop = colors[i + 1].stop;
        break;
      }
    }

    const interpolateColor = (start, end, factor) => {
      const hex = (color) => parseInt(color.substring(1), 16);
      const r = (hex(start) >> 16) & 255,
        g = (hex(start) >> 8) & 255,
        b = hex(start) & 255;
      const r2 = (hex(end) >> 16) & 255,
        g2 = (hex(end) >> 8) & 255,
        b2 = hex(end) & 255;

      const newR = Math.round(r + (r2 - r) * factor);
      const newG = Math.round(g + (g2 - g) * factor);
      const newB = Math.round(b + (b2 - b) * factor);

      return `rgb(${newR}, ${newG}, ${newB})`;
    };

    const factor = (probability - startStop) / (endStop - startStop);
    return interpolateColor(startColor, endColor, factor);
  };

  const labelMapping = {
    age: { label: "Age", unit: "(years)" },
    weight: { label: "Weight", unit: "(kg)" },
    height: { label: "Height", unit: "(cm)" },
    bmi: { label: "BMI", unit: "(kg/m²)" },
    pre_icu_los_days: { label: "Pre-ICU LOS Days", unit: "(days)" },
    d1_diasbp: { label: "Diastolic BP (d1)", unit: "(mmHg)" },
    d1_heartrate: { label: "Heart Rate (d1)", unit: "(bpm)" },
    d1_mbp: { label: "Mean BP (d1)", unit: "(mmHg)" },
    d1_resprate: { label: "Respiratory Rate (d1)", unit: "(breaths/min)" },
    d1_spo2_min: { label: "SpO2 (d1)", unit: "(%)" }, //single feature
    d1_sysbp: { label: "Systolic BP (d1)", unit: "(mmHg)" },
    d1_temp: { label: "Temperature (d1)", unit: "(°C)" },
    h1_diasbp: { label: "Diastolic BP (h1)", unit: "(mmHg)" },
    h1_heartrate: { label: "Heart Rate (h1)", unit: "(bpm)" },
    h1_mbp: { label: "Mean BP (h1)", unit: "(mmHg)" },
    h1_resprate: { label: "Respiratory Rate (h1)", unit: "(breaths/min)" },
    h1_spo2: { label: "SpO2 (h1)", unit: "(%)" },
    h1_sysbp: { label: "Systolic BP (h1)", unit: "(mmHg)" },
    d1_glucose: { label: "Glucose (d1)", unit: "(mg/dL)" },
    d1_potassium: { label: "Potassium (d1)", unit: "(mEq/L)" },
  };

  const renderMinMax = (baseKey) => {
    // Get the human-readable label and unit from the labelMapping
    const { label, unit } = labelMapping[baseKey] || {
      label: baseKey.replace(/_/g, " ").toUpperCase(),
      unit: "",
    };

    //console.log(label);

    return (
      <div className="form-group">
        <label>
          {label} {unit}
        </label>
        <div className="min-max-row">
          <input
            type="number"
            name={`${baseKey}_min`}
            value={formData[`${baseKey}_min`]}
            onChange={handleChange}
            placeholder="Min"
            required
          />
          <input
            type="number"
            name={`${baseKey}_max`}
            value={formData[`${baseKey}_max`]}
            onChange={handleChange}
            placeholder="Max"
            required
          />
        </div>
      </div>
    );
  };

  // Function to render single field (Age, BMI, Pre-ICU LOS)
  const renderSingleField = (baseKey) => {
    // Get the human-readable label and unit from the labelMapping
    const { label, unit } = labelMapping[baseKey] || {
      label: baseKey.replace(/_/g, " ").toUpperCase(),
      unit: "",
    };

    //console.log(label);

    return (
      <div className="form-group">
        <label>
          {label} {unit}
        </label>
        <input
          type="number"
          name={baseKey}
          value={formData[baseKey]}
          onChange={handleChange}
          placeholder="Enter value"
          required
        />
      </div>
    );
  };

  const renderFormFields = () => {
    const processedFeatures = new Set();
    return Object.keys(formData)
      .filter((key) => key !== "bmi") // Exclude BMI from rendering
      .map((key) => {
        const baseKeyParts = key.split("_");

        // Special case for "pre_icu_los_days" to keep the full name and for single d1 feature d1spo2min
        const baseKey =
          key === "d1_spo2_min"
            ? "d1_spo2_min"
            : baseKeyParts[0] === "pre" &&
              baseKeyParts[1] === "icu" &&
              baseKeyParts[2] === "los" &&
              baseKeyParts[3] === "days"
            ? "pre_icu_los_days"
            : baseKeyParts.slice(0, 2).join("_");

        // Skip already processed base keys to avoid duplicates (min/max pairs)
        if (processedFeatures.has(baseKey)) return null;
        processedFeatures.add(baseKey);

        const isSingleField = [
          "age",
          "weight",
          "height",
          "pre_icu_los_days",
          "d1_spo2_min",
        ].includes(baseKey); // Check if it's a single field

        if (isSingleField || baseKey === "d1_spo2_min" || baseKey === "bmi") {
          if (baseKey === "bmi") return null; // Skip rendering BMI and d1spo2min
          return renderSingleField(baseKey);
        }

        // Render the appropriate input field
        if (isSingleField) {
          return renderSingleField(baseKey); // Render single field (e.g., Age, BMI, Pre-ICU LOS)
        } else {
          return renderMinMax(baseKey); // Render min/max pair fields (e.g., Diastolic BP, Heart Rate)
        }
      });
  };
  return (
    // <div className="form-container">
    <div className="form-box">
      <form onSubmit={handleSubmit} className="form-grid">
        {renderFormFields()}
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
              color: getRiskColor(predictionProbability), // Dynamic color
              transition: "color 0.5s ease-in-out",
            }}
          >
            {`Risk Probability: ${(predictionProbability * 100).toFixed(2)}%`}
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}

export default MortalityForm;
