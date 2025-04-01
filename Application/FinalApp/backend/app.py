from flask import Flask, make_response, request, jsonify
from ChatbotHandler import ChatbotHandler
from DBHandler import DBHandler
from ReadmissionPredictor import ReadmissionPredictor
from flask_cors import CORS
from MortalityPredictor import MortalityPredictor
from DiabetesClassifier import DiabetesClassifier
from Doctor import Doctor
from RecordManager import RecordManager
from NormalUser import NormalUser

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
# import csv
from io import StringIO

from dotenv import load_dotenv
import os
from pathlib import Path
from flask_caching import Cache

# Specify the path to the .env file in the root directory
env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'

# Load environment variables from the .env file
load_dotenv(dotenv_path=env_path)

# Access environment variables
MONGO_URI = os.getenv('MONGO_URI')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
DEBUG = os.getenv('DEBUG')

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# MongoDB Configuration
app.config["MONGO_URI"] = MONGO_URI
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)  # Token valid for 1 hour
jwt = JWTManager(app)



# Initialize DBHandler instance
db_handler = DBHandler(app)
chatbot_handler = ChatbotHandler()
record_manager = RecordManager(db_handler)

# Initialize predictors
predictor = ReadmissionPredictor("models\\catboost_model.pkl", "models\\scaler.pkl")
diabetic_predictor = DiabetesClassifier("models\\gradient_boosting.pkl", "models\\minmax_scaler.pkl")
mortality_predictor = MortalityPredictor('models\\catboost_model72.cbm')

# Initialize NormalUser for non-authenticated operations
normal_user = NormalUser(chatbot_handler, diabetic_predictor)

# Initialize cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

def get_current_doctor(email):
    """Helper function to get the current logged-in doctor with caching"""
    @cache.memoize(timeout=300)  # Cache for 5 minutes
    def get_doctor_from_db(user_email):
        user_data = db_handler.get_user_info(user_email)
        if not user_data:
            return None
        """Create a Doctor object from database user data"""
        return Doctor(
          id=str(user_data.get("_id", "")),
          name=user_data.get("name", ""),
          # password=user_data.get("password", ""),
          email=user_data.get("email", ""),
          patientRecords=[]
        )
    
    return get_doctor_from_db(email)


@app.route("/predict-readmission", methods=["POST"])
@jwt_required()
def predict_readmission():
    user_email = get_jwt_identity()  # Extract logged-in user's email from JWT
    data = request.json
    print("Received Data:", data)  # Debugging
    
    # Extract patient name before passing data to predictor
    patientName = data.pop("patientName", None)
    print("Patient Name:", patientName)  # Debugging
    print("Cleaned Data:", data)  # Debugging
    
    response = predictor.predict(data)
    
    # Store the prediction in the database if patientName is provided
    if patientName:
        try:
            doctor = get_current_doctor(user_email)
            if doctor:
                from PredictionRecord import PredictionRecord
                record = PredictionRecord(
                    user_id=str(doctor.id),
                    patient_name=patientName,
                    features=data,
                    prediction=response,
                    record_type="readmission"
                )
                doctor.addPredictionRecord(db_handler, record)
        except Exception as e:
            print(f"Error storing readmission prediction: {e}")
    
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route('/chatbot-diabetes-prediction', methods=['POST'])
def chatbot_diabetes_prediction():
    data = request.json
    print("Received Data:", data)  # Debugging
    prediction = normal_user.get_diabetes_prediction_from_chat(data)
    return jsonify(prediction)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    result, status_code = db_handler.signup(name, email, password)
    if status_code == 201:
        access_token = create_access_token(identity=email)
        return jsonify({"access_token": access_token}), 200
    return jsonify(result), status_code

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    user = db_handler.authenticate(email, password)
    if user:
        # Generate JWT
        access_token = create_access_token(identity=email)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route("/predict-mortality", methods=["POST"])
