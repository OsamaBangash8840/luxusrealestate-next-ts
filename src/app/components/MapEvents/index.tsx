"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapEvents = ({ fetchData }) => {
  const map = useMap();

  useEffect(() => {
    const handleMapChange = () => {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast(); // Northeast corner
      const sw = bounds.getSouthWest(); // Southwest corner

      fetchData({
        neLat: ne.lat,
        neLng: ne.lng,
        swLat: sw.lat,
        swLng: sw.lng,
      });
    };

    map.on("moveend", handleMapChange); // On map move
    map.on("zoomend", handleMapChange); // On zoom change

    return () => {
      map.off("moveend", handleMapChange);
      map.off("zoomend", handleMapChange);
    };
  }, [map, fetchData]);

  return null;
};
