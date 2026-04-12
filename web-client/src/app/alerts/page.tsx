'use client';

import { withAuth } from "@/lib/withAuth";

import { useState } from "react";
import { ALERTS, DISTRICTS } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

function AlertsPage() {
    const [districtFilter, setDistrictFilter] = useState("All");
    const [riskFilter, setRiskFilter] = useState("All");

    const filteredAlerts = ALERTS.filter(alert => {
        const matchDistrict = districtFilter === "All" || alert.district === districtFilter;
        const matchRisk = riskFilter === "All" || alert.riskLevel === riskFilter;
        return matchDistrict && matchRisk;
    });

    const getRiskColor = (level: string) => {
        switch (level) {
            case "High": return "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-200";
            case "Moderate": return "bg-yellow-50 dark:bg-amber-950/30 border-yellow-500 text-yellow-900 dark:text-amber-200";
            default: return "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-200";
        }
    };

    const getIcon = (level: string) => {
        switch (level) {
            case "High": return <AlertCircle className="h-5 w-5 text-red-600" />;
            case "Moderate": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            default: return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
                    <p className="text-muted-foreground mt-1">Real-time warnings for your district.</p>
                </div>

                <div className="flex gap-4">
                    <select
                        className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                    >
                        <option value="All">All Districts</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                    >
                        <option value="All">All Risks</option>
                        <option value="High">High</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-card rounded-lg border border-border border-dashed">
                        No alerts found matching your criteria.
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg border-l-4 shadow-sm flex items-start gap-4 ${getRiskColor(alert.riskLevel)}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(alert.riskLevel)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{alert.riskLevel} Risk in {alert.district}</h3>
                                    <span className="text-xs font-medium opacity-80">{alert.date}</span>
                                </div>
                                <p className="mt-1 text-sm opacity-90">{alert.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default withAuth(AlertsPage, ["OFFICIAL"]);
