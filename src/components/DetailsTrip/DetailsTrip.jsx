import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance

const DetailsTrip = ({ user }) => {
  const { id } = useParams()

  const [tripDetails, setTripDetails] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState(null)

  useEffect(() => {
    const getTripDetails = async () => {
      try {
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      } finally {
        setLoading(false)
      }
    }

    const getInvites = async () => {
      try {
        const response = await Client.get(`/invite/list/${id}`)
        setInvites(response.data.invites)
      } catch (err) {
        console.error("Error fetching invites:", err)
      }
    }

    getTripDetails()
    getInvites()
  }, [id])

  const handleSendInvite = async () => {
    try {
      const response = await Client.post(`/invite/add`, {
        tripId: id,
        email: inviteEmail,
      })
      setInviteMessage(response.data.message)
      setInviteEmail("") // Clear the input after sending

      // Refresh the invites list to show the new invite
      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(error.response?.data?.message || "Failed to send invite")
    }
  }

  const handleDeleteInvite = async (inviteId) => {
    try {
      await Client.delete(`/invite/delete/${inviteId}`)
      setInviteMessage("Invite deleted successfully")

      // Refresh the invites list after deletion
      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(
        error.response?.data?.message || "Failed to delete invite"
      )
    }
  }

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

          {/* Form to send an invite */}
          {tripDetails.creator === user.id && (
            <div>
              <h3>Invite a User</h3>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter invitee's email"
              />
              <button onClick={handleSendInvite}>Send Invite</button>

              {/* Display invite message */}
              {inviteMessage && <p>{inviteMessage}</p>}

              {/* List of invites */}
              <div>
                <h3>Invites</h3>
                {invites.length > 0 ? (
                  <ul>
                    {invites.map((invite) => (
                      <li key={invite._id}>
                        {invite.invitee.email} - {invite.status} - Invited on:{" "}
                        {new Date(invite.invitedAt).toLocaleDateString()}
                        <button onClick={() => handleDeleteInvite(invite._id)}>
                          Delete Invite
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No invites yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
