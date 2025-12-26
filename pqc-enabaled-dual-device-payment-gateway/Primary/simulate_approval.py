import requests
import json
import time

PRIMARY_URL = "http://127.0.0.1:7001"

def print_header():
    print("\n" + "="*50)
    print("  SIMULATE SECONDARY DEVICE APPROVAL")
    print("="*50)

def get_pending_transactions():
    try:
        r = requests.get(f"{PRIMARY_URL}/pending-transactions")
        if r.status_code == 200:
            return r.json()
        print(f"Error fetching pending: {r.text}")
        return []
    except Exception as e:
        print(f"Connection Error: {e}")
        return []

import sys
import os

# Add Backend to path to import LatticeMath
sys.path.append(os.path.join(os.path.dirname(__file__), "Backend"))
from utils.lattice_math import LatticeMath

def approve_transaction(tx):
    print(f"\n[INFO] Approving Transaction ID: {tx['transaction_id']}")
    print(f"       Amount: ${tx['amount']}")
    print(f"       Hash: {tx['transaction_hash']}")
    
    # 1. Local Signing
    print("... Signing locally with 'my_secondary_key.json' ...")
    try:
        # Load local key
        with open("my_secondary_key.json", "r") as f:
            key_data = json.load(f)
            share2_hex = key_data["key_share"]
            
        # Perform Math
        share2_vector = LatticeMath.hex_to_vector(share2_hex)
        tx_hash_bytes = tx['transaction_hash'].encode() # Primary sends hex string as hash
        challenge_vector = LatticeMath.hash_message_to_vector(tx_hash_bytes)
        partial_sig_vector = LatticeMath.add_vectors(share2_vector, challenge_vector)
        partial_sig_hex = LatticeMath.vector_to_hex(partial_sig_vector)
        
        sign_data = {
            "tx_hash": tx['transaction_hash'],
            "partial_signature": partial_sig_hex,
            "signer_role": "secondary",
            "alg": "Dilithium5-Threshold-Python"
        }
        
        print(f"[SUCCESS] Secondary Signature Generated locally: {partial_sig_hex[:20]}...")
        
        # 2. Send Back to Primary
        print("... Sending Approval to Primary ...")
        finalize_resp = requests.post(f"{PRIMARY_URL}/receive-secondary-signature", json={
            "transaction_id": tx['transaction_id'],
            "secondary_partial_signature": sign_data
        })
        
        if finalize_resp.status_code == 200:
            print(f"\n[SUCCESS] Transaction Finalized!")
            print(f"Server Response: {finalize_resp.json()}")
        else:
            print(f"\n[ERROR] Finalization Failed: {finalize_resp.text}")
            
    except FileNotFoundError:
        print("[ERROR] Key file 'my_secondary_key.json' not found. Cannot sign.")
    except Exception as e:
        print(f"[ERROR] Approval Process Failed: {e}")

def main():
    print_header()
    while True:
        pending = get_pending_transactions()
        
        if not pending:
            print("\nNo pending transactions waiting for approval.")
            print("initiate a >$100k transaction on the web app first.")
            choice = input("\n[R]efresh or [Q]uit? ").strip().lower()
            if choice == 'q':
                break
            continue
            
        print(f"\nfound {len(pending)} pending transaction(s):")
        for idx, tx in enumerate(pending):
            print(f"[{idx+1}] Amount: ${tx['amount']} | Recipient: {tx['recipient']} | ID: {tx['transaction_id'][:8]}...")
            
        choice = input("\nSelect transaction # to approve (or 'r' to refresh, 'q' to quit): ").strip().lower()
        
        if choice == 'q':
            break
        if choice == 'r':
            continue
            
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(pending):
                approve_transaction(pending[idx])
                input("\nPress Enter to continue...")
            else:
                print("Invalid selection.")
        except ValueError:
            print("Invalid input.")

if __name__ == "__main__":
    main()
