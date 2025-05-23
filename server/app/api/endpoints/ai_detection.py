from fastapi import APIRouter, HTTPException
from app.core.detection.fraud_detector import FraudDetector
from ...schemas.detection import DetectionResult
from typing import Dict
from datetime import datetime

router = APIRouter()
detector = FraudDetector()

@router.post("/detect", response_model=DetectionResult)
async def detect_fraud(data: Dict[str, str]):
    try:
        if not data.get("image_data"):
            return DetectionResult(
                detections=[],
                is_fraud=False,
                timestamp=datetime.now().isoformat(),
                error="image_data is required"
            )

        result = detector.process_image(data["image_data"])

        # Ensure `result` is an instance of DetectionResult or dict that matches
        return DetectionResult(**result)

    except Exception as e:
        return DetectionResult(
            detections=[],
            is_fraud=False,
            timestamp=datetime.now().isoformat(),
            error=f"Processing error: {str(e)}"
        )
