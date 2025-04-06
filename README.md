# DiaTrack: A Data-Driven Approach for Improved Patient Care by Readmission, Mortality and Diabetic Predictions

---

## 🩺 Overview

**DiaTrack** is a research project developed as a group thesis by students pursuing their **BSc (Hons) in Artificial Intelligence and Data Science**. Conducted in collaboration with the **Informatics Institute of Technology** and **Robert Gordon University Aberdeen**, and supervised by **Mr. Prashan Rathnayaka**, DiaTrack leverages data analytics and machine learning to improve patient outcomes by predicting critical health events.

DiaTrack is a **web-based decision support system** addressing major challenges in diabetes management. It integrates multiple machine learning models and a chatbot interface to provide the following functionalities:

- **Diabetes Risk Assessment**: Enables users to self-assess their diabetic status (diabetic, pre-diabetic, or healthy) via forms or a conversational chatbot.
- **Readmission Prediction**: Predicts 30-day hospital readmission risk for diabetic patients.
- **Mortality Risk Prediction**: Assesses in-hospital mortality risk, especially for ICU-admitted diabetic patients.
- **Chatbot Functionality**: Offers intelligent, interactive assistance for data collection and diabetes education.

---

## 🔍 Motivation and Research Background

- **Global Health Impact**: Diabetes is a rapidly growing health issue with severe complications and economic costs. In countries like Sri Lanka, many remain undiagnosed.
- **Healthcare Burden**: High rates of readmission and mortality among diabetic patients increase pressure on medical systems.
- **Research Gap**: While existing studies address individual aspects (e.g., diabetes detection or readmission), DiaTrack uniquely integrates **risk assessment**, **readmission**, and **mortality prediction** into a unified platform with a **conversational interface**.

---

## 🎯 Objectives and Contributions

### 💻 Technological Contribution

- Implemented **supervised machine learning models** (CatBoost, Gradient Boosting, etc.) using patient demographics, lab results, and medical histories.
- Developed a web app with:
  - **Flask** (Backend)
  - **React** (Frontend)
  - **MongoDB** (Database)
- Integrated a **chatbot using the RASA framework** for data entry and diabetes guidance.

### 🧠 Domain Contribution

- Created a user-friendly platform for patients and healthcare providers.
- Enabled early diagnosis and improved decision-making through predictive modeling.
- Boosted user engagement and health literacy through an interactive chatbot.

---

## ⚙️ Methodology

### 📊 Data and Model Selection

- Utilized **three datasets** for:
  - Diabetes Classification
  - 30-day Readmission Prediction
  - In-hospital Mortality Prediction
- Conducted thorough experimentation with ML algorithms to select the most accurate models.

### 🚀 Development Approach

- **Agile (Scrum)** methodology enabled adaptive development with iterative feedback.
- **Object-Oriented Design (OOD)** for modular, scalable, and maintainable architecture.

### 🧱 System Architecture

![image](https://github.com/user-attachments/assets/d6dbc52b-7f8a-4a47-9335-bb908e521bd0)

##### Class Diagram
![Class Diagram1](https://github.com/user-attachments/assets/70010c84-4a5f-4737-899f-0df15477e8bf)

---

## 🧪 Implementation and Testing

### 🛠 Technology Stack

The DiaTrack project uses a modern, full-stack approach that integrates several key technologies:

![Tech Stack](https://github.com/user-attachments/assets/07c71b90-ec57-4191-8105-94539273c5f2)

#### Backend and Machine Learning:
- Python is used as the primary programming language.
-  Libraries such as Scikit-learn, Pandas, and TensorFlow are employed for data processing, model training, and evaluation.
-  lask serves as the REST API framework that connects the machine learning models with the frontend.

•	Frontend:
- The user interface is built with HTML, CSS, and JavaScript, with React used to develop a dynamic and responsive web experience.

•	Chatbot:
- The system incorporates a conversational interface using the RASA framework, which handles natural language understanding (NLU) and dialogue management for collecting data and providing health advice.

•	Database and Deployment:
-	MongoDB, a NoSQL database, is used to store patient data and model results efficiently.
-	The project utilizes version control with GitHub to manage the codebase and collaboration.

##### Libraries & Frameworks:

| Library              | Version  |
|----------------------|----------|
| pandas               | 2.2.2    |
| seaborn              | 0.13.2   |
| matplotlib           | 3.10.0   |
| numpy                | 1.26.4   |
| sklearn              | 1.6.1    |
| imblearn             | 0.13.0   |
| xgboost              | 2.1.4    |
| catboost             | 1.2.7    |
| scipy                | 1.13.1   |
| tensorflow           | 2.12.0   |
| flask                | 3.1.0    |
| flask-cors           | 5.0.1    |
| flask-pymongo        | 3.0.1    |
| flask-jwt-extended   | 4.7.1    |
| flask-caching        | 2.3.1    |
| python-dotenv        | 1.1.0    |
| pymongo              | 4.11.2   |
| axios                | 1.8.1    |
| react-router-dom     | 7.2.0    |


This combination of technologies enables DiaTrack to provide a robust, scalable, and user-friendly platform for diabetes risk assessment and predictive analytics.

### ✅ Testing Procedures

- Functional Testing: Correct predictions, data flow, chatbot responses.
- Non-Functional Testing: System speed, scalability, and stability.
- Evaluation Metrics: Accuracy, Precision, Recall, AUC, Macro Avg F1

### 🧾 Feedback and Evaluation

- Collected insights from **healthcare professionals** and **technical experts** via surveys/interviews.
- High trust and interest in the system’s predictions validated its clinical relevance.

---

## 📌 Conclusion and Future Enhancements

**DiaTrack** integrates predictive analytics and interactive technology into a single, powerful platform for diabetes management. It supports early diagnosis, guides care decisions, and contributes to medical research.

### 🔮 Future Enhancements

- Include **additional risk factors** in predictive models.
- Improve **chatbot's natural language understanding** for more personalized advice.
- Expand to **mobile platforms** for broader accessibility.

---

