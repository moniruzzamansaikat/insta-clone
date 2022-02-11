import { Button, Form, Card, Col, Row, Tabs, Input, DatePicker, Select } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { fetchAppUser } from "../../features/users/usersSlice";
import ChangePassword from "../ChangePassword/ChangePassword";
import ProfileInfoEdit from "../ProfileInfoEdit/ProfileInfoEdit";
import styles from "./style.module.css";

function EditProfile() {
  return (
    <Card>
      <Tabs tabPosition="left">
        <Tabs.TabPane tab="Edit Profile" key="1">
          <ProfileInfoEdit />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Change Password" key="2">
          <ChangePassword />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}

export default EditProfile;
