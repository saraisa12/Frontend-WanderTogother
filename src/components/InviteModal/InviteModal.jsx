import React, { useState } from "react"
import "./InviteModal.css"

const InviteModal = ({
  inviteEmail,
  setInviteEmail,
  handleSendInvite,
  setInviteModalOpen,
}) => {
  const [successMessage, setSuccessMessage] = useState(false)

  const handleSendClick = () => {
    handleSendInvite() // Call the invite function
    setSuccessMessage(true) // Set success message to true after sending the invite
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setInviteModalOpen(false)}>
          &times;
        </span>
        <h3>Share This Trip</h3>
        <h6>Invite friends to suggest, comment, and vote on trip details</h6>
        <img
          src="/Images/sendLogoColor.png"
          alt="Send Mail"
          className="sendLogo"
        />
        <br />
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter Invitee's Email"
          className="EmailInput"
        />
        <br />
        <button onClick={handleSendClick} className="InviteModelBtn">
          Send Invite
        </button>
        {/* Show success message if invite was sent */}
        {successMessage && (
          <p className="success-message">Invite sent successfully!</p>
        )}
      </div>
    </div>
  )
}

export default InviteModal
