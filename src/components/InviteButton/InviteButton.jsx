import React, { useState } from "react"
import InviteModal from "../InviteModal/InviteModal"
import Client from "../../services/api" // Assuming you're using this for API requests

const InviteButton = ({ tripId }) => {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState(null)
  const [isInviteModalOpen, setInviteModalOpen] = useState(false)

  const handleSendInvite = async () => {
    try {
      const response = await Client.post(`/invite/add`, {
        tripId: tripId,
        email: inviteEmail,
      })
      setInviteMessage(response.data.message)
      setInviteEmail("")

      // Update invites if necessary
    } catch (error) {
      setInviteMessage(error.response?.data?.message || "Failed to send invite")
    }
  }

  return (
    <div>
      <button onClick={() => setInviteModalOpen(true)} className="DBtns">
        Invite
      </button>

      {isInviteModalOpen && (
        <InviteModal
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          handleSendInvite={handleSendInvite}
          setInviteModalOpen={setInviteModalOpen}
          inviteMessage={inviteMessage}
        />
      )}

      {inviteMessage && <p style={{ color: "green" }}>{inviteMessage}</p>}
    </div>
  )
}

export default InviteButton
