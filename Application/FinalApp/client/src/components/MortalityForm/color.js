    /* Gets a color based on a probability value*/
  export const getRiskColor = (probability) => {
    // For direct risk level strings
    if (typeof probability === 'string') {
      if (probability.includes('Low')) return "#00cc00";  // Bright green for low risk
      if (probability.includes('Medium')) return "#ffa500"; // Orange for medium risk
      if (probability.includes('High')) return "#ff0000";  // Red for high risk
      return "#2575fc"; // Default blue if unknown
    }
    
    // For numeric probability values
    if (probability < 1/3) {
      return "#00cc00"; // Green for low risk
    } else if (probability < 2/3) {
      return "#ffa500"; // Orange for medium risk
    } else {
      return "#ff0000"; // Red for high risk
    }
  };
  
  /*Get risk level description based on probability*/
  export const getRiskLevel = (probability) => {
    if (probability < 1/3) return "Low Risk";
    if (probability < 2/3) return "Medium Risk";
    return "High Risk";
  };