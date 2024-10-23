import React, { useState, useEffect } from 'react'
import Client from '../../services/api'
import './Checklist.css'

const Checklist = ({ tripId }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await Client.get(`/checklist/list/${tripId}`)
        setTasks(response.data.data)
      } catch (error) {
        setError("Error fetching tasks.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [tripId])

  // Add a new task

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await Client.post('/checklist/add', {
        title: newTask,
        tripId: tripId
      })
      setTasks([...tasks, response.data.data])
      setNewTask('')
    } catch (error) {
      setError('Error adding task.')
    }
  }

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await Client.put(`/checklist/update/${taskId}`, {
        completed: !completed
      })
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? response.data.data : task
      )
      setTasks(updatedTasks)
    } catch (error) {
      setError('Error toggling task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await Client.delete(`/checklist/delete/${taskId}`)
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (error) {
      setError('Error deleting task.')
    }
  }

  return (
    <div className="checklist-container">
      <h2 className="checklist-title">Checklist for Trip</h2>

      <form className="checklist-form" onSubmit={handleAddTask}>
        <input
          className="checklist-input"
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="checklist-add-button" type="submit">
          Add Task
        </button>
      </form>

      {error && <p className="checklist-error">{error}</p>}

      <ul className="checklist-tasks">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`checklist-task ${
              task.completed ? 'checklist-task-completed' : ''
            }`}
          >
            <label className="checklist-task-label">
              <input
                className="checklist-checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task._id, task.completed)}
              />
              {task.title}
            </label>
            <button
              className="checklist-delete-button"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Checklist
