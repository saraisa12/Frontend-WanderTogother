import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance

const DetailsTrip = () => {
  const { id } = useParams()

  const [tripDetails, setTripDetails] = useState(null)
  const [invites, setInvites] = useState([]) // State to hold invites

  useEffect(() => {
    const getTripDetails = async () => {
      try {
        // Fetch trip details
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      }
    }

    const getInvites = async () => {
      try {
        // Fetch invites associated with the trip
        const response = await Client.get(`/invite/list/${id}`)
        setInvites(response.data.invites)
        console.log("invites", response)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch invites")
      }
    }

    getTripDetails()
    getInvites()
  }, [id])

  const handleDeleteInvite = async (inviteId) => {
    try {
      // Call the delete invite API
      await Client.delete(`/invite/delete/${inviteId}`)
      // Remove the deleted invite from the state
      setInvites(invites.filter((invite) => invite._id !== inviteId))
    } catch (err) {
      console.error("Failed to delete invite:", err)
      setError(err.response?.data?.message || "Failed to delete invite")
    }
  }

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

          <h3>Invites:</h3>
          {invites.length > 0 ? (
            <ul>
              {invites.map((invite) => (
                <li key={invite._id}>
                  {invite.invitee.email} - Status: {invite.status}
                  <button onClick={() => handleDeleteInvite(invite._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No invites for this trip.</p>
          )}
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
