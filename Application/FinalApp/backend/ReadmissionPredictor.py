from PredictionService import PredictionService
import pandas as pd
import pickle


class ReadmissionPredictor(PredictionService):
    def __init__(self, model_path, scaler_path):
        with open(model_path, "rb") as f:
            self.model = pickle.load(f)
        with open(scaler_path, "rb") as f:
            self.scaler = pickle.load(f)
        
        # Encoding dictionaries
        self.medication_encoding = {"No": 0, "Down": 1, "Steady": 2, "Up": 3}
        self.age_encoding = {"[0-10)": 0, "[10-20)": 1, "[20-30)": 2, "[30-40)": 3, "[40-50)": 4, "[50-60)": 5, "[60-70)": 6, "[70-80)": 7, "[80-90)": 8, "[90-100)": 9}
        self.admission_type_encoding = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}
        self.admission_source_encoding = {i: i - 1 for i in range(1, 16)}
        self.race_encoding = {"AfricanAmerican": 0, "Asian": 1, "Caucasian": 2, "Hispanic": 3, "Other": 4}
        self.gender_encoding = {"Female": 0, "Male": 1}
        self.change_encoding = {"Ch": 0, "No": 1}
        self.diag_encoding = {"Circulatory": 0, "Diabetes": 1, "Digestive": 2, "Genitourinary": 3, "Injury": 4, "Musculoskeletal": 5, "Neoplasms": 6, "Other": 7, "Respiratory": 8}

    def preprocess_data(self, data):
        try:
            processed_data = [
                self.race_encoding.get(data["race"], 4),
                self.gender_encoding.get(data["gender"], 1),
                self.age_encoding.get(data["age"], 0),
                self.admission_type_encoding.get(int(data["admission_type_id"]), 0),
                self.admission_source_encoding.get(int(data["admission_source_id"]), 0),
                int(data["time_in_hospital"]),
                int(data["num_lab_procedures"]),
                int(data["num_procedures"]),
                int(data["num_medications"]),
                int(data["number_outpatient"]),
                int(data["number_emergency"]),
                int(data["number_inpatient"]),
                self.diag_encoding.get(data["diag_1"], 7),
                self.diag_encoding.get(data["diag_2"], 7),
                self.diag_encoding.get(data["diag_3"], 7),
                self.medication_encoding.get(data["metformin"], 0),
                self.medication_encoding.get(data["glipizide"], 0),
                self.medication_encoding.get(data["pioglitazone"], 0),
                self.medication_encoding.get(data["rosiglitazone"], 0),
                self.medication_encoding.get(data["acarbose"], 0),
                self.medication_encoding.get(data["insulin"], 0),
                self.change_encoding.get(data["change"], 1),
            ]
            # return np.array(processed_data).reshape(1, -1)
            feature_names = [
                "race", "gender", "age", "admission_type_id", "admission_source_id",
                "time_in_hospital", "num_lab_procedures", "num_procedures", "num_medications",
                "number_outpatient", "number_emergency", "number_inpatient", "diag_1", "diag_2",
                "diag_3", "metformin", "glipizide", "pioglitazone", "rosiglitazone", "acarbose",
                "insulin", "change"
            ]
            return pd.DataFrame([processed_data], columns=feature_names)
        
        except Exception as e:
            raise ValueError(f"Error in preprocessing: {e}")

    def predict(self, data):
        try:
            processed_data = self.preprocess_data(data)
            processed_data = self.scaler.transform(processed_data)
            probabilities = self.model.predict_proba(processed_data)[:, 1]
            probability = float(probabilities[0])
            print("Prediction: ", self.model.predict(processed_data))
            print("Probabilities", self.model.predict_proba(processed_data))
            
            # Determine risk level based on probability thresholds
            if probability < 1/3:
                risk_level = "Low Risk of Readmission"
            elif probability < 2/3:
                risk_level = "Medium Risk of Readmission"
            else:
                risk_level = "High Risk of Readmission"
                
            return {
                "prediction": risk_level,
                "probability": round(probability, 4)
            }
        except Exception as e:
            return {"error": str(e)}