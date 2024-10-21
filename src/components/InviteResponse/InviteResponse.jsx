import React from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const InviteResponse = () => {
  const { inviteId } = useParams()

  const handleResponse = async (status) => {
    try {
      await axios.put(`/invite/${inviteId}`, { status })
      alert(
        `You have successfully ${
          status === "accepted" ? "accepted" : "declined"
        } the invitation.`
      )
    } catch (error) {
      console.error(
        `Error ${
          status === "accepted" ? "accepting" : "declining"
        } the invite:`,
        error
      )
      alert(
        `There was an error ${
          status === "accepted" ? "accepting" : "declining"
        } the invite.`
      )
    }
  }

  return (
    <div>
      <h2>Would you like to join this trip?</h2>
      <button onClick={() => handleResponse("accepted")}>
        Accept Invitation
      </button>
      <button onClick={() => handleResponse("declined")}>
        Decline Invitation
      </button>
    </div>
  )
}

export default InviteResponse
