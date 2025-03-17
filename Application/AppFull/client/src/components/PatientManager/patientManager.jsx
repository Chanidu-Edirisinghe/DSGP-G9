import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patientManager.css";

const PatientManager = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [newPatientName, setNewPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients from backend when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://127.0.0.1:5000/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.patients)) {
          // Transform the data to match our component's expected format
          const uniquePatients = new Map();

          response.data.patients.forEach((patient) => {
            if (!uniquePatients.has(patient.patient_name)) {
              uniquePatients.set(patient.patient_name, {
                id: uniquePatients.size + 1,
                name: patient.patient_name,
              });
            }
          });

          setPatients(Array.from(uniquePatients.values()));
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Update parent component when patient selection changes
  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find(
        (p) => p.id === parseInt(selectedPatientId)
      );
      onSelectPatient(patient);
    } else {
      onSelectPatient(null);
    }
  }, [selectedPatientId, patients, onSelectPatient]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (newPatientName.trim()) {
      try {
        const token = localStorage.getItem("access_token");

        // Save patient to backend
        await axios.post(
          "http://127.0.0.1:5000/patients",
          { name: newPatientName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state
        const id =
          patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
        setPatients([...patients, { id, name: newPatientName }]);
        setNewPatientName("");
      } catch (err) {
        console.error("Error adding patient:", err);
        alert("Failed to add patient. Please try again.");
      }
    }
  };

  const handleDeletePatient = async () => {
    if (selectedPatientId) {
      try {
        const token = localStorage.getItem("access_token");
        const patientName = patients.find(
          (p) => p.id === parseInt(selectedPatientId)
        )?.name;

        // Delete patient from backend
        await axios.delete(`http://127.0.0.1:5000/patients/${patientName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setPatients(
          patients.filter(
            (patient) => patient.id !== parseInt(selectedPatientId)
          )
        );
        setSelectedPatientId("");
      } catch (err) {
        console.error("Error deleting patient:", err);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  const handleSelectChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  return (
    <div className="patient-container">
      <div className="patient-card">
        <div className="controls-row">
          {/* Add Patient Section */}
          <div className="control-group">
            <label className="input-label">New Patient</label>
            <div className="input-with-button">
              <input
                type="text"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="Patient name"
                className="text-input"
              />
              <button onClick={handleAddPatient} className="add-button">
                Add
              </button>
            </div>
          </div>

          {/* Select Patient Section */}
          <div className="control-group">
            <label className="input-label">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={handleSelectChange}
              className="select-input"
              disabled={isLoading}
            >
              <option value="">-- Select a patient --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            {isLoading && <span className="loading-text"> Loading...</span>}
          </div>

          {/* Delete Button */}
          <div className="button-container">
            <button
              onClick={handleDeletePatient}
              disabled={!selectedPatientId}
              className={
                selectedPatientId ? "delete-button" : "delete-button disabled"
              }
            >
              Delete
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Selected Patient Display */}
        {selectedPatientId && (
          <div className="selected-patient">
            <span className="selected-label">Selected:</span>{" "}
            {patients.find((p) => p.id === parseInt(selectedPatientId))?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManager;
