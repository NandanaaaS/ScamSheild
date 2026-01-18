import pandas as pd
import re
from pathlib import Path
from load_data import load_all_data
PROCESSED_DIR = Path("data/processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
def clean_text(text):
    """
    Clean raw text for ML.
    """
    if pd.isna(text):
        return ""

    text = text.lower()

    # remove HTML tags
    text = re.sub(r"<.*?>", " ", text)

    # replace URLs
    text = re.sub(r"http\S+|www\S+", "<URL>", text)

    # replace numbers
    text = re.sub(r"\d+", "<NUM>", text)

    # remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text
def process_phishing_emails(df):
    """
    Process phishing email dataset
    """
    # Keep only relevant columns
    df = df[["Email Text", "Email Type"]]

    # Rename columns
    df = df.rename(columns={
        "Email Text": "text",
        "Email Type": "label"
    })

    # Map labels
    df["label"] = df["label"].map({
        "Phishing Email": "scam",
        "Safe Email": "legit"
    })

    # Add source column
    df["source"] = "email"

    # Clean text
    df["text"] = df["text"].apply(clean_text)

    return df
def process_sms_spam(df):
    """
    Process SMS spam dataset
    """
    # Keep only label and text
    df = df[["v1", "v2"]]

    # Rename columns
    df = df.rename(columns={
        "v1": "label",
        "v2": "text"
    })

    # Map labels
    df["label"] = df["label"].map({
        "spam": "scam",
        "ham": "legit"
    })

    # Add source column
    df["source"] = "sms"

    # Clean text
    df["text"] = df["text"].apply(clean_text)

    return df
def main():
    phishing_df, sms_df = load_all_data()

    phishing_clean = process_phishing_emails(phishing_df)
    sms_clean = process_sms_spam(sms_df)

    # Merge datasets
    final_df = pd.concat([phishing_clean, sms_clean], ignore_index=True)

    # Drop empty texts (safety)
    final_df = final_df[final_df["text"].str.len() > 0]

    # Save cleaned data
    output_path = PROCESSED_DIR / "clean_text.csv"
    final_df.to_csv(output_path, index=False)

    print("Cleaned data saved to:", output_path)
    print(final_df["label"].value_counts())
if __name__ == "__main__":
    main()
