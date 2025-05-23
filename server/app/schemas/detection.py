from pydantic import BaseModel, Field
from typing import List, Optional

class DetectionItem(BaseModel):
    class_id: int
    class_name: str
    confidence: float = Field(..., ge=0, le=1)
    bbox: List[float]

class DetectionResult(BaseModel):
    detections: List[DetectionItem] = []
    is_fraud: bool
    timestamp: str
    error: Optional[str] = None