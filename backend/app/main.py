from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import transactions, chatbot, reports
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    transactions.router, 
    prefix="/api/v1/transactions", 
    tags=["transactions"]
)

app.include_router(
    chatbot.router,
    prefix="/api/v1/chatbot",
    tags=["chatbot"]
)

app.include_router(
    reports.router,
    prefix="/api/v1/reports",
    tags=["reports"]
)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
