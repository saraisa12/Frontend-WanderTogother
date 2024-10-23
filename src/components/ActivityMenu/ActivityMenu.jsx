import React, { useState } from "react"
import "./ActivityMenu.css"
const ActivityMenu = ({ activity, handleDelete, handleEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={toggleMenu}>
        &#x22EE;
      </button>

      {isMenuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => handleEdit(activity._id)}>Edit</button>
          <button onClick={() => handleDelete(activity._id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default ActivityMenu
