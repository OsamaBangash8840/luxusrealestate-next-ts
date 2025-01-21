'use client';
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default markers
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

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

function MapEvents({ fetchData }: { fetchData: MapProps['fetchData'] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMapChange = () => {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      fetchData({
        neLat: ne.lat,
        neLng: ne.lng,
        swLat: sw.lat,
        swLng: sw.lng,
      });
    };

    map.on("moveend", handleMapChange);
    map.on("zoomend", handleMapChange);

    // Initial fetch
    handleMapChange();

    return () => {
      map.off("moveend", handleMapChange);
      map.off("zoomend", handleMapChange);
    };
  }, [map, fetchData]);

  return null;
}

const DynamicMap: React.FC<MapProps> = ({ center, markers, fetchData }) => {
  const mapId = `map-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={mapId} className="w-full h-[500px] relative">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map:any) => {
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.location.coordinates[1], marker.location.coordinates[0]]}
          >
            <Popup>
              <h2 className="text-lg font-semibold">{marker.title}</h2>
              <p>{marker.description}</p>
            </Popup>
          </Marker>
        ))}
        <MapEvents fetchData={fetchData} />
      </MapContainer>
    </div>
  );
};

export default DynamicMap;