import { useState } from "react";
import './App.css';

export default function DiabetesForm() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setResult("Processing classification...");
    
    setTimeout(() => {
      setResult("Classification result: Low risk"); // Placeholder
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Diabetes Classification</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input type="number" id="bmi" placeholder="BMI" value={formData.bmi} onChange={handleChange} className="border p-2 rounded" required />
          <select id="smoker" value={formData.smoker} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Smoker?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <input type="number" id="highBP" placeholder="Blood Pressure" value={formData.highBP} onChange={handleChange} className="border p-2 rounded" required />
          <select id="physActivity" value={formData.physActivity} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Physical Activity?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <input type="number" id="highChol" placeholder="Cholesterol Level" value={formData.highChol} onChange={handleChange} className="border p-2 rounded" required />
          <select id="fruits" value={formData.fruits} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Eats Fruits?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <input type="number" id="age" placeholder="Age" value={formData.age} onChange={handleChange} className="border p-2 rounded" required />
          <select id="veggies" value={formData.veggies} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Eats Veggies?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <input type="number" id="mentHlth" placeholder="Mental Health (Days affected)" value={formData.mentHlth} onChange={handleChange} className="border p-2 rounded" required />
          <select id="diffWalk" value={formData.diffWalk} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Difficulty Walking?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <select id="sex" value={formData.sex} onChange={handleChange} className="col-span-2 border p-2 rounded" required>
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Classify</button>
        </form>
        {result && <p className="mt-4 text-center font-semibold">{result}</p>}
      </div>
    </div>
  );
}
