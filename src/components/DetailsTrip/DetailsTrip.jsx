import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api"
import ManageInvites from "../ManageInvitees/ManageInvitees"

const DetailsTrip = ({ user }) => {
  const { id } = useParams()
  const [tripDetails, setTripDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreator, setIsCreator] = useState(false)
  const [invitees, setInvitees] = useState([])

  useEffect(() => {
    const fetchTripDetailsAndInvites = async () => {
      if (!user) return

      try {
        // Fetch trip details
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data.trip)

        // Check if the logged-in user is the creator of the trip
        const userId = response.data.trip.creator
        const loggedInUserId = user.id
        setIsCreator(userId === loggedInUserId)

        // Fetch invites for the trip
        const invitesResponse = await Client.get(`/invite/list/${id}`) // Adjust the endpoint as necessary
        setInvitees(invitesResponse.data.invites) // Ensure this matches your API response structure
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch trip details or invites"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTripDetailsAndInvites()
  }, [id, user])

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

          {/* Pass the tripId and invitees to the ManageInvites component */}
          <ManageInvites tripId={id} invitees={invitees} />
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
