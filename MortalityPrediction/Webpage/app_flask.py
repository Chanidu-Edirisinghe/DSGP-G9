from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from catboost import CatBoostClassifier

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the trained model
model = CatBoostClassifier()
model.load_model("catboost_model72.cbm")

# Define feature columns
feature_columns = [
    "age", "bmi", "pre_icu_los_days", "d1_diasbp_max", "d1_diasbp_min",
    "d1_heartrate_max", "d1_heartrate_min", "d1_mbp_max", "d1_mbp_min",
    "d1_resprate_max", "d1_resprate_min", "d1_spo2_min", "d1_sysbp_max",
    "d1_sysbp_min", "d1_temp_max", "d1_temp_min", "h1_diasbp_max",
    "h1_diasbp_min", "h1_heartrate_max", "h1_heartrate_min", "h1_mbp_max",
    "h1_mbp_min", "h1_resprate_max", "h1_resprate_min", "h1_spo2_max",
    "h1_spo2_min", "h1_sysbp_max", "h1_sysbp_min", "d1_glucose_max",
    "d1_glucose_min", "d1_potassium_max", "d1_potassium_min"
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data], columns=feature_columns)
        
        # Predict the class (0 or 1)
        prediction = model.predict(df)[0]
        
        # Get prediction probabilities
        prediction_prob = model.predict_proba(df)[0][prediction]  # Get probability of the predicted class
        
        return jsonify({
            'hospital_death': int(prediction),
            'death_probability': float(prediction_prob)
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
