from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


@dataclass(frozen=True)
class DerivedFeatures:
    disease_growth_rate: Optional[float]
    rainfall_intensity_index: float
    water_quality_score: float  # 0-100 where higher is better


@dataclass(frozen=True)
class ExplainableRisk:
    final_risk_score: float  # 0-100
    risk_level: str  # Low, Medium, High
    reasons: List[str]
    likely_diseases: List[str]
    likely_disease_predictions: List[Dict[str, object]]
    disease_reasons: Dict[str, str]
    recommendations: List[str]
    derived: DerivedFeatures


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def rainfall_intensity_index(rainfall_mm: float) -> float:
    """
    Convert rainfall (mm) into an intensity index [0..1].
    Thresholds are intentionally simple for robustness.
    """
    r = max(0.0, float(rainfall_mm))
    # 0-10: low, 10-30: moderate, 30-60: heavy, 60+: very heavy
    if r <= 10:
        return r / 10.0
    if r <= 30:
        return 0.4 + (r - 10.0) / 20.0 * 0.3
    if r <= 60:
        return 0.7 + (r - 30.0) / 30.0 * 0.2
    return 1.0


def water_quality_score(
    *,
    ph: float,
    bod: float,
    dissolved_oxygen: float,
    turbidity: float,
    coliform: float,
) -> Tuple[float, List[str]]:
    """
    Compute a 0-100 score (higher is better) and emit human-readable reasons.
    The score blends common water safety heuristics and is resilient to noisy inputs.
    """
    reasons: List[str] = []

    # pH (ideal ~ 6.5-8.5)
    ph_penalty = 0.0
    if ph < 6.5:
        ph_penalty = _clamp((6.5 - ph) * 8.0, 0.0, 30.0)
        reasons.append("pH is below the safe range")
    elif ph > 8.5:
        ph_penalty = _clamp((ph - 8.5) * 8.0, 0.0, 30.0)
        reasons.append("pH is above the safe range")

    # BOD (lower is better)
    bod_penalty = _clamp(bod * 4.0, 0.0, 35.0)
    if bod >= 6:
        reasons.append("High BOD suggests organic pollution")
    elif bod >= 3:
        reasons.append("Elevated BOD detected")

    # DO (higher is better)
    do_penalty = 0.0
    if dissolved_oxygen < 5:
        do_penalty = _clamp((5.0 - dissolved_oxygen) * 10.0, 0.0, 30.0)
        reasons.append("Low dissolved oxygen detected")

    # Turbidity (higher is worse)
    turb_penalty = _clamp(turbidity * 2.0, 0.0, 25.0)
    if turbidity >= 10:
        reasons.append("High turbidity detected")
    elif turbidity >= 5:
        reasons.append("Moderate turbidity detected")

    # Coliform (higher is worse; treat as already scaled count)
    coli_penalty = _clamp(coliform / 50.0 * 30.0, 0.0, 35.0)
    if coliform >= 200:
        reasons.append("Very high coliform indicates fecal contamination risk")
    elif coliform >= 100:
        reasons.append("High coliform detected")

    penalty = ph_penalty + bod_penalty + do_penalty + turb_penalty + coli_penalty
    score = _clamp(100.0 - penalty, 0.0, 100.0)
    return score, reasons


def disease_hints(
    *,
    bod: float,
    dissolved_oxygen: float,
    coliform: float,
    turbidity: float,
) -> List[str]:
    likely: List[str] = []
    if coliform >= 100 or turbidity >= 10:
        likely.append("Diarrhea")
    if dissolved_oxygen < 5 and bod >= 5:
        likely.append("Cholera")
    if coliform >= 150:
        likely.append("Typhoid")
    # de-dup while preserving order
    seen = set()
    out: List[str] = []
    for d in likely:
        if d not in seen:
            seen.add(d)
            out.append(d)
    return out


def _disease_severity(confidence: float) -> str:
    if confidence >= 0.75:
        return "High"
    if confidence >= 0.45:
        return "Medium"
    return "Low"


