import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { Spin } from "antd";

import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { auth } from "./Firebase";
import { useHistory } from "react-router-dom";
import { createUserDocument } from "./utilities";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
);

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let history = useHistory();

  const handleSubmit = async (values: any) => {
    // console.log("Success:", values);
    setLoading(true);
    const { fullname, email, password } = values;

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      createUserDocument(user, { fullname });
      history.push("/main");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };

  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <div className="form-container">
      <Form
        name="normal_signup"
        className="signup-form"
        initialValues={{
          remember: true,
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "600px",
          width: "100%",
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="fullname"
          rules={[
            {
              required: true,
              message: "Please input your fullname!",
            },
          ]}
        >
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
            }}
            placeholder="Full Name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            type="email"
            prefix={<MailOutlined className="site-form-item-icon" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            size="large"
            style={{ width: "100%" }}
          >
            {loading ? <Spin indicator={antIcon} /> : "Sign Up"}
          </Button>
        </Form.Item>
        {error ? <p>{error}</p> : null}
      </Form>
    </div>
  );
};

export default Signup;
