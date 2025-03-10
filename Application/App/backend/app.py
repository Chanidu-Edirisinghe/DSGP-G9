#  initialise flask api and define routes

# define the routes for the api
# make call to the model to get the prediction
# return the prediction to the client

from flask import Flask, request, jsonify
#from ChatbotHandler import ChatbotHandler
from ReadmissionPredictor import ReadmissionPredictor
from MortalityPredictor import MortalityPredictor
from flask_cors import CORS


app = Flask(__name__)
#chatbot_handler = ChatbotHandler()
CORS(app)

# Initialize Predictor
predictor = ReadmissionPredictor('Application/App/backend/models/catboost_model.pkl', 'Application/App/backend/models/scaler.pkl')
mortality_predictor = MortalityPredictor('Application/App/backend/models/catboost_model72.cbm')

@app.route("/predict1", methods=["POST"])
def predict():
    data = request.json
    print("Received Data:", data)  # Debugging
    response = predictor.predict(data)
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route('/chatbot-diabetes-prediction', methods=['POST'])
def chatbot_diabetes_prediction():
    data = request.json
    prediction = chatbot_handler.get_diabetes_prediction(data)
    return jsonify(prediction)

@app.route("/predict-mortality", methods=["POST"])
def predict_mortality():
    data = request.json
    print("Received Data:", data)  # Debugging
    response = mortality_predictor.predict(data)
    print("Response:", response)  # Debugging
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)