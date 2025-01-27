from rasa_sdk import Action
from rasa_sdk.events import SlotSet

class ActionSubmitDiabetesForm(Action):
    def name(self):
        return "action_submit_diabetes_form"

    def run(self, dispatcher, tracker, domain):
        # Get the user's response to high blood pressure and cholesterol
        high_blood_pressure = tracker.get_slot("high_blood_pressure")
        high_cholesterol = tracker.get_slot("high_cholesterol")

        # Do any necessary processing with the slot values, like making predictions

        return []
