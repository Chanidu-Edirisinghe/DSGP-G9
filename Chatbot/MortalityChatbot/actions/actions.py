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
        return "validate_mortality_prediction_form"

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
    
    def validate_age(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            age_value = float(value)
            
            if 10 <= age_value <= 100:
                return {"age": age_value}
            else:
                dispatcher.utter_message(text="Please provide a valid age value between 0 and 100.")
                return {"age": None}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric age value.")
            return {"age": None}
        
    def validate_height(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        print("Inside validate_height")


        if tracker.latest_message['intent'].get('name') == "quit":    
            print("Inside quit condition")         
            return {"height": None, "requested_slot": None} 

        try:
            height_value = float(value)
            if height_value <= 0 or height_value > 100:  # Check for invalid height ranges
                dispatcher.utter_message(text="Please provide a valid height value between 0 and 100.")
                return {"height": None}
            return {"height": height_value}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric height value.")
            return {"height": None} 
        
    def validate_weight(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        print("Inside validate_weight")


        if tracker.latest_message['intent'].get('name') == "quit":    
            print("Inside quit condition")         
            return {"weight": None, "requested_slot": None} 

        try:
            weight_value = float(value)
            if weight_value <= 0 or weight_value > 100:  # Check for invalid weight ranges
                dispatcher.utter_message(text="Please provide a valid weight value between 0 and 100.")
                return {"weight": None}
            return {"wieght": weight_value}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric weight value.")
            return {"weight": None} 


    def validate_d1_diasbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            diasbp_max = float(value)
            if diasbp_max < 30 or diasbp_max > 200:  #
                dispatcher.utter_message(text="Please provide a valid maximum diastolic blood pressure value between 30 and 200 mmHg.")
                return {"d1_diasbp_max": None}
            return {"d1_diasbp_max": diasbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum diastolic blood pressure value.")
            return {"d1_diasbp_max": None}

    def validate_d1_diasbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            diasbp_min = float(value)
            if diasbp_min < 0 or diasbp_min > 150:  
                dispatcher.utter_message(text="Please provide a valid minimum diastolic blood pressure value between 0 and 150 mmHg.")
                return {"d1_diasbp_min": None}
            return {"d1_diasbp_min": diasbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum diastolic blood pressure value.")
            return {"d1_diasbp_min": None}

    def validate_d1_heartrate_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            heartrate_max = float(value)
            if heartrate_max < 40 or heartrate_max > 200:  
                dispatcher.utter_message(text="Please provide a valid maximum heart rate value between 40 and 200 bpm.")
                return {"d1_heartrate_max": None}
            return {"d1_heartrate_max": heartrate_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum heart rate value.")
            return {"d1_heartrate_max": None}

    def validate_d1_heartrate_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            heartrate_min = float(value)
            if heartrate_min < 0 or heartrate_min > 200:  
                dispatcher.utter_message(text="Please provide a valid minimum heart rate value between 0 and 200 bpm.")
                return {"d1_heartrate_min": None}
            return {"d1_heartrate_min": heartrate_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum heart rate value.")
            return {"d1_heartrate_min": None}

    def validate_d1_mbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            mbp_max = float(value)
            if mbp_max < 30 or mbp_max > 200:  
                dispatcher.utter_message(text="Please provide a valid maximum mean blood pressure value between 30 and 200 mmHg.")
                return {"d1_mbp_max": None}
            return {"d1_mbp_max": mbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum mean blood pressure value.")
            return {"d1_mbp_max": None}

    def validate_d1_mbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            mbp_min = float(value)
            if mbp_min < 0 or mbp_min > 150:  
                dispatcher.utter_message(text="Please provide a valid minimum mean blood pressure value between 0 and 150 mmHg.")
                return {"d1_mbp_min": None}
            return {"d1_mbp_min": mbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum mean blood pressure value.")
            return {"d1_mbp_min": None}

    def validate_d1_resprate_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            resprate_max = float(value)
            if resprate_max < 5 or resprate_max > 100:  
                dispatcher.utter_message(text="Please provide a valid maximum respiratory rate value between 5 and 100 bpm.")
                return {"d1_resprate_max": None}
            return {"d1_resprate_max": resprate_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum respiratory rate value.")
            return {"d1_resprate_max": None}
        
    def validate_d1_resprate_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            resprate_min = float(value)
            if resprate_min < 0 or resprate_min > 100:  
                dispatcher.utter_message(text="Please provide a valid minimum respiratory rate value between 0 and 100 bpm.")
                return {"d1_resprate_min": None}
            return {"d1_resprate_min": resprate_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum respiratory rate value.")
            return {"d1_resprate_min": None}

    def validate_d1_spo2_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            spo2_min = float(value)
            if spo2_min < 0 or spo2_min > 100:  
                dispatcher.utter_message(text="Please provide a valid minimum peripheral oxygen saturation value between 0 and 100%.")
                return {"d1_spo2_min": None}
            return {"d1_spo2_min": spo2_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum peripheral oxygen saturation value.")
            return {"d1_spo2_min": None}

    def validate_d1_sysbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            sysbp_max = float(value)
            if sysbp_max < 60 or sysbp_max > 250:  
                dispatcher.utter_message(text="Please provide a valid maximum systolic blood pressure value between 60 and 250 mmHg.")
                return {"d1_sysbp_max": None}
            return {"d1_sysbp_max": sysbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum systolic blood pressure value.")
            return {"d1_sysbp_max": None}

    def validate_d1_sysbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            sysbp_min = float(value)
            if sysbp_min < 30 or sysbp_min > 190:  
                dispatcher.utter_message(text="Please provide a valid minimum systolic blood pressure value between 30 and 190 mmHg.")
                return {"d1_sysbp_min": None}
            return {"d1_sysbp_min": sysbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum systolic blood pressure value.")
            return {"d1_sysbp_min": None}

    def validate_d1_temp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            temp_max = float(value)
            if temp_max < 30 or temp_max > 45:  
                dispatcher.utter_message(text="Please provide a valid maximum core temperature value between 30 and 45°C.")
                return {"d1_temp_max": None}
            return {"d1_temp_max": temp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum core temperature value.")
            return {"d1_temp_max": None}

    def validate_d1_temp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            temp_min = float(value)
            if temp_min < 25 or temp_min > 45:  
                dispatcher.utter_message(text="Please provide a valid minimum core temperature value between 25 and 45°C.")
                return {"d1_temp_min": None}
            return {"d1_temp_min": temp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum core temperature value.")
            return {"d1_temp_min": None}

    def validate_h1_diasbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            diasbp_max = float(value)
            if diasbp_max < 30 or diasbp_max > 175:  
                dispatcher.utter_message(text="Please provide a valid maximum diastolic blood pressure value between 30 and 175 mmHg.")
                return {"h1_diasbp_max": None}
            return {"h1_diasbp_max": diasbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum diastolic blood pressure value.")
            return {"h1_diasbp_max": None}

    def validate_h1_diasbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            diasbp_min = float(value)
            if diasbp_min < 0 or diasbp_min > 140:  
                dispatcher.utter_message(text="Please provide a valid minimum diastolic blood pressure value between 0 and 140 mmHg.")
                return {"h1_diasbp_min": None}
            return {"h1_diasbp_min": diasbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum diastolic blood pressure value.")
            return {"h1_diasbp_min": None}

    def validate_h1_heartrate_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            heartrate_max = float(value)
            if heartrate_max < 30 or heartrate_max > 200:  
                dispatcher.utter_message(text="Please provide a valid maximum heart rate value between 30 and 200 bpm.")
                return {"h1_heartrate_max": None}
            return {"h1_heartrate_max": heartrate_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum heart rate value.")
            return {"h1_heartrate_max": None}

    def validate_h1_heartrate_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            heartrate_min = float(value)
            if heartrate_min < 0 or heartrate_min > 175:  
                dispatcher.utter_message(text="Please provide a valid minimum heart rate value between 0 and 175 bpm.")
                return {"h1_heartrate_min": None}
            return {"h1_heartrate_min": heartrate_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum heart rate value.")
            return {"h1_heartrate_min": None}

    def validate_h1_mbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            mbp_max = float(value)
            if mbp_max < 30 or mbp_max > 200:  
                dispatcher.utter_message(text="Please provide a valid maximum mean blood pressure value between 30 and 200 mmHg.")
                return {"h1_mbp_max": None}
            return {"h1_mbp_max": mbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum mean blood pressure value.")
            return {"h1_mbp_max": None}

    def validate_h1_mbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            mbp_min = float(value)
            if mbp_min < 0 or mbp_min > 150:  
                dispatcher.utter_message(text="Please provide a valid minimum mean blood pressure value between 0 and 150 mmHg.")
                return {"h1_mbp_min": None}
            return {"h1_mbp_min": mbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum mean blood pressure value.")
            return {"h1_mbp_min": None}

    def validate_h1_spo2_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            spo2_max = float(value)
            if spo2_max < 0 or spo2_max > 100:  
                dispatcher.utter_message(text="Please provide a valid maximum peripheral oxygen saturation value between 0 and 100%.")
                return {"h1_spo2_max": None}
            return {"h1_spo2_max": spo2_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum peripheral oxygen saturation value.")
            return {"h1_spo2_max": None}

    def validate_h1_spo2_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            spo2_min = float(value)
            if spo2_min < 0 or spo2_min > 100:  
                dispatcher.utter_message(text="Please provide a valid minimum peripheral oxygen saturation value between 0 and 100%.")
                return {"h1_spo2_min": None}
            return {"h1_spo2_min": spo2_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum peripheral oxygen saturation value.")
            return {"h1_spo2_min": None}

    def validate_h1_resprate_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            resprate_max = float(value)
            if resprate_max < 0 or resprate_max > 100:  
                dispatcher.utter_message(text="Please provide a valid maximum respiratory rate value between 0 and 100 bpm.")
                return {"h1_resprate_max": None}
            return {"h1_resprate_max": resprate_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum respiratory rate value.")
            return {"h1_resprate_max": None}

    def validate_h1_resprate_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            resprate_min = float(value)
            if resprate_min < 0 or resprate_min > 60:  
                dispatcher.utter_message(text="Please provide a valid minimum respiratory rate value between 0 and 60 bpm.")
                return {"h1_resprate_min": None}
            return {"h1_resprate_min": resprate_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum respiratory rate value.")
            return {"h1_resprate_min": None}

    def validate_h1_sysbp_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            sysbp_max = float(value)
            if sysbp_max < 50 or sysbp_max > 250:  
                dispatcher.utter_message(text="Please provide a valid maximum systolic blood pressure value between 50 and 250 mmHg.")
                return {"h1_sysbp_max": None}
            return {"h1_sysbp_max": sysbp_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum systolic blood pressure value.")
            return {"h1_sysbp_max": None}

    def validate_h1_sysbp_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            sysbp_min = float(value)
            if sysbp_min < 0 or sysbp_min > 250:  
                dispatcher.utter_message(text="Please provide a valid minimum systolic blood pressure value between 0 and 250 mmHg.")
                return {"h1_sysbp_min": None}
            return {"h1_sysbp_min": sysbp_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum systolic blood pressure value.")
            return {"h1_sysbp_min": None}

    def validate_d1_potassium_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            potassium_max = float(value)
            if potassium_max < 0 or potassium_max > 10:  
                dispatcher.utter_message(text="Please provide a valid maximum potassium value between 0 and 10 mmol/L.")
                return {"d1_potassium_max": None}
            return {"d1_potassium_max": potassium_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum potassium value.")
            return {"d1_potassium_max": None}

    def validate_d1_potassium_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            potassium_min = float(value)
            if potassium_min < 0 or potassium_min > 10:  
                dispatcher.utter_message(text="Please provide a valid minimum potassium value between 0 and 10 mmol/L.")
                return {"d1_potassium_min": None}
            return {"d1_potassium_min": potassium_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum potassium value.")
            return {"d1_potassium_min": None}

    def validate_d1_glucose_max(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            glucose_max = float(value)
            if glucose_max < 0 or glucose_max > 1000:  
                dispatcher.utter_message(text="Please provide a valid maximum glucose value between 0 and 1000 mg/dL.")
                return {"d1_glucose_max": None}
            return {"d1_glucose_max": glucose_max}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric maximum glucose value.")
            return {"d1_glucose_max": None}

    def validate_d1_glucose_min(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            glucose_min = float(value)
            if glucose_min < 0 or glucose_min > 500:  
                dispatcher.utter_message(text="Please provide a valid minimum glucose value between 0 and 500 mg/dL.")
                return {"d1_glucose_min": None}
            return {"d1_glucose_min": glucose_min}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric minimum glucose value.")
            return {"d1_glucose_min": None}



class ActionSubmitDetails(Action):
    def name(self) -> str:
        return "action_submit_details"

    def run(self, dispatcher, tracker, domain):
        # Check if all the slot values are not None and send the details to the API
        slot_values = tracker.current_slot_values()
        dispatcher.utter_message(text="Submitting the details to the API...")
        return []
    


