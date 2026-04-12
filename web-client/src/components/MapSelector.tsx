'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'local-leaflet-fallback'; // We'll just use window.L if we have to, but standard import 'leaflet' works if window is defined.
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

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapSelector({ onLocationSelect }: MapSelectorProps) {
    const [locationName, setLocationName] = useState<string>("Click on the map to select a location");
    const [isLoadingName, setIsLoadingName] = useState(false);
    
    // Debounce timer ref
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSelect = (lat: number, lng: number) => {
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

    return (
        <div className="flex flex-col gap-2">
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
                    <LocationMarker onSelect={handleSelect} />
                </MapContainer>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700">Selected: </span>
                <span className={`${isLoadingName ? 'animate-pulse text-blue-600' : 'text-gray-900'}`}>
                    {locationName}
                </span>
            </div>
        </div>
    );
}
