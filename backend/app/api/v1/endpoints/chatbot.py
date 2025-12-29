from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.chatbot import ChatbotService
from app.api.v1.endpoints.transactions import db # Using the in-memory DB for now
from app.core.security import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def query_chatbot(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"] if current_user else "mock-user-id"
    user_txs = [tx for tx in db if tx.user_id == user_id]
    response_text = ChatbotService.process_message(request.message, user_txs)
    return ChatResponse(reply=response_text)
