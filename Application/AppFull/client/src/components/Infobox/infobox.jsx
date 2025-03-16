// src/components/InfoBox/InfoBox.js
import React from "react";
import "./infobox.css";

function InfoBox() {
  return (
    <div className="info-box">
      <h2>Understanding Diabetes Readmission</h2>
      <p>
        Hospital readmission for diabetic patients is a significant concern,
        often indicating complications, improper medication management, or
        inadequate follow-up care. Readmissions not only increase healthcare
        costs but also impact the overall well-being of patients.
      </p>
      <p>
        Diabetes is a chronic condition that requires continuous monitoring and
        proactive intervention. Factors such as blood glucose levels, prior
        hospitalization history, comorbid conditions, and medication adherence
        play a crucial role in determining the risk of readmission.
      </p>
      <p>
        Our predictive model analyzes key health indicators, past medical
        records, and treatment responses to assess the likelihood of
        readmission. By identifying high-risk patients in advance, healthcare
        providers can take preventive measures, such as personalized treatment
        plans and enhanced patient education, to reduce the chances of hospital
        returns.
      </p>
      <p>
        Lifestyle choices, dietary habits, and access to timely medical care
        also influence the likelihood of readmission. Encouraging patient
        engagement and self-management strategies can significantly reduce risks
        and promote better health outcomes.
      </p>
      <p>
        Proactive care and early intervention can make a lasting difference in
        preventing unnecessary readmissions. Understanding these risk factors
        allows both patients and doctors to make informed decisions, improving
        long-term diabetes management and overall quality of care.
      </p>
    </div>
  );
}

export default InfoBox;
