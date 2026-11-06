import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

PAYMENT_ENV = os.getenv("PAYMENT_ENV", "sandbox")

TWO_C2P_MERCHANT_ID = os.getenv("TWO_C2P_MERCHANT_ID")
TWO_C2P_SECRET_KEY = os.getenv("TWO_C2P_SECRET_KEY")
TWO_C2P_CURRENCY = os.getenv("TWO_C2P_CURRENCY", "104")

TWO_C2P_BASE_URL = os.getenv("TWO_C2P_BASE_URL")