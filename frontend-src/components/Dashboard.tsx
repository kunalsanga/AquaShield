"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', cholera: 400, typhoid: 240, diarrhea: 240 },
    { name: 'Feb', cholera: 300, typhoid: 139, diarrhea: 221 },
    { name: 'Mar', cholera: 200, typhoid: 980, diarrhea: 229 },
    { name: 'Apr', cholera: 278, typhoid: 390, diarrhea: 200 },
    { name: 'May', cholera: 189, typhoid: 480, diarrhea: 218 },
    { name: 'Jun', cholera: 239, typhoid: 380, diarrhea: 250 },
    { name: 'Jul', cholera: 349, typhoid: 430, diarrhea: 210 },
];

export default function Dashboard({ riskData }: { riskData?: any }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{riskData?.risk_score || "N/A"}%</div>
                    <p className="text-xs text-muted-foreground">{riskData?.risk_level || "Unknown"} Risk Level</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cholera Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{riskData?.cholera_cases_predicted || "0"}</div>
                    <p className="text-xs text-muted-foreground">Predicted cases/100k</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Typhoid Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{riskData?.typhoid_cases_predicted || "0"}</div>
                    <p className="text-xs text-muted-foreground">Predicted cases/100k</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Diarrhea Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{riskData?.diarrhea_cases_predicted || "0"}</div>
                    <p className="text-xs text-muted-foreground">Predicted cases/100k</p>
                </CardContent>
            </Card>

            <div className="col-span-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Historical Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="cholera" stroke="#8884d8" />
                                <Line type="monotone" dataKey="typhoid" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
