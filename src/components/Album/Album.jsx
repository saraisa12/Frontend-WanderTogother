import React, { useState, useEffect } from "react"
import Client from "../../services/api"
import "./Album.css"

const Album = ({ tripId }) => {
  const [album, setAlbum] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await Client.get(`/album/${tripId}`)
        setAlbum(response.data.album)
      } catch (error) {
        setError("Failed to load album")
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [tripId])

  // Handle image upload
  const handleUpload = async (e) => {
    const files = e.target.files
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i])
    }

    setUploading(true)
    try {
      await Client.post(`/album/add/${tripId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      alert("Images uploaded successfully")
      // Refresh album after upload
      const response = await Client.get(`/album/${tripId}`)
      setAlbum(response.data.album)
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p>Loading album...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="shared-album">
      <h2>Shared Album for Trip</h2>

      {/* Plus Button to Add Images */}
      <div className="add-images">
        <label htmlFor="image-upload" className="upload-label">
          <div className="plus-sign">+</div>
        </label>
        <input
          type="file"
          id="image-upload"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: "none" }}
        />
        {uploading && <p>Uploading...</p>}
      </div>

      {/* Display Images in the Album */}
      <div className="album-images">
        {album && album.images && album.images.length > 0 ? (
          album.images.map((img, index) => (
            <div key={index} className="image-container">
              <img
                src={`http://localhost:4000${img}`}
                alt={`Trip Image ${index}`}
                className="trip-image"
              />
            </div>
          ))
        ) : (
          <p>No images in the album yet. Start by uploading some!</p>
        )}
      </div>
    </div>
  )
}

export default Album
