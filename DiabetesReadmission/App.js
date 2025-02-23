import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    race: "",
    gender: "",
    age: "",
    admission_type_id: "",
    admission_source_id: "",
    time_in_hospital: "",
    num_lab_procedures: "",
    num_procedures: "",
    num_medications: "",
    number_outpatient: "",
    number_emergency: "",
    number_inpatient: "",
    diag_1: "",
    diag_2: "",
    diag_3: "",
    metformin: "",
    glipizide: "",
    pioglitazone: "",
    rosiglitazone: "",
    acarbose: "",
    insulin: "",
    change: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data);
      setPrediction(
        data.prediction === 1
          ? "Likely to be readmitted"
          : data.prediction === 0
          ? "Likely not to be readmitted"
          : "Error in prediction"
      );
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error in prediction");
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h2 className="logo">DiaTrack</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Classification</a></li>
          <li><a href="#">Readmission</a></li>
          <li><a href="#">Mortality</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Diabetes Readmission Prediction</h1>
        <p>Predict your likelihood of hospital readmission with AI-powered insights.</p>
      </header>
      
      {/* Content Section */}
      <section className="content">
        {/* About Readmission */}
        <div className="info-box">
          <h2>Understanding Diabetes Readmission</h2>
          <p>
            Hospital readmission for diabetic patients is a significant concern, often indicating complications, improper medication management, or inadequate follow-up care. Readmissions not only increase healthcare costs but also impact the overall well-being of patients.
          </p>
          <p>
            Diabetes is a chronic condition that requires continuous monitoring and proactive intervention. Factors such as blood glucose levels, prior hospitalization history, comorbid conditions, and medication adherence play a crucial role in determining the risk of readmission.
          </p>
          <p>
            Our predictive model analyzes key health indicators, past medical records, and treatment responses to assess the likelihood of readmission. By identifying high-risk patients in advance, healthcare providers can take preventive measures, such as personalized treatment plans and enhanced patient education, to reduce the chances of hospital returns.
          </p>
          <p>
  Lifestyle choices, dietary habits, and access to timely medical care also influence the likelihood of readmission. Encouraging patient engagement and self-management strategies can significantly reduce risks and promote better health outcomes.
