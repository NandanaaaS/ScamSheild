import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Paths
INPUT_PATH = "data/processed/clean_text.csv"
OUTPUT_DIR = "data/processed"

# Load cleaned dataset
df = pd.read_csv(INPUT_PATH)

# Check required columns
if "text" not in df.columns or "label" not in df.columns:
    raise ValueError("Expected columns 'text' and 'label' not found in dataset.")

# Perform stratified split (80% train, 20% test)
train_df, test_df = train_test_split(
    df,
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

# Save split datasets
train_path = os.path.join(OUTPUT_DIR, "train.csv")
test_path = os.path.join(OUTPUT_DIR, "test.csv")

train_df.to_csv(train_path, index=False)
test_df.to_csv(test_path, index=False)

print(f"Train set saved to: {train_path}")
print(f"Test set saved to: {test_path}")
print("\nTrain distribution:")
print(train_df["label"].value_counts())
print("\nTest distribution:")
print(test_df["label"].value_counts())