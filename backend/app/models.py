from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CrushSubmission(BaseModel):
    """Model for submitting a crush"""
    crusher_address: str = Field(..., description="Wallet address of the person submitting")
    crush_address: str = Field(..., description="Wallet address of the crush")


class CrushResponse(BaseModel):
    """Response after submitting a crush"""
    success: bool
    message: str
    submission_id: Optional[str] = None


class MatchResult(BaseModel):
    """Result of a match check"""
    is_match: bool
    matched_address: Optional[str] = None
    matched_at: Optional[datetime] = None


class UserStats(BaseModel):
    """User statistics"""
    wallet_address: str
    crushes_sent: int = 0
    matches_count: int = 0
    matches: List[str] = []


class MatchNotification(BaseModel):
    """Notification when a match is found"""
    your_address: str
    matched_address: str
    matched_at: datetime
    message: str = "It's a Match! You both like each other!"


class EncryptedData(BaseModel):
    """Encrypted data wrapper"""
    ciphertext: str
    public_key_hash: str


class CompatibilityResult(BaseModel):
    """Result of compatibility check between two wallet addresses"""
    score: int = Field(..., ge=0, le=100, description="Compatibility score 0-100")
    level: str = Field(..., description="Compatibility level name")
    level_index: int = Field(..., ge=0, le=4, description="Level index 0-4")
    emoji: str = Field(..., description="Emoji representing the level")
    message: str = Field(..., description="Fun message about compatibility")
    color: str = Field(..., description="Theme color for this level")
