const riskColors = [
    { stop: 0, color: "#00ff00" }, // Green (0%)
    { stop: 0.3, color: "#ffff00" }, // Yellow (30%)
    { stop: 0.5, color: "#ff8000" }, // Orange (50%)
    { stop: 0.7, color: "#ff4000" }, // Dark Orange-Red (70%)
    { stop: 1, color: "#ff0000" }, // Red (100%)
  ];
  
  /* Interpolates between two colors based on a factor*/
   
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
  
  /* Gets a color based on a probability value*/
  export const getRiskColor = (probability) => {
    let startColor = riskColors[0].color;
    let endColor = riskColors[riskColors.length - 1].color;
    let startStop = 0;
    let endStop = 1;
  
    for (let i = 0; i < riskColors.length - 1; i++) {
      if (probability >= riskColors[i].stop && probability <= riskColors[i + 1].stop) {
        startColor = riskColors[i].color;
        endColor = riskColors[i + 1].color;
        startStop = riskColors[i].stop;
        endStop = riskColors[i + 1].stop;
        break;
      }
    }
  
    const factor = (probability - startStop) / (endStop - startStop);
    return interpolateColor(startColor, endColor, factor);
  };
  
  /*Get risk level description based on probability*/
  export const getRiskLevel = (probability) => {
    if (probability < 0.1) return "Low Risk";
    if (probability < 0.5) return "Moderate Risk";
    return "High Risk";
  };