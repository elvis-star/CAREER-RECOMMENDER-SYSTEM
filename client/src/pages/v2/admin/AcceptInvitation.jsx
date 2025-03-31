'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  message,
  Steps,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import api from '../../../services/api';

const { Title, Text } = Typography;
const { Step } = Steps;

const AcceptInvitation = () => {
  const [form] = Form.useForm();
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/invite/verify/${token}`);
        setInvitation(response.data.data);
        setCurrentStep(1);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Invalid or expired invitation token'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await api.post(`/admin/invite/accept/${token}`, {
        name: values.name,
        password: values.password,
      });

      message.success('Account created successfully! You can now log in.');
      setCurrentStep(2);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Failed to create account'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Text>Verifying invitation...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Invalid Invitation"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          }
        />
      );
    }

    if (currentStep === 1 && invitation) {
      return (
        <>
          <Alert
            message="Admin Invitation"
            description={`You've been invited to join as an administrator by ${
              invitation.invitedBy?.name || 'an administrator'
            }.`}
            type="info"
            showIcon
            className="mb-6"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ email: invitation.email }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
              />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input prefix={<MailOutlined />} disabled />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter a password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create a password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
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
                placeholder="Confirm your password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
              >
                Create Admin Account
              </Button>
            </Form.Item>
          </Form>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="text-center py-8">
          <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
          <Title level={3}>Account Created Successfully!</Title>
          <Text className="block mb-4">
            You can now log in with your email and password.
          </Text>
          <Button type="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <Steps current={currentStep} size="small">
            <Step title="Verify" />
            <Step title="Create Account" />
            <Step title="Complete" />
          </Steps>
        </div>

        <div className="text-center mb-6">
          <Title level={3}>Admin Invitation</Title>
          <Text className="text-gray-500">
            Accept your invitation to join as an administrator
          </Text>
        </div>

        {renderContent()}
      </Card>
    </div>
  );
};

export default AcceptInvitation;
