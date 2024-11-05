import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../../services/api"
import "./ListActivities.css"
import ActivityMenu from "../ActivityMenu/ActivityMenu"
import ActivityComment from "../ActivityComment/ActivityComment"

const ListActivities = ({ tripId, handleAddActivity }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentText, setCommentText] = useState({}) // Store comments per activity
  const navigate = useNavigate()
  const [selectedVote, setSelectedVote] = useState({})

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await Client.get(`/activity/index/${tripId}`)

        // If activities are returned
        const activitiesData = response.data.activities || []
        setActivities(activitiesData)

        // Handling votes (if applicable)
        const storedVotes = JSON.parse(localStorage.getItem("votes")) || {}
        setSelectedVote(storedVotes)
      } catch (error) {
        // If a 404 error occurs (no activities found)
        if (error.response && error.response.status === 404) {
          console.log(error.response.data.message) // No activities found
          setError(error.response.data.message) // Set the error message from backend
          setActivities([]) // Ensure activities is set to an empty array
        } else {
          // Other errors (e.g., network issues)
          console.error("Error fetching activities:", error)
          setError("Failed to fetch activities. Please try again.")
        }
      } finally {
        setLoading(false) // End loading state
      }
    }

    fetchActivities()
  }, [tripId])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?"
    )
    if (!confirmDelete) return

    try {
      await Client.delete(`/activity/delete/${id}`)
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity._id !== id)
      )
    } catch (error) {
      console.error("Error deleting activity:", error)
      alert("Failed to delete activity. Please try again.")
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit/activity/${id}?tripId=${tripId}`)
  }

  const handleVote = async (id, voteType) => {
    try {
      await Client.post(`/activity/vote/${id}`, { voteType })

      const updatedVotes = { ...selectedVote, [id]: voteType }
      localStorage.setItem("votes", JSON.stringify(updatedVotes))
      setSelectedVote(updatedVotes)

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id
            ? {
                ...activity,
                currentVote: voteType,
              }
            : activity
        )
      )
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleCommentChange = (id, text) => {
    setCommentText((prev) => ({ ...prev, [id]: text }))
  }

  const handleComment = async (id) => {
    if (!commentText[id]) {
      alert("Please enter a comment.")
      return
    }

    try {
      await Client.post(`/activity/comment/${id}`, {
        text: commentText[id], // Only send the comment text
      })

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id
            ? {
                ...activity,
                comments: [
                  ...activity.comments,
                  { text: commentText[id], user: { name: "You" } },
                ],
              }
            : activity
        )
      )
      setCommentText((prev) => ({ ...prev, [id]: "" }))
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment. Please try again.")
    }
  }

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h1>Activities</h1>
        <p>Suggest new activities using the “+ Add activity” button below</p>

        <div className="add-activity-button-container">
          <button className="add-activity-button" onClick={handleAddActivity}>
            Add activity <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      {loading && <p>Loading activities...</p>}

      {error ? (
        <p>{error}</p>
      ) : (
        activities.map((activity) => (
          <div className="activitiy-container" key={activity._id}>
            <div className="activity-card">
              <div className="activity-image-container">
                <img src={activity.photoUrl} alt={activity.name} />
              </div>

              <div className="activity-details">
                <div>
                  <h3>{activity.name}</h3>

                  <p>{activity.description}</p>
                  <p>{activity.Date}</p>
                  <hr className="line" />
                  <a
                    href={activity.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in Maps <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>

                <div className="reactions">
                  <button
                    onClick={() => handleVote(activity._id, "happy")}
                    style={{
                      backgroundColor:
                        selectedVote[activity._id] === "happy"
                          ? "#D3D3D3"
                          : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    😊
                  </button>
                  <button
                    onClick={() => handleVote(activity._id, "neutral")}
                    style={{
                      backgroundColor:
                        selectedVote[activity._id] === "neutral"
                          ? "#D3D3D3"
                          : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    😐
                  </button>
                  <button
                    onClick={() => handleVote(activity._id, "angry")}
                    style={{
                      backgroundColor:
                        selectedVote[activity._id] === "angry"
                          ? "#D3D3D3"
                          : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    😠
                  </button>
                </div>
              </div>

              <div className="kabab-menu">
                <ActivityMenu
                  activity={activity}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </div>
            </div>
            <div className="comment-container">
              <ActivityComment
                comments={activity.comments}
                activityId={activity._id}
                commentText={commentText[activity._id] || ""}
                handleCommentChange={handleCommentChange}
                handleComment={handleComment}
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ListActivities
