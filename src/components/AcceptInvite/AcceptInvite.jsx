import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Client from "../../services/api"

const AcceptInvite = ({ handleLogOut }) => {
  const { inviteId } = useParams()
  const [inviteDetails, setInviteDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

      // If no token exists, redirect to the sign-in page
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
      alert("Invite status updated successfully!")
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
