from fastapi import APIRouter
from pydantic import BaseModel
import os
import random

try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

router = APIRouter()

from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str

# Use a hardcoded prompt logic fallback for the hackathon if API key is not present
SYSTEM_PROMPT = "You are a helpful, conversational AI assistant (like ChatGPT). You can answer any questions and chat about any topic in real-time. Additionally, you are an expert on government digital services (PAN card, Aadhaar, tax filing, etc.) and should provide clear, step-by-step guidance when asked about these topics. Be concise, friendly, and engaging."

def get_fallback_response(message: str) -> str:
    msg = message.lower()
    if "pan" in msg:
        return "To apply for a PAN card:\n1. Visit the NSDL or UTIITSL website.\n2. Fill out Form 49A online.\n3. Upload required documents (Identity, Address, and Date of Birth proof).\n4. Pay the application fee.\n5. Submit and track using your 15-digit acknowledgment number."
    elif "aadhaar" in msg:
        return "To update your Aadhaar details:\n1. Go to the myAadhaar portal (myaadhaar.uidai.gov.in).\n2. Login using your Aadhaar number and OTP.\n3. Select the 'Update Aadhaar Online' option online or 'Book Appointment' for offline updates.\n4. Upload supporting documents and submit your request."
    elif "tax" in msg:
        return "For Tax Help:\n1. Ensure you have your Form 16, PAN, and Aadhaar linked.\n2. Login to the Income Tax e-Filing portal.\n3. Select 'e-File' > 'Income Tax Returns' > 'File Income Tax Return'.\n4. Choose the relevant assessment year and ITR form, fill the required details, verify, and submit."
    elif "status" in msg:
        return "You can check your application status using the 'Check Application Status' button in the quick menu, or tell me your application number."
    else:
        return "*(Offline Mode)* I am currently operating without an API key, so I can't provide real-time open conversation right now. However, I can still provide hardcoded help for specific topics like PAN card applications, Aadhaar updates, tax filing, and status checks!"

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    
    if HAS_GROQ and api_key:
        try:
            client = Groq(api_key=api_key)
            
            # Format history for Groq (OpenAI format)
            formatted_messages = [
                {"role": "system", "content": SYSTEM_PROMPT}
            ]
            
            if request.history:
                for msg in request.history:
                    # Map roles (Groq supports system, user, assistant)
                    role = "assistant" if msg.role == "model" else msg.role
                    formatted_messages.append({
                        "role": role,
                        "content": msg.content
                    })
            
            # Add the current message
            formatted_messages.append({
                "role": "user",
                "content": request.message
            })
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=formatted_messages,
                temperature=0.7,
            )
            
            return ChatResponse(response=completion.choices[0].message.content)
        except Exception as e:
            # Fallback on error
            print(f"Groq API Error: {e}")
            return ChatResponse(response=get_fallback_response(request.message))
    else:
        return ChatResponse(response=get_fallback_response(request.message))
