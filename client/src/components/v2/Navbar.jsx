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
} from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  DownOutlined,
  BellOutlined,
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
      label: <div className="px-2 py-1 font-semibold">Notifications</div>,
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
          <div className="text-xs text-theme-text-secondary">
            {notification.description}
          </div>
          <div className="text-xs mt-1 text-theme-text-secondary">
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
        <div className="text-center text-theme-primary">
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
      key: 'theme',
      label: (
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Button
            type="text"
            size="small"
            icon={isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            className="flex items-center justify-center ml-2"
          />
        </div>
      ),
    },
    {
      key: 'divider2',
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
      className={`
      fixed w-full z-50 transition-all duration-300 px-4
      ${scrolled ? 'py-2' : 'py-4'}
      bg-[#002147] text-white
    `}
      style={{
        height: 'auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#0080ff] text-white p-1.5 rounded-md">
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
            className="border-0 bg-transparent text-white"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
            }}
            theme="dark"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle (Desktop) */}
          <Tooltip
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Button
              type="text"
              shape="circle"
              icon={
                isDarkMode ? (
                  <Sun size={18} className="text-yellow-300" />
                ) : (
                  <Moon size={18} className="text-yellow-300" />
                )
              }
              onClick={toggleTheme}
              className="flex items-center justify-center text-white hover:text-yellow-300 hover:bg-[#003366]"
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            />
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
                  className="flex items-center justify-center hover:bg-[#003366]"
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
                className="flex items-center text-white hover:text-blue-300 transition-colors"
              >
                <Space>
                  <Avatar
                    src={user?.avatar}
                    icon={!user?.avatar && <UserOutlined />}
                    size="default"
                    className={`${
                      scrolled
                        ? 'border-2 border-[#0080ff]'
                        : 'border-2 border-transparent'
                    } transition-all`}
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
                className="text-white hover:text-blue-300"
              >
                Sign In
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/register')}
                className="hidden md:inline-block bg-[#0080ff] hover:bg-[#0066cc]"
                size={scrolled ? 'middle' : 'large'}
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
            className="lg:hidden hover:bg-[#003366]"
          />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="bg-[#0080ff] text-white p-1 rounded-md">
              <GraduationCap size={20} />
            </div>
            <span className="font-bold text-theme-text">
              Career Recommender
            </span>
          </div>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={300}
        className={isDarkMode ? 'dark' : ''}
        headerStyle={{ borderBottom: '1px solid var(--color-border)' }}
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4">
          {isAuthenticated && (
            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-theme-background-secondary">
              <Avatar
                src={user?.avatar}
                icon={!user?.avatar && <UserOutlined />}
                size="large"
                className="border-2 border-[#0080ff]"
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <div>
                <div className="font-medium text-theme-text">{user?.name}</div>
                <div className="text-xs text-theme-text-secondary">
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
          />

          {/* Admin Link in Mobile Menu */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="mt-2 px-2">
              <Link to="/admin" onClick={closeDrawer}>
                <Button type="primary" icon={<ShieldOutlined />} block>
                  Admin Panel
                </Button>
              </Link>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 flex flex-col gap-2">
              <Divider className="border-theme my-2" />
              <Button
                type="primary"
                block
                size="large"
                onClick={() => {
                  navigate('/login');
                  closeDrawer();
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
              >
                Sign Up
              </Button>
            </div>
          )}

          <div className="mt-6">
            <Divider className="border-theme my-2" />
            <div className="flex justify-between items-center px-2 py-2">
              <span className="text-theme-text font-medium">Dark Mode</span>
              <Button
                type={isDarkMode ? 'primary' : 'default'}
                icon={isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                onClick={toggleTheme}
                className="flex items-center justify-center"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>

          {isAuthenticated && (
            <div className="mt-6">
              <Divider className="border-theme my-2" />
              <Button
                danger
                block
                icon={<LogoutOutlined />}
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
