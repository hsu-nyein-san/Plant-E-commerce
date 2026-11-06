import os
import jwt
import httpx

from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("TWO_C2P_BASE_URL")
MERCHANT_ID = os.getenv("TWO_C2P_MERCHANT_ID")
SECRET_KEY = os.getenv("TWO_C2P_SECRET_KEY")
CURRENCY = os.getenv("TWO_C2P_CURRENCY")


def generate_jwt(payload: dict):
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm="HS256"
    )


def decode_jwt(token: str):
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=["HS256"]
    )


async def request_2c2p(endpoint: str, payload: dict):

    token = generate_jwt(payload)

    async with httpx.AsyncClient(timeout=30) as client:

        response = await client.post(
            f"{BASE_URL}/payment/4.5/{endpoint}",
            json={"payload": token}
        )

        response.raise_for_status()

        result = response.json()

        return decode_jwt(result["payload"])