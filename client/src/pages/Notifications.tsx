import { Card, Divider } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { fetchNotifications } from "../features/users/usersSlice";

function Notifications() {
  const { notifications, appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications(appUser?._id));
  }, []);

  return (
    <Card title={"Notifications"} style={{ maxWidth: "400px", margin: "0 auto" }}>
      {notifications &&
        notifications.map((notif: any) => {
          return (
            <div key={notif?._id}>
              {notif.type === "follow" && (
                <p>
                  <Link id="link" to={`/profile/${notif.user._id}`}>
                    {notif.user.username}
                  </Link>{" "}
                  followed you
                </p>
              )}

              {notif.type === "like" && (
                <p>
                  <Link id="link" to={`/profile/${notif.user._id}`}>
                    {notif.user.username}
                  </Link>{" "}
                  liked your{" "}
                  <Link id="link" to={`/posts/${notif.post._id}`}>
                    post
                  </Link>
                </p>
              )}

              <Divider />
            </div>
          );
        })}
    </Card>
  );
}

export default Notifications;
