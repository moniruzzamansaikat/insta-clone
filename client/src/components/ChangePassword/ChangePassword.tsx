import { DatePicker, Form, Input, Select, Button, Menu } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { changePassword, fetchAppUser } from "../../features/users/usersSlice";

function ChangePassword() {
  const { appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppUser());
  }, []);

  const handleSubmit = () => {
    const data = {
      oldPassword: form.getFieldValue("oldpwd"),
      newPassword: form.getFieldValue("newpwd"),
      passwordConfirmation: form.getFieldValue("conpwd"),
    };

    dispatch(changePassword(data));
    form.resetFields();
  };

  return (
    <Form form={form} labelCol={{ span: 4 }} onFinish={handleSubmit} wrapperCol={{ span: 14 }}>
      <Form.Item label="Old Password" name="oldpwd">
        <Input />
      </Form.Item>
      <Form.Item label="New Password" name="newpwd">
        <Input />
      </Form.Item>
      <Form.Item label="Confirm Password" name="conpwd">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ChangePassword;
