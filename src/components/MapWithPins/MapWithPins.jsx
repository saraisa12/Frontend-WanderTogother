import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Client from '../../services/api'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBgqMJ0I9Amizf8K6QZRumavkhx9zXzxxM'

const MapWithPins = () => {
  const [trips, setTrips] = useState([])
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await Client.get('/trip/index')
        setTrips(response.data.trips)

        const geocodedMarkers = await Promise.all(
          response.data.trips.map(async (trip) => {
            const geocodeResult = await geocodeLocation(trip.location)
            if (geocodeResult) {
              return {
                lat: geocodeResult.lat,
                lng: geocodeResult.lng,
                name: trip.name
              }
            }
            return null
          })
        )

        setMarkers(geocodedMarkers.filter((marker) => marker !== null))
      } catch (error) {
        console.error('Error fetching trips:', error)
        setError('Failed to fetch trips.')
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationName
        )}&key=${GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        return { lat, lng }
      } else {
        console.error('Geocode error:', data.status)
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    }
    return null
  }

  if (loading) {
    return <p style={styles.loadingText}>Loading map...</p>
  }

  if (error) {
    return <p style={styles.errorText}>{error}</p>
  }

  return (
    <div style={styles.pageContainer}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <h1 style={styles.heading}>My World Travels</h1>
        <GoogleMap
          mapContainerStyle={styles.mapContainer}
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
    </div>
  )
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#e6e3e3',
    minHeight: '100vh'
  },
  heading: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande'"
  },
  mapContainer: {
    width: '85%',
    height: '600px',
    borderRadius: '10px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
    border: '5px solid #bdc3c7'
  },
  loadingText: {
    fontSize: '1.5rem',
    color: '#7f8c8d',
    textAlign: 'center',
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande'"
  },
  errorText: {
    fontSize: '1.5rem',
    color: '#e74c3c',
    textAlign: 'center',
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande'"
  }
}

export default MapWithPins