def disease_predictions(
    *,
    bod: float,
    dissolved_oxygen: float,
    coliform: float,
    turbidity: float,
    rainfall_intensity: float,
    location_name: Optional[str],
) -> Tuple[List[Dict[str, object]], Dict[str, str]]:
    """
    Multi-disease rule-based predictions with region + rainfall adjustments.
    Keeps output deterministic and bounded in [0, 0.99].
    """
    region = (location_name or "").lower()
    is_sambalpur_like = "sambalpur" in region

    candidates: List[Tuple[str, float, str]] = []

    # Diarrhea: high coliform + turbidity
    diarrhea = 0.15 + (0.35 if coliform > 100 else 0.0) + (0.25 if turbidity >= 8 else 0.0)
    diarrhea_reason = "High coliform and turbidity detected" if diarrhea >= 0.4 else "Mild contamination indicators present"
    candidates.append(("Diarrhea", diarrhea, diarrhea_reason))

    # Cholera: high BOD + low DO + contamination
    cholera = 0.1 + (0.3 if bod > 5 else 0.0) + (0.3 if dissolved_oxygen < 5 else 0.0) + (0.15 if coliform > 120 else 0.0)
    cholera_reason = "Low DO and high BOD levels indicate severe contamination"
    candidates.append(("Cholera", cholera, cholera_reason))

    # Typhoid: high turbidity + medium coliform
    typhoid = 0.1 + (0.3 if turbidity >= 8 else 0.0) + (0.25 if 70 <= coliform <= 180 else 0.0)
    typhoid_reason = "High turbidity and sustained bacterial load suggest typhoid risk"
    candidates.append(("Typhoid", typhoid, typhoid_reason))

    # Hepatitis A: contaminated water + moderate coliform
    hep_a = 0.08 + (0.25 if bod > 3 else 0.0) + (0.25 if 60 <= coliform <= 150 else 0.0)
    hep_a_reason = "Contaminated water with moderate coliform indicates Hepatitis A possibility"
    candidates.append(("Hepatitis A", hep_a, hep_a_reason))

    # Dysentery: very high coliform + sanitation proxy
    dysentery = 0.08 + (0.45 if coliform > 200 else 0.0) + (0.2 if turbidity > 10 else 0.0)
    dysentery_reason = "Very high coliform and poor sanitation indicators detected"
    candidates.append(("Dysentery", dysentery, dysentery_reason))

    # Gastroenteritis: generalized contamination
    gastro = 0.12 + (0.25 if turbidity >= 6 else 0.0) + (0.2 if coliform >= 90 else 0.0) + (0.1 if bod > 4 else 0.0)
    gastro_reason = "General contamination pattern with elevated turbidity and bacteria"
    candidates.append(("Gastroenteritis", gastro, gastro_reason))

    boosted: List[Tuple[str, float, str]] = []
    for name, conf, reason in candidates:
        adjusted = conf
        if is_sambalpur_like and name in {"Diarrhea", "Typhoid", "Gastroenteritis"}:
            adjusted += 0.1
        if rainfall_intensity >= 0.7:
            adjusted += 0.1
        elif rainfall_intensity >= 0.4:
            adjusted += 0.05
        boosted.append((name, _clamp(adjusted, 0.0, 0.99), reason))

    detailed: List[Dict[str, object]] = []
    reasons: Dict[str, str] = {}
    for name, conf, reason in boosted:
        if conf < 0.35:
            continue
        detailed.append(
            {
                "name": name,
                "severity": _disease_severity(conf),
                "confidence": round(conf, 2),
            }
        )
        reasons[name] = reason

    detailed.sort(key=lambda x: float(x["confidence"]), reverse=True)
    return detailed, reasons


def base_recommendations(risk_level: str) -> List[str]:
    lvl = (risk_level or "").lower().strip()
    if lvl == "high":
        return [
            "Boil water for at least 1 minute (or use a certified filter) before drinking.",
            "Avoid using untreated water for cooking, brushing teeth, or making ice.",
            "Wash hands with soap frequently and disinfect storage containers.",
            "Seek medical help early if diarrhea, vomiting, or fever appears.",
        ]
    if lvl in ("medium", "moderate"):
        return [
            "Boil water or use filtration for drinking and cooking.",
            "Store water in clean, covered containers and clean them regularly.",
            "Avoid stagnant water sources after rainfall.",
        ]
    return [
        "Maintain standard hygiene and safe water storage practices.",
        "Use routine filtration for drinking water when possible.",
    ]


