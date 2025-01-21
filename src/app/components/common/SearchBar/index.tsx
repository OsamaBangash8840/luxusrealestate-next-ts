'use client';
import React, { useState, useCallback } from "react";
import axios from "axios";
import Map from "../Maps";

interface MarkerType {
  id: string;
  location: {
    coordinates: [number, number];
  };
  title: string;
  description: string;
}

const SearchPage = (): React.ReactElement => {
  const [center] = useState<[number, number]>([39.0997, -94.5786]);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(50000);
  const [category, setCategory] = useState<string>("");

  const fetchData = useCallback(async (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => {
    try {
      const response = await axios.get<MarkerType[]>(
        "http://localhost:8000/api/properties/search",
        {
          params: {
            bounds,
            maxDistance,
            category,
          },
        }
      );
      setMarkers(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response || error.message);
    }
  }, [maxDistance, category]);

  return (
    <div className="p-4">
      <div className="filters mb-4 space-y-4 md:space-y-0 md:flex md:space-x-4">
        <label className="block">
          <span className="text-gray-700">Category:</span>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="shop">Shop</option>
            <option value="office">Office</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Max Distance (meters):</span>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            min="0"
          />
        </label>
      </div>

      <div className="map-container rounded-lg overflow-hidden shadow-lg">
        <Map center={center} markers={markers} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default SearchPage;