import React from "react";
import Hero from "../../components/Hero/hero";
import Footer from "../../components/Footer/footer";
import DiabetesClassification from "../../components/ClassificationForm/classificationForm";
import InfoBox from "../../components/Infobox2/infobox2";
import ChatbotUI from "../../components/ChatbotUI/ChatbotUI";
import "./classification.css";

function Classification() {
  return (
    <div>
      <Hero
        heading="Diabetes Classification Prediction"
        description="AI-powered predictions for risk of diabetes, helping people check their condition and take proactive steps for better health."
      />

      <section className="content">
        <InfoBox />
        <DiabetesClassification />
      </section>
      <ChatbotUI />
      <Footer />
    </div>
  );
}

export default Classification;
