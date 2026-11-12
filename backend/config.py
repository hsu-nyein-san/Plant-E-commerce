import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_USER = "root"
DB_PASSWORD = ""
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "leafly_db"

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

TWO_C2P_MERCHANT_ID = os.getenv("TWO_C2P_MERCHANT_ID")
TWO_C2P_SECRET_KEY = os.getenv("TWO_C2P_SECRET_KEY")
TWO_C2P_CURRENCY = os.getenv("TWO_C2P_CURRENCY", "104")
TWO_C2P_BASE_URL = os.getenv("TWO_C2P_BASE_URL")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)