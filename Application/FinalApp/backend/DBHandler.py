from datetime import datetime, timezone
from flask_pymongo import PyMongo # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash

class DBHandler:
    def __init__(self, app):
        self.mongo = PyMongo(app)  # Initialize PyMongo with the Flask app instance
        

    def authenticate(self, email, password):
        users_collection = self.mongo.db['User']  # Access the collection
        user = users_collection.find_one({"email": email})
        if user and check_password_hash(user["password"], password):
            return True
        return False

    def signup(self, name, email, password):
        # Ensure all fields are provided
        if not name or not email or not password:
            return {"error": "All fields are required"}, 400

        # Check if user already exists
        users_collection = self.mongo.db['User']  # Access the collection
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            return {"error": "User already exists"}, 400

        # Hash the password for storage
        hashed_password = generate_password_hash(password)

        # Create user data object
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password
        }

        # Insert the new user into the database
        users_collection.insert_one(user_data)

        return {"message": "User registered successfully"}, 201
    
    def add_mortality(self, email, prediction_record):
        users_collection = self.mongo.db['User']  # Access the collection
        user = users_collection.find_one({"email": email})
        record = {
            "user_id": str(user["_id"]),  # Link record to logged-in user
            "patient_name": prediction_record.patient_name,
            "features": prediction_record.features,  # All input features from form as received
            "prediction": prediction_record.prediction,  # ML model prediction result
            "created_at": datetime.now(timezone.utc)  # Timestamp for history tracking
        }
        mortality_record_collection = self.mongo.db['MortalityRecords']  # Access the collection
        mortality_record_collection.insert_one(record)

    def get_patients(self, email):
        users_collection = self.mongo.db['User']
        user = users_collection.find_one({"email": email})
        
        if not user:
            return []
        
        # Get patients from the Patients collection
        patients_collection = self.mongo.db.get_collection('Patients')
        patients = list(patients_collection.find({"user_id": str(user["_id"])}))
        
        # Format the results and remove ObjectId
        formatted_patients = []
        for patient in patients:
            formatted_patients.append({
                "patient_name": patient["name"]
            })
        
        return formatted_patients

    def add_patient(self, email, patient_name):
        try:
            users_collection = self.mongo.db['User']
            user = users_collection.find_one({"email": email})
            
            if not user:
                return False
            
            patients_collection = self.mongo.db.get_collection('Patients')
            
            # Check if patient already exists for this user
            existing_patient = patients_collection.find_one({
                "user_id": str(user["_id"]),
                "name": patient_name
            })
            
            if existing_patient:
                return True  # Patient already exists, no need to add
            
            # Add new patient
            patients_collection.insert_one({
                "user_id": str(user["_id"]),
                "name": patient_name,
                "created_at": datetime.now(timezone.utc)
            })
            
            return True
        except Exception as e:
            print(f"Error adding patient: {e}")
            return False

    def delete_patient(self, email, patient_name):
        try:
            users_collection = self.mongo.db['User']
            user = users_collection.find_one({"email": email})
            
            if not user:
                return False
            
            # Delete from Patients collection
            patients_collection = self.mongo.db.get_collection('Patients')
            patients_collection.delete_many({
                "user_id": str(user["_id"]),
                "name": patient_name
            })
            
            # Also remove associated records from MortalityRecords
            mortality_records = self.mongo.db['MortalityRecords']
            mortality_records.delete_many({
                "user_id": str(user["_id"]),
                "patient_name": patient_name
            })
            
            # Also remove associated records from ReadmissionRecords if it exists
            collection_names = self.mongo.db.list_collection_names()
            if 'ReadmissionRecords' in collection_names:
                readmission_records = self.mongo.db['ReadmissionRecords']
                readmission_records.delete_many({
                    "user_id": str(user["_id"]),
                    "patient_name": patient_name
                })
            
            return True
        except Exception as e:
            print(f"Error deleting patient: {e}")
            return False
        
    def add_readmission(self, email, prediction_record):
        users_collection = self.mongo.db['User']  # Access the collection
        user = users_collection.find_one({"email": email})
        record = {
            "user_id": str(user["_id"]),
            "patient_name": prediction_record.patient_name,
            "features": prediction_record.features,
            "prediction": prediction_record.prediction,
            "created_at": datetime.now(timezone.utc)
        }
        readmission_record_collection = self.mongo.db['ReadmissionRecords']  # Access the collection
        readmission_record_collection.insert_one(record)

    def get_readmission_records(self, email):
        users_collection = self.mongo.db['User']
        user = users_collection.find_one({"email": email})
        
        if not user:
            return []
        
        # Check if ReadmissionRecords collection exists
        collection_names = self.mongo.db.list_collection_names()
        if 'ReadmissionRecords' not in collection_names:
            return []
        
        # Get all readmission records for this user
        records = list(self.mongo.db['ReadmissionRecords'].find(
            {"user_id": str(user["_id"])}
        ))
        
        # Format records for JSON serialization
        formatted_records = []
        for record in records:
            # Convert ObjectId to string
            if '_id' in record:
                record['_id'] = str(record['_id'])
            
            # Format the timestamp to a readable string
            if 'created_at' in record:
                # Convert UTC time to local timezone
                utc_time = record['created_at']
                local_time = utc_time.replace(tzinfo=timezone.utc).astimezone()
                record['created_at'] = local_time.strftime('%Y-%m-%d %H:%M:%S')
            
            formatted_records.append(record)
        
        return formatted_records

    def get_mortality_records(self, email):
        users_collection = self.mongo.db['User']
        user = users_collection.find_one({"email": email})
        
        if not user:
            return []
        
        # Get all mortality records for this user
        records = list(self.mongo.db['MortalityRecords'].find(
            {"user_id": str(user["_id"])}
        ))
        
        # Format records for JSON serialization
        formatted_records = []
        for record in records:
            # Convert ObjectId to string
            if '_id' in record:
                record['_id'] = str(record['_id'])
            
            # Format the timestamp to a readable string
            if 'created_at' in record:
                # Convert UTC time to local timezone
                utc_time = record['created_at']
                local_time = utc_time.replace(tzinfo=timezone.utc).astimezone()
                record['created_at'] = local_time.strftime('%Y-%m-%d %H:%M:%S')
            
            formatted_records.append(record)
        
        return formatted_records

# for navbar
    def get_user_info(self, email):
        users_collection = self.mongo.db['User']
        user = users_collection.find_one({"email": email})
    
        if user:
            # Return user info without sensitive data like password
            return {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "id": str(user.get("_id", ""))
            }
        return None