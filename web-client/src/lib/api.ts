/**
 * Typed API client for AquaShield backend.
 * Automatically attaches the Authorization: Bearer <token> header
 * whenever a JWT is present in localStorage.
 */

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = RAW_URL.includes("/api/v1") ? RAW_URL : `${RAW_URL.replace(/\/+$/, '')}/api/v1`;
const REQUEST_TIMEOUT_MS = 30000;

// ── Low-level fetch wrapper ───────────────────────────────────────────────────
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;

    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new Error("Request timed out. The server might be waking up, please try again.");
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail ?? `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) return {} as T;

    return response.json() as Promise<T>;
}

// ── Auth API ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
    email: string;
    password: string;
    role: "ASHA" | "OFFICIAL" | "PUBLIC";
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    role: string;
    email: string;
    assigned_region?: string;
}

export const authApi = {
    register: (data: RegisterPayload) =>
        apiFetch<{ id: number; email: string; role: string }>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data: LoginPayload) =>
        apiFetch<TokenResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    warmup: () =>
        apiFetch<Record<string, unknown>>("/alerts/awareness"),
};

// ── Prediction API ────────────────────────────────────────────────────────────
export interface PredictionInput {
    ph: number;
    turbidity: number;
    temperature: number;
    dissolved_oxygen: number;
    bod: number;
    coliform: number;
    rainfall: number;
    latitude?: number;
    longitude?: number;
    location_name?: string;
    previous_cases?: number;
    current_cases?: number;
}

export interface PredictionOutput {
    id?: number;
    latitude?: number;
    longitude?: number;
    location_name?: string;
    risk_score: number;
    risk_level: string;
    cholera_cases_predicted: number;
    typhoid_cases_predicted: number;
    diarrhea_cases_predicted: number;
    rainfall?: number;
    explanation?: string;
    reasons?: string[];
    likely_diseases?: string[];
    likely_disease_predictions?: { name: string; severity: "High" | "Medium" | "Low"; confidence: number }[];
    disease_reasons?: Record<string, string>;
    recommendations?: string[];
    derived_features?: Record<string, unknown>;
    timestamp?: string;
}

export const predictApi = {
    predict: (data: PredictionInput) =>
        apiFetch<PredictionOutput>("/predict/", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getHistory: () => apiFetch<PredictionOutput[]>("/predict/history"),
};

// ── Dashboard API ─────────────────────────────────────────────────────────────
export interface MapDataPoint {
    id: string;
    location_name: string;
    latitude: number;
    longitude: number;
    ph: number;
    dissolved_oxygen: number;
    bod: number;
    risk_level: string;
    timestamp: string;
}

export interface MapDataResponse {
    stats: {
        avg_ph: number;
        avg_bod: number;
        high_risk_count: number;
        total_points: number;
        risk_score?: number;
        risk_level?: string;
        reasons?: string[];
        likely_diseases?: string[];
        likely_disease_predictions?: { name: string; severity: "High" | "Medium" | "Low"; confidence: number }[];
        disease_reasons?: Record<string, string>;
        recommendations?: string[];
        derived_features?: Record<string, unknown>;
    };
    points: MapDataPoint[];
}

export const dashboardApi = {
    getSummary: () => apiFetch<Record<string, unknown>>("/dashboard/"),
    getMapData: (lat: number, lng: number, allPoints: boolean = false) => 
        apiFetch<MapDataResponse>(`/dashboard/map-data?lat=${lat}&lng=${lng}&radius_km=50.0&all_points=${allPoints}`),
};

// ── Alerts API ────────────────────────────────────────────────────────────────
export const alertsApi = {
    getAlerts: () => apiFetch<Record<string, unknown>[]>("/alerts/"),
    getAwareness: () => apiFetch<Record<string, unknown>>("/alerts/awareness"),
};

// ── AI API ───────────────────────────────────────────────────────────────────
export interface AIExplainPayload {
    area: string;
    risk_level: string;
    risk_score?: number;
    water_quality?: string;
    reasons?: string[];
    likely_diseases?: string[];
}

export interface AIExplainResponse {
    explanation: string;
    recommendations?: string[];
}

export const aiApi = {
    explain: (data: AIExplainPayload) =>
        apiFetch<AIExplainResponse>("/ai/explain", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
