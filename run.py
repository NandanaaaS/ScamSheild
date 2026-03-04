from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import os

# ------------------------
# App Initialization
# ------------------------

app = FastAPI(title="ScamShield API")

origins = [
    "chrome-extension://lajgddkjgchejfnldleoicmpojdejndi",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Load Model Artifacts
# ------------------------

VECTOR_PATH = "models/tfidf_vectorizer.pkl"
MODEL_PATH = "models/scam_classifier.pkl"  # This must be provided by Member 2

if not os.path.exists(VECTOR_PATH):
    raise RuntimeError("TF-IDF vectorizer file not found.")

vectorizer = joblib.load(VECTOR_PATH)

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        "Classifier model file not found. Expected at models/scam_classifier.pkl"
    )

model = joblib.load(MODEL_PATH)

# ------------------------
# Request / Response Schemas
# ------------------------

class PredictRequest(BaseModel):
    message: str


class PredictResponse(BaseModel):
    label: str
    confidence: float
    explanation: Optional[str] = None


# ------------------------
# Prediction Endpoint
# ------------------------

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    try:
        vector = vectorizer.transform([request.message])
        prediction = model.predict(vector)
        probabilities = model.predict_proba(vector)

        label = "scam" if prediction[0] == 1 else "not_scam"
        confidence = float(max(probabilities[0]))

        return PredictResponse(
            label=label,
            confidence=confidence,
            explanation="TF-IDF + Trained Classifier"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))