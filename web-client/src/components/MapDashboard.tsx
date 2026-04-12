'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

    const handleLocationSelect = async (lat: number, lng: number) => {
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
            
            {/* KPI Cards specific to map area */}
            {mapData && (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Filtered Points</p>
                        <p className="text-2xl font-black text-blue-900 mt-1">{mapData.stats.total_points}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wider">High Risk Count</p>
                        <p className="text-2xl font-black text-red-900 mt-1">{mapData.stats.high_risk_count}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Avg pH Level</p>
                        <p className="text-2xl font-black text-green-900 mt-1">{mapData.stats.avg_ph}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm text-center">
                        <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Avg BOD (mg/L)</p>
                        <p className="text-2xl font-black text-orange-900 mt-1">{mapData.stats.avg_bod}</p>
                    </div>
                </div>
            )}

            <div className="h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
                
                {/* Overlay loading indicator */}
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center animate-in fade-in">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-semibold text-blue-800 mt-4 shadow-sm">Calculating Haversine filter...</p>
                    </div>
                )}
                
                {/* Overlay Instruction if nothing selected */}
                {!centerMarker && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-gray-900 text-white px-4 py-2 rounded-full shadow-xl font-medium text-sm animate-pulse border border-gray-700">
                        Click anywhere on map to filter nearby data (50km radius)
                   </div> 
                )}

                <MapContainer 
                    center={[22.3511, 78.6677]} // Center of India
                    zoom={5} 
                    className="h-full w-full z-0 cursor-crosshair"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <LocationSelector onLocationSelect={handleLocationSelect} />
                    
                    {/* The Clicked Center Marker */}
                    {centerMarker && (
                        <Marker position={centerMarker} icon={crosshairIcon}>
                            <Popup>
                                <p className="font-bold">Search Center (50km)</p>
                            </Popup>
                        </Marker>
                    )}

                    {/* Filtered Data Markers */}
                    {mapData?.points.map((record) => (
                        record.latitude && record.longitude ? (
                            <Marker 
                                key={record.id || Math.random().toString()} 
                                position={[record.latitude, record.longitude]}
                                icon={getMarkerIcon(record.risk_level)}
                            >
                                <Popup className="rounded-lg shadow-sm">
                                    <div className="p-1 min-w-[200px]">
                                        <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">
                                            {record.location_name || "Unknown Area"}
                                        </h3>
                                        
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Risk Level:</span>
                                                <span className={`font-semibold ${
                                                    record.risk_level === 'High' ? 'text-red-600' :
                                                    record.risk_level === 'Medium' ? 'text-amber-500' :
                                                    'text-green-600'
                                                }`}>{record.risk_level}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">pH Level:</span>
                                                <span className="font-medium">{record.ph}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">BOD (mg/L):</span>
                                                <span className="font-medium">{record.bod}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">DO (mg/L):</span>
                                                <span className="font-medium">{record.dissolved_oxygen}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ) : null
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
