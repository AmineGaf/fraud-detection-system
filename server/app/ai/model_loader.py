import torch
from torch.serialization import safe_globals
from ultralytics.nn.tasks import DetectionModel
from ultralytics import YOLO

def load_model(path: str, map_location=torch.device("cpu"), safe: bool = True):
    try:
        model = YOLO(path)
        model.to(map_location)
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model from {path}: {str(e)}")