
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os
import io
from typing import Dict, List, Any, Optional, Union
import random  # Just for the mock version

class StressDetector:
    def __init__(self, model_path: str = None):
        # Path to saved model
        self.model_path = model_path or os.path.join(os.path.dirname(__file__), 'models/stress_detection_model.h5')
        self.model = None
        
        # Try to load the model if it exists
        try:
            if os.path.exists(self.model_path):
                print(f"Loading model from {self.model_path}")
                self.model = load_model(self.model_path)
                self.model.summary()
            else:
                print("Model file not found, running in mock mode")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Running in mock mode")
    
    def preprocess_image(self, image_data: bytes) -> np.ndarray:
        """Preprocess image for the model"""
        # Convert bytes to image
        image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
        
        # Resize to our model input size
        image = cv2.resize(image, (224, 224))
        
        # Convert BGR to RGB (if using OpenCV which reads as BGR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Facial feature extraction
        face = self.extract_face(image)
        if face is not None:
            image = face
        
        # Normalize pixel values to [0, 1]
        image = image / 255.0
        
        # Add batch dimension if using TF
        image = np.expand_dims(image, axis=0)
        
        return image
    
    def extract_face(self, image: np.ndarray) -> Optional[np.ndarray]:
        """Extract face from the image using OpenCV"""
        # Load face detector
        face_cascade_path = os.path.join(os.path.dirname(__file__), 'models/haarcascade_frontalface_default.xml')
        if not os.path.exists(face_cascade_path):
            print(f"Cascade file not found at {face_cascade_path}, using full image")
            return None
            
        face_cascade = cv2.CascadeClassifier(face_cascade_path)
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            print("No face detected, using full image")
            return None
        
        # Get the largest face
        largest_area = 0
        largest_face = None
        
        for (x, y, w, h) in faces:
            if w * h > largest_area:
                largest_area = w * h
                largest_face = (x, y, w, h)
        
        if largest_face:
            x, y, w, h = largest_face
            face = image[y:y+h, x:x+w]
            return cv2.resize(face, (224, 224))
        
        return None
    
    def extract_features(self, image: np.ndarray) -> Dict[str, float]:
        """Extract features from face image for stress detection"""
        # This would include:
        # 1. Facial Landmark Detection
        # 2. Eye movement analysis
        # 3. Micro-expression detection
        # 4. Other physiological indicators
        
        # This is a placeholder - in a real implementation this would
        # use more advanced computer vision techniques
        
        features = {}
        
        # For now returning a mock analysis
        # In a real implementation, we'd extract:
        # - Eye blink rate
        # - Facial symmetry
        # - Micro-movements
        # - Skin tone changes (flushing)
        # - Pupil dilation
        # etc.
        
        return features
    
    def detect_stress(self, image_data: bytes) -> Dict[str, Any]:
        """Detect stress from image data"""
        if self.model is None:
            # Return mock results if model isn't loaded
            return self._mock_detection()
            
        try:
            # Preprocess the image
            preprocessed_image = self.preprocess_image(image_data)
            
            # Run the model
            prediction = self.model.predict(preprocessed_image)[0]
            
            # Convert to stress score (0-100)
            # Assuming model returns probability of stress (0-1)
            stress_score = int(prediction * 100)
            
            # Determine stress level based on score
            if stress_score < 25:
                stress_level = "low"
            elif stress_score < 50:
                stress_level = "medium"
            elif stress_score < 75:
                stress_level = "high"
            else:
                stress_level = "severe"
                
            return {
                "stress_score": stress_score,
                "stress_level": stress_level,
                "confidence": float(prediction),
                "analysis": self._get_analysis_for_level(stress_level)
            }
            
        except Exception as e:
            print(f"Error detecting stress: {e}")
            # Fall back to mock detection
            return self._mock_detection()
    
    def _mock_detection(self) -> Dict[str, Any]:
        """Return mock detection results when model isn't available"""
        stress_score = random.randint(0, 100)
        
        if stress_score < 25:
            stress_level = "low"
        elif stress_score < 50:
            stress_level = "medium"  
        elif stress_score < 75:
            stress_level = "high"
        else:
            stress_level = "severe"
            
        return {
            "stress_score": stress_score,
            "stress_level": stress_level,
            "confidence": random.uniform(0.7, 0.95),
            "analysis": self._get_analysis_for_level(stress_level),
            "mock": True  # Indicator that this is mock data
        }
    
    def _get_analysis_for_level(self, level: str) -> Dict[str, str]:
        """Return analysis text based on stress level"""
        analyses = {
            "low": {
                "summary": "Low stress detected - Normal stress levels",
                "recommendation": "Maintaining healthy work habits. Take regular breaks."
            },
            "medium": {
                "summary": "Medium stress detected - Moderate stress levels",
                "recommendation": "Consider short breaks every hour. Practice deep breathing."
            },
            "high": {
                "summary": "High stress detected - Elevated stress levels",
                "recommendation": "Take a longer break. Consider a short walk or meditation."
            },
            "severe": {
                "summary": "Severe stress detected - Critical stress levels",
                "recommendation": "Immediate break recommended. Speak with a colleague or supervisor."
            }
        }
        
        return analyses.get(level, analyses["low"])