def explainable_final_risk(
    *,
    ml_risk_score: float,
    ph: float,
    bod: float,
    dissolved_oxygen: float,
    turbidity: float,
    coliform: float,
    rainfall: float,
    previous_cases: Optional[float],
    current_cases: Optional[float],
    location_name: Optional[str] = None,
) -> ExplainableRisk:
    """
    Combine ML + rule-based adjustments into a final score with explanations.
    """
    reasons: List[str] = []

    wq_score, wq_reasons = water_quality_score(
        ph=ph,
        bod=bod,
        dissolved_oxygen=dissolved_oxygen,
        turbidity=turbidity,
        coliform=coliform,
    )
    reasons.extend(wq_reasons)

    rain_idx = rainfall_intensity_index(rainfall)
    if rain_idx >= 0.7:
        reasons.append("Heavy rainfall observed (higher runoff/contamination risk)")
    elif rain_idx >= 0.4:
        reasons.append("Moderate rainfall observed")

    growth_rate: Optional[float] = None
    if previous_cases is not None and current_cases is not None:
        growth_rate = float(current_cases) - float(previous_cases)
        if previous_cases > 0:
            pct = (growth_rate / float(previous_cases)) * 100.0
            if pct >= 50:
                reasons.append(f"Disease cases increased by {pct:.0f}%")
            elif pct <= -30:
                reasons.append(f"Disease cases decreased by {abs(pct):.0f}%")
        else:
            if current_cases > 0:
                reasons.append("New disease cases detected compared to previous baseline")

    # Rule adjustments (bounded)
    rule_adjustment = 0.0
    if turbidity >= 10:
        rule_adjustment += 8.0
    elif turbidity >= 5:
        rule_adjustment += 4.0

    if rain_idx >= 0.7:
        rule_adjustment += 7.0
    elif rain_idx >= 0.4:
        rule_adjustment += 3.0

    if growth_rate is not None:
        if growth_rate > 5:
            rule_adjustment += 8.0
        elif growth_rate > 0:
            rule_adjustment += 4.0

    if wq_score < 50:
        rule_adjustment += 8.0
    elif wq_score < 70:
        rule_adjustment += 4.0

    final_score = _clamp(float(ml_risk_score) + rule_adjustment, 0.0, 100.0)

    # Risk level thresholds
    risk_level = "Low"
    if final_score > 35:
        risk_level = "Medium"
    if final_score > 70:
        risk_level = "High"

    likely = disease_hints(bod=bod, dissolved_oxygen=dissolved_oxygen, coliform=coliform, turbidity=turbidity)
    detailed_predictions, disease_reason_map = disease_predictions(
        bod=bod,
        dissolved_oxygen=dissolved_oxygen,
        coliform=coliform,
        turbidity=turbidity,
        rainfall_intensity=rain_idx,
        location_name=location_name,
    )
    if detailed_predictions:
        likely = [d["name"] for d in detailed_predictions]
    recs = base_recommendations(risk_level)

    # Keep reasons concise but stable
    deduped: List[str] = []
    seen = set()
    for r in reasons:
        key = r.strip().lower()
        if key and key not in seen:
            seen.add(key)
            deduped.append(r)

    return ExplainableRisk(
        final_risk_score=round(final_score, 2),
        risk_level=risk_level,
        reasons=deduped[:6],
        likely_diseases=likely,
        likely_disease_predictions=detailed_predictions,
        disease_reasons=disease_reason_map,
        recommendations=recs,
        derived=DerivedFeatures(
            disease_growth_rate=round(growth_rate, 2) if growth_rate is not None else None,
            rainfall_intensity_index=round(rain_idx, 3),
            water_quality_score=round(wq_score, 2),
        ),
    )

