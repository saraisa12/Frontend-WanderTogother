import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance

const AcceptInvite = () => {
  const { inviteId } = useParams()
  const [inviteDetails, setInviteDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getInviteDetails = async () => {
      try {
        // Fetch the invite details from the server using the inviteId
        const response = await Client.get(`/invite/details/${inviteId}`)
        setInviteDetails(response.data) // Set the invite details state
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch invite details"
        )
      } finally {
        setLoading(false)
      }
    }

    getInviteDetails()
  }, [inviteId])

  const handleUpdateStatus = async (status) => {
    console.log(`Updating invite at URL: /invite/update/${inviteDetails._id}`)

    try {
      console.log(status)
      await Client.put(`/invite/update/${inviteId}`, { status })

      alert("Invite status updated successfully!")
      // Optionally, redirect or handle further UI updates here
    } catch (error) {
      alert("Failed to update the invite status.")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {inviteDetails ? (
        <div>
          <h2>Invite Details</h2>
          <p>
            <strong>Trip:</strong> {inviteDetails.trip.title}
          </p>
          <p>
            <strong>Description:</strong> {inviteDetails.trip.description}
          </p>
          <button onClick={() => handleUpdateStatus("accepted")}>Accept</button>
          <button onClick={() => handleUpdateStatus("declined")}>
            Decline
          </button>
        </div>
      ) : (
        <p>Invite details not found.</p>
      )}
    </div>
  )
}

export default AcceptInvite
