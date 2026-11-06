from config import(
    DATABASE_URL,
    TWO_C2P_MERCHANT_ID,
    TWO_C2P_SECRET_KEY,
    TWO_C2P_CURRENCY,
    TWO_C2P_BASE_URL
)

import hashlib

secret = TWO_C2P_SECRET_KEY.strip()

print(
    "Secret fingerprint:",
    hashlib.sha256(secret.encode()).hexdigest()
)

print("Database loaded:", bool(DATABASE_URL))
print("Merchant ID:", TWO_C2P_MERCHANT_ID)
print("Secret Key loaded:", bool(TWO_C2P_SECRET_KEY))
print("Currency:", TWO_C2P_CURRENCY)
print("Gateway URL:", TWO_C2P_BASE_URL)

