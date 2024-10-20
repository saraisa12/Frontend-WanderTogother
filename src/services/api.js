import Axios from 'axios'

export const BASE_URL = 'http://localhost:4000'

const Client = Axios.create({ baseURL: BASE_URL })

// Intercepts every request axios makes
Client.interceptors.request.use(
  (config) => {
    // Reads the token in localStorage
    const token = localStorage.getItem('token')
    // if the token exists, we set the authorization header
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`
    }
    return config // We return the new config if the token exists or the default config if no token exists.
  },
  (error) => Promise.reject(error)
)

// CRUD functions for activities

// Get all activities
export const getActivities = async () => {
  try {
    const response = await Client.get('/activities')
    return response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
    throw error
  }
}

// Add a new activity
export const addActivity = async (activity) => {
  try {
    const response = await Client.post('/activities', activity)
    return response.data
  } catch (error) {
    console.error('Error adding activity:', error)
    throw error
  }
}

// Update an existing activity
export const updateActivity = async (id, updatedActivity) => {
  try {
    const response = await Client.put(`/activities/${id}`, updatedActivity)
    return response.data
  } catch (error) {
    console.error('Error updating activity:', error)
    throw error
  }
}

// Delete an activity
export const deleteActivity = async (id) => {
  try {
    await Client.delete(`/activities/${id}`)
  } catch (error) {
    console.error('Error deleting activity:', error)
    throw error
  }
}

export default Client
