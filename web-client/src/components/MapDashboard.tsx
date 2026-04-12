'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { predictApi, PredictionOutput } from '@/lib/api';

// Setup custom colored marker icons
let L: any;
let redIcon: any;
let yellowIcon: any;
let greenIcon: any;

if (typeof window !== "undefined") {
    L = require('leaflet');
    
    // We can use a template URL for different colored markers, or create custom div icons
    // Using unpkg for cdn icons that allow colored markers
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
}

export default function MapDashboard() {
    const [history, setHistory] = useState<PredictionOutput[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const data = await predictApi.getHistory();
                setHistory(data.filter(d => d.latitude && d.longitude)); // Only valid map items
            } catch (err) {
                console.error("Failed to fetch map history:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const getMarkerIcon = (risk_level: string) => {
        if (risk_level === 'High') return redIcon;
        if (risk_level === 'Medium') return yellowIcon;
        return greenIcon;
    };

    if (loading) {
        return (
            <div className="h-[400px] w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center border border-gray-200">
                <p className="text-gray-500 font-medium">Loading map...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="h-[400px] w-full rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No location data reported recently.</p>
                <p className="text-xs text-gray-400 mt-1">Wait for ASHA workers to submit new data.</p>
            </div>
        );
    }

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-md">
            <MapContainer 
                center={[22.3511, 78.6677]} // Center of India
                zoom={5} 
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {history.map((record) => (
                    record.latitude && record.longitude ? (
                        <Marker 
                            key={record.id || Math.random()} 
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
                                            <span className="text-gray-500">Risk Score:</span>
                                            <span className="font-medium">{record.risk_score.toFixed(1)}/100</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Rainfall:</span>
                                            <span className="font-medium">{record.rainfall} mm</span>
                                        </div>
                                        {record.timestamp && (
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t text-xs text-gray-400">
                                                <span>Reported:</span>
                                                <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
