'use client';
import { DASHBOARD_STATS, WEEKLY_CASES_DATA } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, CloudRain, Droplets } from "lucide-react";

export default function StatsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pt-10 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Community Health Stats</h1>
                <p className="text-muted-foreground mt-2">Transparent tracking of waterborne disease trends and predictive models.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border border-blue-500/20 bg-blue-500/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total Cases (Week)</p>
                        <h2 className="text-4xl font-black text-foreground mt-1">{DASHBOARD_STATS.totalCases}</h2>
                    </CardContent>
                </Card>
                <Card className="border border-cyan-500/20 bg-cyan-500/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <CloudRain className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Avg Rainfall</p>
                        <h2 className="text-4xl font-black text-foreground mt-1">{DASHBOARD_STATS.rainfallAverage} mm</h2>
                    </CardContent>
                </Card>
                <Card className="border border-destructive/20 bg-destructive/5 shadow-sm">
                    <CardContent className="pt-6 text-center">
                        <Droplets className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Most Affected</p>
                        <h2 className="text-3xl font-black text-destructive mt-1">Dhubri</h2>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md border-border bg-card">
                <CardHeader>
                    <CardTitle>Case Outbreak Trends</CardTitle>
                    <CardDescription>Predicted and reported diarrhea cases over the last 6 weeks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={WEEKLY_CASES_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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
