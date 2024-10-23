import React, { useState } from "react"
import "./ActivityComment.css"

const ActivityComment = ({
  comments,
  activityId,
  commentText,
  handleCommentChange,
  handleComment,
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false)

  // Toggle comment section visibility
  const toggleComments = () => {
    setIsCommentsVisible(!isCommentsVisible)
  }

  return (
    <div>
      <div className="comment-icon-container">
        <button className="comment-icon-button" onClick={toggleComments}>
          <i className="bi bi-chat-right-dots"></i>
        </button>
      </div>
      {isCommentsVisible && (
        <div>
          <input
            className="comment-input"
            type="text"
            value={commentText || ""}
            onChange={(e) => handleCommentChange(activityId, e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            className="send-icon-button"
            onClick={() => handleComment(activityId)}
          >
            <i class="bi bi-send send-icon"></i>
          </button>

          {comments && comments.length > 0 ? (
            <ul>
              {comments.map((cmt, index) => (
                <li key={index} className="user-comments">
                  <strong>
                    {cmt.user && cmt.user.name ? cmt.user.name : "Unknown User"}
                    :{" "}
                  </strong>

                  {cmt.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ActivityComment
