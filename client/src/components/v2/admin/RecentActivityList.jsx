'use client';

import { List, Avatar, Tag, Typography, Space, Tooltip } from 'antd';
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  MailOutlined,
  LockOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const RecentActivityList = ({ activities }) => {
  // Function to get icon based on action
  const getActionIcon = (action) => {
    switch (action) {
      case 'login':
        return <LoginOutlined style={{ color: '#52c41a' }} />;
      case 'logout':
        return <LogoutOutlined style={{ color: '#faad14' }} />;
      case 'register':
        return <PlusOutlined style={{ color: '#1890ff' }} />;
      case 'update_profile':
        return <EditOutlined style={{ color: '#722ed1' }} />;
      case 'admin_action':
        return <LockOutlined style={{ color: '#f5222d' }} />;
      case 'email_verification':
        return <MailOutlined style={{ color: '#13c2c2' }} />;
      case 'password_reset':
        return <SyncOutlined style={{ color: '#eb2f96' }} />;
      case 'view_career':
        return <EyeOutlined style={{ color: '#1890ff' }} />;
      case 'save_career':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'remove_saved_career':
        return <DeleteOutlined style={{ color: '#f5222d' }} />;
      case 'input_results':
        return <EditOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <UserOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  // Function to format action text
  const formatAction = (action, details) => {
    switch (action) {
      case 'login':
        return 'logged in';
      case 'logout':
        return 'logged out';
      case 'register':
        return `registered as ${details?.userType || 'user'}`;
      case 'update_profile':
        return `updated ${details?.field || 'profile'}`;
      case 'admin_action':
        return `performed admin action: ${details?.action || ''}`;
      case 'email_verification':
        return 'verified email';
      case 'password_reset':
        return 'reset password';
      case 'view_career':
        return `viewed career: ${details?.careerTitle || ''}`;
      case 'save_career':
        return `saved career: ${details?.careerTitle || ''}`;
      case 'remove_saved_career':
        return `removed saved career: ${details?.careerTitle || ''}`;
      case 'input_results':
        return 'input KCSE results';
      default:
        return action.replace(/_/g, ' ');
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={activities}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                icon={getActionIcon(item.action)}
                src={item.user?.avatar}
                alt={item.user?.name}
              />
            }
            title={
              <Space>
                <Text strong>{item.user?.name || 'Anonymous'}</Text>
                <Text>{formatAction(item.action, item.details)}</Text>
              </Space>
            }
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary">
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Space size="small" className="mt-1">
                  {item.ip && (
                    <Tooltip title="IP Address">
                      <Tag color="blue">{item.ip}</Tag>
                    </Tooltip>
                  )}
                  {item.userAgent && (
                    <Tooltip title="User Agent">
                      <Tag color="purple">
                        {item.userAgent.includes('Mobile')
                          ? 'Mobile'
                          : 'Desktop'}
                      </Tag>
                    </Tooltip>
                  )}
                </Space>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default RecentActivityList;
