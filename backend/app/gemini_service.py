import os
from typing import Optional, List, Dict, Any

import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

model: Optional[genai.GenerativeModel] = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")


def _local_fallback(area: str, risk_level: str, water_quality: str, likely_diseases: Optional[List[str]]) -> Dict[str, Any]:
    risk = risk_level.lower().strip()
    diseases = ", ".join(likely_diseases or [])
    disease_part = f" Likely illnesses: {diseases}." if diseases else ""
    if risk == "high":
        explanation = (
            f"{area} is currently in a high-risk category with {water_quality.lower()} water quality. "
            f"{disease_part} "
            "Use boiled or filtered water for drinking and cooking, avoid raw-water contact, and monitor symptoms like diarrhea, vomiting, or fever. "
            "Contact local health workers immediately if multiple household members feel unwell."
        )
        recs = [
            "Boil water or use a certified filter before drinking.",
            "Avoid untreated water for cooking and brushing teeth.",
            "Wash hands with soap and disinfect storage containers.",
            "Seek medical care early if symptoms appear.",
        ]
        return {"explanation": explanation, "recommendations": recs}

    if risk in ("moderate", "medium"):
        explanation = (
            f"{area} shows moderate risk and {water_quality.lower()} water conditions. "
            f"{disease_part} "
            "Boil water before drinking, clean storage containers regularly, and avoid stagnant sources—especially after rainfall. "
            "If symptoms appear, seek medical guidance early."
        )
        recs = [
            "Boil water or use filtration for drinking and cooking.",
            "Store water in clean, covered containers and clean them regularly.",
            "Avoid stagnant sources after rainfall.",
        ]
        return {"explanation": explanation, "recommendations": recs}

    explanation = (
        f"{area} is currently in a lower-risk band with {water_quality.lower()} water quality. "
        f"{disease_part} "
        "Continue standard hygiene, store water in clean covered containers, and maintain routine filtration."
    )
    recs = [
        "Maintain standard hygiene and safe water storage practices.",
        "Use routine filtration for drinking water when possible.",
    ]
    return {"explanation": explanation, "recommendations": recs}


def get_risk_explanation(
    area: str,
    risk_score: float,
    risk_level: str,
    water_quality: str,
    reasons: Optional[List[str]] = None,
    likely_diseases: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Return AI-generated guidance; use deterministic local guidance on model/API failure.
    """
    reasons_txt = "\n".join(f"- {r}" for r in (reasons or [])) or "- (not provided)"
    diseases_txt = ", ".join(likely_diseases or []) or "(not provided)"
    prompt = f"""You are a public health assistant. Based on the following data:
Area: {area}
Risk Score: {risk_score}
Risk Level: {risk_level}
Water Quality: {water_quality}
Key reasons:
{reasons_txt}
Likely diseases:
{diseases_txt}

Write:
1) A short, plain-text explanation (2-4 sentences).
2) 3-5 bullet safety recommendations as plain text lines starting with "- ".
Do not use markdown styling like asterisks."""

    if model is None:
        return _local_fallback(area, risk_level, water_quality, likely_diseases)

    try:
        response = model.generate_content(prompt)
        text = (response.text or "").replace("*", "").strip()
        if text:
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            bullets = [ln[2:].strip() for ln in lines if ln.startswith("- ")]
            explanation_lines = [ln for ln in lines if not ln.startswith("- ")]
            explanation = " ".join(explanation_lines).strip()
            payload: Dict[str, Any] = {"explanation": explanation or text}
            if bullets:
                payload["recommendations"] = bullets[:6]
            return payload
    except Exception:
        pass

    return _local_fallback(area, risk_level, water_quality, likely_diseases)
