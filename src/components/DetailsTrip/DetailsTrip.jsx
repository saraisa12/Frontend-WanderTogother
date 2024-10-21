import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Client from "../../services/api"
import Overview from "../overview/Overview"
import ManageUsers from "../ManageUsers/ManageUsers"
import InviteModal from "../InviteModal/InviteModal"

const DetailsTrip = ({ user }) => {
  const { id } = useParams()

  const [tripDetails, setTripDetails] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState(null)
  const [activeTab, setActiveTab] = useState("overview") // Default to "Overview" tab
  const [isInviteModalOpen, setInviteModalOpen] = useState(false) // Control the modal visibility

  useEffect(() => {
    const getTripDetails = async () => {
      try {
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      } finally {
        setLoading(false)
      }
    }

    const getInvites = async () => {
      try {
        const response = await Client.get(`/invite/list/${id}`)
        setInvites(response.data.invites)
      } catch (err) {
        console.error("Error fetching invites:", err)
      }
    }

    getTripDetails()
    getInvites()
  }, [id])

  const handleSendInvite = async () => {
    try {
      const response = await Client.post(`/invite/add`, {
        tripId: id,
        email: inviteEmail,
      })
      setInviteMessage(response.data.message)
      setInviteEmail("") // Clear the input after sending

      // Refresh the invites list to show the new invite
      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(error.response?.data?.message || "Failed to send invite")
    }
  }

  const handleDeleteInvite = async (inviteId) => {
    try {
      await Client.delete(`/invite/delete/${inviteId}`)
      setInviteMessage("Invite deleted successfully")

      // Refresh the invites list after deletion
      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(
        error.response?.data?.message || "Failed to delete invite"
      )
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {tripDetails ? (
        <div>
          <h2>{tripDetails.title}</h2>

          {/* Tab Navigation */}
          <nav>
            <button onClick={() => setActiveTab("overview")}>Overview</button>
            <button onClick={() => setActiveTab("manage-users")}>
              Manage Users
            </button>
            {tripDetails.creator === user.id && (
              <button onClick={() => setInviteModalOpen(true)}>Invite</button>
            )}
            <button onClick={() => setActiveTab("activities")}>
              Activities
            </button>
          </nav>

          {/* Render Tab Content Based on Active Tab */}
          <div>
            {activeTab === "overview" && <Overview tripDetails={tripDetails} />}
            {activeTab === "manage-users" && (
              <ManageUsers
                invites={invites}
                participants={tripDetails.participants} // Pass participants from tripDetails
                handleDeleteInvite={handleDeleteInvite}
              />
            )}
            {activeTab === "activities" && (
              <div>Activities content goes here.</div>
            )}
          </div>

          {/* Modal to send invite */}
          {isInviteModalOpen && (
            <InviteModal
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              handleSendInvite={handleSendInvite}
              setInviteModalOpen={setInviteModalOpen} // To close the modal
            />
          )}
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
