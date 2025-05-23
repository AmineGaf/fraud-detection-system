import numpy as np
import cv2
import base64
from typing import Dict, Any

class FraudDetector:
    def __init__(self, model):
        self.model = model

    async def detect(self, image_data: str) -> Dict[str, Any]:
        """Process base64 webcam image"""
        try:
            # Handle DataURL if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
                
            # Decode and convert image
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Run detection
            results = self.model(img_rgb, verbose=False)
            detections = []
            
            if results and len(results[0].boxes):
                for box in results[0].boxes:
                    detections.append({
                        "class_id": int(box.cls.item()),
                        "class_name": "cheating" if int(box.cls.item()) == 0 else "normal",
                        "confidence": float(box.conf.item()),
                        "bbox": box.xyxy[0].tolist()
                    })
            
            return {
                "detections": detections,
                "is_fraud": any(d["class_name"] == "cheating" for d in detections)
            }
        except Exception as e:
            return {"error": str(e), "detections": [], "is_fraud": False}