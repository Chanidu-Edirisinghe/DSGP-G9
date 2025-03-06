from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load CatBoost model
with open("catboost_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Encoding dictionaries (same as before)
medication_encoding = {"No": 0, "Down": 2, "Steady": 3, "Up": 1}
age_encoding = {"[0-10)": 1, "[10-20)": 2, "[20-30)": 3, "[30-40)": 4, "[40-50)": 5, "[50-60)": 6, "[60-70)": 7, "[70-80)": 8, "[80-90)": 9, "[90-100)": 0}
admission_type_encoding = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}
admission_source_encoding = {i: i - 1 for i in range(1, 16)}
race_encoding = {"AfricanAmerican": 0, "Asian": 1, "Caucasian": 2, "Hispanic": 3, "Other": 4}
gender_encoding = {"Female": 0, "Male": 1}
change_encoding = {"Ch": 0, "No": 1}
diag_encoding = {"Circulatory": 0, "Diabetes": 1, "Digestive": 2, "Genitourinary": 3, "Injury": 4, "Musculoskeletal": 5, "Neoplasms": 6, "Other": 7, "Respiratory": 8}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    print("Received Data:", data)  # Debugging

    try:
        # Convert input data to model format
        processed_data = [
            race_encoding.get(data["race"], 4),
            gender_encoding.get(data["gender"], 1),
            age_encoding.get(data["age"], 0),
            admission_type_encoding.get(int(data["admission_type_id"]), 0),
            admission_source_encoding.get(int(data["admission_source_id"]), 0),
            float(data["time_in_hospital"]),
            float(data["num_lab_procedures"]),
            float(data["num_procedures"]),
            float(data["num_medications"]),
            float(data["number_outpatient"]),
            float(data["number_emergency"]),
            float(data["number_inpatient"]),
            diag_encoding.get(data["diag_1"], 7),
            diag_encoding.get(data["diag_2"], 7),
            diag_encoding.get(data["diag_3"], 7),
            medication_encoding.get(data["metformin"], 0),
            medication_encoding.get(data["glipizide"], 0),
            medication_encoding.get(data["pioglitazone"], 0),
            medication_encoding.get(data["rosiglitazone"], 0),
            medication_encoding.get(data["acarbose"], 0),
            medication_encoding.get(data["insulin"], 0),
            change_encoding.get(data["change"], 1),
        ]

        print("Processed Data:", processed_data)  # Debugging

        # Convert to NumPy array and reshape
        processed_data = np.array(processed_data).reshape(1, -1)

        # Apply the same StandardScaler before prediction
        processed_data = scaler.transform(processed_data)  

        # Get probability instead of direct prediction
        probabilities = model.predict_proba(processed_data)[:, 1]  # Probability of class 1 (Readmitted)
        threshold = 0.7  # Optimal threshold
        prediction = int(probabilities[0] >= threshold)  # Apply threshold

        print(f"Prediction: {prediction} | Probability of Readmission (1): {probabilities[0]:.4f}")  # Debugging

        return jsonify({
            "prediction": prediction,
            "probability": round(float(probabilities[0]), 4)  # Send probability as well
        })

    except Exception as e:
        print("Error in Backend:", str(e))
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
