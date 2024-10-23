import React from "react"
import "./Home.css"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  // Function to handle the button click
  const handleStartPlanningClick = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/signin")
    } else {
      navigate("/list/trips")
    }
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">
            Unified <br />
            Exploration
          </h1>
          <p className="hero-subtitle">
            Where every adventure begins with your crew by your side!
          </p>
          <button
            onClick={handleStartPlanningClick}
            className="start-planning-btn"
          >
            Start Planning &rarr;
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
