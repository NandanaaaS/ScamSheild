import pandas as pd
import torch
from transformers import AutoTokenizer
import os

# Paths
TRAIN_PATH = "data/processed/train.csv"
TEST_PATH = "data/processed/test.csv"
OUTPUT_DIR = "data/processed"

MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 128

# Load datasets
train_df = pd.read_csv(TRAIN_PATH)
test_df = pd.read_csv(TEST_PATH)

# Keep only required columns
train_df = train_df[["text", "label"]]
test_df = test_df[["text", "label"]]

# Convert labels to numeric
label_mapping = {"legit": 0, "scam": 1}
train_df["label"] = train_df["label"].map(label_mapping)
test_df["label"] = test_df["label"].map(label_mapping)

# Initialize tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# Tokenization function
def tokenize_texts(texts):
    return tokenizer(
        texts.tolist(),
        padding="max_length",
        truncation=True,
        max_length=MAX_LENGTH,
        return_tensors="pt"
    )

# Tokenize
train_encodings = tokenize_texts(train_df["text"])
test_encodings = tokenize_texts(test_df["text"])

# Add labels
train_encodings["labels"] = torch.tensor(train_df["label"].values)
test_encodings["labels"] = torch.tensor(test_df["label"].values)

# Save encoded tensors
torch.save(train_encodings, os.path.join(OUTPUT_DIR, "train_encodings.pt"))
torch.save(test_encodings, os.path.join(OUTPUT_DIR, "test_encodings.pt"))

print("Tokenization complete.")
print("Saved files:")
print(" - train_encodings.pt")
print(" - test_encodings.pt")