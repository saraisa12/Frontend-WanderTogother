import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Activity.css' // Import your CSS file for styling

const ActivityPage = () => {
  const [activities, setActivities] = useState([])

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/activities')
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  /*
  const handleReaction = async (id, reaction) => {
    try {
      await fetch(`http://localhost:4000/api/activities/${id}/reactions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reaction })
      })
      fetchActivities() // Refresh activities after updating the reaction
    } catch (error) {
      console.error('Error updating reaction:', error)
    }
  }*/

  useEffect(() => {
    fetchActivities()
  }, [])

  return (
    <div className="activity-page">
      <h1>Activities</h1>
      <Link className="add-activity-link" to="/activities/create">
        Add activity
      </Link>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity._id} className="activity-item">
            <h2>{activity.name}</h2>
            <p>Price: ${activity.price}</p>
            <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
            <p>Location: {activity.location}</p>
            <p>Description: {activity.description}</p>
            <a
              href={activity.mapLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in map
            </a>
            <div className="reactions">
              <button onClick={() => handleReaction(activity._id, 'like')}>
                😍
              </button>
              <button onClick={() => handleReaction(activity._id, 'neutral')}>
                😐
              </button>
              <button onClick={() => handleReaction(activity._id, 'angry')}>
                😡
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityPage
