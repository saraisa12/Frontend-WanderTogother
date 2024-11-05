import React, { useEffect, useState } from "react"
import Calendar from "react-calendar"
import Client from "../../services/api"
import "react-calendar/dist/Calendar.css"
import "./Calendar.css"

const TripCalendar = ({ tripId, onActivityAdded }) => {
  const [dateActivities, setDateActivities] = useState({})
  const [value, setValue] = useState(new Date())

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await Client.get(`/activity/index/${tripId}`)
        console.log("API Response:", response.data)

        const activities = response.data.activities
        if (!Array.isArray(activities)) {
          throw new Error("Expected activities to be an array")
        }
        const groupedActivities = {}

        activities.map((activity) => {
          const date = new Date(activity.Date).toDateString()
          if (!groupedActivities[date]) {
            groupedActivities[date] = []
          }
          groupedActivities[date].push(activity.name)
        })

        setDateActivities(groupedActivities)
        console.log("Grouped Activities:", groupedActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      }
    }

    fetchActivities()
  }, [tripId])

  const handleDateChange = (date) => {
    setValue(date)
  }

  const formatDate = (date) => {
    return date.toDateString()
  }

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={({ date }) => {
          const dateString = formatDate(date)
          return (
            <div className="calendar-tile">
              {dateActivities[dateString] && (
                <ul>
                  {dateActivities[dateString].map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        }}
      />
      {/* Remove this section to not show activities for the selected date */}
      {/* {dateActivities[formatDate(value)]?.length > 0 && (
        <>
          <h3>Activities on {formatDate(value)}:</h3>
          <ul>
            {dateActivities[formatDate(value)].map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </>
      )} */}
    </div>
  )
}

export default TripCalendar
