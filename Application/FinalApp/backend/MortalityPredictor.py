import pandas as pd
import numpy as np
from catboost import CatBoostClassifier
from PredictionService import PredictionService

class MortalityPredictor(PredictionService):
    def __init__(self, model_path):
        super().__init__()  # Initialize parent class if needed
        self.model = CatBoostClassifier()
        self.model.load_model(model_path)

        # Mortality feature columns
        self.feature_mort = [
            "age", "bmi", "pre_icu_los_days", "d1_diasbp_max", "d1_diasbp_min",
            "d1_heartrate_max", "d1_heartrate_min", "d1_mbp_max", "d1_mbp_min",
            "d1_resprate_max", "d1_resprate_min", "d1_spo2_min", "d1_sysbp_max",
            "d1_sysbp_min", "d1_temp_max", "d1_temp_min", "h1_diasbp_max",
            "h1_diasbp_min", "h1_heartrate_max", "h1_heartrate_min", "h1_mbp_max",
            "h1_mbp_min", "h1_resprate_max", "h1_resprate_min", "h1_spo2_max",
            "h1_spo2_min", "h1_sysbp_max", "h1_sysbp_min", "d1_glucose_max",
            "d1_glucose_min", "d1_potassium_max", "d1_potassium_min"
        ]

    def preprocess_data(self, data):
        try:
            # Convert to float where applicable
            numeric_data = {key: float(value) for key, value in data.items()}
            df = pd.DataFrame([numeric_data], columns=self.feature_mort)
            return df
        except Exception as e:
            raise ValueError(f"Error in preprocessing: {e}")

    def predict(self, data):
        try:
            df = self.preprocess_data(data)
            probabilities = self.model.predict_proba(df)[:, 1]
            probability = float(probabilities[0])
        
            print("Prediction: ", self.model.predict(df))
            print("Probabilities", self.model.predict_proba(df))
            print("Probability: ", probabilities)

            
            # Determine risk level based on probability thresholds
            if probability < 1/3:
                risk_level = "Low Risk"
            elif probability < 2/3:
                risk_level = "Medium Risk"
            else:
                risk_level = "High Risk"
                
            return {
                "prediction": risk_level,
                "death_probability": round(probability, 4)
            }
        except Exception as e:
            return {"error": str(e)}