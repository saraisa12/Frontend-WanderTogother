import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../../services/api'

const AddActivity = () => {
  const formRef = useRef()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(formRef.current)

    try {
      const response = await Client.post('/activity/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Activity added successfully:', response.data)

      formRef.current.reset()
      navigate('/list/activities')
    } catch (error) {
      console.error('Error adding activity:', error)
      alert(
        'Error adding activity: ' +
          (error.response ? error.response.data.message : error.message)
      )
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="activity-form">
      <h2>Add Activity</h2>

      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Activity Name"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Activity Description"
        required
      ></textarea>

      <label htmlFor="location">Location</label>
      <input
        type="text"
        id="location"
        name="location"
        placeholder="Location"
        required
      />

      <label htmlFor="photo">Activity Photo</label>
      <input type="file" id="photo" name="photo" accept="image/*" />

      <button type="submit" className="submit-button">
        Add Activity
      </button>
    </form>
  )
}

export default AddActivity
