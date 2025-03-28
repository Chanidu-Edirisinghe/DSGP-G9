from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.events import SlotSet
from typing import Any, Dict, List, Text, Optional
import re
from rasa_sdk import Action
from rasa_sdk.events import SlotSet


class ValidateDiabetesForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_diabetes_classification_form"
    
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

    def validate_high_blood_pressure(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        print("Inside validate_high_blood_pressure")

        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"high_blood_pressure": None, "requested_slot": None} 
        

        # Validate the input
        if normalized_value in ["yes", "y", "1"]:
            print("Set high_blood_pressure to 1")
            return {"high_blood_pressure": "1"}
        elif normalized_value in ["no", "n", "0"]:
            print("Set high_blood_pressure to 0")
            return {"high_blood_pressure": "0"}
        else:
            print("Invalid input for high_blood_pressure")
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"high_blood_pressure": None}
        
    def validate_high_cholesterol(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        print("Inside validate_high_cholesterol")

        if tracker.latest_message['intent'].get('name') == "quit": 
            print("Inside quit condition")            
            return {"high_cholesterol": None, "requested_slot": None} 

        
        # Validate the input
        if normalized_value in ["yes", "y", "1"]:
            print("Set high_cholesterol to 1")
            return {"high_cholesterol": "1"}
        elif normalized_value in ["no", "n", "0"]:
            print("Set high_cholesterol to 0")
            return {"high_cholesterol": "0"}
        else:
            print("Invalid input for high_cholesterol")
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"high_cholesterol": None}

    def validate_bmi(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        print("Inside validate_bmi")


        if tracker.latest_message['intent'].get('name') == "quit":    
            print("Inside quit condition")         
            return {"bmi": None, "requested_slot": None} 

        try:
            bmi_value = float(value)
            if bmi_value <= 0 or bmi_value > 100:  # Check for invalid BMI ranges
                dispatcher.utter_message(text="Please provide a valid BMI value between 0 and 100.")
                return {"bmi": None}
            return {"bmi": bmi_value}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric BMI value.")
            return {"bmi": None}   

    def validate_smoker(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces

        # if tracker.latest_message['intent'].get('name') == "quit":
        #     all_slots = {slot: None for slot in tracker.slots.keys()}
        #     all_slots["requested_slot"] = None
        #     return all_slots
        
        if tracker.latest_message['intent'].get('name') == "quit":             
            return {"smoker": None, "requested_slot": None} 

        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y" "1"]:
            return {"smoker": "1"}
        elif normalized_value in ["no", "n","0"]:
            return {"smoker": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"smoker": None}
    
    def validate_physical_activity(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"physical_activity": "1"}
        elif normalized_value in ["no", "n"]:
            return {"physical_activity": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"physical_activity": None}  
    
    def validate_fruits(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"fruits": "1"}
        elif normalized_value in ["no", "n"]:
            return {"fruits": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"fruits": None}  

    def validate_veggies(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"veggies": "1"}
        elif normalized_value in ["no", "n"]:
            return {"veggies": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"veggies": None}
        
    def validate_mentHealth(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            mentHealth_value = float(value)
            if mentHealth_value <= 0 or mentHealth_value > 30:  
                dispatcher.utter_message(text="Please provide a valid number of days between 0 and 30.")
                return {"mentHealth": None}
            return {"mentHealth": mentHealth_value}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric value.")
            return {"mentHealth": None}

    def validate_diffWalk(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"diffWalk": "1"}
        elif normalized_value in ["no", "n"]:
            return {"diffWalk": "0"}
        else:
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"diffWalk": None}

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
            
            if age_value >= 18 and age_value <= 24:
                return {"age": 1}
            elif age_value >= 25 and age_value <= 29:
                return {"age": 2}
            elif age_value >= 30 and age_value <= 34:
                return {"age": 3}
            elif age_value >= 35 and age_value <= 39:
                return {"age": 4}
            elif age_value >= 40 and age_value <= 44:
                return {"age": 5}
            elif age_value >= 45 and age_value <= 49:
                return {"age": 6}
            elif age_value >= 50 and age_value <= 54:
                return {"age": 7}
            elif age_value >= 55 and age_value <= 59:
                return {"age": 8}
            elif age_value >= 60 and age_value <= 64:
                return {"age": 9}
            elif age_value >= 65 and age_value <= 69:
                return {"age": 10}
            elif age_value >= 70 and age_value <= 74:
                return {"age": 11}
            elif age_value >= 75 and age_value <= 79:
                return {"age": 12}
            elif age_value >= 80 and age_value <= 99:
                return {"age": 13}
            else:
                dispatcher.utter_message(text="Please provide a valid age value between 18 and 100.")
                return {"age": None}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric age value.")
            return {"age": None}  

    # def validate_income(
    #     self,
    #     value: Text,
    #     dispatcher: CollectingDispatcher,
    #     tracker: Tracker,
    #     domain: DomainDict,
    # ) -> Dict[Text, Any]:
    #     try:
    #         income_value = float(value)
            
    #         if income_value >= 0 and income_value < 10000:
    #             return {"income": 1}
    #         elif income_value >= 10000 and income_value < 15000:
    #             return {"income": 2}
    #         elif income_value >= 15000 and income_value < 20000:
    #             return {"income": 3}
    #         elif income_value >= 20000 and income_value < 25000:
    #             return {"income": 4}
    #         elif income_value >= 25000 and income_value < 35000:
    #             return {"income": 5}
    #         elif income_value >= 35000 and income_value < 50000:
    #             return {"income": 6}
    #         elif income_value >= 50000 and income_value < 75000:
    #             return {"income": 7}
    #         elif income_value >= 75000:
    #             return {"income": 8}
    #         else:
    #             dispatcher.utter_message(text="Please provide a valid income value between $0 and $75000.")
    #             return {"income": None}
    #     except ValueError:
    #         dispatcher.utter_message(text="Please provide a numeric income value.")
    #         return {"income": None}  
        

class ActionClearSlots(Action):
    def name(self) -> str:
        return "action_clear_slots"

    def run(self, dispatcher, tracker, domain):
        return [SlotSet("high_blood_pressure", None),
                SlotSet("high_cholesterol", None),
                SlotSet("bmi", None),
                SlotSet("smoker", None),
                SlotSet("physical_activity", None),
                SlotSet("fruits", None),
                SlotSet("veggies", None),
                SlotSet("mentHealth", None),
                SlotSet("diffWalk", None),
                SlotSet("sex", None),
                SlotSet("age", None)]


class ActionSubmitDetails(Action):
    def name(self) -> str:
        return "action_submit_details"

    def run(self, dispatcher, tracker, domain):
        # Check if all the slot values are not None and send the details to the API
        slot_values = tracker.current_slot_values()