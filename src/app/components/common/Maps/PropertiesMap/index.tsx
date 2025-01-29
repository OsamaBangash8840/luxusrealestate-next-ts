'use client'
import React, { useState, useEffect } from 'react'
import MapLibreGL from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import axios from 'axios'

interface Filters {
  minPrice: number | null
  maxPrice: number | null
  minSize: number | null
  maxSize: number | null
}

interface PropertiesMapProps {
  filters: Filters
  searchText?: string
  lat?: number | null
  lng?: number | null
}

const PropertiesMap = ({ filters, searchText, lat, lng }: PropertiesMapProps) => {
  const [map, setMap] = useState<MapLibreGL.Map | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [center, setCenter] = useState<[number, number]>([-118.30937, 34.062767])

  useEffect(() => {
    const initializeMap = () => {
      const map = new MapLibreGL.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/basic/style.json?key=892okYqSma6U3brRVeQ6',
        center,
        zoom: 12,
      })

      setMap(map)
    }

    initializeMap()
  }, [center])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties/search', {
          params: {
            lng: center[0],
            lat: center[1],
            maxDistance: 10000, // 10 km
            ...filters,
          },
        })
        setProperties(response.data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    if (map) {
      fetchProperties()
    }
  }, [map, filters, center])

  return <div className="flex-1" id="map"></div>
}

export default PropertiesMap
