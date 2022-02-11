import { Card, Avatar, Skeleton, Button } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedUsers, fetchAppUser, unFollowPeople, followPeople } from "../../features/users/usersSlice";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";

function HomeSidebar() {
  const dispatch = useDispatch();
  const { appUser, status, suggestedUsers } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAppUser());
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  const handleFollow = (userId: any) => {
    if (appUser.following.includes(userId)) {
      dispatch(unFollowPeople({ appUserId: appUser._id, userId }));
    } else {
      dispatch(followPeople({ appUserId: appUser._id, userId }));
    }
  };

  return (
    <Card style={{ marginLeft: "10px", border: 0, backgroundColor: "#f0f0f0" }}>
      {status === "loading" ? (
        <Skeleton />
      ) : (
        <div style={{ position: "fixed" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={appUser?.avatar?.url} style={{ width: "60px", height: "60px" }} />
            <div style={{ marginLeft: "12px" }}>
              <Link to={`/profile/${appUser?._id}`}>
                <span style={{ color: "#000", fontSize: "1rem" }}>{appUser?.username}</span>
              </Link>
              <p>{appUser?.fullname}</p>
            </div>
          </div>

          <h3 style={{ marginTop: "1rem" }}>
            Suggestions for you : <Link to="/users">See all</Link>{" "}
          </h3>
          {suggestedUsers.map((sUser) => {
            return (
              <div key={sUser._id} style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                <Avatar src={sUser?.avatar?.url} style={{ width: "40px", height: "40px" }} />
                <div style={{ marginLeft: "12px" }}>
                  <div>
                    <Link to={`/profile/${sUser._id}`}>
                      <span style={{ color: "#000", fontSize: "14px" }}>{sUser.username}</span>
                    </Link>
                    <Button onClick={() => handleFollow(sUser._id)} type="link" style={{ float: "right" }}>
                      {appUser.following.includes(sUser._id) ? "Unfollow" : "Follow"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: "1rem" }}>
            <small>
              © {new Date().getFullYear()} INSTAGRAM CLONED BY{" "}
              <a href="https://twitter.com/m__saikat" target="_blank" rel="noreferrer">
                @m__saikat
              </a>
            </small>
          </div>
        </div>
      )}
    </Card>
  );
}

export default HomeSidebar;
