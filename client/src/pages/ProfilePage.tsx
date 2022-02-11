import { CameraFilled, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Skeleton } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../app/store";
import ProfilePosts from "../components/ProfilePosts/ProfilePosts";
import UploadAvatar from "../components/UploadAvatar/UploadAvatar";
import { fetchAppUser, fetchProfileUser, followPeople, unFollowPeople } from "../features/users/usersSlice";

// main component
function ProfilePage() {
  const { appUser, status, profileUser } = useSelector((state: RootState) => state.users);
  const params: any = useParams();
  const dispatch = useDispatch();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAppUser());
    dispatch(fetchProfileUser(params.id));
  }, []);

  const handleFollow = (userId: any) => {
    if (appUser.following.includes(userId)) {
      dispatch(unFollowPeople({ appUserId: appUser._id, userId }));
    } else {
      dispatch(followPeople({ appUserId: appUser._id, userId }));
    }
  };

  if (status === "loading")
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    );

  return (
    <div>
      <UploadAvatar showAvatarModal={showAvatarModal} setShowAvatarModal={setShowAvatarModal} />

      {/* Profile page header */}
      <Row style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Avatar
            style={{ width: "150px", height: "150px", position: "relative" }}
            src={profileUser?.avatar?.url}
          ></Avatar>
          {appUser?._id === profileUser?._id && (
            <Button
              style={{
                position: "absolute",
                zIndex: 99,
                bottom: 0,
                left: "60%",
                backgroundColor: "transparent",
                border: "0",
                color: "#000",
                outline: "0",
              }}
              onClick={() => setShowAvatarModal(true)}
            >
              <CameraFilled style={{ color: "#4b92fc" }} />
            </Button>
          )}
        </Col>
        <Col span={16}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <h2>{profileUser?.username}</h2>
            {appUser?._id === profileUser?._id ? (
              <Link to="/profile/edit" style={{ margin: "0 12px" }}>
                Edit Profile
              </Link>
            ) : (
              <Button
                onClick={() => handleFollow(profileUser?._id)}
                style={{ marginLeft: "10px" }}
                type="primary"
                size="small"
              >
                {appUser?.following.includes(profileUser?._id) ? "Unfollow" : "Follow"}
              </Button>
            )}
            {appUser?._id === profileUser?._id && <SettingOutlined style={{ fontSize: "1.5rem" }} />}
          </div>

          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}
          >
            <Link style={{ fontSize: "1rem", color: "#0f0f0f" }} to="/">
              {profileUser?.posts.length} posts
            </Link>
            <Link style={{ fontSize: "1rem", color: "#0f0f0f" }} to={`/profile/${profileUser?._id}/followers`}>
              {profileUser?.followers.length} followers
            </Link>
            <Link style={{ fontSize: "1rem", color: "#0f0f0f" }} to={`/profile/${profileUser?._id}/following`}>
              {profileUser?.following.length} following
            </Link>
          </div>

          <div>
            <h3>{profileUser?.fullname}</h3>
            <p>{profileUser?.bio || ""}</p>
          </div>
        </Col>
      </Row>

      <hr style={{ marginTop: "2rem" }} />

      {/* Profile posts */}
      <ProfilePosts posts={profileUser?.posts} />
    </div>
  );
}

export default ProfilePage;
