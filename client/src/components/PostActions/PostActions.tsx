import { CommentOutlined, SendOutlined, BookOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../features/posts/postsSlice";

function PostActions({ post, appUser }: any) {
  const dispatch = useDispatch();

  // return like button based on liked or not
  const getLikeButton = (liked: any) => {
    if (liked) {
      return <HeartFilled style={{ color: "red", cursor: "pointer", fontSize: "1.6rem" }} />;
    }
    return <HeartOutlined style={{ color: "#000", cursor: "pointer", fontSize: "1.6rem" }} />;
  };

  // switch between like and unlike
  const handleLike = (liked: any) => {
    if (liked) {
      dispatch(unlikePost({ postId: post._id, userId: appUser._id }));
    } else {
      dispatch(likePost({ postId: post._id, userId: appUser._id }));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <div>
        <div
          style={{ display: "inline" }}
          onClick={() => handleLike(post?.likes?.some((like: any) => like._id === appUser?._id))}
        >
          {getLikeButton(post?.likes?.some((like: any) => like._id === appUser?._id))}
        </div>

        <CommentOutlined style={{ color: "#333333", cursor: "pointer", margin: "0 10px", fontSize: "1.6rem" }} />
        <SendOutlined
          style={{
            color: "#333333",
            cursor: "pointer",
            margin: "0 10px",
            fontSize: "1.6rem",
          }}
        />
      </div>
      <div>
        <BookOutlined
          style={{
            color: "#333333",
            cursor: "pointer",
            margin: "0 10px",
            fontSize: "1.6rem",
          }}
        />
      </div>
    </div>
  );
}

export default PostActions;
