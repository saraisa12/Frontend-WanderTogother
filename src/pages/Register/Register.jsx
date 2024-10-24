import { useState, useEffect } from 'react'
import { RegisterUser } from '../../services/Auth'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  let navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('') // State for error messages

  // Apply specific class for the register page background
  useEffect(() => {
    document.body.classList.add('register-page')

    return () => {
      document.body.classList.remove('register-page')
    }
  }, [])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      await RegisterUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
      })

      // Clear form values after successful registration
      setFormValues({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      // Navigate to the sign-in page
      navigate('/signin')
    } catch (error) {
      // Handle registration errors
      if (error.response && error.response.status === 400) {
        setError(
          error.response.data.message ||
            'Registration failed. Please try again.'
        )
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="RCNA">
      <h1 className="CNA">
        Create New <br />
        Account
      </h1>
      {error && <div className="error-message">{error}</div>}{' '}
      {/* Display error message */}
      <div className="signup_col">
        <div className="card-overlay_centered">
          <form className="cool" onSubmit={handleSubmit}>
            <div className="input-wrapper-2">
              <label htmlFor="name">Name</label>
              <br />
              <input
                onChange={handleChange}
                name="name"
                type="text"
                placeholder="John Smith"
                value={formValues.name}
                required
                className="input-Register"
              />
            </div>
            <div className="input-wrapper-2">
              <label htmlFor="email">Email</label>
              <br />
              <input
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="example@example.com"
                value={formValues.email}
                required
                className="input-Register"
              />
            </div>

            <div className="input-wrapper-2">
              <label htmlFor="password">Password</label>
              <br />
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Password"
                value={formValues.password}
                required
                className="input-Register"
              />
            </div>
            <div className="input-wrapper-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <br />
              <input
                onChange={handleChange}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formValues.confirmPassword}
                required
                className="input-Register"
              />
            </div>
            <button
              disabled={
                !formValues.email ||
                !formValues.password ||
                formValues.password !== formValues.confirmPassword // Check if passwords match
              }
              className="Register"
            >
              REGISTER
            </button>
            <div className="SignUp">
              <h5>
                Already have an account? <br /> Login now
              </h5>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
