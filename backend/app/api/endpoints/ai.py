from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...gemini_service import get_risk_explanation

router = APIRouter()

class AIExplainRequest(BaseModel):
    area: str
    risk_score: float
    risk_level: str
    water_quality: str

class AIExplainResponse(BaseModel):
    explanation: str

@router.post("/explain", response_model=AIExplainResponse)
def explain_risk(data: AIExplainRequest):
    try:
        explanation = get_risk_explanation(
            area=data.area,
            risk_score=data.risk_score,
            risk_level=data.risk_level,
            water_quality=data.water_quality
        )
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
