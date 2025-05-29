import cv2
import numpy as np
from ultralytics import YOLO
from typing import List, Dict, Any
import base64
from datetime import datetime

class FraudDetector:
    def __init__(self):
        self.model_path = "app/core/detection/models/best.pt"
        self.min_confidence = 0.7
        self.model = None
        self.class_names = None
        self._load_model()

    def _load_model(self):
        """Load the YOLO model and class names"""
        self.model = YOLO(self.model_path)
        self.class_names = self.model.names
        print(f"Model loaded with classes: {self.class_names}")

    def process_image(self, image_data: str) -> Dict[str, Any]:
        
        if not image_data or not isinstance(image_data, str):
            return {
                "detections": [],
                "is_fraud": False,
                "timestamp": datetime.now().isoformat(),
                "error": "Invalid image data"
            }
        
        try:
            
            if not image_data.strip():
                raise ValueError("Empty image data")
            
            # Add padding if needed (base64 requires length divisible by 4)
            padding = len(image_data) % 4
            if padding:
                image_data += "=" * (4 - padding)
            # Convert base64 to numpy array
            
            
            nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            if frame is None:
                return {
                "detections": [],
                "is_fraud": False,
                "timestamp": datetime.now().isoformat(),
                "error": "Could not decode image"
                }
                
            
            # Run detection
            results = self.model(frame)
            
            detections = []
            is_fraud = False
            
            for result in results:
                boxes = result.boxes.xyxy.cpu().numpy()
                confidences = result.boxes.conf.cpu().numpy()
                class_ids = result.boxes.cls.cpu().numpy()
                
                for box, confidence, class_id in zip(boxes, confidences, class_ids):
                    if confidence > self.min_confidence and self.class_names[int(class_id)] == "cheating":
                        is_fraud = True
                        detections.append({
                            "class_id": int(class_id),
                            "class_name": self.class_names[int(class_id)],
                            "confidence": float(confidence),
                            "bbox": box.tolist()  # Convert numpy array to list
                        })
            
            return {
                "detections": detections,
                "is_fraud": is_fraud,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "detections": [],
                "is_fraud": False,
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }