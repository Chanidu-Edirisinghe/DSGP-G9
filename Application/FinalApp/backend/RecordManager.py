import csv
from io import StringIO
from datetime import datetime
from flask import make_response, jsonify

class RecordManager:
    def __init__(self, db_handler):
        self.db_handler = db_handler
    
    def get_records(self, user_email, record_type):
        """Get records of a specific type for a user"""
        if record_type == "readmission":
            return self.db_handler.get_readmission_records(user_email)
        elif record_type == "mortality":
            return self.db_handler.get_mortality_records(user_email)
        return []
    
    def generate_csv(self, user_email, record_type):
        """Generate a CSV file from user records"""
        try:
            # Get records from database
            records = self.get_records(user_email, record_type)
            
            if not records or len(records) == 0:
                return {"error": f"No {record_type} records found"}, 404
                
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
                    hosp_death = prediction.get("prediction")
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
                            # ... other sources
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
            return {"error": f"Failed to generate {record_type} CSV: {str(e)}"}, 500
