from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, status
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Government Service Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router, prefix="/api")
app.include_router(status.router, prefix="/api")

@app.get("/api/services")
async def get_services():
    return {
        "services": [
            {"id": "pan", "name": "Apply PAN Card"},
            {"id": "status", "name": "Check Application Status"},
            {"id": "aadhaar", "name": "Aadhaar Update"},
            {"id": "tax", "name": "Tax Help"}
        ]
    }

@app.get("/")
def read_root():
    return {"message": "Government Service Assistant API is running"}
