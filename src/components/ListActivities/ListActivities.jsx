import { useState, useEffect } from 'react'
import {
  getAllActivities,
  deleteActivity,
  addVote,
  addComment
} from '../../services/api'
import { useNavigate } from 'react-router-dom'

const ListActivities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const [selectedVote, setSelectedVote] = useState({})

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getAllActivities()
        setActivities(activitiesData)

        const storedVotes = JSON.parse(localStorage.getItem('votes')) || {}
        setSelectedVote(storedVotes)
      } catch (error) {
        console.error('Error fetching activities:', error)
        setError('Failed to fetch activities.')
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this activity?'
    )
    if (!confirmDelete) return

    try {
      await deleteActivity(id)
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity._id !== id)
      )
      alert('Activity deleted successfully!')
    } catch (error) {
      console.error('Error deleting activity:', error)
      alert('Failed to delete activity. Please try again.')
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit/activity/${id}`)
  }

  const handleVote = async (id, voteType) => {
    try {
      await addVote(id, voteType)
      alert(`You have ${voteType} this activity!`)

      const updatedVotes = { ...selectedVote, [id]: voteType }
      localStorage.setItem('votes', JSON.stringify(updatedVotes))
      setSelectedVote(updatedVotes)

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id
            ? {
                ...activity,
                currentVote: voteType
              }
            : {
                ...activity,
                currentVote: null
              }
        )
      )
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to vote. Please try again.')
    }
  }

  const handleComment = async (id) => {
    if (!comment) {
      alert('Please enter a comment.')
      return
    }

    const user = localStorage.getItem('username') || 'Anonymous'

    try {
      await addComment(id, { text: comment, user })
      alert('Comment added successfully!')
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id
            ? {
                ...activity,
                comments: [...activity.comments, { text: comment, user }]
              }
            : activity
        )
      )
      setComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    }
  }

  if (loading) {
    return <p>Loading activities...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <p>{activity.location}</p>
            <img
              src={`http://localhost:4000/uploads/../${activity.photo}`}
              alt={activity.name}
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            />
            <button onClick={() => handleDelete(activity._id)}>Delete</button>
            <button onClick={() => handleEdit(activity._id)}>Edit</button>

            <div>
              <button
                onClick={() => handleVote(activity._id, 'Agree')}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === 'Agree'
                      ? 'yellow'
                      : 'transparent',
                  fontWeight:
                    selectedVote[activity._id] === 'Agree' ? 'bold' : 'normal'
                }}
              >
                😍
              </button>
              <button
                onClick={() => handleVote(activity._id, 'I dont know')}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === 'I dont know'
                      ? 'yellow'
                      : 'transparent',
                  fontWeight:
                    selectedVote[activity._id] === 'I dont know'
                      ? 'bold'
                      : 'normal'
                }}
              >
                😐
              </button>
              <button
                onClick={() => handleVote(activity._id, 'Disagree')}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === 'Disagree'
                      ? 'yellow'
                      : 'transparent',
                  fontWeight:
                    selectedVote[activity._id] === 'Disagree'
                      ? 'bold'
                      : 'normal'
                }}
              >
                😡
              </button>
            </div>

            <div>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={() => handleComment(activity._id)}>
                Submit Comment
              </button>
            </div>

            <div>
              {activity.comments && activity.comments.length > 0 ? (
                <ul>
                  {activity.comments.map((cmt, index) => (
                    <li key={index}>
                      <strong>{cmt.user}: </strong>
                      {cmt.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListActivities
