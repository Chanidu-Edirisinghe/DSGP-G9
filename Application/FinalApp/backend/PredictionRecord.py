from datetime import datetime

class PredictionRecord:
    def __init__(self, user_id, patient_name, features, prediction, record_type, created_at=None):
        self.user_id = user_id
        self.patient_name = patient_name
        self.features = features
        self.prediction = prediction
        self.record_type = record_type  # 'mortality' or 'readmission'
        self.created_at = created_at or datetime.now()
    
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "patient_name": self.patient_name,
            "features": self.features,
            "prediction": self.prediction,
            "record_type": self.record_type,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data.get("user_id"),
            patient_name=data.get("patient_name"),
            features=data.get("features"),
            prediction=data.get("prediction"),
            record_type=data.get("record_type", "unknown"),
            created_at=data.get("created_at")
        )
