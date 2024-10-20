import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api"
import InviteUserForm from "../InviteUserForm/InviteUserForm"

const DetailsTrip = ({ user }) => {
  const { id } = useParams()
  const [tripDetails, setTripDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    const getTripDetails = async () => {
      if (!user) {
        // If user is not defined yet, do not proceed
        return
      }

      try {
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)

        const userId = response.data.creator
        const loggedInUserId = user.id

        console.log(userId)
        console.log(loggedInUserId)

        setIsCreator(userId === loggedInUserId) // Compare IDs
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      } finally {
        setLoading(false)
      }
    }

    getTripDetails()
  }, [id, user]) // Adding user as a dependency

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
          <p>
            <strong>Location:</strong> {tripDetails.location}
          </p>

          {/* Show the invite form only if the user is the creator */}
          {isCreator && <InviteUserForm tripId={id} />}
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
