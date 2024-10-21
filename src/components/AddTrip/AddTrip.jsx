import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance
import "./AddTrip.css"

const AddTrip = () => {
  const formRef = useRef()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(formRef.current)

    try {
      const response = await Client.post("/trip/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Trip added successfully:", response.data)

      formRef.current.reset() // Reset the form

      navigate("/list/trips") // Navigate to the list of trips
    } catch (error) {
      console.error("Error adding trip:", error)
      alert(
        "Error adding trip: " +
          (error.response ? error.response.data.message : error.message)
      )
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="trip-form">
      <h2>ADD A NEW TRIP</h2>

      <div className="inputs">
        <div className="input-wrapper-3">
          <label htmlFor="title">Trip Name</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Trip Title"
            required
            className="input-AddTrip"
          />
        </div>

        <div className="input-wrapper-3">
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            placeholder="Trip Description"
            required
          ></textarea>
        </div>

        <div className="input-wrapper-3">
          <label htmlFor="startDate">Start Date</label>
          <br />
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            className="input-AddTrip"
          />
        </div>

        <div className="input-wrapper-3">
          <label htmlFor="endDate">End Date</label>
          <br />
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            className="input-AddTrip"
          />
        </div>

        <div className="input-wrapper-3">
          <label htmlFor="location">Location</label>
          <br />
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            required
            className="input-AddTrip"
          />
        </div>

        <div className="input-wrapper-3">
          <label htmlFor="image">Trip Image</label>
          <br />
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="input-AddTrip"
          />
        </div>

        <button type="submit" className="AddTripSubmitBtn">
          ADD TRIP
        </button>
      </div>
    </form>
  )
}

export default AddTrip
