class Doctor:
  def __init__(self, id, name, password, email, patientRecords):
    self.id = id
    self.name = name
    self.password = password
    self.email = email
    self.patientRecords = patientRecords

  def getPatientRecords(self):
    return self.patientRecords