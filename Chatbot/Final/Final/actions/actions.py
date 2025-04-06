from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.types import DomainDict
from typing import Any, Dict, List, Text, Optional
import requests
import re
from typing import Text, List, Dict, Any
from rasa_sdk import Action, Tracker
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk.events import SlotSet
import logging


class ActionProvideDiabetesTypesInfo(Action):
    def name(self) -> str:
        return "action_diabetes_types_info"

    def run(self, dispatcher, tracker, domain):
        diabetes_type = tracker.get_slot('diabetes_type')

        if diabetes_type:
            diabetes_type = diabetes_type.lower()
            if "1" in diabetes_type or "one" in diabetes_type:
              diabetes_type = "type 1"
            elif "2" in diabetes_type or "two" in diabetes_type:
              diabetes_type = "type 2"

        if diabetes_type == "type 1":
            dispatcher.utter_message(response="utter_type1_diabetes_information")
        elif diabetes_type == "type 2":
            dispatcher.utter_message(response="utter_type2_diabetes_information")
        else:
           dispatcher.utter_message(text="I am unsure about the type of diabetes you are asking about. Please specify type 1 or type 2.")
                
        return []

class ActionProvideDiabetesTypesSymptoms(Action):
    def name(self) -> str:
        return "action_diabetes_types_symptoms"

    def run(self, dispatcher, tracker, domain):
        diabetes_type = tracker.get_slot('diabetes_type')

        if diabetes_type:
            diabetes_type = diabetes_type.lower()
            if "1" in diabetes_type or "one" in diabetes_type:
              diabetes_type = "type 1"
            elif "2" in diabetes_type or "two" in diabetes_type:
              diabetes_type = "type 2"

        if diabetes_type == "type 1":
            dispatcher.utter_message(response="utter_type1_diabetes_symptoms")
        elif diabetes_type == "type 2":
            dispatcher.utter_message(response="utter_type2_diabetes_symptoms")
        else:
           dispatcher.utter_message(text="I am unsure about the type of diabetes you are asking about. Please specify type 1 or type 2.")
                
        return []

class ActionProvideDiabetesTypesRiskFactors(Action):
    def name(self) -> str:
        return "action_diabetes_types_risk_factors"

    def run(self, dispatcher, tracker, domain):
        diabetes_type = tracker.get_slot('diabetes_type')

        if diabetes_type:
            diabetes_type = diabetes_type.lower()
            if "1" in diabetes_type or "one" in diabetes_type:
              diabetes_type = "type 1"
            elif "2" in diabetes_type or "two" in diabetes_type:
              diabetes_type = "type 2"

        if diabetes_type == "type 1":
            dispatcher.utter_message(response="utter_type1_diabetes_risk_factors")
        elif diabetes_type == "type 2":
            dispatcher.utter_message(response="utter_type2_diabetes_risk_factors")
        else:
           dispatcher.utter_message(text="I am unsure about the type of diabetes you are asking about. Please specify type 1 or type 2.")
                
        return []

