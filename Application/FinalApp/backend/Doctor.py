from PatientRecord import PatientRecord
from PredictionRecord import PredictionRecord

class Doctor:
  def __init__(self, id, name, email, patientRecords=None):
    self.id = id
    self.name = name
    # self.password = password
    self.email = email
    self.patientRecords = patientRecords or []
  
  def addPatient(self, db_handler, patient_name):
    """Add a new patient to the doctor's records"""
    result = db_handler.add_patient(self.email, patient_name)
    if result:
      new_patient = PatientRecord(patient_name, self.id)
      self.patientRecords.append(new_patient)
    return result
  
  def deletePatient(self, db_handler, patient_name):
    """Remove a patient from the doctor's records"""
    result = db_handler.delete_patient(self.email, patient_name)
    if result:
      self.patientRecords = [p for p in self.patientRecords if p.patient_name != patient_name]
    return result
  
  def getAllPatients(self, db_handler):
    """Get all patients for this doctor"""
    return db_handler.get_patients(self.email)
  
  def addPredictionRecord(self, db_handler, record):
    """Add a prediction record for a patient"""
    record_type = record.record_type
    
    if record_type == "mortality":
      db_handler.add_mortality(self.email, record)
    elif record_type == "readmission":
      db_handler.add_readmission(self.email, record)
    
    return record
  
  def getPredictionRecords(self, db_handler, record_type):
    """Get all prediction records of a specific type for this doctor"""
    if record_type == "mortality":
      return db_handler.get_mortality_records(self.email)
    elif record_type == "readmission":
      return db_handler.get_readmission_records(self.email)
    return []

  @property
  def user_id(self):
      return self._id

  @property
  def name(self):
      return self._name

  @name.setter
  def name(self, new_name):
      if isinstance(new_name, str) and new_name.strip():
          self._name = new_name
      else:
          raise ValueError("Invalid name!")

  @property
  def email(self):
      return self._email

  @email.setter
  def email(self, new_email):
      if isinstance(new_email, str) and "@" in new_email:
          self._email = new_email
      else:
          raise ValueError("Invalid email format!")

  @property
  def patientRecords(self):
      return self._patientRecords

  @patientRecords.setter
  def patientRecords(self, records):
      if isinstance(records, list):
          self._patientRecords = records
      else:
          raise TypeError("patientRecords must be a list!")
