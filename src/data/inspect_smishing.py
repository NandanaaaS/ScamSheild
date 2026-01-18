from pathlib import Path

file_path = Path("data/raw/SMSSmishCollection.txt")

# Read first 20 lines safely
with open(file_path, "r") as f:
    lines = f.readlines()

print("First 10 lines:\n")
for i, line in enumerate(lines[:10]):
    print(f"{i+1}: {line}")
