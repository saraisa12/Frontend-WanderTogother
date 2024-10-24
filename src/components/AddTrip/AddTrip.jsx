import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../../services/api' // Import the Client instance
import './AddTrip.css'

const AddTrip = () => {
  const formRef = useRef()
  const navigate = useNavigate()

  // Add class to body for specific background
  useEffect(() => {
    document.body.classList.add('add-trip-page')
    return () => {
      document.body.classList.remove('add-trip-page')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(formRef.current)

    try {
      const response = await Client.post('/trip/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Trip added successfully:', response.data)

      formRef.current.reset() // Reset the form

      navigate('/list/trips') // Navigate to the list of trips
    } catch (error) {
      console.error('Error adding trip:', error)
      alert(
        'Error adding trip: ' +
          (error.response ? error.response.data.message : error.message)
      )
    }
  }

  return (
    <>
      <h2 className="title-trip">ADD A NEW TRIP</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="trip-form">
        <div className="inputs">
          <div className="input-wrapper">
            <label htmlFor="title">Trip Name</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Trip Title"
              required
              className="input-AddTrip"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Trip Description"
              required
            ></textarea>
          </div>

          <div className="input-wrapper">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              className="input-AddTrip"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              className="input-AddTrip"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Location"
              required
              className="input-AddTrip"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="image">Trip Image</label>
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
    </>
  )
}

export default AddTrip
