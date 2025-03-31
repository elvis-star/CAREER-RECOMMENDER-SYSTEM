'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/auth/forgot-password', { email: values.email });
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Title level={2}>Forgot Password</Title>
          <Paragraph className="text-gray-500">
            Enter your email address and we'll send you a link to reset your
            password.
          </Paragraph>
        </div>

        {success ? (
          <Alert
            message="Reset Email Sent"
            description="If an account exists with this email, you will receive a password reset link shortly. Please check your email inbox and spam folder."
            type="success"
            showIcon
            className="mb-6"
          />
        ) : (
          <Form
            form={form}
            name="forgot_password"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email address' },
                {
                  type: 'email',
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                size="large"
              />
            </Form.Item>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="mb-4"
              />
            )}

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="text-center mt-4">
          <Space>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
