import Client from './api'

export const SignInUser = async (data) => {
  try {
    console.log('Logging in with data:', data) // Log the login data
    const res = await Client.post('/auth/login', data)
    localStorage.setItem('token', res.data.token)
    console.log('Login response:', res.data) // Log the response data
    return res.data.user
  } catch (error) {
    console.error(
      'SignInUser error:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

export const RegisterUser = async (data) => {
  try {
    const res = await Client.post('/auth/register', data)
    return res.data
  } catch (error) {
    console.error(
      'RegisterUser error:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

export const CheckSession = async () => {
  try {
    const res = await Client.get('/auth/session')
    return res.data
  } catch (error) {
    console.error(
      'CheckSession error:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}
