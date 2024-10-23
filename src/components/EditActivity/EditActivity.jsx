import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Axios from "axios"

const BASE_URL = "http://localhost:4000"

const EditActivity = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [photo, setPhoto] = useState(null)

  // Extract the tripId from the query string
  const tripId = new URLSearchParams(location.search).get("tripId")

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/activity/${id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setActivity(response.data.activity)
      } catch (error) {
        console.error("Error fetching activity:", error)
        setError("Failed to fetch activity.")
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", activity.name)
      formData.append("description", activity.description)
      formData.append("location", activity.location)
      if (photo) {
        formData.append("photo", photo)
      }

      await Axios.put(`${BASE_URL}/activity/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      alert("Activity updated successfully!")

      // Navigate back to the trip details page using tripId
      if (tripId) {
        navigate(`/trip/details/${tripId}`)
      } else {
        navigate("/list/activities") // Fallback if tripId is missing
      }
    } catch (error) {
      console.error("Error updating activity:", error)
      alert("Failed to update activity. Please try again.")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Edit Activity</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={activity.name}
          onChange={(e) => setActivity({ ...activity, name: e.target.value })}
          required
        />
        <textarea
          value={activity.description}
          onChange={(e) =>
            setActivity({ ...activity, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          value={activity.location}
          onChange={(e) =>
            setActivity({ ...activity, location: e.target.value })
          }
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <button type="submit">Update Activity</button>
      </form>
    </div>
  )
}

export default EditActivity
