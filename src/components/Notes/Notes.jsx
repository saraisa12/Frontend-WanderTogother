import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Notes = ({ tripId }) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/notes/${tripId}`)
        console.log('Fetched notes:', res.data)

        if (Array.isArray(res.data)) {
          setNotes(res.data)
        } else {
          console.error('Fetched data is not an array:', res.data)
          setError('Invalid notes data')
        }
      } catch (error) {
        console.error('Fetch notes error:', error)
        setError('Unable to fetch notes')
      }
    }

    if (tripId) {
      fetchNotes()
    }
  }, [tripId])

  const addNote = async () => {
    if (!newNote) {
      setError('Note cannot be empty')
      return
    }

    try {
      const res = await axios.post(`http://localhost:4000/notes`, {
        content: newNote,
        tripId
      })
      setNotes((prevNotes) => [...prevNotes, res.data])
      setNewNote('')
      setError('')
    } catch (error) {
      console.error('Error adding note:', error)
      setError('Failed to add note')
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:4000/notes/${noteId}`)
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
      setError('Failed to delete note')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>Notes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          style={{
            padding: '0.5rem',
            width: '80%',
            marginRight: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={addNote}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Note
        </button>
      </div>
      <div>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {note.title && (
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{note.title}</h3>
              )}
              <p style={{ margin: '0 0 1rem 0' }}>{note.content}</p>
              <button
                onClick={() => deleteNote(note._id)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </div>
  )
}

export default Notes
