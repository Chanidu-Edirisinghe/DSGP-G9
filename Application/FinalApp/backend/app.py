from flask import Flask, make_response, request, jsonify
from ChatbotHandler import ChatbotHandler
from DBHandler import DBHandler
from ReadmissionPredictor import ReadmissionPredictor
from flask_cors import CORS
from MortalityPredictor import MortalityPredictor
from DiabetesClassifier import DiabetesClassifier

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import csv
from io import StringIO

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb+srv://chanidu1214:P7vWcYtKLFqQnxrG@cluster0.nf09b.mongodb.net/DiatrackDB?retryWrites=true&w=majority"  # Ensure this URI is correct
app.config["JWT_SECRET_KEY"] = "aaaabbbb2323ccccdgdudbrorb4"  # Change this
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)  # Token valid for 1 hour
jwt = JWTManager(app)



# Initialize DBHandler instance
db_handler = DBHandler(app)
chatbot_handler = ChatbotHandler()


# Initialize Predictor
predictor = ReadmissionPredictor("models\\catboost_model.pkl", "models\\scaler.pkl")
diabetic_predictor = DiabetesClassifier("models\\gradient_boosting.pkl", "models\\minmax_scaler.pkl")
mortality_predictor = MortalityPredictor('models\\catboost_model72.cbm')

@app.route("/predict-readmission", methods=["POST"])
@jwt_required()
def predict():
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
            db_handler.add_readmission(user_email, data, response, patientName)
        except Exception as e:
            print(f"Error storing readmission prediction: {e}")
    
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route('/chatbot-diabetes-prediction', methods=['POST'])
def chatbot_diabetes_prediction():
    data = request.json
    print("Received Data:", data)  # Debugging
    prediction = chatbot_handler.get_diabetes_prediction(data)
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
    db_handler.add_mortality(user_email, data, response, patientName)
    print("Response:", response)  # Debugging
    return jsonify(response)

@app.route("/diabetesPredict", methods=["POST"])
def predict_diabetes():
    data = request.json
    print("Received Data:", data)
    response = diabetic_predictor.predict(data)
    print("Response:", response)  # Debugging
    return jsonify(response)


@app.route("/patients", methods=["GET"])
@jwt_required()
def get_patients():
    user_email = get_jwt_identity()
    
    all_patients = db_handler.get_patients(user_email)
    
    return jsonify({"patients": all_patients})

@app.route("/patients", methods=["POST"])
@jwt_required()
def add_patient():
    user_email = get_jwt_identity()
    data = request.json
    patient_name = data.get("name")
    
    if not patient_name:
        return jsonify({"error": "Patient name is required"}), 400
    
    success = db_handler.add_patient(user_email, patient_name)
    if success:
        return jsonify({"message": "Patient added successfully"}), 201
    else:
        return jsonify({"error": "Failed to add patient"}), 500

@app.route("/patients/<string:patient_name>", methods=["DELETE"])
@jwt_required()
def delete_patient(patient_name):
    user_email = get_jwt_identity()
    success = db_handler.delete_patient(user_email, patient_name)
    
    if success:
        return jsonify({"message": "Patient deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete patient"}), 500



    
@app.route("/patient-records/readmission", methods=["GET"])
@jwt_required()
def get_readmission_records():
    user_email = get_jwt_identity()
    
    try:
        print("Fetching readmission records")
        records = db_handler.get_readmission_records(user_email)
        print("All Records:", records)
        return jsonify({"records": records})
    except Exception as e:
        print(f"Error fetching readmission records: {e}")
        return jsonify({"error": "Failed to fetch readmission records"}), 500

@app.route("/patient-records/mortality", methods=["GET"])
@jwt_required()
def get_mortality_records():
    user_email = get_jwt_identity()
    
    try:
        records = db_handler.get_mortality_records(user_email)
        print("All Records:", records)
        return jsonify({"records": records})
    except Exception as e:
        print(f"Error fetching mortality records: {e}")
        return jsonify({"error": "Failed to fetch mortality records"}), 500

