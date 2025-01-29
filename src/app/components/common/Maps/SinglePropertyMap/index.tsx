import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface SinglePropertyMapProps {
  lat: number
  lng: number
}

const SinglePropertyMap: React.FC<SinglePropertyMapProps> = ({ lat, lng }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=892okYqSma6U3brRVeQ6', // Get free key from maptiler.com
      center: [lng, lat],
      zoom: 14,
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Add marker
    marker.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map.current)

    // Cleanup function
    return () => {
      if (marker.current) {
        marker.current.remove()
      }
      if (map.current) {
        map.current.remove()
      }
    }
  }, []) // Empty dependency array as we only want to create the map once

  // Update marker and center when coordinates change
  useEffect(() => {
    if (!map.current || !marker.current) return

    marker.current.setLngLat([lng, lat])
    map.current.setCenter([lng, lat])
  }, [lat, lng])

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />
  )
}

export default SinglePropertyMap
