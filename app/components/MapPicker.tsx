"use client";

import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues in Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
    const map = useMap();

    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);

    return lat && lng ? (
        <Marker position={[lat, lng]} icon={defaultIcon} />
    ) : null;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    const center: [number, number] = lat && lng ? [lat, lng] : [17.3850, 78.4867]; // Default to Hyderabad
    const [isClient, setIsClient] = useState(false);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleAutoLocation = () => {
        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                onChange(position.coords.latitude, position.coords.longitude);
                setLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Could not get your location. Please ensure location services are enabled.");
                setLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // We don't need the isClient check if we use dynamic(..., { ssr: false }) 
    // but keeping a small safety check is fine. 
    // The key on MapContainer helps prevent "Map container is already initialized"

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 italic">Click map to pin location</span>
                <button
                    type="button"
                    onClick={handleAutoLocation}
                    disabled={locating}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-bold border border-blue-100 disabled:opacity-50"
                >
                    {locating ? (
                        <>
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                            Getting Location...
                        </>
                    ) : (
                        <>📍 Use My Current Location</>
                    )}
                </button>
            </div>
            <div className="h-[350px] rounded-xl overflow-hidden shadow-inner border border-gray-200 relative">
                {isClient && (
                    <MapContainer
                        key="admin-property-picker-map"
                        center={center}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
                    </MapContainer>
                )}
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                <div>LAT: {lat?.toFixed(6) || "---"}</div>
                <div>LNG: {lng?.toFixed(6) || "---"}</div>
            </div>
        </div>
    );
}
