import { useState } from "react"
import { SignInUser } from "../../services/Auth"
import { useNavigate } from "react-router-dom"
import "./SignIn.css"

const SignIn = ({ setUser }) => {
  let navigate = useNavigate()

  let initialState = { email: "", password: "" }
  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setFormValues({ email: "", password: "" })
    setUser(payload)
    console.log(payload)
    navigate("/")
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
