'use client';
import { useState, useEffect } from 'react';
import { aiApi, dashboardApi } from "@/lib/api";
import { CASE_RECORDS } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";

import { withAuth } from "@/lib/withAuth";
import dynamic from "next/dynamic";

const MapDashboard = dynamic(() => import("@/components/MapDashboard"), { ssr: false, loading: () => <div className="h-[500px] w-full rounded-xl bg-muted animate-pulse border border-border"></div> });

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import {
    Activity,
    CloudRain,
    Droplets,
    AlertTriangle,
    Sparkles,
    ShieldAlert
} from "lucide-react";

const DATA = [
    { name: "Week 1", cases: 45, rainfall: 120 },
    { name: "Week 2", cases: 52, rainfall: 132 },
    { name: "Week 3", cases: 38, rainfall: 101 },
    { name: "Week 4", cases: 65, rainfall: 154 },
    { name: "Week 5", cases: 48, rainfall: 110 },
    { name: "Week 6", cases: 60, rainfall: 140 },
];

function Dashboard() {
    const { user } = useAuth();
    const assignedRegion = user?.assignedRegion || "Sambalpur";
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [aiRecommendations, setAiRecommendations] = useState<string[] | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [systemReasons, setSystemReasons] = useState<string[]>([]);
    const [systemDiseases, setSystemDiseases] = useState<string[]>([]);
    const [systemDiseaseDetails, setSystemDiseaseDetails] = useState<{ name: string; severity: "High" | "Medium" | "Low"; confidence: number }[]>([]);
    const [systemDiseaseReasons, setSystemDiseaseReasons] = useState<Record<string, string>>({});
    const [systemRecs, setSystemRecs] = useState<string[]>([]);
    const regionCases = CASE_RECORDS.filter((record) => record.district === assignedRegion);
    const currentWeek = regionCases.reduce((max, rec) => Math.max(max, rec.weekNumber), 0);
    const weeklyCasesCount = regionCases
        .filter((record) => record.weekNumber === currentWeek)
        .reduce((sum, record) => sum + record.casesReported, 0);
    const diseasesDetectedThisMonth = new Set(
        regionCases
            .filter((record) => {
                const reported = new Date(record.reportedAt);
                const now = new Date();
                return reported.getMonth() === now.getMonth() && reported.getFullYear() === now.getFullYear();
            })
            .map((record) => record.diseaseType)
    ).size;
    const riskDistribution = regionCases.reduce(
        (acc, record) => {
            const normalizedRisk = (record.riskLevel === "Moderate" ? "Medium" : record.riskLevel) as "High" | "Medium" | "Low";
            acc[normalizedRisk] += 1;
            return acc;
        },
        { High: 0, Medium: 0, Low: 0 }
    );

    useEffect(() => {
        const fetchAiInsight = async () => {
            setIsAiLoading(true);
            try {
                // Use an all-points map-data call to get explainable system stats
                const mapData = await dashboardApi.getMapData(22.3511, 78.6677, true);
                const stats: any = mapData.stats || {};
                const reasons: string[] = stats.reasons || [];
                const likelyDiseases: string[] = stats.likely_diseases || [];
                const likelyDiseaseDetails = stats.likely_disease_predictions || [];
                const diseaseReasons = stats.disease_reasons || {};
                const recs: string[] = stats.recommendations || [];

                setSystemReasons(reasons);
                setSystemDiseases(likelyDiseases);
                setSystemDiseaseDetails(likelyDiseaseDetails);
                setSystemDiseaseReasons(diseaseReasons);
                setSystemRecs(recs);

                const aiData = await aiApi.explain({
                    area: "System Wide Overview",
                    risk_score: stats.risk_score ?? 85,
                    risk_level: stats.risk_level ?? "High",
                    water_quality: "Moderate",
                    reasons,
                    likely_diseases: likelyDiseases,
                });
                setAiExplanation(aiData.explanation);
                setAiRecommendations(aiData.recommendations || null);
            } catch (err) {
                setAiError("Failed to fetch AI insights.");
            } finally {
                setIsAiLoading(false);
            }
        };
        fetchAiInsight();
    }, []);

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Dashboard</h1>
                <p className="text-muted-foreground">Real-time monitoring of community health metrics.</p>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-sm text-blue-800 font-semibold">
                    <ShieldAlert className="w-4 h-4" />
                    Assigned Region: {assignedRegion}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases (Week)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{weeklyCasesCount}</div>
                        <p className="text-xs text-muted-foreground">Week {currentWeek || "-"}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Diseases This Month</CardTitle>
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{diseasesDetectedThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Unique disease types detected</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Risk Distribution</CardTitle>
                        <Droplets className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold text-foreground">H:{riskDistribution.High} M:{riskDistribution.Medium} L:{riskDistribution.Low}</div>
                        <p className="text-xs text-muted-foreground">By records in {assignedRegion}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow bg-red-50 dark:bg-red-950/25">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Risk Level</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {riskDistribution.High > riskDistribution.Medium ? "High" : "Medium"}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-300 font-medium">Current regional concern level</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights Card */}
            <Card className="border-border bg-card shadow-md overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 font-bold text-lg mb-3 text-primary">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h3>AI System Insights</h3>
                    </div>
                    {isAiLoading ? (
                        <div className="text-muted-foreground animate-pulse flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                            Analyzing system data...
                        </div>
                    ) : aiError ? (
                        <p className="text-red-500 text-sm">{aiError}</p>
                    ) : aiExplanation ? (
                        <div className="space-y-4">
                            <p className="text-foreground leading-relaxed">{aiExplanation}</p>

                            {systemReasons.length > 0 && (
                                <div className="bg-background/70 rounded-xl p-4 border border-border/60">
                                    <p className="font-bold text-foreground text-sm mb-2">Why the system is at this risk</p>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                        {systemReasons.slice(0, 6).map((r, idx) => (
                                            <li key={idx}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {systemDiseases.length > 0 && (
                                <div className="bg-background/70 rounded-xl p-4 border border-border/60">
                                    <p className="font-bold text-foreground text-sm mb-2">Possible diseases</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(systemDiseaseDetails.length > 0 ? systemDiseaseDetails : systemDiseases.map((name) => ({ name, severity: "Medium" as const, confidence: 0.5 }))).slice(0, 8).map((d, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    d.severity === "High"
                                                        ? "bg-red-500/15 text-red-700 border-red-500/30"
                                                        : d.severity === "Medium"
                                                        ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                                                        : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                                                }`}
                                                title={systemDiseaseReasons[d.name] || "No reason available"}
                                            >
                                                {d.name} {d.severity} ({Math.round((d.confidence || 0.5) * 100)}%)
                                            </span>
                                        ))}
                                    </div>
                                    {systemDiseaseDetails.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            {systemDiseaseDetails.slice(0, 4).map((d, idx) => (
                                                <p key={idx} className="text-xs text-muted-foreground">
                                                    <span className="font-semibold">Why {d.name}?</span>{" "}
                                                    {systemDiseaseReasons[d.name] || "No specific reason available."}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(aiRecommendations && aiRecommendations.length > 0) || systemRecs.length > 0 ? (
                                <div className="bg-background/70 rounded-xl p-4 border border-border/60">
                                    <p className="font-bold text-foreground text-sm mb-2">Recommendations</p>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                        {(aiRecommendations || systemRecs).slice(0, 6).map((a, idx) => (
                                            <li key={idx}>{a}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* Geographical Distribution Map */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Geographical Risk Distribution</CardTitle>
                    <CardDescription>Real-time map of predictive health reports across regions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MapDashboard highlightedRegion={assignedRegion} />
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">

                {/* Cases Trend */}
                <Card className="col-span-1 lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Disease Outbreak Trends</CardTitle>
                        <CardDescription>Weekly reported diarrhea cases over time.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DATA}>
                                    <defs>
                                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                        itemStyle={{ color: "#1f2937" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cases"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorCases)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Rainfall vs Cases */}
                <Card className="col-span-1 lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Rainfall Impact</CardTitle>
                        <CardDescription>Correlation between rainfall (mm) and cases.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cases" />
                                    <Bar yAxisId="right" dataKey="rainfall" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(Dashboard, ["OFFICIAL"]);
