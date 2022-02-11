import React from "react";
import { Link } from "react-router-dom";

function PostBody({ body, postId, isSingle }: any) {
  console.log(isSingle);

  return (
    <div>
      <p>
        {!isSingle && body.length > 100 ? (
          <>
            {body.slice(0, 200) + `...`}
            <Link to={`/posts/${postId}`}>More</Link>
          </>
        ) : (
          body
        )}
      </p>
    </div>
  );
}

export default PostBody;
