import random
import hashlib
import json

# SIMULATED DILITHIUM PARAMETERS (Scaled down for Python performance)
# In real Dilithium, vector dimensions match the security level (e.g., k=6, l=5 for Level 5)
# We use integers modulo Q for the math.
Q = 8380417  # A prime number used in Dilithium
VECTOR_LEN = 256  # Size of the polynomial/vector

class LatticeMath:
    """
    Helper class to simulate Vector/Matrix operations over Finite Field Q.
    This mimics the mathematical structure of Lattice-based Cryptography (Dilithium).
    """
    
    @staticmethod
    def random_vector(length=VECTOR_LEN):
        return [random.randint(0, Q-1) for _ in range(length)]
    
    @staticmethod
    def add_vectors(v1, v2):
        if len(v1) != len(v2):
            raise ValueError("Vector length mismatch")
        return [(x + y) % Q for x, y in zip(v1, v2)]
    
    @staticmethod
    def sub_vectors(v1, v2):
        if len(v1) != len(v2):
            raise ValueError("Vector length mismatch")
        return [(x - y) % Q for x, y in zip(v1, v2)]
    
    @staticmethod
    def vector_to_hex(v):
        # Simple serialization: Join numbers with commas and encode to hex
        s = ",".join(map(str, v))
        return s.encode().hex()
        
    @staticmethod
    def hex_to_vector(h):
        s = bytes.fromhex(h).decode()
        return list(map(int, s.split(",")))
    
    @staticmethod
    def hash_message_to_vector(message_bytes):
        """Maps a message to a vector (challenge simulation)."""
        # We assume the hash creates a deterministic sequence of numbers
        h = hashlib.sha256(message_bytes).digest()
        seed = int.from_bytes(h, "big")
        random.seed(seed)
        v = [random.randint(0, Q-1) for _ in range(VECTOR_LEN)]
        random.seed() # Reset seed
        return v