@jwt_required()
def predict_mortality():
    user_email = get_jwt_identity()  # Extract logged-in user's email from JWT
    data = request.json
    print("Received Data:", data)  # Debugging
    patientName = data.pop("patientName", None)
    cleaned_data = data
    cleaned_data.pop("weight")
    cleaned_data.pop("height")
    print("Cleaned Data:", cleaned_data)
    response = mortality_predictor.predict(cleaned_data)
    if response.get("error"):
        return jsonify({"error": response["error"]})
    
    # Use Doctor object to store the prediction
    doctor = get_current_doctor(user_email)
    if doctor:
        from PredictionRecord import PredictionRecord
        record = PredictionRecord(
            user_id=str(doctor.id),
            patient_name=patientName,
            features=data,
            prediction=response,
            record_type="mortality"
        )
        doctor.addPredictionRecord(db_handler, record)
    
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route("/diabetesPredict", methods=["POST"])
def predict_diabetes():
    data = request.json
    print("Received Data:", data)
    response = normal_user.predict_diabetes(data)
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route("/patients", methods=["GET"])
@jwt_required()
def get_patients():
    user_email = get_jwt_identity()
    
    doctor = get_current_doctor(user_email)
    if doctor:
        all_patients = doctor.getAllPatients(db_handler)
        return jsonify({"patients": all_patients})
    
    return jsonify({"error": "User not found"}), 404

@app.route("/patients", methods=["POST"])
@jwt_required()
def add_patient():
    user_email = get_jwt_identity()
    data = request.json
    patient_name = data.get("name")
    
    if not patient_name:
        return jsonify({"error": "Patient name is required"}), 400
    
    doctor = get_current_doctor(user_email)
    if doctor:
        success = doctor.addPatient(db_handler, patient_name)
        if success:
            return jsonify({"message": "Patient added successfully"}), 201
    
    return jsonify({"error": "Failed to add patient"}), 500

@app.route("/patients/<string:patient_name>", methods=["DELETE"])
@jwt_required()
def delete_patient(patient_name):
    user_email = get_jwt_identity()
    
    doctor = get_current_doctor(user_email)
    if doctor:
        success = doctor.deletePatient(db_handler, patient_name)
        if success:
            return jsonify({"message": "Patient deleted successfully"}), 200
    
    return jsonify({"error": "Failed to delete patient"}), 500

@app.route("/patient-records/readmission", methods=["GET"])
@jwt_required()
def get_readmission_records():
    user_email = get_jwt_identity()
    
    try:
        print("Fetching readmission records")
        doctor = get_current_doctor(user_email)
        if doctor:
            records = doctor.getPredictionRecords(db_handler, "readmission")
            print("All Records:", records)
            return jsonify({"records": records})
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Error fetching readmission records: {e}")
        return jsonify({"error": "Failed to fetch readmission records"}), 500

@app.route("/patient-records/mortality", methods=["GET"])
@jwt_required()
def get_mortality_records():
    user_email = get_jwt_identity()
    
    try:
        doctor = get_current_doctor(user_email)
        if doctor:
            records = doctor.getPredictionRecords(db_handler, "mortality")
            print("All Records:", records)
            return jsonify({"records": records})
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Error fetching mortality records: {e}")
        return jsonify({"error": "Failed to fetch mortality records"}), 500

@app.route("/download-csv/<string:record_type>", methods=["GET"])
@jwt_required()
def download_csv(record_type):
    user_email = get_jwt_identity()
    
    if record_type not in ["readmission", "mortality"]:
        return jsonify({"error": "Invalid record type"}), 400
    
    response = record_manager.generate_csv(user_email, record_type)
    if isinstance(response, tuple) and isinstance(response[0], dict) and "error" in response[0]:
        return jsonify(response[0]), response[1]
    
    return response

@app.route('/api/user/info', methods=['GET'])
@jwt_required()  # Assuming you're using Flask-JWT-Extended for authentication
def get_user_info():
    # Get current user's email from the JWT token
    email = get_jwt_identity()
    
    # Get user info from the database
    user_info = db_handler.get_user_info(email)
    print(user_info)
    
    if user_info:
        return jsonify(user_info), 200
    else:
        return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)