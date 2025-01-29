'use client'
import React, { useState } from 'react'
import axios from 'axios'

const SearchBar = ({
  onSearch,
}: {
  onSearch: (text: string, latitude: number, longitude: number) => void
}) => {
  const [searchText, setSearchText] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2xnbXB3N2l2MDFmODNzbzFsbTYxZnUwMSJ9.zLzyYNdvZBImIoZOeGHRyg`
      )
      const { center } = response.data.features[0]
      setLat(center[1])
      setLng(center[0])
      onSearch(searchText, center[1], center[0])
    } catch (error) {
      console.error('Error geocoding search text:', error)
    }
  }

  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Search</h2>
      <div className="flex">
        <input
          type="text"
          placeholder="Address, neighborhood, city..."
          className="flex-1 border-gray-300 rounded-md mr-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBar
