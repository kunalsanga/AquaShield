export type District =
    | "Sambalpur"
    | "Dhubri"
    | "Kokrajhar"
    | "Barpeta"
    | "Nalbari"
    | "Baksa"
    | "Kamrup"
    | "Darrang"
    | "Sonitpur"
    | "Lakhimpur"
    | "Dhemaji";

export type RiskLevel = "Low" | "Moderate" | "High";
export type WaterQuality = "Good" | "Moderate" | "Poor";

export interface ReportData {
    id?: string;
    district: District;
    weekNumber: number;
    diarrheaCases: number;
    rainfall: number;
    waterQuality: WaterQuality;
    symptoms?: string;
    submittedAt?: Date;
}

export interface Alert {
    id: string;
    district: District;
    date: string;
    riskLevel: RiskLevel;
    message: string;
}

export interface DashboardStats {
    totalCases: number;
    rainfallAverage: number;
    waterQualityStatus: WaterQuality;
    currentRiskLevel: RiskLevel;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole = "ASHA" | "OFFICIAL" | "PUBLIC";

export interface AuthUser {
    email: string;
    role: UserRole;
    token: string;
}

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
}
