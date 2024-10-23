import "./ManageUsers.css"

const ManageUsers = ({ invites, handleDeleteInvite }) => {
  return (
    <div className="MangageUsers">
      {/* List of invites */}
      <h3>📧 Invites</h3>
      {invites.length > 0 ? (
        <ul>
          {invites.map((invite) => (
            <li key={invite._id}>
              {invite.invitee.email} - {invite.status} - Invited on:{" "}
              {new Date(invite.invitedAt).toLocaleDateString()}
              <button
                onClick={() => handleDeleteInvite(invite._id)}
                className="BtnMUsers"
              >
                Delete Invite
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invites yet.</p>
      )}
    </div>
  )
}

export default ManageUsers
