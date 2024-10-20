import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance

const DetailsTrip = () => {
  const { id } = useParams()

  const [tripDetails, setTripDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getTripDetails = async () => {
      try {
        // Use the Client instance to fetch trip details
        const response = await Client.get(`/trip/details/${id}`)

        setTripDetails(response.data)

        console.log(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      } finally {
        setLoading(false)
      }
    }

    getTripDetails()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {tripDetails ? (
        <div>
          <h2>{tripDetails.title}</h2>
          <p>
            <strong>Description:</strong> {tripDetails.description}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(tripDetails.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(tripDetails.endDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