@app.route("/download-csv/<string:record_type>", methods=["GET"])
@jwt_required()
def download_csv(record_type):
    user_email = get_jwt_identity()
    
    if record_type not in ["readmission", "mortality"]:
        return jsonify({"error": "Invalid record type"}), 400
    
    try:
        # Get records from database
        if record_type == "readmission":
            records = db_handler.get_readmission_records(user_email)
        else:
            records = db_handler.get_mortality_records(user_email)
        
        if not records or len(records) == 0:
            return jsonify({"error": f"No {record_type} records found"}), 404
            
        # Create CSV file in memory
        output = StringIO()
        writer = csv.writer(output)
        
        # Get all feature keys from records
        all_feature_keys = set()
        for record in records:
            if "features" in record and isinstance(record["features"], dict):
                all_feature_keys.update(record["features"].keys())
        
        # Prepare headers
        headers = ["Patient Name", "Date"]
        
        # Add prediction headers based on type
        if record_type == "readmission":
            headers.extend(["Readmission Prediction", "Probability"])
        else:  # mortality
            headers.extend(["Mortality Risk", "Death Probability"])
        
        # Add feature headers
        headers.extend(sorted(all_feature_keys))
        
        # Write headers
        writer.writerow(headers)
        
        # Write rows
        for record in records:
            row = []
            
            # Add patient name
            row.append(record.get("patient_name", ""))
            
            # Format date
            created_at = record.get("created_at")
            if created_at:
                if isinstance(created_at, datetime):
                    row.append(created_at.strftime("%Y-%m-%d %H:%M:%S"))
                else:
                    row.append(str(created_at))
            else:
                row.append("")
            
            # Add prediction values
            if record_type == "readmission":
                prediction = record.get("prediction", {})
                pred_value = prediction.get("prediction")
                prob = prediction.get("probability", 0)
                
                row.append("Yes" if pred_value == 1 else "No")
                row.append(f"{prob * 100:.2f}%")
            else:
                prediction = record.get("prediction", {})
                hosp_death = prediction.get("hospital_death")
                death_prob = prediction.get("death_probability", 0)
                
                row.append("High Risk" if hosp_death == 1 else "Low Risk")
                row.append(f"{death_prob * 100:.2f}%")
            
            # Add all feature values
            features = record.get("features", {})
            for key in sorted(all_feature_keys):
                value = features.get(key, "")
                
                # Format specific fields
                if key == "change" and value == "Ch":
                    value = "Yes"
                elif key == "change" and value == "No":
                    value = "No"
                elif key == "admission_type_id":
                    admission_types = {
                        "0": "Emergency",
                        "1": "Urgent",
                        "2": "Elective",
                        "3": "Newborn",
                        "4": "Not Available",
                        "5": "Trauma Center"
                    }
                    if str(value) in admission_types:
                        value = f"{value} - {admission_types[str(value)]}"
                elif key == "admission_source_id":
                    sources = {
                        "1": "Physician Referral",
                        "2": "Clinic Referral",
                        "3": "HMO Referral",
                        "4": "Transfer from hospital",
                        "5": "Transfer from SNF",
                        "6": "Transfer from other facility",
                        "7": "Emergency Room",
                        "8": "Court/Law Enforcement",
                        "9": "Not Available",
                        "10": "Transfer from critical access hospital",
                        "11": "Normal Delivery",
                        "12": "Sick Baby",
                        "13": "Extramural Birth",
                        "14": "Transfer hospital inpatient",
                        "15": "Transfer from Ambulatory Surgery Center"
                    }
                    if str(value) in sources:
                        value = f"{value} - {sources[str(value)]}"
                
                row.append(str(value))
            
            writer.writerow(row)
        
        # Prepare response
        response_data = output.getvalue()
        output.close()
        
        # Create response with CSV as attachment
        response = make_response(response_data)
        response.headers["Content-Disposition"] = f"attachment; filename={record_type}_records_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        response.headers["Content-type"] = "text/csv"
        
        return response
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to generate {record_type} CSV: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)