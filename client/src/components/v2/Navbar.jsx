'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Dropdown,
  Space,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Switch,
} from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  DownOutlined,
  BellOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { Sun, Moon, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AdminLink from './AdminLink';
import { ShieldOutlined } from '@mui/icons-material';

const { Header } = Layout;

const Navbar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeKey, setActiveKey] = useState('home');
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkMode = theme === 'dark';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active menu item based on current path
  useEffect(() => {
    const path = location.pathname;

    if (path === '/') setActiveKey('home');
    else if (path === '/dashboard') setActiveKey('dashboard');
    else if (path.includes('/career')) setActiveKey('careers');
    else if (path === '/about') setActiveKey('about');
    else if (path === '/contact') setActiveKey('contact');
    else if (path.includes('/guide') || path.includes('/institution'))
      setActiveKey('resources');
    else setActiveKey('');
  }, [location.pathname]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock notifications for demo
  const notifications = [
    {
      id: 1,
      title: 'New career recommendation',
      description:
        "Based on your profile, we've found a new career match for you.",
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Profile update reminder',
      description:
        'Complete your profile to get more accurate recommendations.',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 3,
      title: 'New institution added',
      description: 'University of Nairobi has added new programs.',
      time: 'Yesterday',
      read: true,
    },
  ];

  const notificationItems = [
    {
      key: 'notifications-title',
      label: (
        <div
          className="px-2 py-1 font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Notifications
        </div>
      ),
      disabled: true,
    },
    ...notifications.map((notification) => ({
      key: `notification-${notification.id}`,
      label: (
        <div
          className={`p-2 rounded-md ${
            !notification.read
              ? isDarkMode
                ? 'bg-blue-900/20'
                : 'bg-blue-50'
              : ''
          }`}
        >
          <div className="font-medium" style={{ color: 'var(--color-text)' }}>
            {notification.title}
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {notification.description}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {notification.time}
          </div>
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
        <div className="text-center" style={{ color: 'var(--color-primary)' }}>
          View all notifications
        </div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
    },
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    user?.role === 'admin' && {
      key: 'admin',
      label: <Link to="/admin">Admin Panel</Link>,
      icon: <ShieldOutlined />,
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
  ].filter(Boolean);

  const navItems = [
    {
      key: 'home',
      label: <Link to="/">Home</Link>,
    },
    isAuthenticated && {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'careers',
      label: 'Careers',
      children: [
        {
          key: 'explore',
          label: <Link to="/careers">Explore Careers</Link>,
        },
        {
          key: 'trends',
          label: <Link to="/trends">Career Trends</Link>,
        },
      ],
    },
    {
      key: 'resources',
      label: 'Resources',
      children: [
        {
          key: 'guides',
          label: <Link to="/guides">Career Guides</Link>,
        },
        {
          key: 'institutions',
          label: <Link to="/institutions">Universities & Colleges</Link>,
        },
      ],
    },
    {
      key: 'about',
      label: <Link to="/about">About</Link>,
    },
    {
      key: 'contact',
      label: <Link to="/contact">Contact</Link>,
    },
  ].filter(Boolean);

  return (
    <Header
      className={`fixed w-full z-50 transition-all duration-300 px-4 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        height: 'auto',
        backgroundColor: isDarkMode
          ? 'var(--color-header-background)'
          : '#002147',
        boxShadow: isDarkMode
          ? 'var(--shadow-lg)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderBottom: isDarkMode ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-md transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline-block">
              Career Recommender
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <Menu
            mode="horizontal"
            items={navItems}
            selectedKeys={[activeKey]}
            className="border-0 bg-transparent"
            style={{
              backgroundColor: 'transparent',
            }}
            theme="dark"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced Theme Toggle */}
          <Tooltip
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div
              className="p-2 rounded-lg shadow-md border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: isDarkMode
                  ? 'rgba(45, 55, 72, 0.9)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderColor: isDarkMode
                  ? 'var(--color-border)'
                  : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-2">
                <BulbOutlined
                  className="transition-colors duration-300"
                  style={{
                    color: isDarkMode ? 'var(--color-warning)' : '#fbbf24',
                    fontSize: '16px',
                  }}
                />
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren={
                    <Moon
                      size={12}
                      className="text-white"
                      style={{ marginTop: '-2px' }}
                    />
                  }
                  unCheckedChildren={
                    <Sun
                      size={12}
                      className="text-yellow-500"
                      style={{ marginTop: '-2px' }}
                    />
                  }
                  className="theme-switch"
                  style={{
                    backgroundColor: isDarkMode
                      ? 'var(--color-primary)'
                      : '#f0f0f0',
                  }}
                />
              </div>
            </div>
          </Tooltip>

          {/* Admin Link (if user is admin) */}
          {isAuthenticated && user?.role === 'admin' && <AdminLink />}

          {/* Notifications (For authenticated users) */}
          {isAuthenticated && (
            <Dropdown
              menu={{ items: notificationItems }}
              trigger={['click']}
              placement="bottomRight"
              overlayClassName={isDarkMode ? 'dark' : ''}
            >
              <Badge
                count={notifications.filter((n) => !n.read).length}
                size="small"
              >
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined className="text-white" />}
                  className="flex items-center justify-center hover:bg-white/10 transition-colors duration-300"
                  style={{
                    color: 'white',
                  }}
                />
              </Badge>
            </Dropdown>
          )}

          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
              overlayClassName={isDarkMode ? 'dark' : ''}
            >
              <a
                onClick={(e) => e.preventDefault()}
                className="flex items-center text-white hover:text-blue-300 transition-colors duration-300"
              >
                <Space>
                  <Avatar
                    src={user?.avatar}
                    icon={!user?.avatar && <UserOutlined />}
                    size="default"
                    className={`${
                      scrolled ? 'border-2' : 'border-2 border-transparent'
                    } transition-all duration-300`}
                    style={{
                      borderColor: scrolled
                        ? 'var(--color-primary)'
                        : 'transparent',
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <span className="hidden md:inline font-medium">
                    {user?.name}
                  </span>
                  <DownOutlined className="text-xs opacity-70" />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <Space>
              <Button
                type="link"
                onClick={() => navigate('/login')}
                className="text-white hover:text-blue-300 transition-colors duration-300"
                style={{ color: 'white' }}
              >
                Sign In
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/register')}
                className="hidden md:inline-block transition-all duration-300"
                size={scrolled ? 'middle' : 'large'}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                }}
              >
                Sign Up
              </Button>
            </Space>
          )}

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined className="text-white" />}
            onClick={showDrawer}
            className="lg:hidden hover:bg-white/10 transition-colors duration-300"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div
              className="p-1 rounded-md"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <GraduationCap size={20} />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>
              Career Recommender
            </span>
          </div>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={300}
        className={isDarkMode ? 'dark' : ''}
        headerStyle={{
          borderBottom: `1px solid var(--color-border)`,
          backgroundColor: 'var(--color-card-background)',
        }}
        bodyStyle={{
          padding: 0,
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div className="p-4">
          {isAuthenticated && (
            <div
              className="mb-6 flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <Avatar
                src={user?.avatar}
                icon={!user?.avatar && <UserOutlined />}
                size="large"
                className="border-2"
                style={{ borderColor: 'var(--color-primary)' }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user?.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {user?.email}
                </div>
              </div>
            </div>
          )}

          <Menu
            mode="inline"
            items={navItems}
            className="border-0 bg-transparent"
            onClick={closeDrawer}
            selectedKeys={[activeKey]}
            style={{ backgroundColor: 'transparent' }}
          />

          {/* Admin Link in Mobile Menu */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="mt-2 px-2">
              <Link to="/admin" onClick={closeDrawer}>
                <Button
                  type="primary"
                  icon={<ShieldOutlined />}
                  block
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  Admin Panel
                </Button>
              </Link>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 flex flex-col gap-2">
              <Divider
                style={{ borderColor: 'var(--color-border)' }}
                className="my-2"
              />
              <Button
                type="primary"
                block
                size="large"
                onClick={() => {
                  navigate('/login');
                  closeDrawer();
                }}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                }}
              >
                Sign In
              </Button>
              <Button
                block
                size="large"
                onClick={() => {
                  navigate('/register');
                  closeDrawer();
                }}
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Enhanced Mobile Theme Toggle */}
          <div className="mt-6">
            <Divider
              style={{ borderColor: 'var(--color-border)' }}
              className="my-2"
            />
            <div
              className="flex justify-between items-center px-3 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <BulbOutlined
                  style={{
                    color: isDarkMode
                      ? 'var(--color-warning)'
                      : 'var(--color-text-secondary)',
                    fontSize: '16px',
                  }}
                />
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  Theme
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sun
                  size={16}
                  style={{
                    color: isDarkMode
                      ? 'var(--color-text-secondary)'
                      : 'var(--color-warning)',
                  }}
                />
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren="🌙"
                  unCheckedChildren="☀️"
                  style={{
                    backgroundColor: isDarkMode
                      ? 'var(--color-primary)'
                      : '#f0f0f0',
                  }}
                />
                <Moon
                  size={16}
                  style={{
                    color: isDarkMode
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                  }}
                />
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="mt-6">
              <Divider
                style={{ borderColor: 'var(--color-border)' }}
                className="my-2"
              />
              <Button
                danger
                block
                icon={<LogoutOutlined />}
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
                style={{
                  borderColor: 'var(--color-error)',
                  color: 'var(--color-error)',
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Custom CSS for theme switch */}
      <style jsx>{`
        .theme-switch .ant-switch-handle::before {
          transition: all 0.3s ease;
        }

        .theme-switch.ant-switch-checked {
          background-color: var(--color-primary) !important;
        }

        .theme-switch.ant-switch-checked .ant-switch-handle::before {
          background-color: #1a202c;
        }

        .theme-switch:not(.ant-switch-checked) .ant-switch-handle::before {
          background-color: #fbbf24;
        }
      `}</style>
    </Header>
  );
};

export default Navbar;
