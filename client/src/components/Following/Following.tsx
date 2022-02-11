import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { fetchAppUser, fetchFollowing, fetchSuggestedUsers } from "../../features/users/usersSlice";
import UserItem from "../UserItem/UserItem";

function Following() {
  const { followingList: following, appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const params: any = useParams();

  useEffect(() => {
    dispatch(fetchFollowing(params.id));
  }, []);

  useEffect(() => {
    dispatch(fetchAppUser());
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  return (
    <Card title={"Following"} style={{ maxWidth: "400px", margin: "0 auto" }}>
      {following.length > 0 ? (
        following.map((following) => <UserItem key={following?._id} appUser={appUser} user={following} />)
      ) : (
        <h2>
          Not following, <Link to="/users">See peoples.</Link>
        </h2>
      )}
    </Card>
  );
}

export default Following;
