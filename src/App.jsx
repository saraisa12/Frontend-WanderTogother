import "./App.css"
import { Route, Routes } from "react-router"
import Nav from "./components/Nav/Nav"
import Register from "./pages/Register/Register"
import SignIn from "./pages/SignIn/SignIn"
import Home from "./pages/Home/Home"
import AddTrip from "./components/AddTrip/AddTrip"
import ListTrips from "./components/ListTrips/ListTrips"
import DetailsTrip from "./components/DetailsTrip/DetailsTrip"
import AddActivity from "./components/AddActitivity/AddActivity"
import ListActivities from "./components/ListActivities/ListActivities"
import EditActivity from "./components/EditActivity/EditActivity"
import { CheckSession } from "./services/Auth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AcceptInvite from "./components/AcceptInvite/AcceptInvite"
import MapWithPins from "./components/MapWithPins/MapWithPins"
import Album from "./components/Album/Album"

const App = () => {
  const [user, setUser] = useState(null)

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

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
          <Route path="/list/trips" element={<ListTrips user={user} />} />
          <Route path="/list/trips" element={<ListTrips />} />
          <Route
            path="/trip/details/:id"
            element={<DetailsTrip user={user} />}
          />
          <Route
            path="/invite/accept/:inviteId"
            element={<AcceptInvite handleLogOut={handleLogOut} />}
          />
          <Route path="/add/activity/:TripId" element={<AddActivity />} />
          <Route path="/list/activities/:TripId" element={<ListActivities />} />
          <Route path="/edit/activity/:id" element={<EditActivity />} />
          <Route path="/Map" element={<MapWithPins />} />
          <Route path="/album/:TripId" element={<Album />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
