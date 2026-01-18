import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
DATA_PATH = Path("data/processed/clean_text.csv")
MODEL_DIR = Path("models")
MODEL_DIR.mkdir(exist_ok=True)
def load_clean_data():
    df = pd.read_csv(DATA_PATH)
    return df
def create_tfidf_vectorizer():
    vectorizer = TfidfVectorizer(
        max_features=8000,     # limit vocabulary size
        ngram_range=(1, 2),    # unigrams + bigrams
        min_df=2,              # ignore very rare words
        max_df=0.9             # ignore extremely common words
    )
    return vectorizer

def vectorize_text(df):
    X_text = df["text"]
    y = df["label"]

    vectorizer = create_tfidf_vectorizer()
    X = vectorizer.fit_transform(X_text)

    return X, y, vectorizer
def save_vectorizer(vectorizer):
    with open(MODEL_DIR / "tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
def main():
    df = load_clean_data()
    X, y, vectorizer = vectorize_text(df)
    save_vectorizer(vectorizer)

    print("TF-IDF tokenization complete")
    print("Feature matrix shape:", X.shape)
if __name__ == "__main__":
    main()
