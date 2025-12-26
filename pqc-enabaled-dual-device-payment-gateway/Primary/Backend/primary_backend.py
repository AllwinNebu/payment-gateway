import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime
from primary_signer import PrimarySigner
import uuid
import hashlib
import json
import time

# --- MongoDB Setup ---
# Hardcoded for now based on banking/.env. In prod, use os.getenv
MONGO_URL = "mongodb+srv://allwinnebu_db_user:Allwindb%40123@payment-gateway.k8iscn5.mongodb.net/?appName=payment-gateway"
DB_NAME = "banking"

try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    users_collection = db["users"]
    # We will create/use a 'transactions' collection for history not in User model
    transactions_collection = db["transactions"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    db = None

app = Flask(__name__)
signer = PrimarySigner()

# Memory store for pending transactions (Still needed for PQC state)
pending_transactions = {}

@app.route("/")
def index():
    return "Primary Backend Running. Keys Checked."



@app.route("/request-approval", methods=["POST"])
def request_approval():
    """
    Step 1 & 2 & 3: Transaction Request -> Preparation -> Primary Partial Sign
    """
    data = request.json
    transaction_id = str(uuid.uuid4())
    
    try:
        # 1. Create Partial Signature
        partial_result = signer.sign_partial(data)
        
        # 2. Store State
        pending_transactions[transaction_id] = {
            "data": data,
            "primary_partial": partial_result,
            "status": "waiting_for_secondary",
            "timestamp": time.time()
        }
        
        # 3. Simulate sending to Secondary Device
        # We return the info needed for the Secondary Device to act.
        return jsonify({
            "status": "pending_secondary_approval",
            "transaction_id": transaction_id,
            "transaction_hash": partial_result["tx_hash"],
            "message": "Notification sent to Secondary Device. Waiting for approval..."
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/pending-transactions", methods=["GET"])
def get_pending_transactions():
    """Debug endpoint to list transactions waiting for secondary approval"""
    clean_list = []
    current_time = time.time()
    expired_ids = []
    
    for tid, info in pending_transactions.items():
        # Clean up expired
        if current_time - info.get("timestamp", 0) > 30:
            expired_ids.append(tid)
            continue
            
        clean_list.append({
            "transaction_id": tid,
            "amount": info["data"].get("amount"),
            "recipient": info["data"].get("recipient"),
            "transaction_hash": info["primary_partial"]["tx_hash"],
            "date": "Waiting...",
            "expires_in": int(30 - (current_time - info.get("timestamp", 0)))
        })
        
    for tid in expired_ids:
        del pending_transactions[tid]
        
    return jsonify(clean_list)

@app.route("/receive-secondary-signature", methods=["POST"])
def receive_secondary_signature():
    """
    Step 6 & 7: Receive Secondary Partial, Verify and Combine.
    Called by the Secondary Device (simulated).
    """
    data = request.json
    tx_id = data.get("transaction_id")
    secondary_partial = data.get("secondary_partial_signature") # Should be the dict
    
    if tx_id not in pending_transactions:
        return jsonify({"error": "Transaction not found or expired"}), 404
        
    pending_tx = pending_transactions[tx_id]
    
    # Check Timeout (30 seconds)
    if time.time() - pending_tx.get("timestamp", 0) > 30:
        del pending_transactions[tx_id]
        return jsonify({"error": "Transaction expired (timeout > 30s)"}), 400
    
    try:
        # Combine
        final_result = signer.combine_and_finalize(
            pending_tx["data"],
            pending_tx["primary_partial"],
            secondary_partial
        )
        
        # Cleanup
        del pending_transactions[tx_id]
        
        # NEW: Update User State (Finalize Transaction)
        amount = float(pending_tx["data"].get("amount", 0))
        recipient = pending_tx["data"].get("recipient", "Large Transfer")
        username = pending_tx["data"].get("username") # Should be in data now
        
        _update_state_after_transaction(amount, username, name=recipient)
        
        return jsonify({
            "status": "success",
            "message": "Transaction Finalized Successfully",
            "transaction_id": tx_id
        })
        
    except ValueError as ve:
        return jsonify({"error": "Verification Failed: " + str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# SIMULATION HELPER endpoints (to make testing easy without a second physical device)
@app.route("/simulate-secondary-device", methods=["POST"])
def simulate_secondary_device():
    """
    Helper to simulate the Secondary Device's logic.
    Receives tx_hash, loads Mock Secondary Share, signs it, and returns the result.
    """
    data = request.json
    tx_hash = data.get("transaction_hash")
    
    # Load Mock Share
    try:
        import os
        from utils.lattice_math import LatticeMath
        
        keys_dir = os.path.join(os.path.dirname(__file__), "keys")
        with open(os.path.join(keys_dir, "secondary_share_mock.json"), "r") as f:
            share_data = json.load(f)
            share2_hex = share_data["key_share"]
            
        # Mock Signing Logic (Must match PrimarySigner logic)
        # Parse Share2 Vector
        share2_vector = LatticeMath.hex_to_vector(share2_hex)
        
        # Parse/Derive Challenge Vector from Hash
        challenge_bytes = tx_hash.encode() # The tx_hash from primary is already the hex digest? 
        # Wait, the input is 'transaction_hash' from primary response.
        # Actually in PrimarySigner code: tx_hash = self._hash_data(transaction_data) which returns HEX string.
        # LatticeMath.hash_message_to_vector expects BYTES.
        # We need to stay consistent. The primary uses the HEX STRING of the hash as the input to the vector generator?
        # Let's check Primary logic: 
        # tx_hash_bytes = self._hash_data(transaction_data).encode() -> This is Hex String as Bytes.
        
        challenge_vector = LatticeMath.hash_message_to_vector(challenge_bytes)
        
        # Sig2 = Share2 + Challenge
        partial_sig_vector = LatticeMath.add_vectors(share2_vector, challenge_vector)
        partial_sig_hex = LatticeMath.vector_to_hex(partial_sig_vector)
        
        return jsonify({
            "tx_hash": tx_hash,
            "partial_signature": partial_sig_hex,
            "signer_role": "secondary",
            "alg": "Dilithium5-Threshold-Python"
        })
    except Exception as e:
        return jsonify({"error": "Simulation failed: " + str(e)}), 500

# ---------------------------------------------------
# NEW: Database Simulation (In-Memory)
# ---------------------------------------------------
# ---------------------------------------------------
# MongoDB Logic
# ---------------------------------------------------

def get_user_by_name(username):
    """Helper to get a specific user from DB"""
    if db is None or not username: return None
    return users_collection.find_one({"username": username})

@app.route("/balance", methods=["GET"])
def get_balance():
    """Returns current user balance from DB"""
    username = request.args.get("username")
    user = get_user_by_name(username)
    
    if user:
        return jsonify({"balance": user.get("balance", 0)})
    return jsonify({"balance": 0})

@app.route("/transactions", methods=["GET"])
def get_transactions():
    """Returns transaction history from DB"""
    username = request.args.get("username")
    
    if db is None: return jsonify({"transactions": []})
    
    # Filter by user if username provided
    query = {}
    if username:
        query["username"] = username
        
    # Sort by _id desc (timestamp proxy)
    cursor = transactions_collection.find(query).sort("_id", -1).limit(20)
    
    tx_list = []
    for doc in cursor:
        tx_list.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", "Transaction"),
            "date": doc.get("date", ""),
            "amount": doc.get("amount", 0),
            "type": doc.get("type", "neutral"),
            "icon": doc.get("icon", "T")
        })
        
    return jsonify({"transactions": tx_list})

def _update_state_after_transaction(amount, username, name="Transaction"):
    """Helper to update balance in DB and add history"""
    user = get_user_by_name(username)
    if not user:
        print(f"No user found to update: {username}")
        return

    # Update Balance
    current_balance = user.get("balance", 0)
    new_balance = current_balance - amount
    users_collection.update_one({"_id": user["_id"]}, {"$set": {"balance": new_balance}})
    
    # Add Transaction
    new_tx = {
        "username": username, # Link transaction to user
        "name": name,
        "date": datetime.datetime.now().strftime("%b %d, %I:%M %p"),
        "amount": amount,
        "type": "debit",
        "icon": "T"
    }
    transactions_collection.insert_one(new_tx)

# Update sign_direct to use this helper
# We override the original sign_direct to include state update
@app.route("/sign", methods=["POST"])
def sign_direct():
    """
    Handle small transactions.
    NOTE: In a true distributed model, the Primary CANNOT sign alone.
    We return the partial signature here, but in a real app, 
    small transactions might use a different, single-device key.
    """
    data = request.json
    try:
        # Generate Partial Signature
        result = signer.sign_partial(data)
        
        # NEW: Update State
        amount = float(data.get("amount", 0))
        username = data.get("username")
        _update_state_after_transaction(amount, username, name=data.get("recipient", "Quick Transfer"))

        return jsonify({
            "status": "partial_success",
            "message": "Primary Partial Signature Generated (Threshold security requires Secondary)",
            "signature_data": result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Ensure keys exist before starting
    try:
        signer.load_primary_share()
    except:
        print("Keys not found. Generating new keys...")
        signer.generate_and_split_keys()
        
    app.run(port=7001, debug=True)