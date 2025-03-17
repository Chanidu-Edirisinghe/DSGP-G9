// src/components/InfoBox/InfoBox.js
import React from "react";
import "./infobox2.css";

function InfoBox() {
  return (
    <div className="info-box">
      <h2>Understanding Diabetes</h2>
      <p>
        Diabetes is a significant global health issue, and early detection plays
        a crucial role in preventing the progression of the disease. Accurate
        and timely identification of diabetes, pre-diabetes, and healthy
        individuals is essential for effective intervention and management. Our
        predictive model analyzes key health indicators such as blood glucose
        levels, age, family history, and lifestyle factors to assess whether an
        individual is diabetic, pre-diabetic, or healthy.
      </p>
      <p>
        By leveraging advanced machine learning techniques, the model uses the
        entered data to classify individuals into one of these categories. Early
        detection of pre-diabetes, in particular, is vital, as it allows for
        proactive steps to prevent the development of Type 2 diabetes through
        lifestyle modifications such as dietary changes and increased physical
        activity.
      </p>
      <p>
        This predictive tool empowers both individuals and healthcare providers
        by offering an evidence-based approach to diabetes risk assessment. By
        identifying those at risk early, the model provides valuable insights
        that can guide personalized prevention strategies and improve overall
        health outcomes.
      </p>
      <p>
        Whether a person is classified as diabetic, pre-diabetic, or healthy,
        timely intervention can significantly reduce the risk of long-term
        complications. Encouraging healthy habits, promoting regular check-ups,
        and ensuring proper medical guidance are essential for maintaining
        optimal health and preventing the onset of diabetes.
      </p>
    </div>
  );
}

export default InfoBox;
