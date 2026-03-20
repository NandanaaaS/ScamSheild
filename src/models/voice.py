import whisper
from src.models.inference import predict

# load once
model = whisper.load_model("tiny")   # use tiny (faster)

def predict_audio(file_path):
    result = model.transcribe(file_path, task="translate")  
    # Malayalam → English automatically

    extracted_text = result["text"]

    prediction = predict(extracted_text)

    return {
        "text": extracted_text,
        "prediction": prediction["prediction"],
        "confidence": prediction["confidence"],
        "explanation": prediction["explanation"]
    }