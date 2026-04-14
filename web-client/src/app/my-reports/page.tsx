'use client';

import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/lib/auth-context";
import { ASHA_WEEKLY_REPORTS } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyReportsPage() {
    const { user } = useAuth();
    const assignedRegion = user?.assignedRegion || "Sambalpur";
    const reports = ASHA_WEEKLY_REPORTS.filter((report) => report.district === assignedRegion);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Personal Reporting History</h1>
                <p className="text-muted-foreground mt-1">
                    Viewing weekly submissions for: <span className="font-semibold text-foreground">{assignedRegion}</span>
                </p>
            </div>

            <div className="grid gap-4">
                {reports.map((report) => (
                    <Card key={report.id}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                Week {report.weekNumber}, {report.year} - {report.locationName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                <p><span className="text-muted-foreground">Diarrhea:</span> {report.diarrheaCases}</p>
                                <p><span className="text-muted-foreground">Cholera:</span> {report.choleraCases}</p>
                                <p><span className="text-muted-foreground">Typhoid:</span> {report.typhoidCases}</p>
                                <p><span className="text-muted-foreground">Rainfall:</span> {report.rainfall} mm</p>
                                <p><span className="text-muted-foreground">Water Quality:</span> {report.waterQuality}</p>
                                <p><span className="text-muted-foreground">Risk Level:</span> {report.riskLevel}</p>
                                <p className="sm:col-span-2 lg:col-span-2">
                                    <span className="text-muted-foreground">Symptoms:</span> {report.symptoms}
                                </p>
                                <p className="sm:col-span-2 lg:col-span-2">
                                    <span className="text-muted-foreground">Submitted:</span>{" "}
                                    {new Date(report.submittedAt).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default withAuth(MyReportsPage, ["ASHA"]);
