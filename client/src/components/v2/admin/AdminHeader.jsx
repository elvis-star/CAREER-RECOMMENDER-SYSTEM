'use client';
import { Typography, Button, Space, Avatar, Dropdown, Badge } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const { Title } = Typography;

const AdminHeader = ({ title, subtitle, actions }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock notifications for demo
  const notifications = [
    {
      id: 1,
      title: 'New user registered',
      description: 'A new user has registered on the platform.',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'System backup completed',
      description: 'Automatic system backup has completed successfully.',
      time: '1 hour ago',
      read: true,
    },
  ];

  const notificationItems = [
    {
      key: 'notifications-title',
      label: <div className="px-2 py-1 font-semibold">Admin Notifications</div>,
      disabled: true,
    },
    ...notifications.map((notification) => ({
      key: `notification-${notification.id}`,
      label: (
        <div
          className={`p-2 ${
            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
        >
          <div className="font-medium">{notification.title}</div>
          <div className="text-xs text-gray-500">
            {notification.description}
          </div>
          <div className="text-xs mt-1 text-gray-500">{notification.time}</div>
        </div>
      ),
    })),
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'view-all',
      label: (
        <div className="text-center text-blue-600">View all notifications</div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/admin/settings'),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <Title level={2} className="!mb-0 !text-gray-800 dark:!text-gray-100">
          {title}
        </Title>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center mt-4 md:mt-0 space-x-3">
        {actions}

        <Dropdown
          menu={{ items: notificationItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge
            count={notifications.filter((n) => !n.read).length}
            size="small"
          >
            <Button type="text" shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space className="cursor-pointer">
            <Avatar
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
              className="border-2 border-blue-500"
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminHeader;
