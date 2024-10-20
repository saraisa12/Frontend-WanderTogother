import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <img />
        <div className="hero-overlay">
          <h1 className="hero-title">Unified Exploration</h1>
          <p className="hero-subtitle">
            Where every adventure begins with your crew by your side!
          </p>
          <button className="start-planning-btn">Start Planning</button>
        </div>
      </section>
    </div>
  )
}

export default Home
