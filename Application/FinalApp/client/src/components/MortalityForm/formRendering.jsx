import React from "react";

export const labelMapping = {
  age: { label: "Age", unit: "(years)" },
  weight: { label: "Weight", unit: "(kg)" },
  height: { label: "Height", unit: "(cm)" },
  bmi: { label: "BMI", unit: "(kg/m²)" },
  pre_icu_los_days: { label: "Pre-ICU LOS Days", unit: "(days)" },
  d1_diasbp: { label: "Diastolic BP (first 24 hrs)", unit: "(mmHg)" },
  d1_heartrate: { label: "Heart Rate (first 24 hrs)", unit: "(bpm)" },
  d1_mbp: { label: "Mean BP (first 24 hrs)", unit: "(mmHg)" },
  d1_resprate: {
    label: "Respiratory Rate (first 24 hrs)",
    unit: "(breaths/min)",
  },
  d1_spo2_min: { label: "SpO2 min (first 24 hrs)", unit: "(%)" }, // single feature
  d1_sysbp: { label: "Systolic BP (first 24 hrs)", unit: "(mmHg)" },
  d1_temp: { label: "Temperature (first 24 hrs)", unit: "(°C)" },
  h1_diasbp: { label: "Diastolic BP (first hour)", unit: "(mmHg)" },
  h1_heartrate: { label: "Heart Rate (first hour)", unit: "(bpm)" },
  h1_mbp: { label: "Mean BP (first hour)", unit: "(mmHg)" },
  h1_resprate: {
    label: "Respiratory Rate (first hour)",
    unit: "(breaths/min)",
  },
  h1_spo2: { label: "SpO2 (first hour)", unit: "(%)" },
  h1_sysbp: { label: "Systolic BP (first hour)", unit: "(mmHg)" },
  d1_glucose: { label: "Glucose (first 24 hrs)", unit: "(mg/dL)" },
  d1_potassium: { label: "Potassium (first 24 hrs)", unit: "(mEq/L)" },
};

// List of fields that should be rendered as single input (not min/max)
export const singleFields = [
  "age",
  "weight",
  "height",
  "pre_icu_los_days",
  "d1_spo2_min",
];

/* Renders a min/max pair of inputs for a field*/

export const renderMinMax = (baseKey, formData, formErrors, handleChange) => {
  // Gettting the human-readable label and unit from the labelMapping
  const { label, unit } = labelMapping[baseKey] || {
    label: baseKey.replace(/_/g, " ").toUpperCase(),
    unit: "",
  };

  const minKey = `${baseKey}_min`;
  const maxKey = `${baseKey}_max`;

  return (
    <div className="form-group" key={baseKey}>
      <label>
        {label} {unit}
      </label>
      <div className="min-max-row">
        <div className="min-input">
          <input
            type="number"
            name={minKey}
            value={formData[minKey]}
            onChange={handleChange}
            placeholder="Min"
            className={formErrors[minKey] ? "input-error" : ""}
            required
          />
          {formErrors[minKey] && (
            <div className="error-message">{formErrors[minKey]}</div>
          )}
        </div>
        <div className="max-input">
          <input
            type="number"
            name={maxKey}
            value={formData[maxKey]}
            onChange={handleChange}
            placeholder="Max"
            className={formErrors[maxKey] ? "input-error" : ""}
            required
          />
          {formErrors[maxKey] && (
            <div className="error-message">{formErrors[maxKey]}</div>
          )}
        </div>
      </div>
    </div>
  );
};

/*Renders a single input field*/

export const renderSingleField = (
  baseKey,
  formData,
  formErrors,
  handleChange
) => {
  // Get the human-readable label and unit from the labelMapping
  const { label, unit } = labelMapping[baseKey] || {
    label: baseKey.replace(/_/g, " ").toUpperCase(),
    unit: "",
  };

  return (
    <div className="form-group" key={baseKey}>
      <label>
        {label} {unit}
      </label>
      <input
        type="number"
        name={baseKey}
        value={formData[baseKey]}
        onChange={handleChange}
        placeholder="Enter value"
        className={formErrors[baseKey] ? "input-error" : ""}
        required
      />
      {formErrors[baseKey] && (
        <div className="error-message">{formErrors[baseKey]}</div>
      )}
    </div>
  );
};

/* Extracts the base key from a field key*/

export const getBaseKey = (key) => {
  const baseKeyParts = key.split("_");

  // Special case for "pre_icu_los_days" and "d1_spo2_min"
  if (key === "d1_spo2_min") {
    return "d1_spo2_min";
  } else if (
    baseKeyParts[0] === "pre" &&
    baseKeyParts[1] === "icu" &&
    baseKeyParts[2] === "los" &&
    baseKeyParts[3] === "days"
  ) {
    return "pre_icu_los_days";
  } else {
    return baseKeyParts.slice(0, 2).join("_");
  }
};

/*Renders all form fields*/

export const renderFormFields = (formData, formErrors, handleChange) => {
  // Safety check - if formData is undefined or null, return empty array
  if (!formData) {
    console.error("formData is undefined or null in renderFormFields");
    return [];
  }

  const processedFeatures = new Set();

  return Object.keys(formData)
    .filter((key) => key !== "bmi") // Exclude BMI from rendering
    .map((key) => {
      const baseKey = getBaseKey(key);

      // Skip already processed base keys to avoid duplicates (min/max pairs)
      if (processedFeatures.has(baseKey)) return null;
      processedFeatures.add(baseKey);

      // Determininng if it's a single field or min/max pair
      if (singleFields.includes(baseKey)) {
        return renderSingleField(
          baseKey,
          formData,
          formErrors || {},
          handleChange
        );
      } else {
        return renderMinMax(baseKey, formData, formErrors || {}, handleChange);
      }
    })
    .filter(Boolean); // Remove null entries
};
