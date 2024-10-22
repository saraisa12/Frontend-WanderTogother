import Axios from 'axios'

export const BASE_URL = 'http://localhost:4000'

const Client = Axios.create({ baseURL: BASE_URL })

Client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const getAllActivities = async () => {
  try {
    const response = await Client.get('/activity/index')
    return response.data.activities
  } catch (error) {
    throw error
  }
}

export const getActivity = async (activityId) => {
  try {
    const response = await Client.get(`/activity/${activityId}`)
    return response.data.activity
  } catch (error) {
    throw error
  }
}

export const addActivity = async (activityData) => {
  try {
    const formData = new FormData()
    formData.append('name', activityData.name)
    formData.append('description', activityData.description)
    formData.append('location', activityData.location)
    if (activityData.photo) {
      formData.append('photo', activityData.photo)
    }

    const response = await Client.post('/activity/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateActivity = async (activityId, activityData) => {
  try {
    const formData = new FormData()
    formData.append('name', activityData.name)
    formData.append('description', activityData.description)
    formData.append('location', activityData.location)
    if (activityData.photo) {
      formData.append('photo', activityData.photo)
    }

    const response = await Client.put(
      `/activity/update/${activityId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteActivity = async (activityId) => {
  try {
    const response = await Client.delete(`/activity/delete/${activityId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const addVote = async (activityId, voteType) => {
  try {
    const response = await Client.post(`/activity/${activityId}/vote`, {
      voteType
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const addComment = async (activityId, commentData) => {
  try {
    const response = await Client.post(`/activity/${activityId}/comment`, {
      text: commentData.text,
      user: commentData.user
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export default Client
