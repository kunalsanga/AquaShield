'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Flame, Hand, Utensils, ShieldCheck, ShieldAlert, Phone, AlertTriangle, Info } from "lucide-react";

export default function AwarenessPage() {
    const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Low");

    const getDynamicTip = () => {
        if (riskLevel === "High") {
            return {
                title: "CRITICAL: High Risk Alert",
                message: "A severe disease outbreak or severe contamination has been detected in your area. Absolutely do not drink tap or well water without boiling it for at least 3 minutes. Rely on sealed bottled water if possible.",
                color: "bg-destructive/10 border-destructive text-destructive",
                icon: <ShieldAlert className="w-6 h-6" />
            };
        }
        if (riskLevel === "Medium") {
            return {
                title: "WARNING: Moderate Risk",
                message: "Water turbidity or minor bacterial counts are elevated. Use standard water filters and consider boiling drinking water for children and the elderly to be safe.",
                color: "bg-amber-500/10 border-amber-500 text-amber-600",
                icon: <AlertTriangle className="w-6 h-6" />
            };
        }
        return {
            title: "SAFE: Low Risk",
            message: "Water quality is currently within safe parameters. Continue standard hygiene practices.",
            color: "bg-emerald-500/10 border-emerald-500 text-emerald-600",
            icon: <ShieldCheck className="w-6 h-6" />
        };
    };

    const dynamicTip = getDynamicTip();

    const sections = [
        {
            title: "Safe Water Practices",
            items: [
                { title: "Boiling Practices", icon: <Flame className="h-6 w-6 text-orange-500" />, content: "Boil water for at least 1 minute (3 minutes at high altitudes) to kill harmful bacteria and parasites effectively.", color: "border-orange-500" },
                { title: "Water Storage", icon: <Droplet className="h-6 w-6 text-blue-500" />, content: "Ensure water storage containers are washed daily, completely sealed, and kept away from direct sunlight.", color: "border-blue-500" }
            ]
        },
        {
            title: "Hygiene Tips",
            items: [
                { title: "Hand Hygiene", icon: <Hand className="h-6 w-6 text-teal-500" />, content: "Wash hands with soap for at least 20 seconds before eating and immediately after using the restroom.", color: "border-teal-500" },
                { title: "Food Safety", icon: <Utensils className="h-6 w-6 text-green-500" />, content: "Avoid street food during monsoon season. Wash raw fruits and vegetables thoroughly with filtered water.", color: "border-green-500" }
            ]
        },
        {
            title: "Emergency Actions",
            items: [
                { title: "Seek Medical Help", icon: <Info className="h-6 w-6 text-indigo-500" />, content: "If you experience severe diarrhea or vomiting, immediately drink ORS (Oral Rehydration Solution) and visit the nearest clinic.", color: "border-indigo-500" },
                { title: "Report Outbreaks", icon: <Phone className="h-6 w-6 text-purple-500" />, content: "Notify your local ASHA worker immediately if multiple family members show similar symptoms of waterborne diseases.", color: "border-purple-500" }
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pt-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground">Health Awareness & Prevention</h1>
                <p className="text-muted-foreground mt-2">Interactive guidelines to keep your family and community safe from water-borne diseases.</p>
            </div>

            {/* Dynamic Risk Simulator */}
            <Card className="border-border shadow-sm bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Simulate Guidance by Risk Level</span>
                        <div className="flex gap-2">
                            {["Low", "Medium", "High"].map(level => (
                                <button 
                                    key={level}
                                    onClick={() => setRiskLevel(level as any)}
                                    className={`px-3 py-1 text-sm rounded-full transition-all border ${
                                        riskLevel === level 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                                        : 'bg-background text-muted-foreground hover:bg-accent border-border'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className={`p-4 rounded-xl border-l-4 flex gap-4 ${dynamicTip.color} transition-colors duration-300`}>
                        <div className="mt-1">{dynamicTip.icon}</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{dynamicTip.title}</h3>
                            <p className="opacity-90 leading-relaxed text-sm">{dynamicTip.message}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map(section => (
                    <div key={section.title} className="space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-foreground">{section.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.items.map((item, index) => (
                                <Card key={index} className={`hover:shadow-md transition-shadow border-t-4 ${item.color} bg-card`}>
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <div className="p-3 rounded-full bg-secondary">
                                            {item.icon}
                                        </div>
                                        <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm leading-relaxed">
                                        {item.content}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
