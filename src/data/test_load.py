from load_data import load_all_data

phishing_df, sms_df = load_all_data()

print("Phishing emails shape:", phishing_df.shape)
print("SMS spam shape:", sms_df.shape)
