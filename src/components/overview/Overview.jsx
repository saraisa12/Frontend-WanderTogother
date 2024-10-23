import "./Overview.css"
import ManageUsers from "../ManageUsers/ManageUsers"

const Overview = ({
  tripDetails,
  invites,
  participants,
  handleDeleteInvite,
}) => {
  const startDate = new Date(tripDetails.startDate)
  const endDate = new Date(tripDetails.endDate)

  return (
    <div>
      <div className="trip-overview-card">
        <div className="trip-nights">
          {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} Nights
        </div>

        <div className="trip-dates">
          <div className="trip-date">
            <span className="trip-day">
              {startDate.toLocaleDateString("en-US", { weekday: "short" })}.
            </span>
            <span className="trip-date-bold">
              {startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="trip-year">{startDate.getFullYear()}</span>
          </div>

          <div className="trip-arrow">➤</div>

          <div className="trip-date">
            <span className="trip-day">
              {endDate.toLocaleDateString("en-US", { weekday: "short" })}.
            </span>
            <span className="trip-date-bold">
              {endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="trip-year">{endDate.getFullYear()}</span>
          </div>
        </div>
      </div>

      <ManageUsers
        invites={invites}
        participants={tripDetails.participants}
        handleDeleteInvite={handleDeleteInvite}
        tripDetails={tripDetails}
      />
    </div>
  )
}

export default Overview
