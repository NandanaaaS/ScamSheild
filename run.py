
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Placeholder for model loading (to be replaced with actual BERT model)
# Example: from transformers import AutoModelForSequenceClassification, AutoTokenizer
# model = AutoModelForSequenceClassification.from_pretrained('your-model-path')
# tokenizer = AutoTokenizer.from_pretrained('your-model-path')


app = FastAPI()

# Allow CORS for Chrome extension and localhost (adjust as needed)
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

class PredictRequest(BaseModel):
	message: str

class PredictResponse(BaseModel):
	label: str
	confidence: float
	explanation: Optional[str] = None

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
	#replace with logic later
	return PredictResponse(
		label="not_scam",
		confidence=0.99,
		explanation="This is a placeholder response."
	)
