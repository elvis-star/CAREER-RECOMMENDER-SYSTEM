'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [showResetSuccessAlert, setShowResetSuccessAlert] = useState(false);

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Check for query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Check if email was just verified
    if (params.get('verified') === 'true') {
      setShowVerificationAlert(true);
    }

    // Check if password was just reset
    if (params.get('reset') === 'success') {
      setShowResetSuccessAlert(true);
    }
  }, [location]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        if (error.response?.data?.message?.includes('verify your email')) {
          setError(
            'Please verify your email before logging in. Check your inbox for the verification link.'
          );
        } else if (error.response?.data?.message?.includes('locked')) {
          setError(
            'Your account is temporarily locked due to multiple failed login attempts. Please try again later or reset your password.'
          );
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        setError(
          error.response?.data?.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // In a real app, you would implement social login here
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: 'calc(100vh - 150px)' }}
    >
      <Col xs={22} sm={20} md={14} lg={10} xl={8}>
        <div className="text-center mb-8">
          <Title level={2}>Log in to your account</Title>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0080ff]">
              Sign up
            </Link>
          </Text>
        </div>

        {showVerificationAlert && (
          <Alert
            message="Email Verified Successfully!"
            description="Your email has been verified. You can now log in to your account."
            type="success"
            showIcon
            closable
            className="mb-6"
            onClose={() => setShowVerificationAlert(false)}
          />
        )}

        {showResetSuccessAlert && (
          <Alert
            message="Password Reset Successful!"
            description="Your password has been reset. You can now log in with your new password."
            type="success"
            showIcon
            closable
            className="mb-6"
            onClose={() => setShowResetSuccessAlert(false)}
          />
        )}

        <Card bordered={false} className="shadow-md">
          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setError(null)}
              action={
                error.includes('verify your email') ? (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => navigate('/resend-verification')}
                  >
                    Resend Verification
                  </Button>
                ) : error.includes('locked') ? (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Reset Password
                  </Button>
                ) : null
              }
            />
          )}

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Checkbox>Remember me</Checkbox>
                <Link to="/forgot-password" className="text-[#0080ff]">
                  Forgot password?
                </Link>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Sign in
              </Button>
            </Form.Item>

            <Divider plain>or continue with</Divider>

            <Space size="middle" className="w-full flex justify-center">
              <Button
                icon={<GoogleOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Google')}
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Facebook')}
              >
                Facebook
              </Button>
              <Button
                icon={<TwitterOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Twitter')}
              >
                Twitter
              </Button>
            </Space>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
