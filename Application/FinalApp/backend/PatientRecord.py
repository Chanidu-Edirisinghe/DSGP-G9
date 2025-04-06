from datetime import datetime

class PatientRecord:
    def __init__(self, patient_name, doctor_id, created_at=None):
        self.patient_name = patient_name
        self.doctor_id = doctor_id
        self.created_at = created_at or datetime.now()
    
    def to_dict(self):
        return {
            "name": self.patient_name,
            "doctor_id": self.doctor_id,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            patient_name=data.get("name"),
            doctor_id=data.get("doctor_id"),
            created_at=data.get("created_at")
        )

    @property
    def patient_name(self):
        return self._patient_name

    @patient_name.setter
    def patient_name(self, value):
        self._patient_name = value

    @property
    def doctor_id(self):
        return self._doctor_id
    
    @doctor_id.setter
    def doctor_id(self, value):
        self._doctor_id = value

    @property
    def created_at(self):
        return self._created_at

    @created_at.setter
    def created_at(self, value):
        self._created_at = value
