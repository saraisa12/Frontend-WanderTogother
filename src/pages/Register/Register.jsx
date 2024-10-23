import { useState } from "react"
import { RegisterUser } from "../../services/Auth"
import { useNavigate } from "react-router-dom"
import "./Register.css"

const Register = () => {
  let navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await RegisterUser({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    })

    setFormValues({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    navigate("/signin")
  }

  return (
    <div className="RCNA">
      <h1 className="CNA">
        create new <br /> account
      </h1>
      <div className="signup_col">
        <div className="card-overlay_centered">
          <form className="cool" onSubmit={handleSubmit}>
            <div className="input-wrapper-2">
              <label htmlFor="name">Name</label>
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
                (!formValues.password &&
                  formValues.confirmPassword === formValues.password)
              }
              className="Register"
            >
              REGISTER
            </button>
            <div className="SignUp">
              <h5>LOGIN</h5>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
