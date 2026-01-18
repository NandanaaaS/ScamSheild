import pandas as pd

df = pd.read_csv("data/raw/whatsapp_scam_dataset.csv")

print("Columns:", df.columns.tolist())
print("\nSample rows:")
print(df.head())

print("\nAny labels?")
print(df.iloc[:, -1].value_counts() if df.shape[1] > 1 else "No label column")
