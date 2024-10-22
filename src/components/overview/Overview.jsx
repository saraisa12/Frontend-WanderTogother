import "./Overview.css"

const Overview = ({ tripDetails }) => {
  return (
    <div className="Overview">
      <div className="ppp">
        <p>
          <strong>Description:</strong> {tripDetails.description}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(tripDetails.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(tripDetails.endDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default Overview
