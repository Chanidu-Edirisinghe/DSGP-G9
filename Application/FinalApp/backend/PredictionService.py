from abc import ABC, abstractmethod

class PredictionService(ABC):
    @abstractmethod
    def predict(self, data):
        pass