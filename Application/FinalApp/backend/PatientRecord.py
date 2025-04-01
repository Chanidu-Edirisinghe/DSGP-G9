from datetime import datetime

class PatientRecord:
    def __init__(self, patient_name, user_id, created_at=None):
        self.patient_name = patient_name
        self.user_id = user_id
        self.created_at = created_at or datetime.now()
    
    def to_dict(self):
        return {
            "name": self.patient_name,
            "user_id": self.user_id,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            patient_name=data.get("name"),
            user_id=data.get("user_id"),
            created_at=data.get("created_at")
        )

