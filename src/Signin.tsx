import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Typography, Spin } from "antd";
import { auth } from "./Firebase";
import { LockOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { UserContext } from "./Context/UserContext";

const { Title } = Typography;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
);

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(UserContext);
  const {
    userState: { loaded },
    isSignedIn,
  } = context;

  let history = useHistory();

  useEffect(() => {
    if (loaded) {
      history.push("/main");
    }
  }, [history, loaded]);

  const handleSubmit = async (values: any) => {
    console.log("Success:", values);
    setLoading(true);
    const { email, password } = values;

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      console.log(user?.uid);
      // history.push("/main");
      isSignedIn(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <Title level={2}>Sign In</Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px",
          width: "100%",
          marginTop: "20px",
        }}
        onFinish={handleSubmit}
      >
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
            {loading ? <Spin indicator={antIcon} /> : "Log In"}
          </Button>
        </Form.Item>
        {error ? (
          <p style={{ color: "#ff4d4f", textAlign: "center" }}>{error}</p>
        ) : null}
      </Form>
    </div>
  );
};

export default Signin;
