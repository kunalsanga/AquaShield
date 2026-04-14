'use client';
import { useMemo, useState } from "react";
import { ALERTS, ASHA_WEEKLY_REPORTS, CASE_RECORDS, DISTRICTS } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, CloudRain, Droplets, Search } from "lucide-react";

export default function StatsPage() {
    const [selectedRegion, setSelectedRegion] = useState("Sambalpur");

    const availableRegions = useMemo(() => {
        const caseRegions = CASE_RECORDS.map((record) => record.district);
        const alertRegions = ALERTS.map((alert) => alert.district);
        return Array.from(new Set([...DISTRICTS, ...caseRegions, ...alertRegions])).sort();
    }, []);

    const regionCaseRecords = useMemo(
        () => CASE_RECORDS.filter((record) => record.district.toLowerCase() === selectedRegion.toLowerCase()),
        [selectedRegion]
    );

    const regionRainfallReports = useMemo(
        () => ASHA_WEEKLY_REPORTS.filter((report) => report.district.toLowerCase() === selectedRegion.toLowerCase()),
        [selectedRegion]
    );

    const totalCases = regionCaseRecords.reduce((sum, record) => sum + record.casesReported, 0);
    const avgRainfall = regionRainfallReports.length
        ? Math.round(regionRainfallReports.reduce((sum, report) => sum + report.rainfall, 0) / regionRainfallReports.length)
        : 0;

    const mostAffectedLocation = useMemo(() => {
        const locationTotals = regionCaseRecords.reduce<Record<string, number>>((acc, record) => {
            acc[record.locationName] = (acc[record.locationName] || 0) + record.casesReported;
            return acc;
        }, {});
        const sorted = Object.entries(locationTotals).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] || selectedRegion;
    }, [regionCaseRecords, selectedRegion]);

    const weeklyTrendData = useMemo(() => {
        const weekTotals = regionCaseRecords.reduce<Record<number, number>>((acc, record) => {
            acc[record.weekNumber] = (acc[record.weekNumber] || 0) + record.casesReported;
            return acc;
        }, {});
        const sortedWeeks = Object.keys(weekTotals)
            .map(Number)
            .sort((a, b) => a - b)
            .slice(-6);
        return sortedWeeks.map((week) => ({
            week: `Wk ${week}`,
            cases: weekTotals[week],
        }));
    }, [regionCaseRecords]);

    const chartData = weeklyTrendData.length > 0
        ? weeklyTrendData
        : [
            { week: "Wk 1", cases: 0 },
            { week: "Wk 2", cases: 0 },
            { week: "Wk 3", cases: 0 },
            { week: "Wk 4", cases: 0 },
            { week: "Wk 5", cases: 0 },
            { week: "Wk 6", cases: 0 },
        ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pt-10 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Community Health Stats</h1>
                <p className="text-muted-foreground mt-2">Transparent tracking of waterborne disease trends and predictive models.</p>
            </div>

            <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                    <div className="max-w-md mx-auto">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-primary" />
                            Search district/region
                        </label>
                        <input
                            list="region-list"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            placeholder="Type Sambalpur, Dhubri..."
                            className="w-full bg-background border border-input text-foreground rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <datalist id="region-list">
                            {availableRegions.map((region) => (
                                <option key={region} value={region} />
                            ))}
                        </datalist>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border border-blue-500/20 bg-blue-500/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total Cases (Week)</p>
                        <h2 className="text-4xl font-black text-foreground mt-1">{totalCases}</h2>
                    </CardContent>
                </Card>
                <Card className="border border-cyan-500/20 bg-cyan-500/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <CloudRain className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Avg Rainfall</p>
                        <h2 className="text-4xl font-black text-foreground mt-1">{avgRainfall} mm</h2>
                    </CardContent>
                </Card>
                <Card className="border border-destructive/20 bg-destructive/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <Droplets className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Most Affected</p>
                        <h2 className="text-3xl font-black text-destructive mt-1">{mostAffectedLocation}</h2>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md border-border bg-card">
                <CardHeader>
                    <CardTitle>Case Outbreak Trends</CardTitle>
                    <CardDescription>
                        Predicted and reported diarrhea cases over the last 6 available weeks in {selectedRegion}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                <XAxis dataKey="week" stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "var(--card)", borderRadius: "8px", borderColor: "var(--border)", color: "var(--foreground)" }} 
                                    itemStyle={{ color: "#3b82f6", fontWeight: "bold" }} 
                                />
                                <Area type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
