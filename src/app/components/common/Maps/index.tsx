"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export const Map = ({ center, markers, fetchData }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure rendering on the client
    }, []);

    if (!isClient) return null; // Avoid SSR issues

    return (
        <MapContainer
            key={`${center[0]}-${center[1]}`} // Unique key to prevent reinitialization
            center={center}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[
                        marker.location.coordinates[1], // Latitude
                        marker.location.coordinates[0], // Longitude
                    ]}
                >
                    <Popup>
                        <h2>{marker.title}</h2>
                        <p>{marker.description}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
