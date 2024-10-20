import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../../services/api" // Import the Client instance

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
      <h2>Add Trip</h2>

      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        placeholder="Trip Title"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Trip Description"
        required
      ></textarea>

      <label htmlFor="startDate">Start Date</label>
      <input type="date" id="startDate" name="startDate" required />

      <label htmlFor="endDate">End Date</label>
      <input type="date" id="endDate" name="endDate" required />

      <label htmlFor="location">Location</label>
      <input
        type="text"
        id="location"
        name="location"
        placeholder="Location"
        required
      />

      <label htmlFor="image">Trip Image</label>
      <input type="file" id="image" name="image" accept="image/*" />

      <button type="submit" className="submit-button">
        Add Trip
      </button>
    </form>
  )
}

export default AddTrip
