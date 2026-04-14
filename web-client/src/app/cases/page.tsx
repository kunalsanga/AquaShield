'use client';

import { useMemo, useState } from "react";
import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/lib/auth-context";
import { CASE_RECORDS } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const riskToFilter = (value: string) => (value === "Moderate" ? "Medium" : value);
const riskBadgeClass = (risk: string) => {
    if (risk === "High") return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    if (risk === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
};

function CasesPage() {
    const { user } = useAuth();
    const assignedRegion = user?.assignedRegion || "Sambalpur";
    const districtCases = useMemo(
        () => CASE_RECORDS.filter((record) => record.district === assignedRegion),
        [assignedRegion]
    );
    const latestWeek = districtCases.reduce((max, rec) => Math.max(max, rec.weekNumber), 0);

    const [weekFilter, setWeekFilter] = useState(String(latestWeek));
    const [riskFilter, setRiskFilter] = useState("All");
    const [diseaseFilter, setDiseaseFilter] = useState("All");

    const filteredCases = districtCases.filter((record) => {
        const matchWeek = weekFilter === "All" || String(record.weekNumber) === weekFilter;
        const matchRisk = riskFilter === "All" || riskToFilter(record.riskLevel) === riskFilter;
        const matchDisease = diseaseFilter === "All" || record.diseaseType === diseaseFilter;
        return matchWeek && matchRisk && matchDisease;
    });

    const weeks = Array.from(new Set(districtCases.map((record) => record.weekNumber))).sort((a, b) => b - a);
    const diseaseTypes = Array.from(new Set(districtCases.map((record) => record.diseaseType)));
    const totalFilteredCases = filteredCases.reduce((sum, record) => sum + record.casesReported, 0);
    const highRiskCount = filteredCases.filter((record) => riskToFilter(record.riskLevel) === "High").length;
    const uniqueLocations = new Set(filteredCases.map((record) => record.locationName)).size;
    const diseaseBreakdown = diseaseTypes
        .map((disease) => ({
            disease,
            count: filteredCases
                .filter((record) => record.diseaseType === disease)
                .reduce((sum, record) => sum + record.casesReported, 0),
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Cases</h1>
                <p className="text-muted-foreground mt-1">
                    Default weekly view for assigned region: <span className="font-semibold text-foreground">{assignedRegion}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filter Cases</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Week</label>
                        <select
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={weekFilter}
                            onChange={(e) => setWeekFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            {weeks.map((week) => (
                                <option key={week} value={String(week)}>
                                    Current Week {week}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Risk Level</label>
                        <select
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Disease Type</label>
                        <select
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={diseaseFilter}
                            onChange={(e) => setDiseaseFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            {diseaseTypes.map((disease) => (
                                <option key={disease} value={disease}>{disease}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Records Shown</p>
                        <p className="text-2xl font-bold mt-1">{filteredCases.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Total Reported Cases</p>
                        <p className="text-2xl font-bold mt-1">{totalFilteredCases}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">High Risk Entries</p>
                        <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{highRiskCount}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Locations Covered</p>
                        <p className="text-2xl font-bold mt-1">{uniqueLocations}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Disease-wise Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    {diseaseBreakdown.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data available for selected filters.</p>
                    ) : (
                        <div className="space-y-3">
                            {diseaseBreakdown.map((item) => (
                                <div key={item.disease}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{item.disease}</span>
                                        <span className="text-muted-foreground">{item.count} cases</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                                            style={{ width: `${Math.max(8, (item.count / Math.max(totalFilteredCases, 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {filteredCases.length === 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground text-sm">No case records match the selected filters.</p>
                        </CardContent>
                    </Card>
                )}
                {filteredCases.map((record) => (
                    <Card key={record.id}>
                        <CardContent className="pt-6 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <p><span className="text-muted-foreground">Week:</span> {record.weekNumber}, {record.year}</p>
                            <p><span className="text-muted-foreground">Disease:</span> {record.diseaseType}</p>
                            <p><span className="text-muted-foreground">Cases:</span> <span className="font-semibold">{record.casesReported}</span></p>
                            <p>
                                <span className="text-muted-foreground">Risk:</span>{" "}
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${riskBadgeClass(riskToFilter(record.riskLevel))}`}>
                                    {riskToFilter(record.riskLevel)}
                                </span>
                            </p>
                            <p><span className="text-muted-foreground">Location:</span> {record.locationName}</p>
                            <p><span className="text-muted-foreground">Reported by:</span> {record.reportedBy}</p>
                            <p className="sm:col-span-2">
                                <span className="text-muted-foreground">Reported at:</span> {new Date(record.reportedAt).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default withAuth(CasesPage, ["OFFICIAL"]);
