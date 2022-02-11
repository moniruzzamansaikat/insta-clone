import { Link } from "react-router-dom";
import { DashOutlined } from "@ant-design/icons";
import { Dropdown, Card, Form } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import styles from "./PostItem.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import PostComments from "../PostComments/PostComments";
import CommentBox from "../CommentBox/CommentBox";
import PostActions from "../PostActions/PostActions";
import PostOptions from "../PostOptions/PostOptions";
import PostBody from "../Post/PostBody/PostBody";
import PostLikes from "../Post/PostLikes/PostLikes";

// main componenet
function PostItem({ post, isSingle }: any) {
  const appUser = useSelector((state: RootState) => state.users.appUser);
  const [commentForm] = Form.useForm();

  return (
    <Card style={{ marginBottom: "1rem" }}>
      {/* post header */}
      <header className={styles.header}>
        <div className={styles.header_left}>
          <Link to={`/profile/${post?.user?._id}`}>
            <Avatar src={post?.user?.avatar?.url || ""}>{post?.user?.fullname[0]}</Avatar>
          </Link>
          <Link to={`/profile/${post?.user?._id}`}>{post?.user?.username}</Link>
        </div>

        <div>
          <Dropdown overlay={<PostOptions post={post} userId={appUser?._id} />} trigger={["click", "hover"]}>
            <DashOutlined />
          </Dropdown>
        </div>
      </header>

      {/* post main image */}
      <img alt={post.user.fullname} style={{ width: "100%" }} src={post.photos[0]?.url} />
      <div className={styles.post_footer}>
        <PostActions post={post} appUser={appUser} />
      </div>

      {/* show post likes */}
      <PostLikes likes={post?.likes} />

      {/* post text body */}
      <PostBody postId={post?._id} isSingle={isSingle} body={post?.body} />

      {/* comments */}
      <PostComments comments={isSingle ? post.comments : post.comments.slice(0, 2)} />
      {!isSingle && post.comments?.length > 2 && <Link to={`/posts/${post._id}`}>See all comments</Link>}

      {/* commment box */}
      <CommentBox commentForm={commentForm} postId={post?._id} userId={appUser?._id} />
    </Card>
  );
}

export default PostItem;
