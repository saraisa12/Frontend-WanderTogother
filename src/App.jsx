import "./App.css"
import { Route, Routes } from "react-router"
import Nav from "./components/Nav/Nav"
import Register from "./pages/Register/Register"
import SignIn from "./pages/SignIn/SignIn"
import Home from "./pages/Home/Home"
import { CheckSession } from "./services/Auth"
import { useState, useEffect } from "react"
import AddTrip from "./components/AddTrip/AddTrip"
import ListTrips from "./components/ListTrips/ListTrips"
import DetailsTrip from "./components/DetailsTrip/DetailsTrip"

const App = () => {
  const [user, setUser] = useState(null)

  const handleLogOut = () => {
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.clear()
  }

  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    // Check if token exists before requesting to validate the token
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <div className="App">
      <Nav user={user} handleLogOut={handleLogOut} />

      <main>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add/trip" element={<AddTrip />} />
          <Route path="/list/trips" element={<ListTrips />} />

          <Route path="/trip/details/:id" element={<DetailsTrip />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
