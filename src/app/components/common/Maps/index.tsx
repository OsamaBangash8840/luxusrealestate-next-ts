'use client';
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapContainer component
const MapWithNoSSR = dynamic(
  () => import('./DynamicMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: "500px", width: "100%", background: "#f0f0f0" }}>Loading map...</div>
  }
);

interface MarkerType {
  id: string;
  location: { coordinates: [number, number] };
  title: string;
  description: string;
}

interface MapProps {
  center: [number, number];
  markers: MarkerType[];
  fetchData: (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => void;
}

const Map: React.FC<MapProps> = memo(({ center, markers, fetchData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return <MapWithNoSSR center={center} markers={markers} fetchData={fetchData} />;
});

Map.displayName = 'Map';

export default Map;