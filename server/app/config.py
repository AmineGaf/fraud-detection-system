import os

class Settings:
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "ai", "best.pt")
    RELOAD = False  # Set to False to prevent reloading

settings = Settings()