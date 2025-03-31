'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Breadcrumb,
  Drawer,
  Badge,
  theme,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  BankOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  BarChartOutlined,
  HomeOutlined,
  HistoryOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme: colorTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { token } = theme.useToken();

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current path for breadcrumb and menu selection
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    {
      title: (
        <Link to="/admin">
          <HomeOutlined /> Admin
        </Link>
      ),
    },
    ...pathSnippets.slice(1).map((snippet, index) => {
      const url = `/admin/${pathSnippets.slice(1, index + 2).join('/')}`;
      const title =
        snippet.charAt(0).toUpperCase() + snippet.slice(1).replace(/-/g, ' ');
      return {
        title: <Link to={url}>{title}</Link>,
      };
    }),
  ];

  // Get current selected menu item
  const selectedKey = pathSnippets[1] || 'dashboard';

  // Menu items
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: 'careers',
      icon: <BookOutlined />,
      label: <Link to="/admin/careers">Careers</Link>,
    },
    {
      key: 'institutions',
      icon: <BankOutlined />,
      label: <Link to="/admin/institutions">Institutions</Link>,
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/analytics">Analytics</Link>,
    },
    {
      key: 'activity',
      icon: <HistoryOutlined />,
      label: <Link to="/admin/activity">Activity Logs</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
    {
      key: 'backup',
      icon: <DatabaseOutlined />,
      label: <Link to="/admin/backup">Database Backup</Link>,
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // User dropdown menu
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/profile">My Profile</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">Settings</Link>,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: <a onClick={handleLogout}>Logout</a>,
        },
      ]}
    />
  );

  // Notification dropdown
  const notificationMenu = (
    <Menu
      items={
        notifications.length > 0
          ? notifications.map((notification, index) => ({
              key: index,
              label: (
                <div>
                  <Text strong>{notification.title}</Text>
                  <br />
                  <Text type="secondary">{notification.message}</Text>
                </div>
              ),
            }))
          : [
              {
                key: 'empty',
                label: <Text type="secondary">No new notifications</Text>,
              },
            ]
      }
    />
  );

  const sidebarContent = (
    <>
      <div className="logo p-4 flex items-center justify-center">
        <Link to="/admin">
          <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
            Admin Panel
          </Title>
        </Link>
      </div>
      <Menu
        theme={colorTheme === 'dark' ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {mobileView ? (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme={colorTheme === 'dark' ? 'dark' : 'light'}
          width={250}
        >
          {sidebarContent}
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorTheme === 'dark' ? token.colorBgContainer : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="flex items-center">
            {mobileView ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
            )}
            <Link to="/" className="ml-4 text-gray-600 hover:text-gray-900">
              <HomeOutlined /> Back to Main Site
            </Link>
          </div>
          <Space>
            <Dropdown
              overlay={notificationMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <Badge count={notifications.length} overflowCount={9}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
            </Dropdown>
            <Dropdown
              overlay={userMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="text">
                <Space>
                  <Avatar
                    size="small"
                    src={user?.avatar}
                    icon={!user?.avatar && <UserOutlined />}
                    alt={user?.name}
                  />
                  {!mobileView && <span>{user?.name}</span>}
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div
            style={{
              padding: 24,
              background:
                colorTheme === 'dark' ? token.colorBgContainer : '#fff',
              borderRadius: token.borderRadius,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Career Recommender System ©{new Date().getFullYear()} - Admin Panel
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
