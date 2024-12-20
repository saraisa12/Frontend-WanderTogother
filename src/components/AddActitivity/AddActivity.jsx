import { useRef, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Client from "../../services/api"
import { LoadScript, Autocomplete } from "@react-google-maps/api"
import "./AddActivity.css"

const GOOGLE_MAPS_API_KEY = ""
const libraries = ["places"]

const AddActivity = () => {
  const { TripId } = useParams()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const [location, setLocation] = useState({ mapsUrl: "", photoUrl: "" })
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add("add-activity-page")
    return () => {
      document.body.classList.remove("add-activity-page")
    }
  }, [])

  const handleSubmit = async (event) => {
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
      // Additional logging for debugging
      console.error(
        "Error details:",
        error.response ? error.response.data : error
      )
    } finally {
      setLoading(false)
    }
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      const mapsUrl = place.url || ""
      const photos = place.photos || []
      const photoUrl =
        photos.length > 0 ? photos[0].getUrl({ maxWidth: 1080 }) : ""

      setLocation({ mapsUrl, photoUrl })
    } else {
      console.log("Autocomplete is not loaded yet!")
    }
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <h1 className="activity-title">Add Activity</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="activity-form">
        <div className="ActivityInfo">
          <div className="ActivityName">
            <label htmlFor="name">Activity Name</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Activity Name"
              required
            />
          </div>
          <div className="ActivityDes">
            <label htmlFor="description">Description</label>
            <br />
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              required
            />
          </div>

          <div className="ActivityDate">
            <label htmlFor="Date">Date</label>
            <br />
            <input type="Date" id="Date" name="Date" required />
          </div>

          <div className="ActivityLocation">
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

          <button type="submit" className="ActivityBtn" disabled={loading}>
            {loading ? "Adding..." : "Add Activity"}
          </button>
        </div>
      </form>
    </LoadScript>
  )
}

export default AddActivity
