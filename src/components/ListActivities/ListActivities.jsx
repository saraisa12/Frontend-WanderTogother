import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../../services/api" // Assuming Client is your Axios instance

const ListActivities = ({ tripId }) => {
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

  // Handle comment input and submission per activity
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

      // After successfully adding a comment, update the activities list with the new comment
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id
            ? {
                ...activity,
                comments: [
                  ...activity.comments,
                  { text: commentText[id], user: { name: "You" } },
                ], // Placeholder user for the added comment until refetch
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
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <a href={activity.mapsUrl}>view in maps</a>
            <img
              src={activity.photoUrl}
              alt={activity.name}
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
            />
            <button onClick={() => handleDelete(activity._id)}>Delete</button>
            <button onClick={() => handleEdit(activity._id)}>Edit</button>

            {/* Voting Section */}
            <div>
              <button
                onClick={() => handleVote(activity._id, "happy")}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === "happy"
                      ? "yellow"
                      : "transparent",
                }}
              >
                😊
              </button>
              <button
                onClick={() => handleVote(activity._id, "neutral")}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === "neutral"
                      ? "yellow"
                      : "transparent",
                }}
              >
                😐
              </button>
              <button
                onClick={() => handleVote(activity._id, "angry")}
                style={{
                  backgroundColor:
                    selectedVote[activity._id] === "angry"
                      ? "yellow"
                      : "transparent",
                }}
              >
                😠
              </button>
            </div>

            {/* Comments Section */}
            <div>
              <input
                type="text"
                value={commentText[activity._id] || ""}
                onChange={(e) =>
                  handleCommentChange(activity._id, e.target.value)
                }
                placeholder="Add a comment..."
              />
              <button onClick={() => handleComment(activity._id)}>
                Submit Comment
              </button>
            </div>

            {/* Display Comments */}
            <div>
              {activity.comments && activity.comments.length > 0 ? (
                <ul>
                  {activity.comments.map((cmt, index) => (
                    <li key={index}>
                      {/* Check if cmt.user and cmt.user.name exist before trying to access it */}
                      <strong>
                        {cmt.user && cmt.user.name
                          ? cmt.user.name
                          : "Unknown User"}
                        :{" "}
                      </strong>
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
