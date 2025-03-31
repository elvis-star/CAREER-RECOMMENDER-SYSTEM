'use client';

// import { Alert } from '@/components/ui/alert';

import { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Spin,
  Empty,
  Alert,
} from 'antd';
import {
  LogoutOutlined,
  ExclamationCircleOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const SessionManagement = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sessions');
      setSessions(response.data.data);

      // Identify current session
      const token = localStorage.getItem('token');
      const currentSession = response.data.data.find(
        (session) => session.token === token
      );
      if (currentSession) {
        setCurrentSessionId(currentSession._id);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load your active sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = (sessionId) => {
    confirm({
      title: 'Terminate Session',
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure you want to terminate this session? If this is your current session, you will be logged out.',
      okText: 'Yes, Terminate',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await api.delete(`/sessions/${sessionId}`);

          // If terminating current session, log out
          if (sessionId === currentSessionId) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }

          // Otherwise, refresh the sessions list
          messageApi.success('Session terminated successfully');
          fetchSessions();
        } catch (err) {
          console.error('Error terminating session:', err);
          messageApi.error('Failed to terminate session. Please try again.');
        }
      },
    });
  };

  const handleTerminateAllSessions = () => {
    confirm({
      title: 'Terminate All Other Sessions',
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure you want to terminate all other sessions? This will log out all your other devices.',
      okText: 'Yes, Terminate All',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await api.delete('/sessions');
          messageApi.success('All other sessions terminated successfully');
          fetchSessions();
        } catch (err) {
          console.error('Error terminating all sessions:', err);
          messageApi.error('Failed to terminate sessions. Please try again.');
        }
      },
    });
  };

  // Helper function to determine device icon
  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <GlobalOutlined />;

    if (userAgent.includes('Mobile')) {
      return <MobileOutlined />;
    } else if (userAgent.includes('Tablet')) {
      return <TabletOutlined />;
    } else {
      return <DesktopOutlined />;
    }
  };

  // Helper function to format device name
  const getDeviceName = (userAgent) => {
    if (!userAgent) return 'Unknown device';

    let device = 'Unknown device';

    if (userAgent.includes('Windows')) {
      device = 'Windows';
    } else if (userAgent.includes('Mac')) {
      device = 'Mac';
    } else if (userAgent.includes('iPhone')) {
      device = 'iPhone';
    } else if (userAgent.includes('iPad')) {
      device = 'iPad';
    } else if (userAgent.includes('Android')) {
      device = 'Android';
    } else if (userAgent.includes('Linux')) {
      device = 'Linux';
    }

    let browser = '';
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    } else if (userAgent.includes('Opera')) {
      browser = 'Opera';
    }

    return `${device}${browser ? ` - ${browser}` : ''}`;
  };

  const columns = [
    {
      title: 'Device',
      dataIndex: 'device',
      key: 'device',
      render: (text, record) => (
        <Space>
          {getDeviceIcon(text)}
          <span>{getDeviceName(text)}</span>
          {record._id === currentSessionId && (
            <Tag color="green">Current Session</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (text) => text || 'Unknown',
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (text) => (text ? new Date(text).toLocaleString() : 'Unknown'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={() => handleTerminateSession(record._id)}
          disabled={loading}
        >
          {record._id === currentSessionId ? 'Log Out' : 'Terminate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Session Management</Title>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleTerminateAllSessions}
          disabled={loading || sessions.length <= 1}
        >
          Terminate All Other Sessions
        </Button>
      </div>

      <Card>
        <Paragraph className="mb-6">
          These are all the devices currently logged into your account. You can
          terminate any session to log out that device.
        </Paragraph>

        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
            <Text className="block mt-4">Loading your sessions...</Text>
          </div>
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mt-6"
          />
        ) : sessions.length === 0 ? (
          <Empty description="No active sessions found" />
        ) : (
          <Table
            columns={columns}
            dataSource={sessions}
            rowKey="_id"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default SessionManagement;
