import React, { useState } from "react";
import axios from "axios";
import "./readmissionForm.css";

function ReadmissionForm({ selectedPatient }) {
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
  const [predictionProbability, setPredictionProbability] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a patient is selected
    if (!selectedPatient) {
      alert("Please select a patient before making a prediction");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      // Include patient data in the request
      const dataWithPatient = {
        ...formData,
        patientName: selectedPatient.name,
      };

      // Use axios for the API request
      const response = await axios.post(
        "http://127.0.0.1:5000/predict-readmission",
        dataWithPatient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      setPrediction(
        response.data.prediction === 1
          ? "Likely to be readmitted"
          : response.data.prediction === 0
          ? "Likely not to be readmitted"
          : "Error in prediction"
      );

      // Store the probability if it exists in the response
      if (response.data.probability !== undefined) {
        setPredictionProbability(response.data.probability);
      }
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error in prediction");
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Race Selection */}
            <div className="input-group">
              <p>Select the patient's race or ethnicity:</p>
              <select
                name="race"
                value={formData.race}
                onChange={handleChange}
                required
              >
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
              <p>Select the patient's biological sex.</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {/* Age Dropdown */}
            <div className="input-group">
              <p>What is the patient's age?</p>
              <select
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              >
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
              <p>What is the admission type?</p>
              <select
                name="admission_type_id"
                value={formData.admission_type_id}
                onChange={handleChange}
                required
              >
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
              <p>Please select the patient's admission source:</p>
              <select
                name="admission_source_id"
                value={formData.admission_source_id}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="1">Physician Referral</option>
                <option value="2">Clinic Referral</option>
                <option value="3">HMO Referral</option>
                <option value="4">Transfer from a hospital</option>
                <option value="5">
                  Transfer from a Skilled Nursing Facility (SNF)
                </option>
                <option value="6">
                  Transfer from another health care facility
                </option>
                <option value="7">Emergency Room</option>
                <option value="8">Court/Law Enforcement</option>
                <option value="9">Not Available</option>
                <option value="10">
                  Transfer from critical access hospital
                </option>
                <option value="11">Normal Delivery</option>
                <option value="12">Sick Baby</option>
                <option value="13">Extramural Birth</option>
                <option value="14">
                  Transfer from hospital inpatient/same facility resulting in a
                  separate claim
                </option>
                <option value="15">
                  Transfer from Ambulatory Surgery Center
                </option>
              </select>
            </div>
            {/* Diagnosis Selection */}
            <div className="input-group">
              <p>
                The main condition that led to hospitalization (ICD-9
                categories).
              </p>
              <select
                name="diag_1"
                value={formData.diag_1}
                onChange={handleChange}
                required
              >
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
              <p>
                A condition that coexists with or arises during hospitalization.
              </p>
              <select
                name="diag_2"
                value={formData.diag_2}
                onChange={handleChange}
                required
              >
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
              <p>An additional condition noted during the hospital stay.</p>
              <select
                name="diag_3"
                value={formData.diag_3}
                onChange={handleChange}
                required
              >
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
              <p>Integer number of days between admission and discharge.</p>
              <input
                type="number"
                name="time_in_hospital"
                value={formData.time_in_hospital}
                onChange={handleChange}
                min="1"
                max="14"
                required
              />
            </div>
            <div className="input-group">
              <p>Number of lab tests performed during the encounter.</p>
              <input
                type="number"
                name="num_lab_procedures"
                value={formData.num_lab_procedures}
                onChange={handleChange}
                min="1"
                max="132"
                required
              />
            </div>
            <div className="input-group">
              <p>
                Number of procedures (other than lab tests) performed during the
                encounter.
              </p>
              <input
                type="number"
                name="num_procedures"
                value={formData.num_procedures}
                onChange={handleChange}
                min="0"
                max="6"
                required
              />
            </div>
            <div className="input-group">
              <p>
                Number of distinct generic names administered during the
                encounter.
              </p>
              <input
                type="number"
                name="num_medications"
                value={formData.num_medications}
                onChange={handleChange}
                min="1"
                max="81"
                required
              />
            </div>
            <div className="input-group">
              <p>
                Number of outpatient visits of the patient in the year preceding
                the encounter.
              </p>
              <input
                type="number"
                name="number_outpatient"
                value={formData.number_outpatient}
                onChange={handleChange}
                min="0"
                max="42"
                required
              />
            </div>
            <div className="input-group">
              <p>
                Number of emergency visits of the patient in the year preceding
                the encounter.
              </p>
              <input
                type="number"
                name="number_emergency"
                value={formData.number_emergency}
                onChange={handleChange}
                min="0"
                max="76"
                required
              />
            </div>
            <div className="input-group">
              <p>
                Number of inpatient visits of the patient in the year preceding
                the encounter.
              </p>
              <input
                type="number"
                name="number_inpatient"
                value={formData.number_inpatient}
                onChange={handleChange}
                min="0"
                max="21"
                required
              />
            </div>
            {/* Medication Selection */}
            {[
              "metformin",
              "glipizide",
              "pioglitazone",
              "rosiglitazone",
              "acarbose",
              "insulin",
            ].map((med) => (
              <div className="input-group" key={med}>
                <p>Was the dosage of {med} changed during treatment?</p>
                <select
                  name={med}
                  value={formData[med]}
                  onChange={handleChange}
                  required
                >
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
              <p>
                Did the diabetic medication change during the encounter (either
                dosage or generic name)
              </p>
              <select
                name="change"
                value={formData.change}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Ch">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Predict
            </button>
          </form>
        </div>

        {prediction && (
          <div className="result">
            <div>Prediction: {prediction}</div>
            {predictionProbability !== null && (
              <div>Confidence: {(predictionProbability * 100).toFixed(2)}%</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadmissionForm;
