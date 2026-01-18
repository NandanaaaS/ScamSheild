import pandas as pd
from pathlib import Path

# Base path to data folder
DATA_DIR = Path("data/raw")


def load_phishing_emails():
    """
    Load phishing email dataset
    """
    file_path = DATA_DIR / "Phishing_Email.csv"
    df = pd.read_csv(file_path)
    return df


def load_sms_spam():
    """
    Load SMS spam dataset
    """
    file_path = DATA_DIR / "spam.csv"
    df = pd.read_csv(file_path, encoding="latin-1")

    return df


def load_all_data():
    """
    Load all datasets and return them
    """
    phishing_df = load_phishing_emails()
    sms_df = load_sms_spam()

    return phishing_df, sms_df
