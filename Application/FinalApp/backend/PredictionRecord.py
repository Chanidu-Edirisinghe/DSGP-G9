from datetime import datetime

class PredictionRecord:
    def __init__(self, doctor_id, patient_name, features, prediction, record_type, created_at=None):
        self.doctor_id = doctor_id
        self.patient_name = patient_name
        self.features = features
        self.prediction = prediction
        self.record_type = record_type  # 'mortality' or 'readmission'
        self.created_at = created_at or datetime.now()
    
    def to_dict(self):
        return {
            "doctor_id": self.doctor_id,
            "patient_name": self.patient_name,
            "features": self.features,
            "prediction": self.prediction,
            "record_type": self.record_type,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data.get("doctor_id"),
            patient_name=data.get("patient_name"),
            features=data.get("features"),
            prediction=data.get("prediction"),
            record_type=data.get("record_type", "unknown"),
            created_at=data.get("created_at")
        )

    @property
    def doctor_id(self):
        return self.doctor_id
    
    @doctor_id.setter
    def doctor_id(self, value):
        self._doctor_id = value
    
    @property
    def patient_name(self):
        return self._patient_name
    
    @patient_name.setter
    def patient_name(self, value):
        self._patient_name = value
    
    @property
    def features(self):
        return self._features
    
    @features.setter
    def features(self, value):
        self._features = value

    @property
    def prediction(self):
        return self._prediction
    
    @prediction.setter
    def prediction(self, value):
        self._prediction = value
    
    @property
    def record_type(self):
        return self._record_type
    
    @record_type.setter
    def record_type(self, value):
        if value in ["mortality", "readmission"]:
            self._record_type = value
        else:
            raise ValueError("Invalid record type! Must be 'mortality' or 'readmission'.")
    
    @property
    def created_at(self):
        return self._created_at
    
    @created_at.setter
    def created_at(self, value):
        self._created_at = value
    