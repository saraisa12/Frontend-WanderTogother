import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Client from "../../services/api"
import "./AcceptInvite.css"

const AcceptInvite = ({ handleLogOut }) => {
  const { inviteId } = useParams()
  const [inviteDetails, setInviteDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creatorEmail, setCreatorEmail] = useState("")
  const navigate = useNavigate()
  const location = useLocation() // To get the current URL

  useEffect(() => {
    const handleAuthentication = async () => {
      const token = localStorage.getItem("token")

      // Check if the user has been redirected from the login page
      const searchParams = new URLSearchParams(location.search)
      const redirected = searchParams.get("redirected")

      // If the user has NOT been redirected from login AND a token exists, log them out
      // if (!redirected && token) {
      //   console.log("User logged in, logging out...")
      //   handleLogOut() // Log out the user and remove the token
      //   navigate(`/signin?redirect=/invite/accept/${inviteId}`)
      //   return
      // }

      if (!token) {
        console.log("No token found, redirecting to login")
        navigate(`/signin?redirect=/invite/accept/${inviteId}`)
      }
    }

    handleAuthentication()
  }, [inviteId, navigate, handleLogOut, location])

  useEffect(() => {
    const getInviteDetails = async () => {
      const token = localStorage.getItem("token")

      // Fetch the invite details only if a valid token exists
      if (!token) return

      try {
        const inviteResponse = await Client.get(`/invite/details/${inviteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setInviteDetails(inviteResponse.data)
        fetchCreatorEmail(inviteResponse.data.trip.creator)
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

  const fetchCreatorEmail = async (creatorId) => {
    try {
      const response = await Client.post("/auth/details", {
        ids: [creatorId], // Send the creator's ID in the request body
      })
      if (response.data.length > 0) {
        setCreatorEmail(response.data[0].email)

        console.log(response)
      }
    } catch (error) {
      console.error("Error fetching creator details:", error)
    }
  }

  const handleUpdateStatus = async (status) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("You need to sign in to update the invite status")
      navigate(`/signin?redirect=/invite/accept/${inviteId}`)
      return
    }

    try {
      await Client.put(
        `/invite/update/${inviteId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      navigate("/list/trips")
    } catch (error) {
      alert("Failed to update the invite status.")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="accept-invite-container">
      {inviteDetails ? (
        <div className="invite-card">
          <h2 className="invite-title">You're Invited!</h2>

          <img className="accept-image" src="/Images/accept.svg" alt="" />

          <div className="invite-info">
            <p>
              <strong>Trip:</strong> {inviteDetails.trip.title}
            </p>

            <p>
              <strong>Organizer:</strong> {creatorEmail}{" "}
              {/* Email of the organizer */}
            </p>
          </div>

          <div className="invite-buttons">
            <button
              className="invite-button accept"
              onClick={() => handleUpdateStatus("accepted")}
            >
              Accept Invitation
            </button>
            <button
              className="invite-button decline"
              onClick={() => handleUpdateStatus("declined")}
            >
              Decline
            </button>
          </div>
        </div>
      ) : (
        <p>Invite details not found.</p>
      )}
    </div>
  )
}

export default AcceptInvite
