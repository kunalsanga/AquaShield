'use client';

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
    AlertTriangle
} from "lucide-react";

const DATA = [
    { name: "Week 1", cases: 45, rainfall: 120 },
    { name: "Week 2", cases: 52, rainfall: 132 },
    { name: "Week 3", cases: 38, rainfall: 101 },
    { name: "Week 4", cases: 65, rainfall: 154 },
    { name: "Week 5", cases: 48, rainfall: 110 },
    { name: "Week 6", cases: 60, rainfall: 140 },
];

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Live Dashboard</h1>
                <p className="text-gray-500">Real-time monitoring of community health metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Cases (Week)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">60</div>
                        <p className="text-xs text-gray-500">+12% from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Avg Rainfall</CardTitle>
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">140 mm</div>
                        <p className="text-xs text-gray-500">Moderate levels</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Water Quality</CardTitle>
                        <Droplets className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">Moderate</div>
                        <p className="text-xs text-gray-500">Requires filtration</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-800">Risk Level</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">High</div>
                        <p className="text-xs text-red-600 font-medium">Alert Authorities</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Cases Trend */}
                <Card className="col-span-4 shadow-sm">
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
                <Card className="col-span-3 shadow-sm">
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
