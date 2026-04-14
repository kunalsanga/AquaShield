from fastapi import APIRouter

router = APIRouter()


@router.get("/metrics", summary="Basic model evaluation metrics")
def get_model_metrics():
    """
    Simple, production-safe metrics endpoint.
    If you later add offline evaluation, swap these values with real computed metrics.
    """
    return {
        "accuracy": 0.82,
        "precision": 0.79,
        "recall": 0.76,
        "note": "Baseline metrics (placeholder) — replace with offline evaluation results when available.",
    }

