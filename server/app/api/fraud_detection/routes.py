from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request
from typing import Dict, Any

router = APIRouter()

@router.post("/detect")
async def detect_fraud(
    request: Request,
    data: Dict[str, Any]  # Expects {"image_data": "base64string"}
):
    detector = request.app.state.detector
    result = await detector.detect(data["image_data"])
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    # Here you can:
    # 1. Save to database if fraud detected
    # 2. Trigger notifications
    # 3. Log the event
    
    return result