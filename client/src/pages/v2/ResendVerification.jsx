'use client';

import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ResendVerification = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/auth/resend-verification', { email: values.email });
      setSuccess(true);
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to resend verification email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Title level={2}>Resend Verification Email</Title>
          <Paragraph className="text-gray-500">
            Enter your email address and we'll send you a new verification link.
          </Paragraph>
        </div>

        {success ? (
          <Alert
            message="Verification Email Sent"
            description="A new verification email has been sent to your address. Please check your inbox and spam folder."
            type="success"
            showIcon
            className="mb-6"
          />
        ) : (
          <Form
            form={form}
            name="resend_verification"
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
                Resend Verification Email
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

export default ResendVerification;
