from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List
from enum import Enum

class TransactionType(str, Enum):
    CREDIT = "credit"
    DEBIT = "debit"

class TransactionBase(BaseModel):
    date: date
    description: str
    category: str
    amount: float = Field(..., gt=0)
    type: TransactionType

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    description: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[TransactionType] = None

class Transaction(TransactionBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class FinancialSummary(BaseModel):
    total_balance: float
    total_credited: float
    total_debited: float
    transaction_count: int
