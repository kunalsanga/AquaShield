import os
from typing import Optional

import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

model: Optional[genai.GenerativeModel] = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")


def _local_fallback_explanation(area: str, risk_level: str, water_quality: str) -> str:
    risk = risk_level.lower().strip()
    if risk == "high":
        return (
            f"{area} is currently in a high-risk category with {water_quality.lower()} water quality. "
            "Use boiled or filtered water for drinking and cooking, avoid raw-water contact, and monitor symptoms like diarrhea or fever. "
            "Contact local health workers immediately if multiple household members feel unwell."
        )
    if risk == "moderate":
        return (
            f"{area} shows moderate risk and {water_quality.lower()} water conditions. "
            "Boil water before drinking, clean storage containers regularly, and avoid stagnant sources. "
            "If symptoms appear, seek medical guidance early."
        )
    return (
        f"{area} is currently in a lower-risk band with {water_quality.lower()} water quality. "
        "Continue standard hygiene, store water in clean covered containers, and maintain routine filtration."
    )


def get_risk_explanation(area: str, risk_score: float, risk_level: str, water_quality: str) -> str:
    """
    Return AI-generated guidance; use deterministic local guidance on model/API failure.
    """
    prompt = f"""You are a public health assistant. Based on the following data:
Area: {area}
Risk Score: {risk_score}
Risk Level: {risk_level}
Water Quality: {water_quality}

Provide a short, clear explanation and safety recommendations (2-4 sentences max). Do not use markdown styling like asterisks, keep it plain text."""

    if model is None:
        return _local_fallback_explanation(area, risk_level, water_quality)

    try:
        response = model.generate_content(prompt)
        text = (response.text or "").replace("*", "").strip()
        if text:
            return text
    except Exception:
        pass

    return _local_fallback_explanation(area, risk_level, water_quality)
