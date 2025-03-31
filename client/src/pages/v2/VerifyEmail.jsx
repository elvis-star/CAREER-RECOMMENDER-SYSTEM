'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Result, Spin, Alert, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);

        // First check if token is valid
        await api.get(`/auth/check-verification-token/${token}`);

        // Then verify the email
        const response = await api.get(`/auth/verify-email/${token}`);
        setVerified(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } catch (err) {
        console.error('Verification error:', err);
        setError(
          err.response?.data?.message ||
            'Verification failed. The link may be invalid or expired.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      await api.post('/auth/resend-verification', { email });
      setResendSuccess(true);
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to resend verification email. Please try again.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8">
          <Spin size="large" />
          <Text className="block mt-4">Verifying your email...</Text>
        </Card>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8">
          <Result
            status="success"
            title="Email Verified Successfully!"
            subTitle="Your email has been verified. You can now log in to your account."
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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md p-8">
          <Result
            status="error"
            title="Verification Failed"
            subTitle={error}
            extra={[
              <Button type="primary" key="home" onClick={() => navigate('/')}>
                Back to Home
              </Button>,
            ]}
          />

          {!resendSuccess ? (
            <div className="mt-8 text-center">
              <Title level={5}>Didn't receive the verification email?</Title>
              <Paragraph>
                Enter your email address below to resend the verification link.
              </Paragraph>
              <Space direction="vertical" className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <Button
                  type="primary"
                  icon={<MailOutlined />}
                  onClick={handleResendVerification}
                  loading={resendLoading}
                  disabled={!email}
                  block
                >
                  Resend Verification Email
                </Button>
              </Space>
            </div>
          ) : (
            <Alert
              message="Verification Email Sent"
              description="A new verification email has been sent to your email address. Please check your inbox and spam folder."
              type="success"
              showIcon
              className="mt-6"
            />
          )}
        </Card>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;
