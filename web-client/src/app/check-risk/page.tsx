'use client';
import { useState } from 'react';
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { DISTRICTS, ALERTS } from "@/lib/mockData";
import { dashboardApi } from "@/lib/api";
import { ShieldCheck, ShieldAlert, Droplets, HeartPulse, MapPin } from "lucide-react";

// Dynamic import for MapSelector to avoid SSR issues
const MapSelector = dynamic(() => import("@/components/MapSelector"), { ssr: false });

export default function CheckRiskPage() {
    const [selectedName, setSelectedName] = useState("");
    const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = (lat: number, lng: number, name: string) => {
        setCoordinates({ lat, lng });
        
        // Clean up name for input (remove coords text if it's there)
        const cleanName = name.split(' (')[0];
        setSelectedName(cleanName !== "Click on the map to select a location" ? cleanName : "");
    };

    const handleCheck = async () => {
        if (!selectedName && !coordinates) return;
        setResult(null);
        setLoading(true);

        try {
            if (coordinates) {
                // Real data lookup from map coordinates
                const data = await dashboardApi.getMapData(coordinates.lat, coordinates.lng);
                
                let riskLevel = "Low";
                let msg = "Water quality parameters are within safe limits. Manage standard hygiene.";
                
                if (data.stats.high_risk_count > 0 || data.stats.avg_bod > 5) {
                    riskLevel = "High";
                    msg = "Critical contamination detected nearby. High probability of waterborne issues.";
                } else if (data.stats.avg_bod > 3) {
                    riskLevel = "Moderate";
                    msg = "Rising turbidity or bacterial counts reported near your location.";
                }
                
                setResult({
                    district: selectedName || "Selected Location",
                    riskLevel,
                    message: msg,
                    stats: data.stats
                });
            } else {
                // Fallback to mock data for typed District lookups where we don't have coords
                const alert = ALERTS.find(a => a.district.toLowerCase() === selectedName.toLowerCase());
                if (alert) {
                    setResult(alert);
                } else {
                    setResult({ 
                        district: selectedName, 
                        riskLevel: "Low", 
                        message: "Water quality parameters are within safe limits. Manage standard hygiene."
                    });
                }
            }
        } catch (error) {
            console.error("Lookup failed", error);
            setResult({ district: selectedName, riskLevel: "Low", message: "Could not fetch real-time data or area is safe. Maintain hygiene."});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pt-10 px-4 animate-in fade-in duration-500 pb-20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Check Area Risk</h1>
                <p className="text-muted-foreground mt-2">Type your area, select from dropdown, or pinpoint on the map.</p>
            </div>
            
            <Card className="border-border bg-card shadow-md overflow-hidden">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500"/>
                                1. Pinpoint Location on Map
                            </label>
                            <MapSelector onLocationSelect={handleLocationSelect} />
                        </div>
                        
                        <div className="relative my-4 hidden sm:block">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-medium">
                                <span className="bg-card px-2 text-muted-foreground">Or Search Manually</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input 
                                list="districts-list"
                                className="flex-1 bg-background border border-input shadow-inner rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none" 
                                placeholder="Type or select a District..."
                                value={selectedName} 
                                onChange={e => {
                                    setSelectedName(e.target.value);
                                    // if typing manually, we clear out map coordinates
                                    setCoordinates(null); 
                                }}
                            />
                            <datalist id="districts-list">
                                {DISTRICTS.map(d => <option key={d} value={d} />)}
                            </datalist>
                            <button 
                                onClick={handleCheck} 
                                disabled={loading || (!selectedName && !coordinates)}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
                            >
                                {loading ? "Analyzing..." : "Check Risk"}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <Card className={`border-l-4 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                    result.riskLevel === 'High' ? 'border-destructive bg-destructive/5' : 
                    result.riskLevel === 'Moderate' ? 'border-amber-500 bg-amber-500/5' : 
                    'border-emerald-500 bg-emerald-500/5'
                }`}>
                    <CardContent className="pt-6 flex flex-col sm:flex-row items-start gap-5">
                        {result.riskLevel === 'High' ? <ShieldAlert className="w-14 h-14 text-destructive flex-shrink-0 mt-1 drop-shadow-sm" /> : 
                         result.riskLevel === 'Moderate' ? <ShieldAlert className="w-14 h-14 text-amber-500 flex-shrink-0 mt-1 drop-shadow-sm" /> :
                         <ShieldCheck className="w-14 h-14 text-emerald-500 flex-shrink-0 mt-1 drop-shadow-sm" />}
                        <div className="space-y-4 w-full">
                            <div>
                                <h2 className="text-2xl font-black text-foreground mb-1">{result.riskLevel} Risk in {result.district}</h2>
                                <p className="text-muted-foreground leading-relaxed font-medium">{result.message}</p>
                            </div>
                            
                            {result.stats && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-background/80 p-3 rounded-xl border border-border shadow-sm">
                                        <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-extrabold mb-1">Avg pH Level</p>
                                        <p className="text-xl font-black text-foreground">{result.stats.avg_ph}</p>
                                    </div>
                                    <div className="bg-background/80 p-3 rounded-xl border border-border shadow-sm">
                                        <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-extrabold mb-1">BOD (mg/L)</p>
                                        <p className="text-xl font-black text-foreground">{result.stats.avg_bod}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="bg-background shadow-inner rounded-xl p-5 space-y-4 border border-border/50">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                        <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Water Quality Status</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {result.riskLevel === 'High' ? 'Severely Contaminated. Immediate filtering required.' : 
                                             result.riskLevel === 'Moderate' ? 'High turbidity levels. Boil before use.' : 
                                             'Safe for general use. Standard filtration recommended.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg">
                                        <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Disease Probability</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {result.riskLevel === 'High' ? 'High risk of Cholera and Diarrhea outbreaks detected in local clinics.' : 
                                             result.riskLevel === 'Moderate' ? 'Moderate risk of waterborne pathogens.' : 
                                             'Low probability of outbreak.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
