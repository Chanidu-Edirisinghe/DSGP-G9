import React, { useState } from "react";
import "./patientManager.css";

const PatientManager = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [newPatientName, setNewPatientName] = useState("");

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (newPatientName.trim()) {
      const id =
        patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
      setPatients([...patients, { id, name: newPatientName }]);
      setNewPatientName("");
    }
  };

  const handleDeletePatient = () => {
    if (selectedPatientId) {
      setPatients(
        patients.filter((patient) => patient.id !== parseInt(selectedPatientId))
      );
      setSelectedPatientId("");
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
            >
              <option value="">-- Select a patient --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
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
