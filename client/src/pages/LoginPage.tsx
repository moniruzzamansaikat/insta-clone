import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Spin } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import Axios from "axios";
import { authToken } from "../util";
import { isExpired } from "react-jwt";
import { loginUser, setLoggingIn, setLoginSuccess } from "../features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import "antd/dist/antd.css";

type RequiredMark = boolean | "optional";
const antIcon = <LoadingOutlined style={{ fontSize: 18, color: "#fff" }} spin />;

const LoginPage = () => {
  const { loggingIn, loginSuccess } = useSelector((state: RootState) => state.users);
  const history = useHistory();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>("optional");
  const dispatch = useDispatch();

  useEffect(() => {
    const token = authToken();
    if (token && !isExpired(token)) history.push("/");
  }, []);

  const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  // on login success redirect user to
  if (loginSuccess) {
    window.location.reload();
    dispatch(setLoginSuccess(false));
  }

  const onFinish = () => {
    dispatch(setLoggingIn());
    const email = form.getFieldValue("email");
    const password = form.getFieldValue("password");
    dispatch(loginUser({ email, password }));
  };

  return (
    <Card style={{ maxWidth: "400px", margin: "20px auto" }} title="Login" type="inner">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ requiredMarkValue: requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={onFinish}
      >
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {loggingIn ? <Spin indicator={antIcon} /> : "Login"}
          </Button>
          <br />
          <br />
          <hr />
          <p>
            Don't have any account ? <Link to="/register">register</Link>
          </p>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
