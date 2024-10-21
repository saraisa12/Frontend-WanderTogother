import React from "react"
import { Link } from "react-router-dom"
import "./Nav.css"

const Nav = ({ user, handleLogOut }) => {
  let userOptions
  if (user) {
    userOptions = (
      <nav>
        <h3>Welcome {user.email}!</h3>
        <Link to="/">Home</Link>
        <Link to="/add/trip">About</Link>
        <Link onClick={handleLogOut} to="/">
          Sign Out
        </Link>
        <img src="/Images/Logo-NoBg.png" alt="Logo" />
      </nav>
    )
  }

  const publicOptions = (
    <div className="NavBar-Signin">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
    </div>
  )

  return (
    <header>
      <Link to="/"></Link>
      {user ? userOptions : publicOptions}
    </header>
  )
}

export default Nav
