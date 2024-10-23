import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Client from "../../services/api"
import "./ListTrips.css" // Add a CSS file for styling

const ListTrips = ({ user }) => {
  console.log({ user })
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getTrips = async () => {
      try {
        const response = await Client.get("/trip/index")
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
      setTrips(trips.filter((trip) => trip._id !== id))
      alert("Trip deleted successfully")
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message)
    }
  }

  if (loading) return <p>Loading trips...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="trips-container">
      <div className="trips-header">
        <h2>My Trips</h2>
        <Link to="/add/trip" className="add-trip-button">
          Add New Trip +
        </Link>
      </div>

      <div className="trips-list">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip._id} className="trip-card">
              {trip.creator === user.id && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(trip._id)}
                >
                  &times;
                </button>
              )}
              <Link to={`/trip/details/${trip._id}`} className="trip-link">
                <div className="image-container">
                  <img
                    src={`http://localhost:4000/uploads/../${trip.image}`}
                    alt={trip.title}
                    className="trip-image"
                  />
                  <div className="image-overlay"></div>
                  <h3 className="trip-title">{trip.title}</h3>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
    </div>
  )
}

export default ListTrips
