from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for React Frontend

BACKEND_URL = "http://127.0.0.1:7001"
THRESHOLD = 100000  # 1 lakh


@app.route("/pay", methods=["POST"])
def pay():
    data = request.json
    amount = float(data["amount"])

    # Small amount → direct signing
    if amount < THRESHOLD:
        r = requests.post(f"{BACKEND_URL}/sign", json=data)
        return r.json()

    # Big amount → approval required
    r = requests.post(f"{BACKEND_URL}/request-approval", json=data)
    return r.json()

@app.route("/balance", methods=["GET"])
def get_balance():
    try:
        r = requests.get(f"{BACKEND_URL}/balance", params=request.args)
        return r.json()
    except Exception as e:
        return jsonify({"error": "Backend offline"}), 503

@app.route("/transactions", methods=["GET"])
def get_transactions():
    try:
        r = requests.get(f"{BACKEND_URL}/transactions", params=request.args)
        return r.json()
    except Exception as e:
        return jsonify({"error": "Backend offline"}), 503

if __name__ == "__main__":
    app.run(port=5001, debug=True)
