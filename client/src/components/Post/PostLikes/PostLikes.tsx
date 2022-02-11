import React from "react";
import { Link } from "react-router-dom";

function PostLikes({ likes }: any) {
  return (
    <div>
      {likes?.length > 1 ? (
        <h3>
          Liked by{" "}
          <Link id="link" to={`/profile/${likes[0]?._id}`}>
            {likes[0]?.username}
          </Link>{" "}
          and {likes.length - 1} {likes.length - 1 === 1 ? "Other" : "Others"}
        </h3>
      ) : (
        likes?.length + " Like"
      )}
    </div>
  );
}

export default PostLikes;
