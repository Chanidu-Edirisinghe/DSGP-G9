import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [readmissionData, setReadmissionData] = useState([]);
  const [mortalityData, setMortalityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");

      try {
        // Fetch readmission data
        const readmissionResponse = await axios.get(
          "http://127.0.0.1:5000/patient-records/readmission",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch mortality data
        const mortalityResponse = await axios.get(
          "http://127.0.0.1:5000/patient-records/mortality",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Readmission data:", readmissionResponse.data);
        console.log("Mortality data:", mortalityResponse.data);

        setReadmissionData(readmissionResponse.data.records || []);
        setMortalityData(mortalityResponse.data.records || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load patient records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadCSV = async (type) => {
    const token = localStorage.getItem("access_token");

    try {
      console.log(`Downloading ${type} CSV...`);

      const response = await axios({
        method: "get",
        url: `http://127.0.0.1:5000/download-csv/${type}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      console.log("CSV response received:", response);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}_records_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error(`Error downloading ${type} CSV:`, err);
      alert(`Failed to download ${type} records. Please try again.`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    // Handle both string dates and MongoDB ISODate objects
    if (!dateString) return "N/A";

    try {
      // Check if it's already a Date object
      if (dateString instanceof Date) {
        return dateString.toLocaleString();
      }

      // Handle MongoDB date format which may be a string or an object
      if (typeof dateString === "object") {
        if (dateString.$date) {
          return new Date(dateString.$date).toLocaleString();
        } else if (dateString.seconds) {
          return new Date(dateString.seconds * 1000).toLocaleString();
        }
      }

      // Regular string date - convert to milliseconds if needed
      if (typeof dateString === "string" && /^\d+$/.test(dateString)) {
        return new Date(parseInt(dateString)).toLocaleString();
      }

      // Standard date string
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error("Error formatting date:", err, dateString);
      return "Invalid Date";
    }
  };

  // Extract prediction result for display
  const formatPrediction = (predictionObj, type) => {
    if (!predictionObj) return "N/A";

    if (type === "readmission") {
      return predictionObj.prediction === 1
        ? `Likely to be readmitted (${(predictionObj.probability * 100).toFixed(
            2
          )}%)`
        : `Not likely to be readmitted (${(
            predictionObj.probability * 100
          ).toFixed(2)}%)`;
    } else if (type === "mortality") {
      return predictionObj.hospital_death === 1
        ? `High risk (${(predictionObj.death_probability * 100).toFixed(2)}%)`
        : `Low risk (${(predictionObj.death_probability * 100).toFixed(2)}%)`;
    }

    return JSON.stringify(predictionObj);
  };

  // Format feature value for display
  const formatFeatureValue = (key, value) => {
    if (value === undefined || value === null) return "N/A";

    // Format specific fields
    switch (key) {
      case "metformin":
      case "glipizide":
      case "pioglitazone":
      case "rosiglitazone":
      case "acarbose":
      case "insulin":
        return value; // Just return the value without "Dosage:" prefix
      case "change":
        return value === "Ch" ? "Yes" : "No";
      case "admission_type_id":
        const admissionTypes = {
          0: "Emergency",
          1: "Urgent",
          2: "Elective",
          3: "Newborn",
          4: "Not Available",
          5: "Trauma Center",
        };
        return `${value} - ${admissionTypes[value] || ""}`;
      case "admission_source_id":
        const sources = {
          1: "Physician Referral",
          2: "Clinic Referral",
          3: "HMO Referral",
          4: "Transfer from hospital",
          5: "Transfer from SNF",
          6: "Transfer from other facility",
          7: "Emergency Room",
          8: "Court/Law Enforcement",
          9: "Not Available",
          10: "Transfer from critical access hospital",
          11: "Normal Delivery",
          12: "Sick Baby",
          13: "Extramural Birth",
          14: "Transfer hospital inpatient",
          15: "Transfer from Ambulatory Surgery Center",
        };
        return `${value} - ${sources[value] || ""}`;
      default:
        return value;
    }
  };

  // Get all feature keys from record data
  const getAllFeatureKeys = (records) => {
    const allKeys = new Set();
    records.forEach((record) => {
      if (record.features && typeof record.features === "object") {
        Object.keys(record.features).forEach((key) => allKeys.add(key));
      }
    });
    return Array.from(allKeys);
  };

  // Get readmission feature keys
  const readmissionFeatureKeys =
    readmissionData.length > 0 ? getAllFeatureKeys(readmissionData) : [];

  // Get mortality feature keys
  const mortalityFeatureKeys =
    mortalityData.length > 0 ? getAllFeatureKeys(mortalityData) : [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Patient Records Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <p>Loading patient records...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Readmission Records Table */}
          <div className="table-section">
            <h2 className="table-title">Readmission Records</h2>
            <div className="table-container">
              {readmissionData.length === 0 ? (
                <p className="no-data-message">No readmission records found.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Prediction</th>
                      <th>Date</th>
                      {readmissionFeatureKeys.map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {readmissionData.map((record, index) => (
                      <tr key={`readmission-${index}`}>
                        <td>{record.patient_name}</td>
                        <td>
                          {formatPrediction(record.prediction, "readmission")}
                        </td>
                        <td>{formatDate(record.created_at)}</td>
                        {readmissionFeatureKeys.map((key) => (
                          <td key={key}>
                            {formatFeatureValue(key, record.features?.[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button
              className="download-button"
              onClick={() => downloadCSV("readmission")}
              disabled={readmissionData.length === 0}
            >
              Download Readmission Records (CSV)
            </button>
          </div>

          {/* Mortality Records Table */}
          <div className="table-section">
            <h2 className="table-title">Mortality Records</h2>
            <div className="table-container">
              {mortalityData.length === 0 ? (
                <p className="no-data-message">No mortality records found.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Prediction</th>
                      <th>Date</th>
                      {mortalityFeatureKeys.map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mortalityData.map((record, index) => (
                      <tr key={`mortality-${index}`}>
                        <td>{record.patient_name}</td>
                        <td>
                          {formatPrediction(record.prediction, "mortality")}
                        </td>
                        <td>{formatDate(record.created_at)}</td>
                        {mortalityFeatureKeys.map((key) => (
                          <td key={key}>{record.features?.[key] || "N/A"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button
              className="download-button"
              onClick={() => downloadCSV("mortality")}
              disabled={mortalityData.length === 0}
            >
              Download Mortality Records (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
