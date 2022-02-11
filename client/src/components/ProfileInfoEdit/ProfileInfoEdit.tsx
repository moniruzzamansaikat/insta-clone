import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Select, Button, Menu, Spin } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { fetchAppUser, updateProfileInfo } from "../../features/users/usersSlice";

function ProfileInfoEdit() {
  const { appUser, status } = useSelector((state: RootState) => state.users);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppUser());
  }, []);

  const handleSubmit = () => {
    const email = form.getFieldValue("email");
    const bio = form.getFieldValue("bio");
    const username = form.getFieldValue("username");
    const gender = form.getFieldValue("gender");
    const birthday = form.getFieldValue("birthday");

    dispatch(updateProfileInfo({ email, bio, username, gender }));
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      onFinish={handleSubmit}
      fields={[
        {
          name: "username",
          value: appUser?.username,
        },
        {
          name: "email",
          value: appUser?.email,
        },
        {
          name: "bio",
          value: appUser?.bio,
        },
      ]}
    >
      <Form.Item label="Name">
        <Input placeholder="input placeholder" disabled value={appUser?.fullname} />
      </Form.Item>
      <Form.Item label="User Name" name="username">
        <Input placeholder="input placeholder" value={appUser?.fullname} />
      </Form.Item>
      <Form.Item label="Bio" name="bio">
        <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input type="email" value={appUser?.email} />
      </Form.Item>
      <Form.Item label="Gender" name="gender">
        <Select defaultValue={appUser?.gender}>
          <Select.Option value="Male">Male</Select.Option>
          <Select.Option value="Female">Female</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Date of Birth" name="birthday">
        <DatePicker />
      </Form.Item>
      <Form.Item label=" ">
        <Button style={{ minWidth: "80px" }} type="primary" htmlType="submit">
          {submitting ? <Spin indicator={<LoadingOutlined style={{ color: " #fff" }} />} /> : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ProfileInfoEdit;
