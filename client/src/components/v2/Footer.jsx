'use client';

import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Input,
  Button,
  Divider,
  Form,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const onSubscribe = (values) => {
    console.log('Subscribed with email:', values.email);
    // In a real app, you would call an API to subscribe the user
  };

  return (
    <AntFooter className="bg-theme-footer-background mt-auto transition-colors duration-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <Row gutter={[32, 48]}>
          {/* About */}
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div className="flex items-center mb-4">
              <div className="bg-theme-primary text-white p-1.5 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <Title level={4} className="text-theme-primary mb-0">
                Career Recommender
              </Title>
            </div>
            <Text className="text-theme-text-secondary block mb-6">
              Helping Kenyan students make informed career decisions based on
              their KCSE results. Our AI-powered platform matches academic
              strengths with market opportunities.
            </Text>
            <Space size="large">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                <FacebookOutlined className="text-xl" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                <TwitterOutlined className="text-xl" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                <InstagramOutlined className="text-xl" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                <LinkedinOutlined className="text-xl" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                <YoutubeOutlined className="text-xl" />
              </a>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={8} md={5} lg={5} xl={5}>
            <Title level={5} className="text-theme-text mb-4">
              Company
            </Title>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col xs={12} sm={8} md={5} lg={5} xl={5}>
            <Title level={5} className="text-theme-text mb-4">
              Support
            </Title>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Legal
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className="text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col xs={24} sm={8} md={6} lg={6} xl={6}>
            <Title level={5} className="text-theme-text mb-4">
              Stay up to date
            </Title>
            <Text className="text-theme-text-secondary block mb-4">
              Subscribe to our newsletter for the latest updates on careers,
              education, and more.
            </Text>
            <Form onFinish={onSubscribe}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please enter a valid email',
                  },
                ]}
              >
                <Input.Search
                  placeholder="Your email address"
                  enterButton={
                    <Button type="primary" icon={<SendOutlined />}>
                      Subscribe
                    </Button>
                  }
                  size="large"
                  className="rounded-lg overflow-hidden"
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Divider className="my-8 border-theme" />

        <Row justify="space-between" align="middle">
          <Col xs={24} sm={24} md={12} className="text-center md:text-left">
            <Text className="text-theme-text-secondary">
              © {new Date().getFullYear()} Career Recommender. All rights
              reserved
            </Text>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            className="text-center md:text-right mt-4 md:mt-0"
          >
            <Space split={<Divider type="vertical" className="border-theme" />}>
              <Link
                to="/privacy"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-theme-text-secondary hover:text-theme-primary transition-colors"
              >
                Cookies
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
