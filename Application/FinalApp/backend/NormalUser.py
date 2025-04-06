class NormalUser:
    """
    Class to handle operations that do not require authentication,
    such as chatbot interactions and diabetes classification.
    """
    
    def __init__(self, chatbot_handler=None, diabetes_classifier=None):
        """
        Initialize the NormalUser with necessary handlers
        
        Args:
            chatbot_handler: An instance of ChatbotHandler
            diabetes_classifier: An instance of DiabetesClassifier
        """
        self.chatbot_handler = chatbot_handler
        self.diabetes_classifier = diabetes_classifier
    
    def get_diabetes_prediction_from_chat(self, data):
        """
        Get diabetes prediction based on chatbot interaction
        
        Args:
            data: User input data for the chatbot
            
        Returns:
            dict: Prediction result
        """
        if self.chatbot_handler:
            return self.chatbot_handler.get_diabetes_prediction(data)
        return {"error": "Chatbot handler not initialized"}
    
    def predict_diabetes(self, data):
        """
        Predict diabetes based on clinical data
        
        Args:
            data: Patient data for prediction
            
        Returns:
            dict: Prediction result
        """
        if self.diabetes_classifier:
            return self.diabetes_classifier.predict(data)
        return {"error": "Diabetes classifier not initialized"}
