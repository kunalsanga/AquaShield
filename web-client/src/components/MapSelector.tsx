'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icon issue in Next.js/Webpack
import type { IconOptions } from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon: L.Icon | null = null;
if (typeof window !== "undefined") {
    const L = require('leaflet');
    DefaultIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    } as IconOptions);
    L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapSelectorProps {
    onLocationSelect: (lat: number, lng: number, locationName: string) => void;
}

function LocationMarker({ position, onSelect }: { position: L.LatLngTuple | null, onSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 13, { duration: 1.5 });
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapSelector({ onLocationSelect }: MapSelectorProps) {
    const [locationName, setLocationName] = useState<string>("Click on the map to select a location");
    const [isLoadingName, setIsLoadingName] = useState(false);
    const [pinPosition, setPinPosition] = useState<L.LatLngTuple | null>(null);
    
    // Debounce timer ref
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSelect = (lat: number, lng: number) => {
        setPinPosition([lat, lng]);
        setIsLoadingName(true);
        setLocationName(`Fetching location details...`);
        
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'en'
                        }
                    }
                );
                const data = await response.json();
                
                let name = "Unknown Location";
                if (data && data.address) {
                    name = data.address.state_district || data.address.county || data.address.city || data.address.state || "Unknown Area";
                }
                
                setLocationName(`${name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                onLocationSelect(lat, lng, name);
            } catch (error) {
                console.error("Reverse geocoding failed", error);
                const fallback = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setLocationName(fallback);
                onLocationSelect(lat, lng, fallback);
            } finally {
                setIsLoadingName(false);
            }
        }, 800); // 800ms debounce
    };

    const handleLocateMe = () => {
        if ("geolocation" in navigator) {
            setIsLoadingName(true);
            setLocationName("Requesting device location...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    handleSelect(latitude, longitude);
                },
                (err) => {
                    console.error("Geolocation failed", err);
                    setLocationName("Location access denied or failed.");
                    setIsLoadingName(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex justify-end mb-2">
                <button 
                    type="button"
                    onClick={handleLocateMe}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
                    Use Device Location
                </button>
            </div>
            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0">
                <MapContainer 
                    center={[22.3511, 78.6677]} // Center of India
                    zoom={5} 
                    scrollWheelZoom={true} 
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={pinPosition} onSelect={handleSelect} />
                </MapContainer>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700 w-16">Selected: </span>
                <span className={`text-right truncate flex-1 ${isLoadingName ? 'animate-pulse text-blue-600' : 'text-gray-900'}`}>
                    {locationName}
                </span>
            </div>
        </div>
    );
}
