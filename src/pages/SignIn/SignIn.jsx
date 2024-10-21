import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

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
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formValues.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  )
}

export default SignIn
