import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Client from "../../services/api"
import Overview from "../overview/Overview"
import ManageUsers from "../ManageUsers/ManageUsers"
import InviteModal from "../InviteModal/InviteModal"
import Notes from "../Notes/Notes"
import ListActivities from "../ListActivities/ListActivities"
import Album from "../Album/Album"
import Checklist from "../Checklist/Checklist"
import TripCalendar from "../Calendar/Calendar"
import "./DetailsTrip.css"

const DetailsTrip = ({ user }) => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [tripDetails, setTripDetails] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const [isInviteModalOpen, setInviteModalOpen] = useState(false)
  const [creatorName, setCreatorName] = useState("")
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)

        // Fetch creator details
        const creatorId = response.data.creator // Assuming creator is the ID field
        fetchCreatorDetails(creatorId)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trip details")
      } finally {
        setLoading(false)
      }
    }

    const fetchInvites = async () => {
      try {
        const response = await Client.get(`/invite/list/${id}`)
        setInvites(response.data.invites)
      } catch (err) {
        console.error("Error fetching invites:", err)
      }
    }

    // Fetch creator's details based on creator ID
    const fetchCreatorDetails = async (creatorId) => {
      try {
        const response = await Client.post("/auth/details", {
          ids: [creatorId], // Pass the creator ID to the backend
        })
        if (response.data.length > 0) {
          setCreatorName(response.data[0].name)
        }
      } catch (error) {
        console.error("Error fetching creator details:", error)
      }
    }

    fetchTripDetails()
    fetchInvites()
  }, [id])

  const handleSendInvite = async () => {
    try {
      const response = await Client.post(`/invite/add`, {
        tripId: id,
        email: inviteEmail,
      })
      setInviteMessage(response.data.message)
      setInviteEmail("")

      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(error.response?.data?.message || "Failed to send invite")
    }
  }

  const handleAddActivity = () => {
    navigate(`/add/activity/${id}`)
  }

  const handleDeleteInvite = async (inviteId) => {
    try {
      await Client.delete(`/invite/delete/${inviteId}`)
      setInviteMessage("Invite deleted successfully")

      const updatedInvites = await Client.get(`/invite/list/${id}`)
      setInvites(updatedInvites.data.invites)
    } catch (error) {
      setInviteMessage(
        error.response?.data?.message || "Failed to delete invite"
      )
    }
  }

  const handleActivityAdded = (activity) => {
    console.log("Activity added:", activity)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div className="details-container">
      {tripDetails ? (
        <div className="Details">
          <h2>{tripDetails.title}</h2>

          <nav className="navBarDetails">
            <div className="creator-info">
              <span className="creator-name">{creatorName}</span>
              <span className="badge">planner</span>
            </div>

            <button onClick={() => setActiveTab("overview")} className="DBtns">
              Overview
            </button>

            <button
              onClick={() => setActiveTab("activities")}
              className="DBtns"
            >
              Activities
            </button>

            <button onClick={() => setActiveTab("calendar")} className="DBtns">
              Calendar
            </button>

            <button onClick={() => setActiveTab("album")} className="DBtns">
              Album
            </button>

            <button onClick={() => setActiveTab("checklist")} className="DBtns">
              checklist
            </button>

            <button
              onClick={() => {
                setActiveTab("notes")
              }}
              className="DBtns"
            >
              Notes
            </button>

            {tripDetails.creator === user?.id && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="DBtns"
              >
                <i class="bi bi-person-add"></i> Invite
              </button>
            )}
          </nav>

          <div>
            {activeTab === "overview" && (
              <Overview
                tripDetails={tripDetails}
                invites={invites}
                participants={tripDetails.participants}
                handleDeleteInvite={handleDeleteInvite}
              />
            )}

            {activeTab === "activities" && (
              <div>
                <ListActivities
                  tripId={id}
                  onActivityAdded={handleActivityAdded}
                  handleAddActivity={handleAddActivity}
                />
              </div>
            )}

            {activeTab === "notes" && <Notes tripId={id} />}
            {activeTab === "calendar" && (
              <TripCalendar tripId={id} onActivityAdded={handleActivityAdded} />
            )}

            {activeTab === "album" && <Album tripId={id} />}
            {activeTab === "checklist" && <Checklist tripId={id} />}
          </div>

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
      ) : (
        <p>No trip details found</p>
      )}
    </div>
  )
}

export default DetailsTrip
