from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.events import SlotSet
from typing import Any, Dict, List, Text, Optional
import re
from rasa_sdk import Action
from rasa_sdk.events import SlotSet


class ValidateReadmissionForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_diabetes_readmission_form"

    async def required_slots(
            self,
            domain_slots: List[Text],
            dispatcher: "CollectingDispatcher",
            tracker: "Tracker",
            domain: "DomainDict",
        ) -> List[Text]:

        # Get all current slot values from the tracker
        current_slots = tracker.current_slot_values()
        
        # Print the slots and their values
        print("Current slots and values:")
        for slot_name, slot_value in current_slots.items():
            print(f"  {slot_name}: {slot_value}")

        print(f"Domain slots:{domain_slots}")
        
        # Return the copied list of required slots
        updated_slots = domain_slots.copy()
        return updated_slots
    
    def validate_continue_form(
        self,   
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        print("Inside validate_continue_form")

        # Validate the input
        if normalized_value in ["yes"]:
            print("Continue with form")
            return {"continue_form": "yes"}
        elif normalized_value in ["no"]:
            print("End form")
            return {"continue_form": "no", "requested_slot": None}
        else:
            print("Invalid input")
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"continue_form": None}

    def validate_race(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"race": None}
            
        try:
            race_value = int(value)
            if 1 <= race_value <= 5:
                return {"race": str(race_value)}
            else:
                dispatcher.utter_message(response="utter_ask_race")
                return {"race": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_race")
            return {"race": None}
        
    def validate_sex(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["male", "m"]:
            return {"sex": "1"}
        elif normalized_value in ["female", "f"]:
            return {"sex": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'male' or 'female'.")
            return {"sex": None}
        
    def validate_age(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            age_value = float(value)
            
            if 0 <= age_value < 10:
                return {"age": 0}
            elif 10 <= age_value < 20:
                return {"age": 1}
            elif 20 <= age_value < 30:
                return {"age": 2}
            elif 30 <= age_value < 40:
                return {"age": 3}
            elif 40 <= age_value < 50:
                return {"age": 4}
            elif 50 <= age_value < 60:
                return {"age": 5}
            elif 60 <= age_value < 70:
                return {"age": 6}
            elif 70 <= age_value < 80:
                return {"age": 7}
            elif 80 <= age_value < 90:
                return {"age": 8}
            elif 90 <= age_value < 100:
                return {"age": 9}
            else:
                dispatcher.utter_message(text="Please provide a valid age value between 0 and 100.")
                return {"age": None}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric age value.")
            return {"age": None}
        
    def validate_admission_type(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"admission_type": None}
            
        try:
            admission_type_value = int(value)
            if 1 <= admission_type_value <= 6:
                return {"admission_type": str(admission_type_value)}
            else:
                dispatcher.utter_message(response="utter_ask_admission_type")
                return {"admission_type": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_admission_type")
            return {"admission_type": None}

    def validate_admission_source(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"admission_source": None}
            
        try:
            admission_source_value = int(value)
            if 1 <= admission_source_value <= 15:
                return {"admission_source": str(admission_source_value)}
            else:
                dispatcher.utter_message(response="utter_ask_admission_source")
                return {"admission_source": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_admission_source")
            return {"admission_source": None}
    
    def validate_time_in_hospital(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            time_in_hospital_value = int(value)
            if 1 <= time_in_hospital_value <= 30:   # used 30 days as the maximum time in hospital
                return {"time_in_hospital": str(time_in_hospital_value)}
            else:
                dispatcher.utter_message(response="utter_ask_time_in_hospital")
                return {"time_in_hospital": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_time_in_hospital")
            return {"time_in_hospital": None}

    def validate_num_lab_procedures(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            num_lab_procedures_value = int(value)
            if 1 <= num_lab_procedures_value <= 150:   # used 150 as the maximum number of lab procedures
                return {"num_lab_procedures": str(num_lab_procedures_value)}
            else:
                dispatcher.utter_message(response="utter_ask_num_lab_procedures")
                return {"num_lab_procedures": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_num_lab_procedures")
            return {"num_lab_procedures": None}

    def validate_num_procedures(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            num_procedures_value = int(value)
            if 0 <= num_procedures_value <= 10:   # used 10 as the maximum number of procedures
                return {"num_procedures": str(num_procedures_value)}
            else:
                dispatcher.utter_message(response="utter_ask_num_procedures")
                return {"num_procedures": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_num_procedures")
            return {"num_procedures": None}

    def validate_num_medications(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            num_medications_value = int(value)
            if 1 <= num_medications_value <= 100:   # used 100 as the maximum number of medications
                return {"num_medications": str(num_medications_value)}
            else:
                dispatcher.utter_message(response="utter_ask_num_medications")
                return {"num_medications": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_num_medications")
            return {"num_medications": None}

    def validate_number_outpatient(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            number_outpatient_value = int(value)
            if 0 <= number_outpatient_value <= 60:   # used 60 as the maximum number of outpatient visits
                return {"number_outpatient": str(number_outpatient_value)}
            else:
                dispatcher.utter_message(response="utter_ask_number_outpatient")
                return {"number_outpatient": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_number_outpatient")
            return {"number_outpatient": None}

    def validate_number_inpatient(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            number_inpatient_value = int(value)
            if 0 <= number_inpatient_value <= 40:   # used 40 as the maximum number of inpatient visits
                return {"number_inpatient": str(number_inpatient_value)}
            else:
                dispatcher.utter_message(response="utter_ask_number_inpatient")
                return {"number_inpatient": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_number_inpatient")
            return {"number_inpatient": None}

    def validate_number_emergency(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            number_emergency_value = int(value)
            if 0 <= number_emergency_value <= 100:   # used 100 as the maximum number of emergency visits
                return {"number_emergency": str(number_emergency_value)}
            else:
                dispatcher.utter_message(response="utter_ask_number_emergency")
                return {"number_emergency": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_number_emergency")
            return {"number_emergency": None}

    def validate_metformin(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"metformin": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"metformin": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_metformin")
                return {"metformin": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_metformin")
            return {"metformin": None}

    def validate_glipizide(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"glipizide": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"glipizide": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_glipizide")
                return {"glipizide": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_glipizide")
            return {"glipizide": None}

    def validate_piozlitazone(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"pioglitazone": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"pioglitazone": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_pioglitazone")
                return {"pioglitazone": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_pioglitazone")
            return {"pioglitazone": None}

    def validate_rosiglitazone(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"rosiglitazone": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"rosiglitazone": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_rosiglitazone")
                return {"rosiglitazone": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_rosiglitazone")
            return {"rosiglitazone": None}

    def validate_acarbose(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"acarbose": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"acarbose": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_acarbose")
                return {"acarbose": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_acarbose")
            return {"acarbose": None}

    def validate_insulin(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"insulin": None}
            
        try:
            choice = int(value)
            # Expecting a number between 1 and 4; then subtract 1
            if 1 <= choice <= 4:
                return {"insulin": str(choice - 1)}
            else:
                dispatcher.utter_message(response="utter_ask_insulin")
                return {"insulin": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_insulin")
            return {"insulin": None}

    def validate_change(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"change": None}
            
        try:
            choice = int(value)
            if 1 <= choice <= 2:
                return {"change": str(choice)}
            else:
                dispatcher.utter_message(response="utter_ask_change")
                return {"change": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_change")
            return {"change": None}


    def map_icd9(self, code):
        try:
            code = str(code)
            if code.startswith("250"):
                return "Diabetes"
            elif 390 <= int(code) <= 459 or code == "785":
                return "Circulatory"
            elif 460 <= int(code) <= 519 or code == "786":
                return "Respiratory"
            elif 520 <= int(code) <= 579 or code == "787":
                return "Digestive"
            elif 800 <= int(code) <= 999:
                return "Injury"
            elif 710 <= int(code) <= 739:
                return "Musculoskeletal"
            elif 580 <= int(code) <= 629 or code == "788":
                return "Genitourinary"
            elif 140 <= int(code) <= 239:
                return "Neoplasms"
            else:
                return "Other"
        except ValueError:
            return "Other"

    def validate_diag_1(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"diag_1": None}
            
        try:
            # Extract the first three digits from the entered value
            code = str(value).strip()[:3]
            code_int = int(code)
            if 1 <= code_int <= 999:
                mapped_value = self.map_icd9(code)
                return {"diag_1": mapped_value}
            else:
                dispatcher.utter_message(response="utter_ask_diag_1")
                return {"diag_1": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_diag_1")
            return {"diag_1": None}
        
    def validate_diag_2(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"diag_2": None}
            
        try:
            # Extract the first three digits from the entered value
            code = str(value).strip()[:3]
            code_int = int(code)
            if 1 <= code_int <= 999:
                mapped_value = self.map_icd9(code)
                return {"diag_2": mapped_value}
            else:
                dispatcher.utter_message(response="utter_ask_diag_2")
                return {"diag_2": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_diag_2")
            return {"diag_2": None}

    def validate_diag_3(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        if not value:
            return {"diag_3": None}
            
        try:
            # Extract the first three digits from the entered value
            code = str(value).strip()[:3]
            code_int = int(code)
            if 1 <= code_int <= 999:
                mapped_value = self.map_icd9(code)
                return {"diag_3": mapped_value}
            else:
                dispatcher.utter_message(response="utter_ask_diag_3")
                return {"diag_3": None}
        except ValueError:
            dispatcher.utter_message(response="utter_ask_diag_3")
            return {"diag_3": None}
        
class ActionClearSlots(Action):
    def name(self) -> str:
        return "action_clear_slots"

    def run(self, dispatcher, tracker, domain):
        return [
            SlotSet("race", None),
            SlotSet("sex", None),
            SlotSet("age", None),
            SlotSet("admission_type", None),
            SlotSet("admission_source", None),
            SlotSet("time_in_hospital", None),
            SlotSet("num_lab_procedures", None),
            SlotSet("num_procedures", None),
            SlotSet("num_medications", None),
            SlotSet("number_outpatient", None),
            SlotSet("number_inpatient", None),
            SlotSet("number_emergency", None),
            SlotSet("metformin", None),
            SlotSet("glipizide", None),
            SlotSet("pioglitazone", None),
            SlotSet("rosiglitazone", None),
            SlotSet("acarbose", None),
            SlotSet("insulin", None),
            SlotSet("diag_1", None),
            SlotSet("diag_2", None),
            SlotSet("diag_3", None)
        ]

class ActionSubmitDetails(Action):
    def name(self) -> str:
        return "action_submit_details"

    def run(self, dispatcher, tracker, domain):
        # Check if all the slot values are not None and send the details to the API
        slot_values = tracker.current_slot_values()
        dispatcher.utter_message(text="Submitting the details to the API...")
        return []
    

