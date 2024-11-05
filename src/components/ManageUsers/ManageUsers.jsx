import React, { useEffect, useState } from "react"
import Client from "../../services/api" // Assuming you're using this for API requests
import "./ManageUsers.css"
import InviteButton from "../InviteButton/InviteButton"

const ManageUsers = ({
  invites = [], // Ensure invites is an array by default
  participants,
  handleDeleteInvite,
  tripDetails,
}) => {
  const [participantDetails, setParticipantDetails] = useState([])

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await Client.post("/auth/details", {
          ids: participants,
        })
        setParticipantDetails(response.data)
      } catch (error) {
        console.error("Error fetching participant details:", error)
      }
    }

    if (participants.length > 0) {
      fetchParticipantDetails()
    }
  }, [participants])

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
    return initials
  }

  const pendingInvites = invites.filter((invite) => invite.status === "pending")
  const acceptedInvites = invites.filter(
    (invite) => invite.status === "accepted"
  )
  const declinedInvites = invites.filter(
    (invite) => invite.status === "declined"
  )

  return (
    <>
      <div className="ManageUsers">
        <h3>Who's Going</h3>

        <div className="participants-container">
          {participantDetails.length > 0 ? (
            participantDetails.map((participant) => (
              <div key={participant._id} className="participant-card">
                <div className="avatar-circle">
                  {getInitials(participant.name)}
                </div>
                <p className="participant-name">{participant.name}</p>
                <p className="participant-status">Going</p>
              </div>
            ))
          ) : (
            <p>No participants yet.</p>
          )}
        </div>
      </div>

      <div className="ManageUsers">
        <h3>📧 Invites</h3>
        <InviteButton tripId={tripDetails._id} />

        {/* Pending Invites */}
        <div className="invite-section">
          <h4>Pending ({pendingInvites.length})</h4>
          {pendingInvites.length > 0 ? (
            <ul className="invites-list">
              {pendingInvites.map((invite) => (
                <li key={invite._id}>
                  <p className="email">{invite.invitee.email}</p>
                  <p className="date">
                    Invited on {new Date(invite.invitedAt).toLocaleDateString()}
                  </p>
                  {/* 
                  <button
                    onClick={() => handleDeleteInvite(invite._id)}
                    className="BtnMUsers"
                  >
                    Delete Invite
                  </button>
                  */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="notFound-message">No pending email invites.</p>
          )}
        </div>

        <div className="invite-section">
          <h4>Accepted ({acceptedInvites.length})</h4>
          {acceptedInvites.length > 0 ? (
            <ul className="invites-list">
              {acceptedInvites.map((invite) => (
                <li key={invite._id}>
                  <p className="email">{invite.invitee.email}</p>
                  {/* 
                  <button
                    onClick={() => handleDeleteInvite(invite._id)}
                    className="BtnMUsers"
                  >
                    Delete Invite
                  </button>
                  */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="notFound-message">No accepted invites yet.</p>
          )}
        </div>

        {/* Declined Invites */}
        <div className="invite-section">
          <h4>Declined ({declinedInvites.length})</h4>
          {declinedInvites.length > 0 ? (
            <ul className="invites-list">
              {declinedInvites.map((invite) => (
                <li key={invite._id}>
                  <p className="email">{invite.invitee.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="notFound-message">No declined invites.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ManageUsers
