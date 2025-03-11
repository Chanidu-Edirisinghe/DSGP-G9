import { useState } from "react";
import axios from "axios";
import "./App.css";

type FormDataType = {
  bmi: string;
  smoker: string;
  highBP: string;
  physActivity: string;
  highChol: string;
  fruits: string;
  age: string;
  veggies: string;
  mentHlth: string;
  diffWalk: string;
  sex: string;
};

export default function DiabetesClassification() {
  const [formData, setFormData] = useState<FormDataType>({
    bmi: "",
    smoker: "",
    highBP: "",
    physActivity: "",
    highChol: "",
    fruits: "",
    age: "",
    veggies: "",
    mentHlth: "",
    diffWalk: "",
    sex: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("Processing classification...");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResult(`Prediction: ${response.data.prediction === 1 ? "High Risk" : "Low Risk"} (Probability: ${response.data.probability.toFixed(2)})`);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error occurred while processing the request.");
    }
  };

  return (
    <div className="app-container">
      <h1>Diabetes Classification</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" id="bmi" placeholder="BMI" value={formData.bmi} onChange={handleChange} required />
        <select id="smoker" value={formData.smoker} onChange={handleChange} required>
          <option value="">Smoker?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select id="highBP" value={formData.highBP} onChange={handleChange} required>
          <option value="">High BP?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select id="physActivity" value={formData.physActivity} onChange={handleChange} required>
          <option value="">Physical Activity?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select id="highChol" value={formData.highChol} onChange={handleChange} required>
          <option value="">High Cholesterol?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select id="fruits" value={formData.fruits} onChange={handleChange} required>
          <option value="">Daily Fruits?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <input type="number" id="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="number" id="mentHlth" placeholder="Mental Health Days" value={formData.mentHlth} onChange={handleChange} required />
        <select id="diffWalk" value={formData.diffWalk} onChange={handleChange} required>
          <option value="">Difficulty Walking?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select id="sex" value={formData.sex} onChange={handleChange} required>
          <option value="">Sex?</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit">Predict</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}
