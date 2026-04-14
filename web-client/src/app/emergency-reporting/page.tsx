'use client';

import { FormEvent, useState } from "react";
import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function EmergencyReportingPage() {
    const { user } = useAuth();
    const assignedRegion = user?.assignedRegion || "Sambalpur";
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        diseaseType: "Water-borne disease cluster",
        affectedCount: "",
        severity: "High",
        description: "",
        contactNumber: "",
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Emergency Reporting</h1>
                <p className="text-muted-foreground mt-1">
                    Assigned area: <span className="font-semibold text-foreground">{assignedRegion}</span>
                </p>
            </div>

            <Card className="border-red-200/70 bg-red-50/60 dark:bg-red-950/20 dark:border-red-900/60">
                <CardContent className="pt-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-300">
                        Use this page for sudden outbreaks or high-risk events that need immediate escalation to the water sanitation department.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Submit Emergency Alert</CardTitle>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 p-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                            <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                Emergency report submitted for {assignedRegion}. Authorities have been notified for rapid response.
                            </p>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="diseaseType">Disease/Event Type</Label>
                                <Input
                                    id="diseaseType"
                                    value={formData.diseaseType}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, diseaseType: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="affectedCount">Approx. Affected Cases</Label>
                                    <Input
                                        id="affectedCount"
                                        type="number"
                                        min="1"
                                        value={formData.affectedCount}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, affectedCount: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="severity">Severity</Label>
                                    <select
                                        id="severity"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.severity}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value }))}
                                    >
                                        <option value="Critical">Critical</option>
                                        <option value="High">High</option>
                                        <option value="Moderate">Moderate</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Situation Details</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mention localities affected, symptoms seen, and urgency."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))}
                                    placeholder="+91..."
                                />
                            </div>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-primary-foreground">
                                Send Emergency Alert
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(EmergencyReportingPage, ["ASHA"]);
