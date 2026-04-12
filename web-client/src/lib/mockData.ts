import { Alert, DashboardStats, ReportData } from "../types";

export const WEEKLY_CASES_DATA = [
    { week: 'Wk 1', cases: 12 },
    { week: 'Wk 2', cases: 19 },
    { week: 'Wk 3', cases: 15 },
    { week: 'Wk 4', cases: 28 },
    { week: 'Wk 5', cases: 45 },
    { week: 'Wk 6', cases: 32 },
];

export const RAINFALL_VS_CASES_DATA = [
    { week: 'Wk 1', rainfall: 120, cases: 12 },
    { week: 'Wk 2', rainfall: 150, cases: 19 },
    { week: 'Wk 3', rainfall: 180, cases: 15 },
    { week: 'Wk 4', rainfall: 220, cases: 28 },
    { week: 'Wk 5', rainfall: 300, cases: 45 },
    { week: 'Wk 6', rainfall: 250, cases: 32 },
];

export const DASHBOARD_STATS: DashboardStats = {
    totalCases: 151,
    rainfallAverage: 203,
    waterQualityStatus: "Moderate",
    currentRiskLevel: "High"
};

export const ALERTS: Alert[] = [
    {
        id: "1",
        district: "Dhubri",
        date: "2024-02-15",
        riskLevel: "High",
        message: "Critical rainfall levels detected. High probability of water contamination."
    },
    {
        id: "2",
        district: "Barpeta",
        date: "2024-02-14",
        riskLevel: "Moderate",
        message: "Rising diarrhea cases reported near river banks."
    },
    {
        id: "3",
        district: "Kamrup",
        date: "2024-02-12",
        riskLevel: "Low",
        message: "Water quality parameters within safe limits."
    },
    {
        id: "4",
        district: "Nalbari",
        date: "2024-02-10",
        riskLevel: "High",
        message: "Bacterial count exceeds safety threshold in community wells."
    },
    {
        id: "5",
        district: "Sambalpur",
        date: "2024-06-15",
        riskLevel: "High",
        message: "Heavy rainfall causing increased turbidity and Cholera case spikes in Burla and Modipara."
    }
];

export const DISTRICTS = [
    "Sambalpur", "Dhubri", "Kokrajhar", "Barpeta", "Nalbari", "Baksa",
    "Kamrup", "Darrang", "Sonitpur", "Lakhimpur", "Dhemaji"
];
