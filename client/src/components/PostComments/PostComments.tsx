import React from "react";
import { Link } from "react-router-dom";

function PostComments({ comments }: any) {
  return (
    <div>
      {comments?.map((comment: any) => (
        <div key={comment._id}>
          <p>
            <Link style={{ color: "#000", fontWeight: "bold" }} to={`/profile/${comment.user._id}`}>
              {comment.user.username}
            </Link>{" "}
            {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PostComments;
