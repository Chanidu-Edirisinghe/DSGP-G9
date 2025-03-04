import React from "react";
import "./readmission.css";
import Hero from "../../components/Hero/hero";
import InfoBox from "../../components/Infobox/infobox";
import ReadmissionForm from "../../components/ReadmissionForm/ReadmissionForm";
import Footer from "../../components/Footer/footer";
import ChatbotUI from "../../components/ChatbotUI/ChatbotUI";
import PatientManager from "../../components/PatientManager/patientManager";

function Readmission() {
  return (
    <div>
      <Hero
        heading="Diabetes Readmission Prediction"
        description="AI-powered predictions for the likelihood of hospital readmission, helping healthcare professionals make informed decisions."
      />
      <PatientManager />

      <section className="content">
        <InfoBox />
        <ReadmissionForm />
      </section>

      <ChatbotUI />
      <Footer />
    </div>
  );
}

export default Readmission;
