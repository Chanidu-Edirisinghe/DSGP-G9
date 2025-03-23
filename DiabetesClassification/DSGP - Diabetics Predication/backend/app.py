from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the MinMaxScaler
with open("minmax_scaler.pkl", "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

# Load the trained model (Gradient Boosting)
with open("gradient_boosting.pkl", "rb") as model_file:  
    model = pickle.load(model_file)

# Load the trained model (Logistic Regression or Gradient Boosting)
with open("logistic_regression.pkl", "rb") as model_file:  
    model = pickle.load(model_file)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Receive JSON data from frontend
        data = request.get_json()

        # Extract and process features
        features = [
            float(data["bmi"]),
            1 if data["smoker"] == "yes" else 0,
            1 if data["highBP"] == "yes" else 0,
            1 if data["physActivity"] == "yes" else 0,
            1 if data["highChol"] == "yes" else 0,
            1 if data["fruits"] == "yes" else 0,
            float(data["age"]),
            1 if data["veggies"] == "yes" else 0,
            float(data["mentHlth"]),
            1 if data["diffWalk"] == "yes" else 0,
            1 if data["sex"] == "male" else 0
        ]

        # Reshape input for the model
        input_data = np.array(features).reshape(1, -1)

        # Scale input using MinMaxScaler
        input_scaled = scaler.transform(input_data)

        # Get model prediction
        prediction = model.predict(input_scaled)
        probability = model.predict_proba(input_scaled)[:, 1][0]  # Probability of diabetes risk

        # Prepare response
        response = {
            "prediction": int(prediction[0]),  # 0 = Low Risk, 1 = High Risk
            "probability": float(probability)
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)