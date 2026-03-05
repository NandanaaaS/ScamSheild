from lime.lime_text import LimeTextExplainer
import numpy as np
import torch
from transformers import AutoTokenizer
from src.models.model import DistilBERTClassifier

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "models/checkpoints/best_model.pt"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

# Load model
model = DistilBERTClassifier()
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()
explainer = LimeTextExplainer(class_names=["legit", "scam"])

def predict_proba(texts):
    results = []

    for text in texts:
        inputs = tokenizer(
            text,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt"
        )

        input_ids = inputs["input_ids"].to(DEVICE)
        attention_mask = inputs["attention_mask"].to(DEVICE)

        with torch.no_grad():
            outputs = model(input_ids, attention_mask)
            probabilities = torch.softmax(outputs, dim=1)

        results.append(probabilities.cpu().numpy()[0])

    return np.array(results)

def predict(text: str):

    inputs = tokenizer(
        text,
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="pt"
    )

    input_ids = inputs["input_ids"].to(DEVICE)
    attention_mask = inputs["attention_mask"].to(DEVICE)

    with torch.no_grad():
        outputs = model(input_ids, attention_mask)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_class = torch.max(probabilities, dim=1)

    label_map = {0: "legit", 1: "scam"}
    prediction = label_map[predicted_class.item()]

    # LIME explanation
    explanation = explainer.explain_instance(
        text,
        predict_proba,
        num_features=6,
        num_samples=100
    )

    important_words = [str(word) for word, weight in explanation.as_list()]

    return {
        "prediction": prediction,
        "confidence": round(confidence.item(), 4),
        "explanation": important_words
    }

if __name__ == "__main__":
    sample_text = "Urgent! Your bank account has been suspended. Click here to verify immediately."
    result = predict(sample_text)
    print(result)