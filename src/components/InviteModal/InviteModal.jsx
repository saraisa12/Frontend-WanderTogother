import React from "react"

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
        <h3>Invite a User</h3>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter invitee's email"
        />
        <button
          onClick={() => {
            handleSendInvite()
            setInviteModalOpen(false)
          }}
        >
          Send Invite
        </button>
      </div>
    </div>
  )
}

export default InviteModal
