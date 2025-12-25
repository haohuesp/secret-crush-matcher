import sqlite3
import json
from datetime import datetime
from typing import Optional, List, Tuple
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "crushes.db")


def get_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables"""
    conn = get_connection()
    cursor = conn.cursor()

    # Table for encrypted crush submissions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crushes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crusher_address TEXT NOT NULL,
            crush_address_encrypted TEXT NOT NULL,
            crush_address_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(crusher_address, crush_address_hash)
        )
    """)

    # Table for confirmed matches
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1_address TEXT NOT NULL,
            user2_address TEXT NOT NULL,
            matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user1_address, user2_address)
        )
    """)

    # Table for user profiles
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            wallet_address TEXT PRIMARY KEY,
            nickname TEXT,
            avatar_seed TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def add_crush(crusher_address: str, crush_address_encrypted: str, crush_address_hash: str) -> bool:
    """Add a new crush submission"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT OR REPLACE INTO crushes (crusher_address, crush_address_encrypted, crush_address_hash)
            VALUES (?, ?, ?)
        """, (crusher_address.lower(), crush_address_encrypted, crush_address_hash.lower()))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding crush: {e}")
        return False
    finally:
        conn.close()


def get_crushes_by_user(wallet_address: str) -> List[dict]:
    """Get all crushes submitted by a user"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM crushes WHERE crusher_address = ?
    """, (wallet_address.lower(),))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results


def check_mutual_crush(address1: str, address2: str) -> bool:
    """Check if two addresses have mutual crushes (both like each other)"""
    from app.fhe_matcher import encrypt_crush

    conn = get_connection()
    cursor = conn.cursor()

    # Get the hash of each address for comparison
    _, address1_hash = encrypt_crush(address1)
    _, address2_hash = encrypt_crush(address2)

    # Check if address1 has crush on address2
    cursor.execute("""
        SELECT 1 FROM crushes WHERE crusher_address = ? AND crush_address_hash = ?
    """, (address1.lower(), address2_hash))
    a_likes_b = cursor.fetchone() is not None

    # Check if address2 has crush on address1
    cursor.execute("""
        SELECT 1 FROM crushes WHERE crusher_address = ? AND crush_address_hash = ?
    """, (address2.lower(), address1_hash))
    b_likes_a = cursor.fetchone() is not None

    conn.close()
    return a_likes_b and b_likes_a


def add_match(address1: str, address2: str) -> bool:
    """Record a match between two users"""
    conn = get_connection()
    cursor = conn.cursor()

    # Normalize order to prevent duplicates
    addr1, addr2 = sorted([address1.lower(), address2.lower()])

    try:
        cursor.execute("""
            INSERT OR IGNORE INTO matches (user1_address, user2_address)
            VALUES (?, ?)
        """, (addr1, addr2))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"Error adding match: {e}")
        return False
    finally:
        conn.close()


def get_matches_for_user(wallet_address: str) -> List[str]:
    """Get all matches for a user"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT user1_address, user2_address FROM matches
        WHERE user1_address = ? OR user2_address = ?
    """, (wallet_address.lower(), wallet_address.lower()))

    matches = []
    for row in cursor.fetchall():
        if row['user1_address'] == wallet_address.lower():
            matches.append(row['user2_address'])
        else:
            matches.append(row['user1_address'])

    conn.close()
    return matches


def get_user_stats(wallet_address: str) -> dict:
    """Get user statistics"""
    conn = get_connection()
    cursor = conn.cursor()

    # Count crushes sent
    cursor.execute("""
        SELECT COUNT(*) as count FROM crushes WHERE crusher_address = ?
    """, (wallet_address.lower(),))
    crushes_sent = cursor.fetchone()['count']

    # Get matches
    matches = get_matches_for_user(wallet_address)

    conn.close()

    return {
        "wallet_address": wallet_address,
        "crushes_sent": crushes_sent,
        "matches_count": len(matches),
        "matches": matches
    }


def register_user(wallet_address: str, nickname: Optional[str] = None) -> bool:
    """Register or update a user"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (wallet_address, nickname, avatar_seed)
            VALUES (?, ?, ?)
            ON CONFLICT(wallet_address) DO UPDATE SET
                last_active = CURRENT_TIMESTAMP,
                nickname = COALESCE(?, nickname)
        """, (wallet_address.lower(), nickname, wallet_address[:8], nickname))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error registering user: {e}")
        return False
    finally:
        conn.close()


# Initialize database on module load
init_db()
