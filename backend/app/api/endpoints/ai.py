from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ...gemini_service import get_risk_explanation

router = APIRouter()

class AIExplainRequest(BaseModel):
    area: str
    risk_level: str
    # Keep existing fields optional for backward compatibility with older frontend
    risk_score: Optional[float] = None
    water_quality: Optional[str] = None
    reasons: Optional[List[str]] = None
    likely_diseases: Optional[List[str]] = None

class AIExplainResponse(BaseModel):
    explanation: str
    recommendations: Optional[List[str]] = None

@router.post("/explain", response_model=AIExplainResponse)
def explain_risk(data: AIExplainRequest):
    try:
        explanation = get_risk_explanation(
            area=data.area,
            risk_score=float(data.risk_score) if data.risk_score is not None else 0.0,
            risk_level=data.risk_level,
            water_quality=data.water_quality or "Unknown",
            reasons=data.reasons,
            likely_diseases=data.likely_diseases,
        )
        # Service may optionally embed short recommendations after the explanation;
        # keep response shape stable by returning an optional list.
        if isinstance(explanation, dict):
            return explanation
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
