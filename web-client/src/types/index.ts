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

// ── Emergency Report ─────────────────────────────────────────────────────────
export interface EmergencyReport {
    id: string;
    reportedBy: string;
    area: string;
    district: string;
    diseaseType: string;
    affectedCount: number;
    severity: "Critical" | "High" | "Moderate";
    description: string;
    timestamp: string;
    status: "Pending" | "Acknowledged" | "Resolved";
    contactNumber?: string;
}

// ── ASHA Report History ──────────────────────────────────────────────────────
export interface ASHAWeeklyReport {
    id: string;
    weekNumber: number;
    year: number;
    district: string;
    locationName: string;
    diarrheaCases: number;
    choleraCases: number;
    typhoidCases: number;
    rainfall: number;
    waterQuality: WaterQuality;
    symptoms: string;
    submittedAt: string;
    riskLevel: RiskLevel;
}

// ── Case Record (Official Cases Page) ────────────────────────────────────────
export type DiseaseType = "Cholera" | "Typhoid" | "Diarrhea" | "Dysentery" | "Hepatitis A";

export interface CaseRecord {
    id: string;
    weekNumber: number;
    year: number;
    district: string;
    locationName: string;
    diseaseType: DiseaseType;
    casesReported: number;
    riskLevel: RiskLevel;
    reportedBy: string;
    reportedAt: string;
    patientAge?: string;
    waterSource?: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole = "ASHA" | "OFFICIAL" | "PUBLIC";

export interface AuthUser {
    email: string;
    role: UserRole;
    token: string;
    assignedRegion?: string;
}

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
}
