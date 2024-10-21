const Overview = ({ tripDetails }) => {
  return (
    <div>
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
  )
}

export default Overview
