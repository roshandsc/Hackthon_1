from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class StatusResponse(BaseModel):
    status: str
    message: str

STATUS_MOCKS = [
    {
        "status": "In Progress",
        "message": "Your application is currently under verification. Please check back in 2-3 working days."
    },
    {
        "status": "Approved",
        "message": "Your application has been approved and processed. The hard copy will be dispatched shortly."
    },
    {
        "status": "Pending Additional Information",
        "message": "Your application requires additional document uploads. Please check your registered email for details."
    }
]

@router.post("/status", response_model=StatusResponse)
async def check_status():
    # Return a random mock status
    selected_status = random.choice(STATUS_MOCKS)
    return StatusResponse(
        status=selected_status["status"],
        message=selected_status["message"]
    )
