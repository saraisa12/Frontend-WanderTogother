import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./SignIn.css"

const SignIn = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" })
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token) // Store token
        console.log("Token stored:", data.token)

        // Optionally store user info if needed
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect after successful login
        const redirectUrl = new URLSearchParams(location.search).get("redirect")
        navigate(redirectUrl || "/")
      } else {
        console.error("Login failed:", data.message)
        alert("Login failed: " + data.message)
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed")
    }
  }

  return (
    <div className="signin_col">
      <div className="card-overlay-centered">
        <form className="col" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <br />
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formValues.email}
              required
              className="input-Signin"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <br />
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              required
              className="input-Signin"
            />
          </div>
          <button
            disabled={!formValues.email || !formValues.password}
            className="SignIn_btn"
          >
            SIGN IN
          </button>
          <div className="SignUp">
            <h5>
              Don't have an account?
              <br /> Sign Up now
            </h5>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
