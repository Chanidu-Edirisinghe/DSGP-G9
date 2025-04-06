// Field validation limits with error messages
export const fieldLimits = {
    age: { min: 0, max: 100, message: "Age must be between 0 and 100 years" },
    weight: { min: 5, max: 180, message: "Weight must be between 5 and 180 kg" },
    height: { min: 40, max: 215, message: "Height must be between 40 and 215 cm" },
    pre_icu_los_days: { min: 0, max: 60, message: "Pre-ICU stay must be between 0 and 60 days" },
    d1_spo2_min: { min: 50, max: 100, message: "SpO2 must be between 50% and 100%" },
    d1_diasbp_max: { min: 30, max: 200, message: "Diastolic BP must be between 30 and 200 mmHg" },
    d1_diasbp_min: { min: 0, max: 150, message: "Diastolic BP must be between 0 and 150 mmHg" },
    d1_heartrate_max: { min: 40, max: 200, message: "Heart rate must be between 40 and 200 bpm" },
    d1_heartrate_min: { min: 0, max: 200, message: "Heart rate must be between 0 and 200 bpm" },
    d1_mbp_max: { min: 30, max: 200, message: "Mean BP must be between 30 and 200 mmHg" },
    d1_mbp_min: { min: 0, max: 150, message: "Mean BP must be between 0 and 150 mmHg" },
    d1_resprate_max: { min: 5, max: 100, message: "Respiratory rate must be between 5 and 100 breaths/min" },
    d1_resprate_min: { min: 0, max: 100, message: "Respiratory rate must be between 0 and 100 breaths/min" },
    d1_sysbp_max: { min: 60, max: 250, message: "Systolic BP must be between 60 and 250 mmHg" },
    d1_sysbp_min: { min: 30, max: 190, message: "Systolic BP must be between 30 and 190 mmHg" },
    d1_temp_max: { min: 30, max: 45, message: "Temperature must be between 30°C and 45°C" },
    d1_temp_min: { min: 25, max: 45, message: "Temperature must be between 25°C and 45°C" },
    h1_diasbp_max: { min: 30, max: 175, message: "Diastolic BP must be between 30 and 175 mmHg" },
    h1_diasbp_min: { min: 0, max: 140, message: "Diastolic BP must be between 0 and 140 mmHg" },
    h1_heartrate_max: { min: 30, max: 200, message: "Heart rate must be between 30 and 200 bpm" },
    h1_heartrate_min: { min: 0, max: 175, message: "Heart rate must be between 0 and 175 bpm" },
    h1_mbp_max: { min: 30, max: 200, message: "Mean BP must be between 30 and 200 mmHg" },
    h1_mbp_min: { min: 0, max: 150, message: "Mean BP must be between 0 and 150 mmHg" },
    h1_spo2_max: { min: 0, max: 100, message: "SpO2 must be between 0% and 100%" },
    h1_spo2_min: { min: 0, max: 100, message: "SpO2 must be between 0% and 100%" },
    h1_resprate_max: { min: 0, max: 100, message: "Respiratory rate must be between 0 and 100 breaths/min" },
    h1_resprate_min: { min: 0, max: 60, message: "Respiratory rate must be between 0 and 60 breaths/min" },
    h1_sysbp_max: { min: 50, max: 250, message: "Systolic BP must be between 50 and 250 mmHg" },
    h1_sysbp_min: { min: 50, max: 250, message: "Systolic BP must be between 50 and 250 mmHg" },
    d1_potassium_max: { min: 0, max: 10, message: "Potassium must be between 0 and 10 mEq/L" },
    d1_potassium_min: { min: 0, max: 10, message: "Potassium must be between 0 and 10 mEq/L" },
    d1_glucose_max: { min: 0, max: 1000, message: "Glucose must be between 0 and 1000 mg/dL" },
    d1_glucose_min: { min: 0, max: 500, message: "Glucose must be between 0 and 500 mg/dL" },
  };
  
  // Validate a single field and return error message if invalid
  export const validateField = (name, value) => {
    if (!fieldLimits[name] || value === "") {
      return null; // No validation needed or empty field
    }
  
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      return "Please enter a valid number";
    }
    
    const limits = fieldLimits[name];
    if (numericValue < limits.min || numericValue > limits.max) {
      return limits.message;
    }
    
    return null; // Field is valid
  };
  
  // Validate all fields in formData and return object with error messages
  export const validateForm = (formData) => {
    const errors = {};
    
    for (const field in formData) {
      if (fieldLimits[field] && formData[field] !== "") {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
        }
      }
    }
    
    return errors;
  };
  
  // Calculate BMI from height and weight
  export const calculateBMI = (weight, height) => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to meters
    
    if (weightNum > 0 && heightNum > 0) {
      return parseFloat((weightNum / (heightNum * heightNum)).toFixed(4));
    }
    
    return "";
  };