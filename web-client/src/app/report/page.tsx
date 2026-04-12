'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DISTRICTS } from "@/lib/mockData";
import { Check, Loader2 } from "lucide-react";

export default function ReportPage() {
    const [formData, setFormData] = useState({
        district: DISTRICTS[0],
        weekNumber: "",
        cases: "",
        rainfall: "",
        waterQuality: "Good",
        symptoms: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Submitted Data:", formData);
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="bg-green-100 p-6 rounded-full">
                    <Check className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Report Submitted Successfully</h2>
                <p className="text-gray-600">Thank you for updating the community health records.</p>
                <Button onClick={() => setSubmitted(false)} className="bg-blue-600">Submit Another Report</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-6 sm:py-10 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Report Health Data</h1>
                    <p className="text-gray-500 text-sm mt-2">ASHA Worker / Clinic Submission Form</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <select
                            id="district"
                            name="district"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        >
                            {DISTRICTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
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
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-base font-semibold shadow-md"
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
