from DiabetesClassifier import DiabetesClassifier


class ChatbotHandler:
    def __init__(self):
        pass    

    def get_diabetes_prediction(self, data):
        converted_data = self.convert_data_format(data)
        diabetic_predictor = DiabetesClassifier("gradient_boosting.pkl", "minmax_scaler.pkl")
        prediction = diabetic_predictor.predict(converted_data)
        return prediction
    
    def get_mortality_prediction(self, data):
        return "Low risk of mortality"
    
    def get_readmission_prediction(self, data):
        return "High risk of readmission"
    
    def convert_data_format(self, data):
        return {
            'height': str(int(data['height'])),  # Convert float to int and then string
            'weight': str(int(data['weight'])),  # Convert float to int and then string
            'bmi': str(round(data['weight'] / ((data['height'] / 100) ** 2), 1)),  # BMI formula
            'smoker': 'yes' if data['smoker'] == '1' else 'no',
            'highBP': 'yes' if data['high_blood_pressure'] == '1' else 'no',
            'physActivity': 'yes' if data['physical_activity'] == '1' else 'no',
            'highChol': 'yes' if data['high_cholesterol'] == '1' else 'no',
            'fruits': 'yes' if data['fruits'] == '1' else 'no',
            'veggies': 'yes' if data['veggies'] == '1' else 'no',
            'age': data['age'],  # Keep as integer
            'mentHlth': str(data['mentHealth']),  # Convert to string
            'diffWalk': 'yes' if data['diffWalk'] == '1' else 'no',
            'sex': 'male' if data['sex'] == '1' else 'female'
        }