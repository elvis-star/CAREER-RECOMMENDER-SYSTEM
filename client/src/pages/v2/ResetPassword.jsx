'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Result, Spin } from 'antd';
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [error, setError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true);
        await api.get(`/auth/check-reset-token/${token}`);
        setValidToken(true);
      } catch (err) {
        console.error('Token validation error:', err);
        setError(
          err.response?.data?.message ||
            'Password reset link is invalid or has expired.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      await api.put(`/auth/reset-password/${token}`, {
        password: values.password,
      });
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login?reset=success');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8">
          <Spin size="large" />
          <Text className="block mt-4">Validating your reset link...</Text>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8">
          <Result
            status="success"
            title="Password Reset Successful!"
            subTitle="Your password has been reset successfully. You can now log in with your new password."
            extra={[
              <Button
                type="primary"
                key="login"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  if (!validToken || error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md p-8">
          <Result
            status="error"
            title="Invalid or Expired Link"
            subTitle={
              error || 'The password reset link is invalid or has expired.'
            }
            extra={[
              <Button
                type="primary"
                key="reset"
                onClick={() => navigate('/forgot-password')}
              >
                Request New Reset Link
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                Back to Home
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Title level={2}>Reset Your Password</Title>
          <Paragraph className="text-gray-500">
            Please enter your new password below.
          </Paragraph>
        </div>

        <Form
          form={form}
          name="reset_password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Password must include uppercase, lowercase, number and special character',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitLoading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
