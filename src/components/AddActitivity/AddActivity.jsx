import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Client from "../../services/api"
import { LoadScript, Autocomplete } from "@react-google-maps/api"

const GOOGLE_MAPS_API_KEY = "AIzaSyBgqMJ0I9Amizf8K6QZRumavkhx9zXzxxM" // Replace with your actual Google Maps API key
const libraries = ["places"] // Move libraries outside the component
const AddActivity = () => {
  const { TripId } = useParams()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const [location, setLocation] = useState({ mapsUrl: "", photoUrl: "" })
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    console.log(location)
    event.preventDefault()
    const formData = new FormData(formRef.current)

    formData.append("tripId", TripId)
    formData.append("mapsUrl", location.mapsUrl)
    formData.append("photoUrl", location.photoUrl)

    setLoading(true)

    try {
      const response = await Client.post("/activity/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Activity added successfully:", response.data)
      formRef.current.reset()
      navigate(`/trip/details/${TripId}`)
    } catch (error) {
      console.error("Error adding activity:", error)
      alert(
        "Error adding activity: " +
          (error.response ? error.response.data.message : error.message)
      )
    } finally {
      setLoading(false)
    }
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()

      // Extract the Google Maps URL and photo URL
      const mapsUrl = place.url || ""
      const photos = place.photos || []
      const photoUrl =
        photos.length > 0 ? photos[0].getUrl({ maxWidth: 1080 }) : ""

      // Log the URLs to ensure they are correct
      console.log("Google Maps URL:", mapsUrl)
      console.log("Photo URL:", photoUrl)

      // Set the URLs in state
      setLocation({ mapsUrl, photoUrl })
    } else {
      console.log("Autocomplete is not loaded yet!")
    }
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <form ref={formRef} onSubmit={handleSubmit} className="activity-form">
        <h2>Add Activity</h2>

        <div>
          <label htmlFor="name">Activity Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter a location"
              required
            />
          </Autocomplete>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Activity"}
        </button>
      </form>
    </LoadScript>
  )
}

export default AddActivity
