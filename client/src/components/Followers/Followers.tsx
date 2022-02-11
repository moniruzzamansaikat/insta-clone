import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { fetchFollowers } from "../../features/users/usersSlice";
import UserItem from "../UserItem/UserItem";

function Followers() {
  const { followersList: followers, appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const params: any = useParams();

  useEffect(() => {
    dispatch(fetchFollowers(params.id));
  }, [params]);

  return (
    <Card title={"Followers"} style={{ maxWidth: "400px", margin: "0 auto" }}>
      {followers.length > 0 ? (
        followers.map((follower) => <UserItem key={follower?._id} appUser={appUser} user={follower} />)
      ) : (
        <h2>No followers.</h2>
      )}
    </Card>
  );
}

export default Followers;
