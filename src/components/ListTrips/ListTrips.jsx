import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Client from "../../services/api"

const ListTrips = ({ user }) => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log(user)
  useEffect(() => {
    const getTrips = async () => {
      try {
        const response = await Client.get("/trip/index")
        console.log("API Response:", response.data)

        setTrips(response.data.trips)
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message)
      } finally {
        setLoading(false)
      }
    }

    getTrips()
  }, [])

  const handleDelete = async (id) => {
    try {
      await Client.delete(`/trip/delete/${id}`)
      // Filter out the deleted trip from the state
      setTrips(trips.filter((trip) => trip._id !== id))
      alert("Trip deleted successfully") // Optional: You can keep or remove this alert
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message)
    }
  }

  if (loading) return <p>Loading trips...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      {trips.length > 0 ? (
        trips.map((trip) => (
          <div key={trip._id} style={{ marginBottom: "10px" }}>
            <Link to={`/trip/details/${trip._id}`}>
              <h3>{trip.title}</h3>
            </Link>
            {trip.creator === user.id && (
              <button onClick={() => handleDelete(trip._id)}>Delete</button>
            )}
          </div>
        ))
      ) : (
        <p>No trips found.</p>
      )}
    </div>
  )
}

export default ListTrips
