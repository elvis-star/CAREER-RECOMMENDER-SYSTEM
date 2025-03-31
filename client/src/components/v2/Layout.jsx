'use client';

import { Layout as AntLayout } from 'antd';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const { Content } = AntLayout;

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Check if current route is login or register
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // Check if current route is landing page
  const isLandingPage = location.pathname === '/';

  return (
    <AntLayout
      className={`min-h-screen bg-theme-background transition-colors duration-300 ${theme}`}
    >
      <Navbar />
      <Content
        className={`
          flex-1 w-full transition-colors duration-300
          ${
            isLandingPage
              ? 'max-w-full pt-16'
              : 'max-w-[1400px] mx-auto px-4 py-6 pt-24'
          }
        `}
      >
        {children}
      </Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
