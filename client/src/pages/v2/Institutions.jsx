'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Button,
  Pagination,
  Empty,
  Spin,
  Divider,
  Space,
  Alert,
  Tooltip,
  Tabs,
  Avatar,
  Breadcrumb,
  Badge,
  Rate,
  ConfigProvider,
} from 'antd';
import {
  SearchOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BookOutlined,
  GlobalOutlined,
  StarOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  FilterOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitutions } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Institutions = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [activeTab, setActiveTab] = useState('all');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Fetch institutions with filters
  const {
    data: institutionsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'institutions',
      searchTerm,
      type,
      location,
      sortBy,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      fetchInstitutions({
        search: searchTerm,
        type,
        'location.city': location,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
      }),
  });

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleTypeChange = (value) => {
    setType(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setLocation(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key !== 'all') {
      setType(key);
    } else {
      setType('');
    }
    setCurrentPage(1);
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setType('');
    setLocation('');
    setSortBy('name');
    setCurrentPage(1);
    setActiveTab('all');
  };

  // Institution types
  const institutionTypes = [
    'University',
    'College',
    'Technical Institute',
    'Vocational School',
    'Medical School',
    'Law School',
    'Business School',
  ];

  // Locations
  const locations = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Machakos',
    'Kitale',
    'Garissa',
  ];

  // Fallback data for when API returns empty
  const fallbackInstitutions = [
    {
      _id: '1',
      name: 'University of Nairobi',
      type: 'University',
      logo: '/placeholder.svg?height=80&width=80',
      location: { city: 'Nairobi', county: 'Nairobi' },
      description:
        'The leading university in Kenya offering a wide range of programs across various disciplines.',
      rating: 4.5,
      programs: [
        { name: 'Computer Science', level: 'Undergraduate' },
        { name: 'Medicine', level: 'Undergraduate' },
        { name: 'Business Administration', level: 'Undergraduate' },
      ],
      contact: { email: 'info@uon.ac.ke', phone: '+254 20 123 4567' },
      featured: true,
    },
    {
      _id: '2',
      name: 'Kenyatta University',
      type: 'University',
      logo: '/placeholder.svg?height=80&width=80',
      location: { city: 'Nairobi', county: 'Nairobi' },
      description:
        'A leading institution of higher learning committed to quality teaching, research, and service to humanity.',
      rating: 4.3,
      programs: [
        { name: 'Education', level: 'Undergraduate' },
        { name: 'Engineering', level: 'Undergraduate' },
        { name: 'Environmental Science', level: 'Undergraduate' },
      ],
      contact: { email: 'info@ku.ac.ke', phone: '+254 20 870 3000' },
      featured: true,
    },
    {
      _id: '3',
      name: 'Strathmore University',
      type: 'University',
      logo: '/placeholder.svg?height=80&width=80',
      location: { city: 'Nairobi', county: 'Nairobi' },
      description:
        'A leading non-profit private university in Kenya with a reputation for excellence in teaching and research.',
      rating: 4.7,
      programs: [
        { name: 'Commerce', level: 'Undergraduate' },
        { name: 'Information Technology', level: 'Undergraduate' },
        { name: 'Law', level: 'Undergraduate' },
      ],
      contact: {
        email: 'admissions@strathmore.edu',
        phone: '+254 703 034 000',
      },
      featured: true,
    },
  ];

  // Get featured institutions from API data or fallback
  const getFeaturedInstitutions = () => {
    if (institutionsData?.data && institutionsData.data.length > 0) {
      // Filter featured institutions from API data
      return institutionsData.data.filter((inst) => inst.featured).slice(0, 3);
    }
    // Use fallback data if no API data
    return fallbackInstitutions;
  };

  // Get all institutions from API data or fallback
  const getAllInstitutions = () => {
    if (institutionsData?.data && institutionsData.data.length > 0) {
      return institutionsData.data;
    }
    // Only use fallback if we're not loading and there's no error
    if (
      !isLoading &&
      !isError &&
      (!institutionsData || institutionsData.data?.length === 0)
    ) {
      return fallbackInstitutions;
    }
    return [];
  };

  // Render institution card
  const renderInstitutionCard = (institution) => (
    <Col xs={24} sm={12} lg={8} key={institution._id} className="mb-4">
      <Card
        hoverable
        className="h-full transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          <Avatar
            src={institution.logo}
            size={64}
            icon={<BankOutlined />}
            className="mr-4"
          />
          <div>
            <Title level={4} className="mb-1 dark:text-gray-100">
              {institution.name}
            </Title>
            <Space>
              <Tag color="blue">{institution.type}</Tag>
              {institution.featured && (
                <Badge
                  status="success"
                  text={<span className="dark:text-gray-300">Featured</span>}
                />
              )}
            </Space>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3 text-sm dark:text-gray-400">
            <EnvironmentOutlined className="mr-1 text-blue-500" />
            <span>
              {institution.location?.city}, {institution.location?.county}
            </span>
          </div>

          <Paragraph ellipsis={{ rows: 3 }} className="mb-4 dark:text-gray-300">
            {institution.description ||
              'A leading educational institution offering quality programs.'}
          </Paragraph>

          <div className="mb-3">
            <Text strong className="block mb-1 dark:text-gray-200">
              Programs:
            </Text>
            <div className="flex flex-wrap gap-1">
              {institution.programs?.slice(0, 3).map((program, index) => (
                <Tag
                  key={index}
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                >
                  {program.name}
                </Tag>
              ))}
              {institution.programs?.length > 3 && (
                <Tag className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                  +{institution.programs.length - 3} more
                </Tag>
              )}
            </div>
          </div>

          {institution.rating && (
            <div className="flex items-center mb-3">
              <Text strong className="mr-2 dark:text-gray-200">
                Rating:
              </Text>
              <Rate
                disabled
                allowHalf
                defaultValue={institution.rating}
                className="text-sm"
              />
              <Text className="ml-1 dark:text-gray-300">
                {institution.rating.toFixed(1)}
              </Text>
            </div>
          )}

          <Divider className="my-3 dark:border-gray-700" />

          <div className="flex justify-between items-center">
            <Link to={`/institutions/${institution._id}`}>
              <Button type="primary" icon={<EyeOutlined />}>
                View Details
              </Button>
            </Link>
            <Space>
              {institution.contact?.phone && (
                <Tooltip title={institution.contact.phone}>
                  <Button
                    icon={<PhoneOutlined />}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  />
                </Tooltip>
              )}
              {institution.contact?.email && (
                <Tooltip title={institution.contact.email}>
                  <Button
                    icon={<MailOutlined />}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? ConfigProvider.darkAlgorithm
          : ConfigProvider.defaultAlgorithm,
      }}
    >
      <div className="max-w-7xl mx-auto transition-colors duration-300">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="dark:text-gray-400">
            Resources
          </Breadcrumb.Item>
          <Breadcrumb.Item className="dark:text-gray-300">
            Institutions
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="text-center mb-12">
          <Title className="dark:text-white">Universities & Colleges</Title>
          <Paragraph className="max-w-3xl mx-auto dark:text-gray-300">
            Explore universities, colleges, and other educational institutions
            offering programs in your desired field. Find the perfect
            institution to pursue your career goals.
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Search
                placeholder="Search institutions..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700"
              />
            </div>

            <div className="md:hidden">
              <Button
                icon={<FilterOutlined />}
                onClick={toggleFilters}
                type={filtersVisible ? 'primary' : 'default'}
                className="w-full"
              >
                Filters
              </Button>
            </div>

            <div
              className={`flex flex-wrap gap-3 ${
                filtersVisible ? 'block' : 'hidden md:flex'
              }`}
            >
              <Select
                placeholder="Institution Type"
                style={{ minWidth: 150 }}
                onChange={handleTypeChange}
                value={type || undefined}
                allowClear
                className="dark:bg-gray-700"
              >
                {institutionTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Location"
                style={{ minWidth: 150 }}
                onChange={handleLocationChange}
                value={location || undefined}
                allowClear
                className="dark:bg-gray-700"
              >
                {locations.map((location) => (
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Sort By"
                style={{ minWidth: 150 }}
                onChange={handleSortChange}
                value={sortBy}
                defaultValue="name"
                className="dark:bg-gray-700"
              >
                <Option value="name">Name (A-Z)</Option>
                <Option value="-name">Name (Z-A)</Option>
                <Option value="-views">Most Viewed</Option>
                <Option value="-rating">Highest Rated</Option>
              </Select>

              <Button
                onClick={clearFilters}
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card
              hoverable
              className="text-center h-full transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <GlobalOutlined className="text-4xl text-blue-500 mb-3" />
              <Title level={4} className="dark:text-gray-100">
                Top Universities
              </Title>
              <Text className="dark:text-gray-400">
                Explore Kenya's leading universities
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              className="text-center h-full transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <BookOutlined className="text-4xl text-green-500 mb-3" />
              <Title level={4} className="dark:text-gray-100">
                Program Search
              </Title>
              <Text className="dark:text-gray-400">
                Find institutions by specific programs
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              className="text-center h-full transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <TeamOutlined className="text-4xl text-purple-500 mb-3" />
              <Title level={4} className="dark:text-gray-100">
                Virtual Tours
              </Title>
              <Text className="dark:text-gray-400">
                Take virtual tours of campuses
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Featured Institutions */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <StarOutlined className="text-xl text-yellow-500 mr-2" />
            <Title level={2} className="mb-0 dark:text-white">
              Featured Institutions
            </Title>
          </div>
          <Row gutter={[16, 16]}>
            {getFeaturedInstitutions().map(renderInstitutionCard)}
          </Row>
        </div>

        {/* All Institutions */}
        <div className="mb-12">
          <Divider className="dark:border-gray-700">
            <Space>
              <BankOutlined className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                All Institutions
              </span>
            </Space>
          </Divider>

          <Tabs
            defaultActiveKey="all"
            activeKey={activeTab}
            onChange={handleTabChange}
            className="mb-6 institution-tabs"
          >
            <TabPane tab="All Institutions" key="all" />
            <TabPane tab="Universities" key="University" />
            <TabPane tab="Colleges" key="College" />
            <TabPane tab="Technical Institutes" key="Technical Institute" />
            <TabPane tab="Vocational Schools" key="Vocational School" />
          </Tabs>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spin size="large" />
              <Text className="mt-4 dark:text-gray-300">
                Loading institutions...
              </Text>
            </div>
          ) : isError ? (
            <Alert
              type="error"
              message="Error loading institutions"
              description="There was a problem fetching the institution data. Please try again later."
              className="mb-4"
            />
          ) : getAllInstitutions().length === 0 ? (
            <Empty
              description={
                <Text className="dark:text-gray-300">
                  No institutions found matching your criteria
                </Text>
              }
              className="py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[16, 16]} className="mb-6">
                {getAllInstitutions().map(renderInstitutionCard)}
              </Row>

              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={institutionsData?.total || 0}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `Total ${total} institutions`}
                  className="dark:text-gray-300"
                />
              </div>
            </>
          )}
        </div>

        {/* Institution Categories */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-6 dark:text-white">
            Institution Types
          </Title>
          <Row gutter={[16, 16]}>
            {institutionTypes.slice(0, 4).map((type) => (
              <Col xs={24} sm={12} md={6} key={type}>
                <Card
                  hoverable
                  className="text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => {
                    setType(type);
                    setCurrentPage(1);
                    setActiveTab(type);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <BankOutlined className="text-4xl text-blue-500 mb-3" />
                  <Title level={4} className="dark:text-gray-100">
                    {type}
                  </Title>
                  <Paragraph className="dark:text-gray-400 mb-0">
                    Explore {type.toLowerCase()} options
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg p-8 text-center bg-blue-50 dark:bg-blue-900/20">
          <Title level={3} className="dark:text-white">
            Find the Right Institution for Your Career
          </Title>
          <Paragraph className="max-w-2xl mx-auto mb-6 dark:text-gray-300">
            Take our career assessment to get personalized recommendations for
            institutions that offer programs aligned with your career goals.
          </Paragraph>
          <Space size="large" className="flex flex-wrap justify-center gap-4">
            <Link to="/input-results">
              <Button type="primary" size="large">
                Get Career Recommendations
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="large"
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Contact an Advisor
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Institutions;
