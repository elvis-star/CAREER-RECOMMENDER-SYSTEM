'use client';

import { useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Avatar,
  Rate,
  Timeline,
  Badge,
  Tag,
} from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  Navigation,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Enhanced Map Component with theme integration
const InteractiveMap = () => {
  const { theme } = useTheme();
  const [mapView, setMapView] = useState('satellite');
  const [zoom, setZoom] = useState(13);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nairobiCoords = { lat: -1.2921, lng: 36.8219 };

  const officeLocations = [
    {
      id: 1,
      name: 'Main Office',
      address: 'Kimathi Street, Nairobi CBD',
      coords: { lat: -1.2841, lng: 36.8155 },
      type: 'primary',
      phone: '+254 712 345 678',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    },
    {
      id: 2,
      name: 'Westlands Branch',
      address: 'Westlands, Nairobi',
      coords: { lat: -1.2676, lng: 36.8108 },
      type: 'branch',
      phone: '+254 712 345 679',
      hours: 'Mon-Fri: 9:00 AM - 4:00 PM',
    },
    {
      id: 3,
      name: 'Karen Office',
      address: 'Karen, Nairobi',
      coords: { lat: -1.3197, lng: 36.7073 },
      type: 'branch',
      phone: '+254 712 345 680',
      hours: 'Mon-Fri: 9:00 AM - 4:00 PM',
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState(officeLocations[0]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 1, 20));
  const handleZoomOut = () => setZoom(Math.max(zoom - 1, 1));
  const handleReset = () => {
    setZoom(13);
    setMapView('satellite');
    setShowTraffic(false);
    setShowTransit(false);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[500px]'
      } rounded-lg overflow-hidden border-theme shadow-theme-md`}
      style={{
        backgroundColor: 'var(--color-card-background)',
      }}
    >
      {/* Map Container */}
      <div className="relative w-full h-full">
        {/* Simulated Map Background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #2d3748 100%)'
              : 'linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 50%, #e6f3ff 100%)',
          }}
        >
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <div
                  key={i}
                  className="border"
                  style={{
                    borderColor: isDark
                      ? 'rgba(160, 174, 192, 0.2)'
                      : 'rgba(100, 116, 139, 0.2)',
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Simulated roads with theme support */}
          <div
            className="absolute top-1/3 left-0 right-0 h-2 opacity-60"
            style={{
              backgroundColor: isDark ? '#4a5568' : '#718096',
            }}
          ></div>
          <div
            className="absolute top-2/3 left-0 right-0 h-1 opacity-40"
            style={{
              backgroundColor: isDark ? '#4a5568' : '#a0aec0',
            }}
          ></div>
          <div
            className="absolute left-1/4 top-0 bottom-0 w-1 opacity-40"
            style={{
              backgroundColor: isDark ? '#4a5568' : '#a0aec0',
            }}
          ></div>
          <div
            className="absolute left-3/4 top-0 bottom-0 w-2 opacity-60"
            style={{
              backgroundColor: isDark ? '#4a5568' : '#718096',
            }}
          ></div>

          {/* Office location markers */}
          {officeLocations.map((location, index) => (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                selectedLocation.id === location.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${25 + index * 25}%`,
                top: `${30 + index * 15}%`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`relative ${
                  location.type === 'primary' ? 'w-8 h-8' : 'w-6 h-6'
                }`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    location.type === 'primary'
                      ? 'bg-red-500 border-4 border-white shadow-lg'
                      : 'bg-blue-500 border-2 border-white shadow-md'
                  } flex items-center justify-center`}
                >
                  <EnvironmentOutlined className="text-white text-xs" />
                </div>
                {selectedLocation.id === location.id && (
                  <div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 rounded-lg shadow-theme-lg p-2 min-w-48 border-theme"
                    style={{
                      backgroundColor: 'var(--color-card-background)',
                    }}
                  >
                    <Text
                      strong
                      className="block text-xs"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {location.name}
                    </Text>
                    <Text
                      className="text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {location.address}
                    </Text>
                    <Text className="text-xs text-theme-primary">
                      {location.phone}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Nairobi CBD indicator */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-yellow-400 rounded-full w-4 h-4 border-2 border-white shadow-lg animate-pulse"></div>
            <Text
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded shadow-theme-sm"
              style={{
                backgroundColor: 'var(--color-card-background)',
                color: 'var(--color-text)',
              }}
            >
              Nairobi CBD
            </Text>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <div
            className="rounded-lg shadow-theme-lg p-1 border-theme"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <Button
              type="text"
              icon={<ZoomIn size={16} />}
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: 'var(--color-text)' }}
              disabled={zoom >= 20}
            />
            <Divider className="my-1" />
            <Button
              type="text"
              icon={<ZoomOut size={16} />}
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: 'var(--color-text)' }}
              disabled={zoom <= 1}
            />
          </div>

          <Button
            type="text"
            icon={<Navigation size={16} />}
            className="rounded-lg shadow-theme-lg w-8 h-8 flex items-center justify-center border-theme"
            style={{
              backgroundColor: 'var(--color-card-background)',
              color: 'var(--color-text)',
            }}
            title="My Location"
          />

          <Button
            type="text"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
            className="rounded-lg shadow-theme-lg w-8 h-8 flex items-center justify-center border-theme"
            style={{
              backgroundColor: 'var(--color-card-background)',
              color: 'var(--color-text)',
            }}
            title="Reset View"
          />

          <Button
            type="text"
            icon={<Maximize size={16} />}
            onClick={toggleFullscreen}
            className="rounded-lg shadow-theme-lg w-8 h-8 flex items-center justify-center border-theme"
            style={{
              backgroundColor: 'var(--color-card-background)',
              color: 'var(--color-text)',
            }}
            title="Fullscreen"
          />
        </div>

        {/* Layer Controls */}
        <div className="absolute top-4 left-4 z-30">
          <div
            className="rounded-lg shadow-theme-lg p-3 border-theme"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <Text
              strong
              className="block mb-2 text-xs"
              style={{ color: 'var(--color-text)' }}
            >
              Map Layers
            </Text>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="satellite"
                  name="mapView"
                  checked={mapView === 'satellite'}
                  onChange={() => setMapView('satellite')}
                  className="w-3 h-3"
                />
                <label
                  htmlFor="satellite"
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--color-text)' }}
                >
                  Satellite
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="street"
                  name="mapView"
                  checked={mapView === 'street'}
                  onChange={() => setMapView('street')}
                  className="w-3 h-3"
                />
                <label
                  htmlFor="street"
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--color-text)' }}
                >
                  Street
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="terrain"
                  name="mapView"
                  checked={mapView === 'terrain'}
                  onChange={() => setMapView('terrain')}
                  className="w-3 h-3"
                />
                <label
                  htmlFor="terrain"
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--color-text)' }}
                >
                  Terrain
                </label>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="traffic"
                  checked={showTraffic}
                  onChange={(e) => setShowTraffic(e.target.checked)}
                  className="w-3 h-3"
                />
                <label
                  htmlFor="traffic"
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--color-text)' }}
                >
                  Traffic
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="transit"
                  checked={showTransit}
                  onChange={(e) => setShowTransit(e.target.checked)}
                  className="w-3 h-3"
                />
                <label
                  htmlFor="transit"
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--color-text)' }}
                >
                  Transit
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div
            className="rounded-lg shadow-theme-lg p-2 flex items-center gap-2 min-w-80 border-theme"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <Search
              size={16}
              style={{ color: 'var(--color-text-secondary)' }}
            />
            <Input
              placeholder="Search for places in Nairobi..."
              bordered={false}
              className="flex-1"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
              }}
            />
            <Button type="primary" size="small">
              Search
            </Button>
          </div>
        </div>

        {/* Zoom Level Indicator */}
        <div
          className="absolute bottom-4 right-4 rounded px-2 py-1 shadow-theme-sm text-xs z-30 border-theme"
          style={{
            backgroundColor: 'var(--color-card-background)',
            color: 'var(--color-text)',
          }}
        >
          Zoom: {zoom}
        </div>

        {/* Scale */}
        <div className="absolute bottom-4 left-4 z-30">
          <div
            className="rounded px-2 py-1 shadow-theme-sm text-xs border-theme"
            style={{ backgroundColor: 'var(--color-card-background)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-16 h-1"
                style={{
                  backgroundColor: isDark
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-text)',
                }}
              ></div>
              <span style={{ color: 'var(--color-text)' }}>1 km</span>
            </div>
          </div>
        </div>

        {/* Traffic overlay */}
        {showTraffic && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-32 h-1 bg-red-500 opacity-60"></div>
            <div className="absolute top-2/3 left-1/2 w-24 h-1 bg-yellow-500 opacity-60"></div>
            <div className="absolute top-1/2 left-3/4 w-16 h-1 bg-green-500 opacity-60"></div>
          </div>
        )}

        {/* Transit overlay */}
        {showTransit && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-blue-600 opacity-70 border-dashed border-t-2"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-purple-600 opacity-70 border-dashed border-l-2"></div>
          </div>
        )}
      </div>

      {/* Selected Location Info Panel */}
      <div
        className="absolute bottom-4 left-4 rounded-lg shadow-theme-lg p-4 max-w-xs z-30 border-theme"
        style={{ backgroundColor: 'var(--color-card-background)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-3 h-3 rounded-full mt-1 ${
              selectedLocation.type === 'primary' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          ></div>
          <div className="flex-1">
            <Text
              strong
              className="block"
              style={{ color: 'var(--color-text)' }}
            >
              {selectedLocation.name}
            </Text>
            <Text
              className="text-xs block mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {selectedLocation.address}
            </Text>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <PhoneOutlined className="text-green-600" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedLocation.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ClockCircleOutlined className="text-blue-600" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedLocation.hours}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="small"
                type="primary"
                icon={<Navigation size={12} />}
              >
                Directions
              </Button>
              <Button size="small" icon={<PhoneOutlined />}>
                Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen close button */}
      {isFullscreen && (
        <Button
          type="text"
          onClick={toggleFullscreen}
          className="absolute top-4 right-16 rounded-lg shadow-theme-lg z-40 border-theme"
          style={{
            backgroundColor: 'var(--color-card-background)',
            color: 'var(--color-text)',
          }}
          size="large"
        >
          ✕
        </Button>
      )}
    </div>
  );
};

const Contact = () => {
  const { theme } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Form values:', values);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined />,
      title: 'Our Location',
      content: 'Kimathi Street, Nairobi CBD, Kenya',
      color: 'var(--color-error)',
      description: 'Visit us in the heart of Nairobi',
    },
    {
      icon: <PhoneOutlined />,
      title: 'Phone Number',
      content: '+254 712 345 678',
      color: 'var(--color-success)',
      description: 'Call us during business hours',
    },
    {
      icon: <MailOutlined />,
      title: 'Email Address',
      content: 'info@careerrecommender.co.ke',
      color: 'var(--color-primary)',
      description: 'Send us your inquiries',
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Working Hours',
      content: 'Mon - Fri: 8:00 AM - 5:00 PM',
      color: 'var(--color-warning)',
      description: "We're here to help",
    },
  ];

  const faqItems = [
    {
      question: 'How does the career recommendation system work?',
      answer:
        'Our AI-powered system analyzes your KCSE results, academic strengths, and interests to match you with suitable career paths. We use advanced algorithms that consider subject requirements, performance patterns, and current job market trends.',
      icon: <QuestionCircleOutlined />,
      category: 'System',
    },
    {
      question: 'Is the service free to use?',
      answer:
        'Yes, our basic career recommendation service is completely free for all Kenyan students. We also offer premium features including personalized counseling sessions, detailed career reports, and one-on-one guidance.',
      icon: <CheckCircleOutlined />,
      category: 'Pricing',
    },
    {
      question: 'How accurate are the career recommendations?',
      answer:
        'Our recommendations achieve 85% accuracy based on academic performance, job market analysis, and career path requirements. We continuously update our algorithms with the latest industry data and graduate success stories.',
      icon: <StarOutlined />,
      category: 'Accuracy',
    },
    {
      question: 'Can I get personalized career counseling?',
      answer:
        'Our certified career counselors offer one-on-one sessions via video call, phone, or in-person meetings. Premium users get priority booking and extended session times.',
      icon: <TeamOutlined />,
      category: 'Counseling',
    },
    {
      question: 'Is my data secure and private?',
      answer:
        'Yes, we use bank-level encryption and comply with international data protection standards. Your academic records and personal information are never shared with third parties without your explicit consent.',
      icon: <SafetyCertificateOutlined />,
      category: 'Security',
    },
    {
      question: 'Do you cover all Kenyan universities and colleges?',
      answer:
        'We have partnerships with over 200 institutions across Kenya, including all public universities, major private universities, and technical colleges. Our database is updated regularly with new programs and requirements.',
      icon: <GlobalOutlined />,
      category: 'Coverage',
    },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Kimani',
      role: 'Lead Career Counselor',
      avatar: '/Sarah.png?height=64&width=64&text=SK',
      rating: 5,
      specialization: 'STEM Careers',
    },
    {
      name: 'James Mwangi',
      role: 'Education Consultant',
      avatar: '/david.png?height=64&width=64&text=JM',
      rating: 5,
      specialization: 'Business & Finance',
    },
    {
      name: 'Grace Achieng',
      role: 'Student Success Manager',
      avatar: '/amina.png?height=64&width=64&text=GA',
      rating: 5,
      specialization: 'Arts & Humanities',
    },
  ];

  return (
    <div
      className="max-w-7xl mx-auto py-12 px-4 min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* Enhanced Hero Section */}
      <div className="text-center mb-16 relative">
        <div
          className="absolute inset-0 rounded-3xl -z-10"
          style={{
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-card-background) 50%, var(--color-background-secondary) 100%)'
                : 'linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 50%, #e6f3ff 100%)',
          }}
        />
        <div className="py-16 px-8">
          <Badge.Ribbon text="24/7 Support" color="blue" className="mb-4">
            <div />
          </Badge.Ribbon>
          <Title
            level={1}
            className="text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Contact Us
          </Title>
          <Paragraph
            className="text-xl max-w-4xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Have questions or need guidance? Our expert team is here to help you
            navigate your career journey. Get in touch with us through any of
            the channels below.
          </Paragraph>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              type="primary"
              size="large"
              icon={<MessageOutlined />}
              className="px-8"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
                border: 'none',
              }}
            >
              Start Chat
            </Button>
            <Button size="large" icon={<PhoneOutlined />} className="px-8">
              Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Information Cards */}
      <Row gutter={[24, 24]} className="mb-16">
        {contactInfo.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full text-center transition-all duration-300 hover:shadow-theme-lg hover:-translate-y-2 group">
              <div className="relative">
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <Title level={4} className="mb-2">
                  {item.title}
                </Title>
                <Text strong className="block mb-2 text-lg">
                  {item.content}
                </Text>
                <Text style={{ color: 'var(--color-text-secondary)' }}>
                  {item.description}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Contact Form and Enhanced Map Section */}
      <Row gutter={[32, 32]} className="mb-20">
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <SendOutlined style={{ color: 'var(--color-primary)' }} />
                <Title level={3} className="mb-0">
                  Send Us a Message
                </Title>
              </div>
            }
            className="h-full shadow-theme-lg"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Your Name"
                rules={[
                  { required: true, message: 'Please enter your name' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                ]}
              >
                <Input
                  placeholder="Enter your full name"
                  prefix={
                    <UserOutlined
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                  }
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address',
                  },
                ]}
              >
                <Input
                  placeholder="Enter your email address"
                  prefix={
                    <MailOutlined
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                  }
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input
                  placeholder="Enter message subject"
                  prefix={
                    <MessageOutlined
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                  }
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[
                  { required: true, message: 'Please enter your message' },
                  {
                    min: 10,
                    message: 'Message must be at least 10 characters',
                  },
                ]}
              >
                <TextArea
                  placeholder="Enter your message"
                  rows={6}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  icon={<SendOutlined />}
                  className="h-12 text-lg font-medium"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
                    border: 'none',
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <div className="h-full">
            <div className="flex items-center gap-2 mb-6">
              <EnvironmentOutlined
                className="text-xl"
                style={{ color: 'var(--color-primary)' }}
              />
              <Title level={3} className="mb-0">
                Our Location
              </Title>
            </div>
            <InteractiveMap />
            <div
              className="mt-4 p-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <Text className="block mb-2">
                <strong>Visit our office</strong> in Nairobi's central business
                district, conveniently located near major transportation hubs
                and easily accessible by public transport.
              </Text>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge color="red" />
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Main Office
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge color="blue" />
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Branch Offices
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge color="yellow" />
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Nairobi CBD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Enhanced Team Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Title level={2} className="mb-4">
            Meet Our Expert Team
          </Title>
          <Paragraph
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Our certified career counselors and education experts are here to
            guide you through every step of your academic and career journey.
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card className="text-center h-full hover:shadow-theme-lg transition-all duration-300">
                <Avatar size={80} src={member.avatar} className="mb-4" />
                <Title level={4} className="mb-2">
                  {member.name}
                </Title>
                <Text
                  className="block mb-2 font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {member.role}
                </Text>
                <Rate disabled defaultValue={member.rating} className="mb-3" />
                <Tag color="blue" className="mb-4">
                  {member.specialization}
                </Tag>
                <Button type="primary" size="small" block>
                  Book Consultation
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Enhanced FAQ Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Title level={2} className="mb-4">
            Frequently Asked Questions
          </Title>
          <Paragraph
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Find answers to common questions about our services, processes, and
            how we can help you.
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {faqItems.map((item, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card className="h-full hover:shadow-theme-lg transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        theme === 'dark'
                          ? 'rgba(0, 128, 255, 0.2)'
                          : 'rgba(0, 128, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'var(--color-primary)' }}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Title level={4} className="mb-0">
                        {item.question}
                      </Title>
                      <Tag color="blue" size="small">
                        {item.category}
                      </Tag>
                    </div>
                  </div>
                </div>
                <Paragraph
                  className="leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.answer}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Enhanced Social Media Section */}
      <div className="text-center mb-20">
        <Title level={3} className="mb-6">
          Connect With Us
        </Title>
        <Paragraph
          className="mb-8 text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Follow us on social media for the latest updates, career tips, success
          stories, and more.
        </Paragraph>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button
              icon={<FacebookOutlined />}
              size="large"
              className="bg-blue-600 text-white border-0 hover:bg-blue-700 px-6"
            >
              Facebook
            </Button>
          </Col>
          <Col>
            <Button
              icon={<TwitterOutlined />}
              size="large"
              className="bg-blue-400 text-white border-0 hover:bg-blue-500 px-6"
            >
              Twitter
            </Button>
          </Col>
          <Col>
            <Button
              icon={<InstagramOutlined />}
              size="large"
              className="bg-pink-500 text-white border-0 hover:bg-pink-600 px-6"
            >
              Instagram
            </Button>
          </Col>
          <Col>
            <Button
              icon={<LinkedinOutlined />}
              size="large"
              className="bg-blue-700 text-white border-0 hover:bg-blue-800 px-6"
            >
              LinkedIn
            </Button>
          </Col>
        </Row>
      </div>

      {/* Enhanced CTA Section */}
      <Card
        className="text-center border-0 rounded-3xl overflow-hidden relative"
        style={{
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-card-background) 50%, var(--color-background-secondary) 100%)'
              : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, #ff6b9d 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <TeamOutlined className="text-4xl text-white" />
            </div>
          </div>
          <Title level={2} className="text-white mb-4">
            Need Personalized Assistance?
          </Title>
          <Paragraph className="text-white/90 text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Our certified career counselors are available for one-on-one
            sessions to provide personalized guidance, detailed career
            assessments, and strategic planning for your academic journey.
          </Paragraph>
          <Space size="large" wrap className="justify-center">
            <Button
              size="large"
              icon={<PhoneOutlined />}
              className="bg-white border-0 hover:bg-gray-100 px-8 py-6 h-auto text-lg font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              Book a Consultation
            </Button>
            <Button
              size="large"
              icon={<MessageOutlined />}
              className="border-white text-white hover:bg-white px-8 py-6 h-auto text-lg font-medium"
              style={{
                borderColor: 'white',
                '&:hover': {
                  color: 'var(--color-primary)',
                },
              }}
            >
              Live Chat Support
            </Button>
          </Space>

          {/* Success Timeline */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Title level={4} className="text-white mb-6">
              Our Process
            </Title>
            <Timeline
              mode="horizontal"
              className="custom-timeline"
              items={[
                {
                  dot: <div className="w-4 h-4 bg-white rounded-full" />,
                  children: (
                    <div className="text-center">
                      <Text className="text-white font-medium block">
                        1. Assessment
                      </Text>
                      <Text className="text-white/80 text-sm">
                        Analyze your results
                      </Text>
                    </div>
                  ),
                },
                {
                  dot: <div className="w-4 h-4 bg-white rounded-full" />,
                  children: (
                    <div className="text-center">
                      <Text className="text-white font-medium block">
                        2. Matching
                      </Text>
                      <Text className="text-white/80 text-sm">
                        Find suitable careers
                      </Text>
                    </div>
                  ),
                },
                {
                  dot: <div className="w-4 h-4 bg-white rounded-full" />,
                  children: (
                    <div className="text-center">
                      <Text className="text-white font-medium block">
                        3. Guidance
                      </Text>
                      <Text className="text-white/80 text-sm">
                        Personalized advice
                      </Text>
                    </div>
                  ),
                },
                {
                  dot: <div className="w-4 h-4 bg-white rounded-full" />,
                  children: (
                    <div className="text-center">
                      <Text className="text-white font-medium block">
                        4. Success
                      </Text>
                      <Text className="text-white/80 text-sm">
                        Achieve your goals
                      </Text>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
