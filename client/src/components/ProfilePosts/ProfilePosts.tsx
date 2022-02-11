import React from "react";
import { Link } from "react-router-dom";

function ProfilePosts({ posts }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridGap: "10px" }}>
      {posts?.map((post: any) => {
        return (
          <div key={post._id}>
            <Link to={`/posts/${post._id}`}>
              <img
                style={{ width: "100%", height: "300px", maxHeight: "300px" }}
                src={post.photos[0].url}
                alt={post?.user?.fullname}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
