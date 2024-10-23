import React, { useState, useEffect } from "react"
import axios from "axios"
import "./Notes.css"

const Notes = ({ tripId }) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/notes/${tripId}`)
        console.log("Fetched notes:", res.data)

        if (Array.isArray(res.data)) {
          setNotes(res.data)
        } else {
          console.error("Fetched data is not an array:", res.data)
          setError("Invalid notes data")
        }
      } catch (error) {
        console.error("Fetch notes error:", error)
        setError("Unable to fetch notes")
      }
    }

    if (tripId) {
      fetchNotes()
    }
  }, [tripId])

  const addNote = async () => {
    if (!newNote) {
      setError("Note cannot be empty")
      return
    }

    try {
      const res = await axios.post(`http://localhost:4000/notes`, {
        content: newNote,
        tripId,
      })
      setNotes((prevNotes) => [...prevNotes, res.data])
      setNewNote("")
      setError("")
    } catch (error) {
      console.error("Error adding note:", error)
      setError("Failed to add note")
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:4000/notes/${noteId}`)
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
      setError("Failed to delete note")
    }
  }

  return (
    <div
      style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}
      className="Notes"
    >
      <h2>Notes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="NewNote"
        />
        <button onClick={addNote} className="AddNoteBtn">
          Add Note
        </button>
      </div>
      <div>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <div className="NotesAdded" key={note._id}>
              {note.title && <h3>{note.title}</h3>}
              <p className="pNote">{note.content}</p>
              <button
                className="NAddedDelBtn"
                onClick={() => deleteNote(note._id)}
                style={{}}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="NoNotesAvailable">No notes available</p>
        )}
      </div>
    </div>
  )
}

export default Notes
