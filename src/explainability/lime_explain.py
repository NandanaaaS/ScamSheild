import torch
import numpy as np
from lime.lime_text import LimeTextExplainer
from transformers import AutoTokenizer
from src.models.model import DistilBERTClassifier

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "models/checkpoints/best_model.pt"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

model = DistilBERTClassifier()
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

class_names = ["legit", "scam"]


def predict_proba(texts):
    """
    LIME expects a list of texts and returns probability scores.
    """
    inputs = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="pt"
    )

    input_ids = inputs["input_ids"].to(DEVICE)
    attention_mask = inputs["attention_mask"].to(DEVICE)

    with torch.no_grad():
        outputs = model(input_ids, attention_mask)
        probs = torch.softmax(outputs, dim=1)

    return probs.cpu().numpy()


def explain_text(text):
    explainer = LimeTextExplainer(class_names=class_names)

    explanation = explainer.explain_instance(
        text,
        predict_proba,
        num_features=10
    )

    print("\nPrediction Explanation:")
    for word, weight in explanation.as_list():
        print(f"{word}: {weight:.4f}")

    return explanation


if __name__ == "__main__":
    sample_text = "Hi team, please find attached the meeting minutes from yesterday."
    explain_text(sample_text)