"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Map } from "../Maps";

const SearchPage = () => {
  const [center, setCenter] = useState([39.0997, -94.5786]); // Default center (latitude, longitude)
  const [markers, setMarkers] = useState([]);
  const [maxDistance, setMaxDistance] = useState(50000); // Default max distance in meters
  const [category, setCategory] = useState(""); // Category filter

  // Function to fetch properties from the backend
  const fetchData = async ({ lat, lng }) => {
    try {
      const response = await axios.get("http://localhost:8000/api/properties/search", {
        params: {
          lat,
          lng,
          maxDistance,
          category,
        },
      });
      setMarkers(response.data); // Update markers with the response data
    } catch (error:any) {
        console.error("Error fetching data:", error.response || error.message);
    }
  };

  // Fetch data when the center, maxDistance, or category changes
  useEffect(() => {
    fetchData({ lat: center[0], lng: center[1] });
  }, [center, maxDistance, category]);

  return (
    <div>
      {/* Filter controls */}
      <div className="filters">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="shop">Shop</option>
            <option value="office">Office</option>
          </select>
        </label>

        <label>
          Max Distance (meters):
          <input
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Map with markers */}
      <Map
        center={center}
        markers={markers}
        fetchData={({ neLat, neLng, swLat, swLng }) => {
          // Update center based on map bounds
          const lat = (neLat + swLat) / 2;
          const lng = (neLng + swLng) / 2;
          setCenter([lat, lng]);
          fetchData({ lat, lng });
        }}
      />
    </div>
  );
};

export default SearchPage;
