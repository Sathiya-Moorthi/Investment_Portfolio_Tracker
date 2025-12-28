import requests
import json

url = "http://127.0.0.1:8000/portfolio/7a221df5-5aae-45e3-a455-41f3b3f4b6c1/holdings"

payload = {
    "symbol": "AAPL",
    "quantity": 10,
    "average_price": 150.0,
    "asset_type": "STOCK",
    "details": {}
}

print(f"Sending payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
