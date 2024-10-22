import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Client from '../../services/api'
import Overview from '../overview/Overview'
import ManageUsers from '../ManageUsers/ManageUsers'
import InviteModal from '../InviteModal/InviteModal'
import Notes from '../Notes/Notes'

const DetailsTrip = ({ user }) => {
  const { id } = useParams()
  const [tripDetails, setTripDetails] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isInviteModalOpen, setInviteModalOpen] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await Client.get(`/trip/details/${id}`)
        setTripDetails(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch trip details')
      } finally {
        setLoading(false)
      }
    }

    const fetchInvites = async () => {
      try {
        const response = await Client.get(`/invite/list/${id}`)
        setInvites(response.data.invites)
      } catch (err) {
        console.error('Error fetching invites:', err)
      }
    }

    fetchTripDetails()
    fetchInvites()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      {tripDetails ? (
        <div>
          <h2>{tripDetails.title}</h2>
          <nav>
            <button onClick={() => setActiveTab('overview')}>Overview</button>
            <button onClick={() => setActiveTab('manage-users')}>
              Manage Users
            </button>
            {tripDetails.creator === user.id && (
              <button onClick={() => setInviteModalOpen(true)}>Invite</button>
            )}
            <button onClick={() => setActiveTab('activities')}>
              Activities
            </button>
            <button
              onClick={() => {
                console.log('Notes button clicked')
                setShowNotes(true)
                setActiveTab('notes')
              }}
            >
              Notes
            </button>
          </nav>
          <div>
            {activeTab === 'overview' && <Overview tripDetails={tripDetails} />}
            {activeTab === 'manage-users' && (
              <ManageUsers
                invites={invites}
                participants={tripDetails.participants}
                handleDeleteInvite={handleDeleteInvite}
              />
            )}
            {activeTab === 'activities' && (
              <div>Activities content goes here.</div>
            )}
            {activeTab === 'notes' && showNotes && (
              <>
                {console.log('Rendering Notes component')}
                <Notes tripId={id} />
              </>
            )}
          </div>
          {isInviteModalOpen && (
            <InviteModal
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              handleSendInvite={handleSendInvite}
              setInviteModalOpen={setInviteModalOpen}
            />
          )}
          {inviteMessage && <p style={{ color: 'green' }}>{inviteMessage}</p>}
        </div>
      ) : (
        <p>Trip details not found.</p>
      )}
    </div>
  )
}

export default DetailsTrip
