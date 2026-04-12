'use client';
import dynamic from "next/dynamic";

const MapDashboard = dynamic(() => import("@/components/MapDashboard"), { 
    ssr: false, 
    loading: () => <div className="h-[500px] w-full rounded-xl bg-muted animate-pulse border border-border flex items-center justify-center">Loading Map Engine...</div> 
});

export default function PublicMapPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-10 animate-in fade-in duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-foreground">Public Risk Map</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Interactive map displaying real-time water quality predictions and disease spread data. 
                    Click anywhere on the map to query the localized risk radius.
                </p>
            </div>
            
            <MapDashboard />
        </div>
    );
}
