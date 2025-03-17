from flask import jsonify
from PredictionService import PredictionService
import pickle
import pandas as pd

class DiabetesClassifier(PredictionService):

    def __init__(self, model_path, scaler_path):
        with open(scaler_path, "rb") as scaler_file:
            self.scaler = pickle.load(scaler_file)

        with open(model_path, "rb") as model_file:  
            self.model = pickle.load(model_file)


    def preprocess_data(self, data):
        processed_data = [
            1 if data["highBP"] == "yes" else 0,
            1 if data["highChol"] == "yes" else 0,
            float(data["bmi"]),
            1 if data["smoker"] == "yes" else 0,
            1 if data["physActivity"] == "yes" else 0,
            1 if data["fruits"] == "yes" else 0,
            1 if data["veggies"] == "yes" else 0,
            int(data["mentHlth"]),
            1 if data["diffWalk"] == "yes" else 0,
            1 if data["sex"] == "male" else 0,
            int(data["age"])
        ]


        feature_names = [
            'HighBP', 'HighChol', 'BMI', 'Smoker', 'PhysActivity', 'Fruits', 'Veggies', 'MentHlth', 'DiffWalk', 'Sex', 'Age'
        ]

        return pd.DataFrame([processed_data], columns=feature_names)


    def predict(self, data):
        processed_data = self.preprocess_data(data)
        input_scaled = self.scaler.transform(processed_data)
        prediction = self.model.predict(input_scaled)
        probability = self.model.predict_proba(input_scaled)[:, 1][0] 

        response = {
            "prediction": int(prediction),  
            "probability": float(probability)
        }

        return response