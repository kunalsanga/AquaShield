'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { dashboardApi, MapDataResponse } from '@/lib/api';

// Setup custom colored marker icons directly inside the component boundary
let L: any;
let redIcon: any;
let yellowIcon: any;
let greenIcon: any;
let crosshairIcon: any;

if (typeof window !== "undefined") {
    L = require('leaflet');
    
    const createIcon = (color: string) => {
        return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    redIcon = createIcon('red');
    yellowIcon = createIcon('orange');
    greenIcon = createIcon('green');
    crosshairIcon = createIcon('blue'); // to show the center click
}

function LocationSelector({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapDashboard() {
    const [centerMarker, setCenterMarker] = useState<[number, number] | null>(null);
    const [mapData, setMapData] = useState<MapDataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [isHeatmap, setIsHeatmap] = useState(false);

    useEffect(() => {
        if (isHeatmap) {
            fetchHeatmap();
        } else {
            setMapData(null);
            setCenterMarker(null);
        }
    }, [isHeatmap]);

    const fetchHeatmap = async () => {
        setLoading(true);
        try {
            const data = await dashboardApi.getMapData(0, 0, true);
            setMapData(data);
        } catch (err) {
            console.error("Failed to fetch map data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        if (isHeatmap) setIsHeatmap(false);
        setCenterMarker([lat, lng]);
        setLoading(true);
        try {
            const data = await dashboardApi.getMapData(lat, lng);
            setMapData(data);
        } catch (err) {
            console.error("Failed to fetch map data:", err);
            setMapData({ stats: { avg_ph: 0, avg_bod: 0, high_risk_count: 0, total_points: 0 }, points: [] });
        } finally {
            setLoading(false);
        }
    };

    const getMarkerIcon = (risk_level: string) => {
        if (risk_level === 'High') return redIcon;
        if (risk_level === 'Medium') return yellowIcon;
        return greenIcon;
    };

    return (
        <div className="flex flex-col gap-4">
            
            <div className="flex justify-between items-center bg-card border border-border p-3 rounded-xl shadow-sm">
                <div>
                    <h3 className="font-bold text-foreground">Interactive Map Mode</h3>
                    <p className="text-xs text-muted-foreground">Select local radius filtering or view the whole country.</p>
                </div>
                <button 
                    onClick={() => setIsHeatmap(!isHeatmap)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                        isHeatmap ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    {isHeatmap ? "Heatmap Active" : "View India Heatmap"}
                </button>
            </div>

            {/* KPI Cards specific to map area */}
            {mapData && (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Filtered Points</p>
                        <p className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-1">{mapData.stats.total_points}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">High Risk Count</p>
                        <p className="text-2xl font-black text-red-900 dark:text-red-100 mt-1">{mapData.stats.high_risk_count}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Avg pH Level</p>
                        <p className="text-2xl font-black text-green-900 dark:text-green-100 mt-1">{mapData.stats.avg_ph}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Avg BOD (mg/L)</p>
                        <p className="text-2xl font-black text-orange-900 dark:text-orange-100 mt-1">{mapData.stats.avg_bod}</p>
                    </div>
                </div>
            )}
            {mapData?.stats?.likely_disease_predictions && mapData.stats.likely_disease_predictions.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <p className="font-bold text-foreground mb-2">Possible Diseases</p>
                    <div className="flex flex-wrap gap-2">
                        {mapData.stats.likely_disease_predictions.slice(0, 8).map((d, idx) => (
                            <span
                                key={`${d.name}-${idx}`}
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    d.severity === "High"
                                        ? "bg-red-500/15 text-red-700 border-red-500/30"
                                        : d.severity === "Medium"
                                        ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                                        : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                                }`}
                                title={(mapData.stats.disease_reasons && mapData.stats.disease_reasons[d.name]) || "No reason available"}
                            >
                                {d.name} {d.severity} ({Math.round((d.confidence || 0) * 100)}%)
                            </span>
                        ))}
                    </div>
                    <div className="mt-3 space-y-1">
                        {mapData.stats.likely_disease_predictions.slice(0, 4).map((d, idx) => (
                            <p key={`why-${idx}`} className="text-xs text-muted-foreground">
                                <span className="font-semibold">Why {d.name}?</span>{" "}
                                {(mapData.stats.disease_reasons && mapData.stats.disease_reasons[d.name]) || "No specific reason available."}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="h-[500px] w-full rounded-xl overflow-hidden border border-border shadow-md relative">
                
                {/* Overlay loading indicator */}
                {loading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center animate-in fade-in">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-semibold text-blue-800 dark:text-blue-200 mt-4 shadow-sm">Fetching Data...</p>
                    </div>
                )}
                
                {/* Overlay Instruction if nothing selected */}
                {!centerMarker && !isHeatmap && !loading && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 rounded-full shadow-xl font-medium text-sm animate-pulse border border-gray-700">
                        Click anywhere on map to filter nearby data (50km radius)
                   </div> 
                )}

                <MapContainer 
                    center={[21.4680, 83.9820]} // Default to Sambalpur
                    zoom={5} 
                    className="h-full w-full z-0 cursor-crosshair"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <LocationSelector onLocationSelect={handleLocationSelect} />
                    
                    {/* The Clicked Center Marker */}
                    {centerMarker && !isHeatmap && (
                        <Marker position={centerMarker} icon={crosshairIcon}>
                            <Popup>
                                <p className="font-bold">Search Center (50km)</p>
                            </Popup>
                        </Marker>
                    )}

                    {/* Filtered Data Markers or Heatmap Circles */}
                    {mapData?.points.map((record) => (
                        record.latitude && record.longitude ? (
                            isHeatmap ? (
                                <CircleMarker
                                    key={record.id || Math.random().toString()}
                                    center={[record.latitude, record.longitude]}
                                    radius={record.risk_level === 'High' ? 15 : record.risk_level === 'Medium' ? 12 : 8}
                                    pathOptions={{
                                        color: record.risk_level === 'High' ? 'red' : record.risk_level === 'Medium' ? 'orange' : 'green',
                                        fillColor: record.risk_level === 'High' ? '#ef4444' : record.risk_level === 'Medium' ? '#f59e0b' : '#10b981',
                                        fillOpacity: 0.5,
                                        weight: 0
                                    }}
                                >
                                    <Popup className="rounded-lg shadow-sm">
                                        <p className="font-bold">{record.location_name}</p>
                                        <p className="text-sm">Risk Level: <span className="font-semibold">{record.risk_level}</span></p>
                                    </Popup>
                                </CircleMarker>
                            ) : (
                                <Marker 
                                    key={record.id || Math.random().toString()} 
                                    position={[record.latitude, record.longitude]}
                                    icon={getMarkerIcon(record.risk_level)}
                                >
                                    <Popup className="rounded-lg shadow-sm">
                                        <div className="p-1 min-w-[200px]">
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                                                {record.location_name || "Unknown Area"}
                                            </h3>
                                            
                                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
                                                    <span className={`font-semibold ${
                                                        record.risk_level === 'High' ? 'text-red-600 dark:text-red-400' :
                                                        record.risk_level === 'Medium' ? 'text-amber-500 dark:text-amber-400' :
                                                        'text-green-600 dark:text-green-400'
                                                    }`}>{record.risk_level}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 dark:text-gray-400">pH Level:</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{record.ph}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 dark:text-gray-400">BOD (mg/L):</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{record.bod}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 dark:text-gray-400">DO (mg/L):</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{record.dissolved_oxygen}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ) : null
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
