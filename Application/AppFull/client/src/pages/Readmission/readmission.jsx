import React, { useState } from "react";
import "./readmission.css";
import Hero from "../../components/Hero/hero";
import InfoBox from "../../components/Infobox/infobox";
import ReadmissionForm from "../../components/ReadmissionForm/readmissionForm";
import Footer from "../../components/Footer/footer";
import ChatbotUI from "../../components/ChatbotUI/ChatbotUI";
import PatientManager from "../../components/PatientManager/patientManager";

function Readmission() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  return (
    <div>
      <Hero
        heading="Diabetes Readmission Prediction"
        description="AI-powered predictions for the likelihood of hospital readmission, helping healthcare professionals make informed decisions."
      />
      <PatientManager onSelectPatient={setSelectedPatient} />

      <section className="content">
        <InfoBox />
        <ReadmissionForm selectedPatient={selectedPatient} />
      </section>

      <ChatbotUI />
      <Footer />
    </div>
  );
}

export default Readmission;
