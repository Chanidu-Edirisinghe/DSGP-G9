import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import Footer from "../../components/Footer/footer";
import Hero from "../../components/Hero/hero";

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

        // Update data extraction based on the response structure
        setReadmissionData(
          readmissionResponse.data && readmissionResponse.data.records
            ? Array.isArray(readmissionResponse.data.records)
              ? readmissionResponse.data.records
              : [readmissionResponse.data.records]
            : Array.isArray(readmissionResponse.data)
            ? readmissionResponse.data
            : []
        );

        setMortalityData(
          mortalityResponse.data && mortalityResponse.data.records
            ? Array.isArray(mortalityResponse.data.records)
              ? mortalityResponse.data.records
              : [mortalityResponse.data.records]
            : Array.isArray(mortalityResponse.data)
            ? mortalityResponse.data
            : []
        );
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

      // Create download link with formatted date for consistent naming
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_records_${formattedDate}.csv`);
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
      return predictionObj.prediction === 1
        ? `High risk (${(predictionObj.probability * 100).toFixed(2)}%)`
        : `Low risk (${(predictionObj.probability * 100).toFixed(2)}%)`;
    }

    return JSON.stringify(predictionObj);
  };

  // Format feature value for display - updated to match readmissionForm.jsx formatting
  const formatFeatureValue = (key, value) => {
    if (value === undefined || value === null) return "N/A";

    // Format specific fields based on readmissionForm.jsx values
    switch (key) {
      case "metformin":
      case "glipizide":
      case "pioglitazone":
      case "rosiglitazone":
      case "acarbose":
      case "insulin":
        // Convert medication values to the format in the form
        switch (value) {
          case "No":
            return "No";
          case "Up":
            return "Increased";
          case "Down":
            return "Decreased";
          case "Steady":
            return "Steady";
          default:
            return value;
        }
      case "change":
        return value === "Ch" ? "Yes" : "No";
      case "race":
        // Map race values to more readable form
        const races = {
          Caucasian: "Caucasian",
          Asian: "Asian",
          AfricanAmerican: "African American",
          Hispanic: "Hispanic",
          Other: "Other",
        };
        return races[value] || value;
      case "gender":
        return value;
      case "age":
        return value;
      case "admission_type_id":
        const admissionTypes = {
          0: "Emergency",
          1: "Urgent",
          2: "Elective",
          3: "Newborn",
          4: "Not Available",
          5: "Trauma Center",
        };
        return admissionTypes[value] || value;
      case "admission_source_id":
        const sources = {
          1: "Physician Referral",
          2: "Clinic Referral",
          3: "HMO Referral",
          4: "Transfer from a hospital",
          5: "Transfer from SNF",
          6: "Transfer from another facility",
          7: "Emergency Room",
          8: "Court/Law Enforcement",
          9: "Not Available",
          10: "Transfer from critical access",
          11: "Normal Delivery",
          12: "Sick Baby",
          13: "Extramural Birth",
          14: "Transfer from inpatient",
          15: "Transfer from Surgery Center",
        };
        return sources[value] || value;
      case "diag_1":
      case "diag_2":
      case "diag_3":
        return value; // Keep diagnoses as is
      default:
        return value;
    }
  };

  // Get filtered feature keys - select important ones to show first
  const getFilteredFeatureKeys = (records, type) => {
    // Define key order based on form sections
    const keyOrder =
      type === "readmission"
        ? [
            // Demographics
            "race",
            "gender",
            "age",
            // Admission info
            "admission_type_id",
            "admission_source_id",
            "time_in_hospital",
            // Medical info
            "num_lab_procedures",
            "num_procedures",
            "num_medications",
            "number_outpatient",
            "number_emergency",
            "number_inpatient",
            // Diagnoses
            "diag_1",
            "diag_2",
            "diag_3",
            "change",
            // Medications
            "metformin",
            "glipizide",
            "pioglitazone",
            "rosiglitazone",
            "acarbose",
            "insulin",
          ]
        : [];

    // Get all keys from records
    const allKeys = new Set();
    records.forEach((record) => {
      if (record.features && typeof record.features === "object") {
        Object.keys(record.features).forEach((key) => allKeys.add(key));
      }
    });

    // Return ordered keys (prioritizing the defined order)
    const orderedKeys = keyOrder.filter((key) => allKeys.has(key));
    const remainingKeys = Array.from(allKeys).filter(
      (key) => !keyOrder.includes(key)
    );

    return [...orderedKeys, ...remainingKeys];
  };

  // Get readmission feature keys with better ordering
  const readmissionFeatureKeys =
    readmissionData.length > 0
      ? getFilteredFeatureKeys(readmissionData, "readmission")
      : [];

  // Get mortality feature keys with better ordering
  const mortalityFeatureKeys =
    mortalityData.length > 0
      ? getFilteredFeatureKeys(mortalityData, "mortality")
      : [];

  return (
    <>
      <Hero heading="Dashboard" description="" />
      <div className="dashboard-container">
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
                  <p className="no-data-message">
                    No readmission records found.
                  </p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Prediction</th>
                        <th>Date</th>
                        {readmissionFeatureKeys.map((key) => (
                          <th key={key}>
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/_/g, " ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {readmissionData.map((record, index) => {
                        // Handle record as either an object or dictionary
                        const features =
                          typeof record.features === "object"
                            ? record.features
                            : {};
                        const prediction =
                          typeof record.prediction === "object"
                            ? record.prediction
                            : typeof record.prediction === "string"
                            ? JSON.parse(record.prediction)
                            : {};

                        return (
                          <tr key={`readmission-${index}`}>
                            <td>{record.patient_name}</td>
                            <td>
                              {formatPrediction(prediction, "readmission")}
                            </td>
                            <td>{record.created_at}</td>
                            {readmissionFeatureKeys.map((key) => (
                              <td key={key}>
                                {formatFeatureValue(key, features[key])}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <button
                className="download-button"
                onClick={() => downloadCSV("readmission")}
                disabled={readmissionData.length === 0}
              >
                Download Readmission Records
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
                          <th key={key}>
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/_/g, " ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mortalityData.map((record, index) => {
                        // Handle record as either an object or dictionary
                        const features =
                          typeof record.features === "object"
                            ? record.features
                            : {};
                        const prediction =
                          typeof record.prediction === "object"
                            ? record.prediction
                            : typeof record.prediction === "string"
                            ? JSON.parse(record.prediction)
                            : {};

                        return (
                          <tr key={`mortality-${index}`}>
                            <td>{record.patient_name}</td>
                            <td>{formatPrediction(prediction, "mortality")}</td>
                            <td>{record.created_at}</td>
                            {mortalityFeatureKeys.map((key) => (
                              <td key={key}>
                                {formatFeatureValue(key, features[key])}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <button
                className="download-button"
                onClick={() => downloadCSV("mortality")}
                disabled={mortalityData.length === 0}
              >
                Download Mortality Records
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
