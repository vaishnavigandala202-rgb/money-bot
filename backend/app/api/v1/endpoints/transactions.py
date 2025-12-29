from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate, FinancialSummary
from app.core.security import get_current_user
import uuid

router = APIRouter()

# In-memory storage for demonstration
db = [
    {
        "id": "1",
        "user_id": "mock-user-id",
        "date": "2023-12-01",
        "description": "Apple Store",
        "category": "Technology",
        "amount": 999.00,
        "type": "debit"
    },
    {
        "id": "2",
        "user_id": "mock-user-id",
        "date": "2023-12-02",
        "description": "Salary Deposit",
        "category": "Salary",
        "amount": 5000.00,
        "type": "credit"
    },
    {
        "id": "3",
        "user_id": "mock-user-id",
        "date": "2023-12-03",
        "description": "Starbucks",
        "category": "Food & Drink",
        "amount": 15.50,
        "type": "debit"
    },
    {
        "id": "4",
        "user_id": "mock-user-id",
        "date": "2023-12-05",
        "description": "Monthly Rent",
        "category": "Housing",
        "amount": 1200.00,
        "type": "debit"
    }
]

# We need a proper Pydantic conversion for these dicts if they are to be used via schemas
from app.schemas.transaction import Transaction
db = [Transaction(**tx) for tx in db]

@router.post("/", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction: TransactionCreate, 
    current_user: dict = Depends(get_current_user)
):
    new_tx = Transaction(
        id=str(uuid.uuid4()),
        user_id=current_user["id"],
        **transaction.dict()
    )
    db.append(new_tx)
    return new_tx

@router.get("/", response_model=List[Transaction])
async def list_transactions(current_user: dict = Depends(get_current_user)):
    return [tx for tx in db if tx.user_id == current_user["id"]]

@router.get("/summary", response_model=FinancialSummary)
async def get_summary(current_user: dict = Depends(get_current_user)):
    user_txs = [tx for tx in db if tx.user_id == current_user["id"]]
    
    credited = sum(tx.amount for tx in user_txs if tx.type == "credit")
    debited = sum(tx.amount for tx in user_txs if tx.type == "debit")
    
    return FinancialSummary(
        total_balance=credited - debited,
        total_credited=credited,
        total_debited=debited,
        transaction_count=len(user_txs)
    )

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: str, 
    current_user: dict = Depends(get_current_user)
):
    global db
    initial_len = len(db)
    db = [tx for tx in db if not (tx.id == transaction_id and tx.user_id == current_user["id"])]
    if len(db) == initial_len:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return None
