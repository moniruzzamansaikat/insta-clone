import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Spin } from "antd";
import { memo } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { authToken, openNotification } from "../util";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setRegistering, setRegisterSucces } from "../features/users/usersSlice";
import { RootState } from "../app/store";

type RequiredMark = boolean | "optional";
const antIcon = <LoadingOutlined style={{ fontSize: 18, color: "#fff" }} spin />;

const Register = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>("optional");
  const { registering, registerSuccess } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  if (registerSuccess) {
    history.push("/login");
    openNotification("You can now log in");
    dispatch(setRegisterSucces(false));
  }
  const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const onFinish = () => {
    dispatch(setRegistering());
    const fullname = form.getFieldValue("fullname");
    const email = form.getFieldValue("email");
    const password = form.getFieldValue("password");
    const password_confirmation = form.getFieldValue("password_confirmation");
    dispatch(registerUser({ fullname, email, password, password_confirmation }));
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <Card style={{ maxWidth: "400px", margin: "20px auto" }} title="Register" type="inner">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ requiredMarkValue: requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Fullname"
          tooltip="Please provide your fullname"
          name="fullname"
          rules={[{ required: true, message: "Please input your full name!", whitespace: false }]}
        >
          <Input placeholder="e.g. John Doe" />
        </Form.Item>
        <Form.Item
          label="Email Address"
          tooltip="We need your email address. Because this will be your identity in this site."
          name="email"
          rules={[{ required: true, message: "Please input your email address!" }]}
        >
          <Input placeholder="e.g. john@gmail.com" />
        </Form.Item>
        <Form.Item
          label="Password"
          rules={[{ required: true, message: "Please input your password!", min: 6 }]}
          name="password"
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="password_confirmation"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {registering ? <Spin indicator={antIcon} /> : "Register"}
          </Button>

          <br />
          <br />
          <p>
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;
