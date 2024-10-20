import React, { useState } from "react"
import Client from "../../services/api"

const InviteUserForm = ({ tripId }) => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleInvite = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    console.log("clicked")
    console.log(tripId)
    try {
      const response = await Client.post("/trip/invite", { tripId, email })

      console.log(response)
      setMessage(response)
      setEmail("") // Clear the input field after successful invite.
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invite")
    }
  }

  return (
    <div>
      <h3>Invite a User</h3>
      <form onSubmit={handleInvite}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          required
        />
        <button type="submit">Send Invite</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default InviteUserForm
