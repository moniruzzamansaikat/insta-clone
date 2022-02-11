import { Avatar, Button } from "antd";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { followPeople, unFollowPeople } from "../../features/users/usersSlice";

function UserItem({ appUser, user }: any) {
  const dispatch = useDispatch();

  const handleFollow = (userId: any) => {
    if (appUser.following.includes(userId)) {
      dispatch(unFollowPeople({ appUserId: appUser._id, userId }));
    } else {
      dispatch(followPeople({ appUserId: appUser._id, userId }));
    }
  };

  return (
    <div className={styles.main} key={user?._id}>
      <Avatar style={{ marginTop: "-10px" }} src={user?.avatar?.url} />
      <div className={styles.name_username}>
        <Link to={`/profile/${user?._id}`}>{user?.username}</Link> <strong>.</strong>
        {appUser?._id !== user?._id && (
          <Button onClick={() => handleFollow(user?._id)} type="link">
            {appUser?.following.includes(user?._id) ? "Unfollow" : "Follow"}
          </Button>
        )}
        <p>{user?.fullname}</p>
      </div>
    </div>
  );
}

export default UserItem;
