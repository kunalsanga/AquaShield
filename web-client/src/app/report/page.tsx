'use client';

import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/lib/auth-context";

import { useState } from "react";
import dynamic from "next/dynamic";
import { predictApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, MapPin } from "lucide-react";

const MapSelector = dynamic<any>(() => import("@/components/MapSelector"), { ssr: false });


function ReportPage() {
    const { user } = useAuth();
    const assignedRegion = user?.assignedRegion || "Sambalpur";
    const [formData, setFormData] = useState({
        lat: null as number | null,
        lng: null as number | null,
        locationName: "",
        weekNumber: "",
        cases: "",
        rainfall: "",
        waterQuality: "Good",
        symptoms: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleLocationSelect = (lat: number, lng: number, locationName: string) => {
        setFormData(prev => ({ ...prev, lat, lng, locationName }));
        setError("");
    };


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (!formData.lat || !formData.lng) {
            setError("Please select a location on the map.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // Mapping UI values to backend PredictionInput
            // using simulated average sensor values for health worker reports
            await predictApi.predict({
                latitude: formData.lat,
                longitude: formData.lng,
                location_name: formData.locationName,
                ph: 7.2,
                turbidity: formData.waterQuality === 'Poor' ? 15.5 : formData.waterQuality === 'Moderate' ? 8.2 : 2.5,
                temperature: 28.5,
                dissolved_oxygen: 6.8,
                bod: 3.2,
                coliform: formData.waterQuality === 'Poor' ? 1500 : 250,
                rainfall: parseFloat(formData.rainfall) || 0
            });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full">
                    <Check className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Report Submitted Successfully</h2>
                <p className="text-muted-foreground">Thank you for updating the community health records.</p>
                <Button onClick={() => setSubmitted(false)} className="bg-blue-600 hover:bg-blue-700 text-primary-foreground">Submit Another Report</Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
            <div className="bg-card shadow-xl rounded-2xl p-6 sm:p-8 border border-border">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Report Health Data</h1>
                    <p className="text-muted-foreground text-sm mt-2">ASHA Worker / Clinic Submission Form</p>
                    <p className="text-muted-foreground text-sm mt-1">
                        Assigned area: <span className="font-semibold text-foreground">{assignedRegion}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Select Location
                        </Label>
                        <MapSelector
                            onLocationSelect={handleLocationSelect}
                            mapClassName="h-[420px] sm:h-[540px] lg:h-[620px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weekNumber">Week Number</Label>
                            <Input
                                id="weekNumber"
                                name="weekNumber"
                                type="number"
                                placeholder="e.g. 12"
                                value={formData.weekNumber}
                                onChange={handleChange}
                                required
                                min="1"
                                max="52"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cases">Diarrhea Cases</Label>
                            <Input
                                id="cases"
                                name="cases"
                                type="number"
                                placeholder="0"
                                value={formData.cases}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rainfall">Rainfall (mm)</Label>
                            <Input
                                id="rainfall"
                                name="rainfall"
                                type="number"
                                placeholder="0.0"
                                step="0.1"
                                value={formData.rainfall}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waterQuality">Water Quality</Label>
                            <select
                                id="waterQuality"
                                name="waterQuality"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.waterQuality}
                                onChange={handleChange}
                            >
                                <option value="Good">Good</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="symptoms">Observed Symptoms (Optional)</Label>
                        <Textarea
                            id="symptoms"
                            name="symptoms"
                            placeholder="Describe any specific symptoms reported..."
                            value={formData.symptoms}
                            onChange={handleChange}
                            className="min-h-[100px]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground h-11 text-base font-semibold shadow-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default withAuth(ReportPage, ["ASHA", "OFFICIAL"]);
