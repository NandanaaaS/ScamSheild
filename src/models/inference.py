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

    return {
        "prediction": label_map[predicted_class.item()],
        "confidence": round(confidence.item(), 4)
    }


if __name__ == "__main__":
    sample_text = "Urgent! Your bank account has been suspended. Click here to verify immediately."
    result = predict(sample_text)
    print(result)