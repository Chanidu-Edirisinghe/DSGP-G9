from DiabetesClassifier import DiabetesClassifier


class ChatbotHandler:
    def __init__(self):
        pass    

    def get_diabetes_prediction(self, data):
        converted_data = self.convert_data_format(data)
        diabetic_predictor = DiabetesClassifier("models\\gradient_boosting.pkl", "models\\minmax_scaler.pkl")
        prediction = diabetic_predictor.predict(converted_data)
        return prediction
    
    
    def convert_data_format(self, data):
        return {
            # 'height': str(int(data['height'])),  # Convert float to int and then string
            # 'weight': str(int(data['weight'])),  # Convert float to int and then string
            'bmi': str(round(data['weight'] / ((data['height'] / 100) ** 2), 1)),  # BMI formula
            'smoker': data['smoker'],
            'highBP': data['high_blood_pressure'],
            'physActivity': data['physical_activity'],
            'highChol': data['high_cholesterol'],
            'fruits': data['fruits'],
            'veggies': data['veggies'] == '1',
            'age': data['age'],  # Keep as integer
            'mentHlth': str(data['mentHealth']),  # Convert to string
            'diffWalk': data['diffWalk'],
            'sex': data['sex']
        }