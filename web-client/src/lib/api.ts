/**
 * Typed API client for AquaShield backend.
 * Automatically attaches the Authorization: Bearer <token> header
 * whenever a JWT is present in localStorage.
 */

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = RAW_URL.includes("/api/v1") ? RAW_URL : `${RAW_URL.replace(/\/+$/, '')}/api/v1`;

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

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

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
export const dashboardApi = {
    getSummary: () => apiFetch<Record<string, unknown>>("/dashboard/"),
};

// ── Alerts API ────────────────────────────────────────────────────────────────
export const alertsApi = {
    getAlerts: () => apiFetch<Record<string, unknown>[]>("/alerts/"),
    getAwareness: () => apiFetch<Record<string, unknown>>("/alerts/awareness"),
};
