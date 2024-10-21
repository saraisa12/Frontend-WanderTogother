import React, { useState } from "react"
import Client from "../../services/api"

const ManageInvitees = ({ tripId, invitees }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [inviteeList, setInviteeList] = useState(invitees)

  const handleInvite = async () => {
    try {
      const response = await Client.post("/trip/invite", {
        tripId,
        email,
      })
      setSuccess(response.data.message)
      setError(null)
      setInviteeList([...inviteeList, { email, status: "pending" }]) // Update invitees list with the new invite
      setEmail("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invite")
      setSuccess(null)
    }
  }

  const handleRemoveInvite = async (inviteId) => {
    console.log(inviteId)
    try {
      await Client.delete(`/invite/${inviteId}`)
      setInviteeList(inviteeList.filter((invite) => invite._id !== inviteId))
      setSuccess("Invite removed successfully")
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove invite")
      setSuccess(null)
    }
  }

  return (
    <div>
      <h3>Manage Invites</h3>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Invite user by email"
        />
        <button onClick={handleInvite}>Send Invite</button>
      </div>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h4>Invitees</h4>
      <ul>
        {inviteeList.map((invite, index) => (
          <li key={index}>
            {invite.email} - {invite.status}
            <button onClick={() => handleRemoveInvite(invite._id)}>
              Remove Invite
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ManageInvitees
