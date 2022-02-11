import { Menu } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../features/posts/postsSlice";
import { openNotification } from "../../util";

function PostOptions({ post, userId }: any) {
  const dispatch = useDispatch();

  // submit delete post
  const handleDeletePost = () => {
    dispatch(deletePost({ id: post._id, publicId: post.photos[0].publicId }));
    openNotification("Post deleted !");
  };

  return (
    <Menu style={{ minWidth: "200px" }}>
      {post?.user?._id === userId ? (
        <Menu.Item onClick={handleDeletePost} key="0">
          Delete
        </Menu.Item>
      ) : null}
    </Menu>
  );
}

export default PostOptions;