</p>

          <p>
          Proactive care and early intervention can make a lasting difference in preventing unnecessary readmissions.Understanding these risk factors allows both patients and doctors to make informed decisions, improving long-term diabetes management and overall quality of care. 
          </p>
        </div>


        <div className="container">
          <h1>Diabetes Readmission Prediction</h1>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {/* Race Selection */}
              <div className="input-group">
                <label>Race/Ethnicity</label>
                <p>Select the patient’s race or ethnicity:</p>
                <select name="race" value={formData.race} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Caucasian">Caucasian</option>
                  <option value="Asian">Asian</option>
                  <option value="AfricanAmerican">African American</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Gender Selection */}
              <div className="input-group">
                <label>Gender</label>
                <p>Select the patient's biological sex.</p>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
          
              {/* Age Dropdown */}
              <div className="input-group">
                <label>Age</label>
                <p>What is the patient's age?</p>
                <select name="age" value={formData.age} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="[0-10)">0-10</option>
                  <option value="[10-20)">10-20</option>
                  <option value="[20-30)">20-30</option>
                  <option value="[30-40)">30-40</option>
                  <option value="[40-50)">40-50</option>
                  <option value="[50-60)">50-60</option>
                  <option value="[60-70)">60-70</option>
                  <option value="[70-80)">70-80</option>
                  <option value="[80-90)">80-90</option>
                  <option value="[90-100)">90-100</option>
                </select>
              </div>

              {/* Admission Type */}
              <div className="input-group">
                <label>Admission Type</label>
                <p>What is the admission type?</p>
                <select name="admission_type_id" value={formData.admission_type_id} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="0">Emergency</option>
                  <option value="1">Urgent</option>
                  <option value="2">Elective</option>
                  <option value="3">Newborn</option>
                  <option value="4">Not Available</option>
                  <option value="5">Trauma Center</option>
                </select>
              </div>

              {/* Admission Source */}
              <div className="input-group">
                <label>Admission Source</label>
                <p>Please select the patient's admission source:</p>
                <select name="admission_source_id" value={formData.admission_source_id} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">Physician Referral</option>
                  <option value="2">Clinic Referral</option>
                  <option value="3">HMO Referral</option>
                  <option value="4">Transfer from a hospital</option>
                  <option value="5">Transfer from a Skilled Nursing Facility (SNF)</option>
                  <option value="6">Transfer from another health care facility</option>
                  <option value="7">Emergency Room</option>
                  <option value="8">Court/Law Enforcement</option>
                  <option value="9">Not Available</option>
                  <option value="10">Transfer from critical access hospital</option>
                  <option value="11">Normal Delivery</option>
                  <option value="12">Sick Baby</option>
                  <option value="13">Extramural Birth</option>
                  <option value="14">Transfer from hospital inpatient/same facility resulting in a separate claim</option>
                  <option value="15">Transfer from Ambulatory Surgery Center</option>
                </select>
              </div>

              {/* Diagnosis Selection */}
              <div className="input-group">
                <label>Primary Diagnosis</label>
                <p>The main condition that led to hospitalization (ICD-9 categories).</p>
                <select name="diag_1" value={formData.diag_1} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Circulatory">Circulatory</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Digestive">Digestive</option>
                  <option value="Genitourinary">Genitourinary</option>
                  <option value="Injury">Injury</option>
                  <option value="Musculoskeletal">Musculoskeletal</option>
                  <option value="Neoplasms">Neoplasms</option>
                  <option value="Other">Other</option>
                  <option value="Respiratory">Respiratory</option>
                </select>
              </div>

              <div className="input-group">
                <label>Secondary Diagnosis</label>
                <p>A condition that coexists with or arises during hospitalization.</p>
                <select name="diag_2" value={formData.diag_2} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Circulatory">Circulatory</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Digestive">Digestive</option>
                  <option value="Genitourinary">Genitourinary</option>
                  <option value="Injury">Injury</option>
                  <option value="Musculoskeletal">Musculoskeletal</option>
                  <option value="Neoplasms">Neoplasms</option>
                  <option value="Other">Other</option>
                  <option value="Respiratory">Respiratory</option>
                </select>
              </div>

              <div className="input-group">
                <label>Tertiary Diagnosis</label>
                <p>An additional condition noted during the hospital stay.</p>
                <select name="diag_3" value={formData.diag_3} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Circulatory">Circulatory</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Digestive">Digestive</option>
                  <option value="Genitourinary">Genitourinary</option>
                  <option value="Injury">Injury</option>
                  <option value="Musculoskeletal">Musculoskeletal</option>
                  <option value="Neoplasms">Neoplasms</option>
                  <option value="Other">Other</option>
                  <option value="Respiratory">Respiratory</option>
                </select>
              </div>

              {/* Numeric Inputs with Separate Explanations */}
              <div className="input-group">
                <label>Time in Hospital</label>
                <p>Integer number of days between admission and discharge.</p>
                <input type="number" name="time_in_hospital" value={formData.time_in_hospital} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Lab Procedures</label>
                <p>Number of lab tests performed during the encounter.</p>
                <input type="number" name="num_lab_procedures" value={formData.num_lab_procedures} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Procedures</label>
                <p>Number of procedures (other than lab tests) performed during the encounter.</p>
                <input type="number" name="num_procedures" value={formData.num_procedures} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Medications</label>
                <p>Number of distinct generic names administered during the encounter.</p>
                <input type="number" name="num_medications" value={formData.num_medications} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Outpatient Visits</label>
                <p>Number of outpatient visits of the patient in the year preceding the encounter.</p>
                <input type="number" name="number_outpatient" value={formData.number_outpatient} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Emergency Visits</label>
                <p>Number of emergency visits of the patient in the year preceding the encounter.</p>
                <input type="number" name="number_emergency" value={formData.number_emergency} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Number of Inpatient Visits</label>
                <p>Number of inpatient visits of the patient in the year preceding the encounter.</p>
                <input type="number" name="number_inpatient" value={formData.number_inpatient} onChange={handleChange} required />
              </div>


              {/* Medication Selection */}
              {["metformin", "glipizide", "pioglitazone", "rosiglitazone", "acarbose", "insulin"].map((med) => (
                <div className="input-group" key={med}>
                  <label>{med.charAt(0).toUpperCase() + med.slice(1)}</label>
                  <p>Was the dosage of {med} changed during treatment?</p>
                  <select name={med} value={formData[med]} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="No">No</option>
                    <option value="Up">Up</option>
                    <option value="Down">Down</option>
                    <option value="Steady">Steady</option>
                  </select>
                </div>
              ))}

              {/* Change in Medication */}
              <div className="input-group">
                <label title="Whether the medication was changed during the stay.">Medication Change</label>
                <p>Did the diabetic medication change during the encounter (either dosage or generic name)</p>
                <select name="change" value={formData.change} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Ch">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">Predict</button>
            </form>
          </div>
          {prediction && <div className="result">Prediction: {prediction}</div>}
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Diabetes Prediction | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;