import React from "react"
import "./InviteModal.css"

const InviteModal = ({
  inviteEmail,
  setInviteEmail,
  handleSendInvite,
  setInviteModalOpen,
}) => {
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
        <button
          onClick={() => {
            handleSendInvite()
            setInviteModalOpen(false)
          }}
          className="InviteModelBtn"
        >
          Send Invite
        </button>
      </div>
    </div>
  )
}

export default InviteModal
