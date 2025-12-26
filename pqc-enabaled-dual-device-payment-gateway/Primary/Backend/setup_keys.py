from primary_signer import PrimarySigner
import json
import os

def setup():
    signer = PrimarySigner()
    
    print("Initializing Post-Quantum Distributed Signing Keys...")
    secondary_share = signer.generate_and_split_keys()
    
    # In a real scenario, this share would be sent securely to the secondary device via QR code or secure channel.
    # For this simulation, we will save it to a file so we can mock the secondary device participation.
    
    secondary_share_path = os.path.join(signer.keys_dir, "secondary_share_mock.json")
    with open(secondary_share_path, "w") as f:
        json.dump({"share_id": 2, "key_share": secondary_share, "alg": "Dilithium5-Threshold-Python"}, f)
        
    print(f"\n[URGENT] Secondary Share generated.")
    print(f"Stored locally for SIMULATION purposes at: {secondary_share_path}")
    print("In production, this file should be deleted after transfer to the Secondary Device.")
    
if __name__ == "__main__":
    setup()