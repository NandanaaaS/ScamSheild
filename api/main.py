from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import shutil
import os

# Import the ML inference function
from src.models.inference import predict

# For QR decoding
from PIL import Image
from pyzbar.pyzbar import decode


app = FastAPI(title="ScamShield API")

# CORS (allow extension + frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # You can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------
# Schemas
# ------------------------

class PredictRequest(BaseModel):
    message: str


class PredictResponse(BaseModel):
    prediction: str
    confidence: float


# ------------------------
# TEXT PREDICTION
# ------------------------

@app.post("/predict", response_model=PredictResponse)
async def predict_text(request: PredictRequest):

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    try:
        result = predict(request.message)

        return PredictResponse(
            prediction=result["prediction"],
            confidence=result["confidence"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------
# QR PREDICTION
# ------------------------

@app.post("/predict-qr", response_model=PredictResponse)
async def predict_qr(file: UploadFile = File(...)):

    try:
        temp_path = "temp_qr.png"

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image = Image.open(temp_path)
        decoded_objects = decode(image)

        if not decoded_objects:
            raise HTTPException(status_code=400, detail="No QR code found")

        extracted_text = decoded_objects[0].data.decode("utf-8")

        result = predict(extracted_text)

        os.remove(temp_path)

        return PredictResponse(
            prediction=result["prediction"],
            confidence=result["confidence"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))