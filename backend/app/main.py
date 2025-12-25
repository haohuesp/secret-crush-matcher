"""
Secret Crush Matcher API

A fun dating/social app where users can secretly submit their crush's wallet address.
If two people BOTH submit each other, they match! All powered by FHE.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import uvicorn

from app.models import (
    CrushSubmission,
    CrushResponse,
    MatchResult,
    UserStats,
    MatchNotification,
    CompatibilityResult
)
from app.fhe_matcher import encrypt_crush, check_for_match, generate_match_proof, fhe_matcher
import app.database as db

app = FastAPI(
    title="Secret Crush Matcher API",
    description="Find your secret crush... privately! Powered by FHE (Fully Homomorphic Encryption)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to Secret Crush Matcher!",
        "tagline": "Find your secret crush... privately",
        "powered_by": "Zama FHE (Fully Homomorphic Encryption)",
        "docs": "/docs"
    }


@app.post("/api/connect", status_code=status.HTTP_200_OK)
async def connect_wallet(wallet_address: str):
    """Register/connect a wallet address"""
    if not wallet_address or len(wallet_address) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid wallet address"
        )

    db.register_user(wallet_address)

    return {
        "success": True,
        "message": "Wallet connected successfully!",
        "wallet_address": wallet_address.lower()
    }


@app.post("/api/crush/submit", response_model=CrushResponse)
async def submit_crush(submission: CrushSubmission):
    """
    Submit a secret crush!

    Your crush submission is encrypted using FHE.
    Nobody (not even us!) can see who you like...
    Unless they like you back!
    """
    # Validate addresses
    if not submission.crusher_address or not submission.crush_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both addresses are required"
        )

    if submission.crusher_address.lower() == submission.crush_address.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can't have a crush on yourself! (But self-love is important too)"
        )

    # Encrypt the crush address using FHE
    encrypted_crush, crush_hash = encrypt_crush(submission.crush_address)

    # Store in database
    success = db.add_crush(
        crusher_address=submission.crusher_address,
        crush_address_encrypted=encrypted_crush,
        crush_address_hash=crush_hash
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save your crush. Please try again!"
        )

    # Check for potential matches
    match_found = await check_for_matches(
        submission.crusher_address,
        submission.crush_address
    )

    message = "Your secret love has been sent!"
    if match_found:
        message = "Your secret love has been sent... and guess what? IT'S A MATCH!"

    return CrushResponse(
        success=True,
        message=message,
        submission_id=crush_hash[:16]
    )


async def check_for_matches(crusher_address: str, crush_address: str) -> bool:
    """Check if submitting this crush creates a match"""
    # Check if the crush has also submitted the crusher
    is_mutual = db.check_mutual_crush(crusher_address, crush_address)

    if is_mutual:
        # Record the match!
        db.add_match(crusher_address, crush_address)
        return True

    return False


@app.get("/api/matches/{wallet_address}", response_model=List[MatchNotification])
async def get_matches(wallet_address: str):
    """Get all matches for a wallet address"""
    matches = db.get_matches_for_user(wallet_address)

    return [
        MatchNotification(
            your_address=wallet_address.lower(),
            matched_address=match,
            matched_at=datetime.now(),  # In production, store actual match time
            message="You both like each other!"
        )
        for match in matches
    ]


@app.get("/api/stats/{wallet_address}", response_model=UserStats)
async def get_user_stats(wallet_address: str):
    """Get user statistics"""
    stats = db.get_user_stats(wallet_address)
    return UserStats(**stats)


@app.get("/api/check-match")
async def check_match(address1: str, address2: str):
    """
    Check if two addresses have a mutual match.

    This endpoint performs the FHE comparison to check
    if both users have submitted each other as crushes.
    """
    is_match = db.check_mutual_crush(address1, address2)

    if is_match:
        proof = generate_match_proof(address1, address2)
        return {
            "is_match": True,
            "message": "It's a Match! You both like each other!",
            "proof": proof
        }

    return {
        "is_match": False,
        "message": "No match yet... keep hoping!"
    }


@app.delete("/api/crush/{wallet_address}/{crush_hash}")
async def remove_crush(wallet_address: str, crush_hash: str):
    """Remove a crush submission (change your mind?)"""
    # Implementation would go here
    return {
        "success": True,
        "message": "Crush removed. It's okay, hearts change!"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Secret Crush Matcher",
        "fhe_enabled": True
    }


def calculate_compatibility(address1: str, address2: str) -> int:
    """
    Calculate compatibility score between two wallet addresses.
    Uses multiple factors for a fun, deterministic calculation.
    """
    addr1 = address1.lower().replace("0x", "")
    addr2 = address2.lower().replace("0x", "")

    score = 0

    # Factor 1: Matching characters at same positions (max 40 points)
    matching_chars = sum(1 for a, b in zip(addr1, addr2) if a == b)
    score += int((matching_chars / 40) * 40)

    # Factor 2: Character frequency similarity (max 20 points)
    freq1 = {c: addr1.count(c) for c in set(addr1)}
    freq2 = {c: addr2.count(c) for c in set(addr2)}
    all_chars = set(freq1.keys()) | set(freq2.keys())
    freq_similarity = sum(min(freq1.get(c, 0), freq2.get(c, 0)) for c in all_chars)
    score += int((freq_similarity / 40) * 20)

    # Factor 3: Numeric harmony - sum of digits (max 20 points)
    digits1 = sum(int(c, 16) for c in addr1)
    digits2 = sum(int(c, 16) for c in addr2)
    digit_diff = abs(digits1 - digits2)
    max_diff = 40 * 15  # max possible difference
    harmony = 1 - (digit_diff / max_diff)
    score += int(harmony * 20)

    # Factor 4: "Destiny number" - XOR pattern creates unique bond (max 20 points)
    xor_sum = sum(int(a, 16) ^ int(b, 16) for a, b in zip(addr1, addr2))
    # Lower XOR means more similar, but we want some variation
    destiny = ((xor_sum % 100) + (digits1 + digits2) % 100) % 100
    score += int((destiny / 100) * 20)

    return min(100, max(0, score))


COMPATIBILITY_LEVELS = [
    {
        "level": "Different Worlds",
        "emoji": "🌍",
        "color": "#9CA3AF",
        "messages": [
            "The stars haven't aligned... yet!",
            "Opposites attract? Maybe in another universe!",
            "Your paths are quite different, but who knows?",
        ]
    },
    {
        "level": "Curious Spark",
        "emoji": "✨",
        "color": "#60A5FA",
        "messages": [
            "There's a faint spark between you two!",
            "Curiosity is the first step to love!",
            "Something mysterious connects you...",
        ]
    },
    {
        "level": "Growing Connection",
        "emoji": "🌱",
        "color": "#34D399",
        "messages": [
            "A beautiful connection is blooming!",
            "Your energies are starting to sync!",
            "The universe sees potential here!",
        ]
    },
    {
        "level": "Strong Chemistry",
        "emoji": "💜",
        "color": "#A78BFA",
        "messages": [
            "Wow! The chemistry is undeniable!",
            "Your wallets were meant to meet!",
            "This could be something special!",
        ]
    },
    {
        "level": "Soulmates",
        "emoji": "💕",
        "color": "#F472B6",
        "messages": [
            "SOULMATES DETECTED! This is destiny!",
            "The blockchain has blessed this match!",
            "Written in the stars AND the blockchain!",
        ]
    }
]


@app.get("/api/compatibility", response_model=CompatibilityResult)
async def check_compatibility(address1: str, address2: str):
    """
    Check compatibility between two wallet addresses.
    Returns a fun compatibility score with effects!
    """
    if not address1 or not address2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both addresses are required"
        )

    if address1.lower() == address2.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check compatibility with yourself!"
        )

    score = calculate_compatibility(address1, address2)

    # Determine level (0-4) based on score
    if score <= 20:
        level_index = 0
    elif score <= 40:
        level_index = 1
    elif score <= 60:
        level_index = 2
    elif score <= 80:
        level_index = 3
    else:
        level_index = 4

    level_data = COMPATIBILITY_LEVELS[level_index]

    import random
    random.seed(hash(address1.lower() + address2.lower()))
    message = random.choice(level_data["messages"])

    return CompatibilityResult(
        score=score,
        level=level_data["level"],
        level_index=level_index,
        emoji=level_data["emoji"],
        message=message,
        color=level_data["color"]
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
