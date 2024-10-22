import React from "react"
import "./Home.css"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        {/* <img src="/Images/Logo-NoBg.png" alt="Logo" /> */}
        <div className="hero-overlay">
          <h1 className="hero-title">
            Unified <br />
            Exploration
          </h1>
          <p className="hero-subtitle">
            Where every adventure begins with your crew by your side!
          </p>
          <Link to="/list/trips" className="start-planning-btn">
            Start Planning &rarr;
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
