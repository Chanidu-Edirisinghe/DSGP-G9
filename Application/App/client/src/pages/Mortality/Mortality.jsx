import React from "react";
import Hero from "../../components/Hero/hero";
import Footer from "../../components/Footer/footer";
import MortalityForm from "../../components/MortalityForm/mortalityForm";
import ChatbotUI from "../../components/ChatbotUI/ChatbotUI";
import PatientManager from "../../components/PatientManager/patientManager";
import InfoBox from "../../components/Infobox2/infobox2";
import "./mortality.css";

function Mortality() {
  return (
    <div>
      <Hero
        heading="Mortality Risk Prediction"
        description="Predicting patient mortality rates is essential for early intervention, efficient resource allocation, and improved decision-making in healthcare.
         It enables timely treatments, helps prioritize patients for critical care, and guides end-of-life care planning in alignment with patient wishes.
         Mortality prediction also reduces unnecessary interventions for patients with low chances of survival, ensuring a focus on comfort and quality of life.
         In DiaTrack, this prediction supports doctors and lab technicians in making informed clinical decisions, optimizing patient care, and improving overall healthcare quality.
         It also serves as a key performance metric for evaluating hospital outcomes and treatment efficacy."
      />
      <PatientManager />
      {/* <section className="content">
        <InfoBox />
        <MortalityForm />
      </section> */}
      <MortalityForm />
      <ChatbotUI />
      <Footer />
    </div>
  );
}

export default Mortality;
