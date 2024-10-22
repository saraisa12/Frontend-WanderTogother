import React, { useEffect, useState } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import Client from "../../services/api" // Your Axios instance or API service

const GOOGLE_MAPS_API_KEY = "AIzaSyBgqMJ0I9Amizf8K6QZRumavkhx9zXzxxM"

const MapWithPins = () => {
  const [trips, setTrips] = useState([])
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Fetch trips from your API
        const response = await Client.get("/trip/index")
        setTrips(response.data.trips)

        // Geocode each trip location to get lat/lng
        const geocodedMarkers = await Promise.all(
          response.data.trips.map(async (trip) => {
            const geocodeResult = await geocodeLocation(trip.location)
            if (geocodeResult) {
              return {
                lat: geocodeResult.lat,
                lng: geocodeResult.lng,
                name: trip.name,
              }
            }
            return null
          })
        )

        // Filter out any unsuccessful geocodes
        setMarkers(geocodedMarkers.filter((marker) => marker !== null))
      } catch (error) {
        console.error("Error fetching trips:", error)
        setError("Failed to fetch trips.")
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  // Function to get latitude and longitude from Google Maps Geocoding API
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationName
        )}&key=${GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        return { lat, lng }
      } else {
        console.error("Geocode error:", data.status)
      }
    } catch (error) {
      console.error("Geocoding failed:", error)
    }
    return null
  }

  if (loading) {
    return <p>Loading map...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <h1>My World Travels</h1>
      <GoogleMap
        mapContainerStyle={{
          width: "80%",
          height: "600px",
          border: "10px solid black",
        }}
        center={markers.length > 0 ? markers[0] : { lat: 0, lng: 0 }}
        zoom={5}
      >
        {markers.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default MapWithPins
