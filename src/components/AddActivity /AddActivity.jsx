import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../../services/api'

const AddActivity = () => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(formRef.current)

    setLoading(true)

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="activity-form">
      <h2>Add Activity</h2>

      <div>
        <label htmlFor="name">Activity Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" required />
      </div>
      <div>
        <label htmlFor="photo">Upload Photo</label>
        <input type="file" id="photo" name="photo" accept="image/*" required />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Adding...' : 'Add Activity'}
      </button>
    </form>
  )
}

export default AddActivity
