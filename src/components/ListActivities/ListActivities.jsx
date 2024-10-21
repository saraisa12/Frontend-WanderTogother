import { useState, useEffect } from 'react'
import { getAllActivities, deleteActivity } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const ListActivities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getAllActivities()
        setActivities(activitiesData)
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
      setActivities(activities.filter((activity) => activity._id !== id))
      alert('Activity deleted successfully!')
    } catch (error) {
      console.error('Error deleting activity:', error)
      alert('Failed to delete activity. Please try again.')
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit/activity/${id}`)
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
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListActivities
