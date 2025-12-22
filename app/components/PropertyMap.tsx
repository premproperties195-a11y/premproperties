"use client";

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues in Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface PropertyMapProps {
    lat: number | null;
    lng: number | null;
    address: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function PropertyMap({ lat, lng, address }: PropertyMapProps) {
    const defaultCenter: [number, number] = [17.3850, 78.4867]; // Hyderabad
    const hasCoords = typeof lat === 'number' && typeof lng === 'number';
    const center: [number, number] = hasCoords ? [lat as number, lng as number] : defaultCenter;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleGetDirections = () => {
        if (hasCoords) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        }
    };

    if (!isClient) return <div className="h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>;

    return (
        <div className="h-full w-full relative group">
            <MapContainer
                key="property-detail-map" // Stable key per property view
                center={center}
                zoom={hasCoords ? 15 : 12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {hasCoords && (
                    <Marker position={[lat as number, lng as number]} icon={defaultIcon} />
                )}
                <MapUpdater center={center} />
            </MapContainer>

            {/* GET DIRECTIONS BUTTON */}
            <div className="absolute bottom-6 right-6 z-[1000]">
                <button
                    onClick={handleGetDirections}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-[var(--primary)] hover:text-black font-bold rounded-full shadow-2xl transition-all duration-300 scale-95 group-hover:scale-100 active:scale-90"
                >
                    <span className="text-xl">🚗</span>
                    <span className="uppercase tracking-widest text-xs">Get Directions</span>
                </button>
            </div>

            {!hasCoords && address && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-amber-100 flex items-center gap-2">
                    <span className="text-amber-500 text-lg">⚠️</span>
                    <span className="text-sm font-medium text-gray-700">Displaying approximate area: {address}</span>
                </div>
            )}
        </div>
    );
}
