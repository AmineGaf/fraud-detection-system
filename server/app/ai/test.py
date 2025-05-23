import cv2
import os
import time
import json
import torch
import numpy as np
from datetime import datetime
from ultralytics import YOLO

class CheatingDetectionProcessor:
    def __init__(self):
        # Configuration
        self.yolo_model_path = "best.pt"
        self.output_dir = "Detection_Results"
        self.min_confidence = 0.5  # Minimum confidence to count as detection
        self.screenshot_interval = 1  # Save screenshot every detection
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        self._initialize_components()

    def _initialize_components(self):
        self._load_model()
        self._setup_camera()
        self._create_output_directories()
        self._init_tracking_variables()

    def _load_model(self):
        print("Loading detection model...")
        self.model = YOLO(self.yolo_model_path).to(self.device)
        self.class_names = self.model.names
        print(f"Model loaded with classes: {self.class_names}")

    def _setup_camera(self):
        print("Initializing camera...")
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise RuntimeError("Could not open camera")
        
        # Set resolution
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(f"Camera resolution: {self.width}x{self.height}")

    def _create_output_directories(self):
        os.makedirs(self.output_dir, exist_ok=True)
        self.screenshots_dir = os.path.join(self.output_dir, "evidence")
        os.makedirs(self.screenshots_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.json_output_path = os.path.join(self.output_dir, f"detections_{timestamp}.json")

    def _init_tracking_variables(self):
        self.detection_counter = 0
        self.json_data = {
            "start_time": datetime.now().isoformat(),
            "detections": [],
            "evidence": []
        }

    def _record_detection(self, frame, box, confidence):
        self.detection_counter += 1
        detection_id = self.detection_counter
        timestamp = datetime.now().isoformat()
        
        # Save screenshot
        screenshot_path = self._save_evidence(frame, box, detection_id)
        
        # Record detection data
        detection_record = {
            "id": detection_id,
            "timestamp": timestamp,
            "confidence": float(confidence),
            "location": {
                "x1": float(box[0]), "y1": float(box[1]),
                "x2": float(box[2]), "y2": float(box[3])
            },
            "evidence_path": screenshot_path
        }
        
        self.json_data["detections"].append(detection_record)
        return detection_id

    def _save_evidence(self, frame, box, detection_id):
        try:
            x1, y1, x2, y2 = map(int, box)
            margin = 20  # Padding around detection
            
            # Expand bounding box area
            crop_x1 = max(0, x1 - margin)
            crop_y1 = max(0, y1 - margin)
            crop_x2 = min(self.width, x2 + margin)
            crop_y2 = min(self.height, y2 + margin)
            
            cropped = frame[crop_y1:crop_y2, crop_x1:crop_x2]
            if cropped.size == 0:
                return None
            
            filename = f"cheating_{detection_id}.jpg"
            path = os.path.join(self.screenshots_dir, filename)
            
            if cv2.imwrite(path, cropped):
                evidence_record = {
                    "detection_id": detection_id,
                    "file_path": os.path.abspath(path),
                    "timestamp": datetime.now().isoformat()
                }
                self.json_data["evidence"].append(evidence_record)
                return path
        except Exception as e:
            print(f"Error saving evidence: {e}")
        return None

    def _draw_detection_box(self, frame, box, detection_id, confidence):
        x1, y1, x2, y2 = map(int, box)
        color = (0, 0, 255)  # Red
        
        # Draw rectangle
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        
        # Draw label
        label = f"Cheating #{detection_id} ({confidence:.2f})"
        cv2.putText(frame, label, (x1, y1-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    def process_frame(self, frame):
        results = self.model(frame)
        
        for result in results:
            boxes = result.boxes.xyxy.cpu().numpy()
            confidences = result.boxes.conf.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()
            
            for box, confidence, class_id in zip(boxes, confidences, class_ids):
                if confidence > self.min_confidence and self.class_names[int(class_id)] == "cheating":
                    # Record and draw detection
                    detection_id = self._record_detection(frame, box, confidence)
                    self._draw_detection_box(frame, box, detection_id, confidence)
        
        return frame

    def run(self):
        print("\nStarting detection... Press 'q' to quit")
        start_time = time.time()
        
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    break
                
                # Process frame
                processed_frame = self.process_frame(frame)
                
                # Display
                cv2.imshow("Cheating Detection", processed_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                
        finally:
            self.cap.release()
            cv2.destroyAllWindows()
            
            # Finalize and save JSON
            self.json_data["end_time"] = datetime.now().isoformat()
            self.json_data["processing_time_seconds"] = time.time() - start_time
            self.json_data["total_detections"] = len(self.json_data["detections"])
            
            with open(self.json_output_path, 'w') as f:
                json.dump(self.json_data, f, indent=2)
            
            print("\nDetection complete!")
            print(f"Found {self.detection_counter} cheating instances")
            print(f"Results saved to: {self.json_output_path}")
            print(f"Evidence saved to: {self.screenshots_dir}")

if __name__ == "__main__":
    detector = CheatingDetectionProcessor()
    detector.run()