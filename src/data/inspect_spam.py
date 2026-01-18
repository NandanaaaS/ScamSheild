import pandas as pd


df = pd.read_csv("data/raw/spam.csv", encoding="latin-1")

print("Columns:", df.columns.tolist())
print("\nSample rows:")
print(df.head())

print("\nLabel distribution:")
print(df.iloc[:, -1].value_counts())

