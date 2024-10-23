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
        setActivities(response.data.activities)

        const storedVotes = JSON.parse(localStorage.getItem("votes")) || {}
        setSelectedVote(storedVotes)
      } catch (error) {
        console.error("Error fetching activities:", error)
        setError("Failed to fetch activities.")
      } finally {
        setLoading(false)
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

    console.log(id)

    try {
      await Client.post(`/activity/comment/${id}`, {
        text: commentText[id], // Only send the comment text
      })

      alert("Comment added successfully!")

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
      setCommentText((prev) => ({ ...prev, [id]: "" })) // Clear comment input for this activity
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment. Please try again.")
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
      <div class="activity-header">
        <h1>Activities</h1>
        <p>Suggest new activities using the “+ Add activity” button below</p>

        <div className="add-activity-button-container">
          <button class="add-activity-button" onClick={handleAddActivity}>
            Add activity <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>

      {activities.map((activity) => (
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
                <a href={activity.mapsUrl} target="_blank">
                  view in maps <i class="bi bi-box-arrow-up-right"></i>
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
      ))}
    </div>
  )
}

export default ListActivities