class ActionProvideDiabetesTypesCauses(Action):
    def name(self) -> str:
        return "action_diabetes_types_causes"

    def run(self, dispatcher, tracker, domain):
        diabetes_type = tracker.get_slot('diabetes_type')

        if diabetes_type:
            diabetes_type = diabetes_type.lower()
            if "1" in diabetes_type or "one" in diabetes_type:
              diabetes_type = "type 1"
            elif "2" in diabetes_type or "two" in diabetes_type:
              diabetes_type = "type 2"

        if diabetes_type == "type 1":
            dispatcher.utter_message(response="utter_type1_diabetes_causes")
        elif diabetes_type == "type 2":
            dispatcher.utter_message(response="utter_type2_diabetes_causes")
        else:
           dispatcher.utter_message(text="I am unsure about the type of diabetes you are asking about. Please specify type 1 or type 2.")
                
        return []

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
            return {"high_blood_pressure": None, "continue_form": None} 
        

        # Validate the input
        if normalized_value in ["yes", "y"]:
            print("Set high_blood_pressure to 1")
            return {"high_blood_pressure": "yes"}
        elif normalized_value in ["no", "n"]:
            print("Set high_blood_pressure to 0")
            return {"high_blood_pressure": "no"}
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
            return {"high_cholesterol": None, "continue_form": None} 

        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            print("Set high_cholesterol to 1")
            return {"high_cholesterol": "yes"}
        elif normalized_value in ["no", "n"]:
            print("Set high_cholesterol to 0")
            return {"high_cholesterol": "no"}
        else:
            print("Invalid input for high_cholesterol")
            dispatcher.utter_message(text="Invalid input. Please respond with 'yes' or 'no'.")
            return {"high_cholesterol": None}
        

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
            return {"height": None, "continue_form": None} 

        try:
            height_value = float(value)
            if height_value <= 50 or height_value > 272:  # Check for invalid height ranges
                dispatcher.utter_message(text="Please provide a valid height in cm.")
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
            return {"weight": None, "continue_form": None} 

        try:
            weight_value = float(value)
            if weight_value <= 3 or weight_value > 635:  # Check for invalid weight ranges
                dispatcher.utter_message(text="Please provide a valid weight value in kg.")
                return {"weight": None}
            return {"weight": weight_value}
        except ValueError:
            dispatcher.utter_message(text="Please provide a numeric weight value.")
            return {"weight": None} 

    # def validate_bmi(
    #     self,
    #     value: Text,
    #     dispatcher: CollectingDispatcher,
    #     tracker: Tracker,
    #     domain: DomainDict,
    # ) -> Dict[Text, Any]:
        
    #     print("Inside validate_bmi")


    #     if tracker.latest_message['intent'].get('name') == "quit":    
    #         print("Inside quit condition")         
    #         return {"bmi": None, "requested_slot": None} 

    #     try:
    #         bmi_value = float(value)
    #         if bmi_value <= 0 or bmi_value > 100:  # Check for invalid BMI ranges
    #             dispatcher.utter_message(text="Please provide a valid BMI value between 0 and 100.")
    #             return {"bmi": None}
    #         return {"bmi": bmi_value}
    #     except ValueError:
    #         dispatcher.utter_message(text="Please provide a numeric BMI value.")
    #         return {"bmi": None}   

    def validate_smoker(
        self,
        value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        # Normalize the input to lowercase and strip spaces

        if tracker.latest_message['intent'].get('name') == "quit":             
            return {"smoker": None, "continue_form": None} 

        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"smoker": "yes"}
        elif normalized_value in ["no", "n"]:
            return {"smoker": "no"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"physical_activity": None, "continue_form": None} 
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"physical_activity": "yes"}
        elif normalized_value in ["no", "n"]:
            return {"physical_activity": "no"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"fruits": None, "continue_form": None} 
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"fruits": "yes"}
        elif normalized_value in ["no", "n"]:
            return {"fruits": "no"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"veggies": None, "continue_form": None} 
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"veggies": "yes"}
        elif normalized_value in ["no", "n"]:
            return {"veggies": "no"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"mentHealth": None, "continue_form": None} 
        try:
            mentHealth_value = int(value)
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"diffWalk": None, "continue_form": None} 
        normalized_value = value.lower().strip()
        
        # Validate the input
        if normalized_value in ["yes", "y"]:
            return {"diffWalk": "yes"}
        elif normalized_value in ["no", "n"]:
            return {"diffWalk": "no"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"sex": None, "continue_form": None} 
        
        # Validate the input
        if normalized_value in ["male", "m"]:
            return {"sex": "male"}
        elif normalized_value in ["female", "f"]:
            return {"sex": "female"}
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
        if tracker.latest_message['intent'].get('name') == "quit":  
            print("Inside quit condition")           
            return {"age": None, "continue_form": None} 
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
                SlotSet("height", None),
                SlotSet("weight", None),
                SlotSet("smoker", None),
                SlotSet("physical_activity", None),
                SlotSet("fruits", None),
                SlotSet("veggies", None),
                SlotSet("mentHealth", None),
                SlotSet("diffWalk", None),
                SlotSet("sex", None),
                SlotSet("age", None),
                SlotSet("continue_form", "yes")]

class ActionSubmitDetails(Action):
    def name(self) -> str:
        return "action_submit_details"

    def run(self, dispatcher, tracker, domain):
        # Check if all the slot values are not None and send the details to the API
        required_slots = [
            "age", "sex", "height", "weight", "high_blood_pressure",
            "high_cholesterol", "smoker", "physical_activity", "fruits",
            "veggies", "mentHealth", "diffWalk"
        ]
        
        try:
            slot_values = {slot: tracker.get_slot(slot) for slot in required_slots}
            
            if all(slot_values.values()):
                try:
                    response = requests.post(
                        "http://127.0.0.1:5000/chatbot-diabetes-prediction",
                        json=slot_values,
                        timeout=10  # Add timeout to prevent hanging
                    )
                    
                    # Check if the request was successful
                    response.raise_for_status()
                    
                    result = response.json()
                    prediction = result.get('prediction')
                    probability = result.get('probability')
                    
                    if prediction == 0:
                        advice = "You are not at risk for diabetes. Maintain a healthy lifestyle with a balanced diet, regular exercise, and routine checkups."
                    elif prediction == 1:
                        advice = "You may have prediabetes. Prevent diabetes by eating healthy, exercising regularly, managing weight, and reducing sugar intake. Consult a doctor for guidance."
                    elif prediction == 2:
                        advice = "You may have diabetes. Consult a doctor about having a fasting blood glucose test. Act now to manage your health."
                    else:
                        advice = "Error in prediction"
                    
                    # Include probability in the message
                    message = f"Based on your information, the analysis shows: {advice}"
                    # message = f"Based on your information, the analysis shows: {advice} (Confidence: {probability:.1%})"
                    dispatcher.utter_message(text=message)
                    
                except requests.exceptions.ConnectionError:
                    dispatcher.utter_message(text="Sorry, I couldn't connect to the diabetes prediction service. Please try again later.")
                except requests.exceptions.Timeout:
                    dispatcher.utter_message(text="The prediction service is taking too long to respond. Please try again later.")
                except requests.exceptions.HTTPError as http_err:
                    dispatcher.utter_message(text=f"There was a problem with the prediction service.")
                except requests.exceptions.RequestException:
                    dispatcher.utter_message(text="There was an unexpected error when trying to make the prediction.")
                except (ValueError, KeyError, TypeError):
                    dispatcher.utter_message(text="I received an invalid response from the prediction service.")
            else:
                dispatcher.utter_message(response="utter_form_exit")
                
        except Exception as e:
            dispatcher.utter_message(text=f"I'm sorry, something went wrong processing your information. Please try again.")
            logging.error(f"Unexpected error in action_submit_details: {str(e)}")
        
        return []
