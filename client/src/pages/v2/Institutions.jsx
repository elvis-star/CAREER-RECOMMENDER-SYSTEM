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
} from 'antd';
import {
  SearchOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BookOutlined,
  GlobalOutlined,
  StarOutlined,
  StarFilled,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitutions } from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Institutions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

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
  };

  // Mock data for institution types
  const institutionTypes = [
    'University',
    'College',
    'Technical Institute',
    'Vocational School',
    'Medical School',
    'Law School',
    'Business School',
  ];

  // Mock data for locations
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

  // Mock data for featured institutions (in a real app, this would come from the API)
  const featuredInstitutions = [
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

  // Render institution card
  const renderInstitutionCard = (institution) => (
    <Col xs={24} sm={12} lg={8} key={institution._id}>
      <Card hoverable className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <Avatar
              src={institution.logo}
              size={64}
              icon={<BankOutlined />}
              className="mr-4"
            />
            <div>
              <Title level={4} className="mb-0">
                {institution.name}
              </Title>
              <Space>
                <Tag color="blue">{institution.type}</Tag>
                {institution.featured && (
                  <Badge status="success" text="Featured" />
                )}
              </Space>
            </div>
          </div>

          <Space className="mb-2">
            <EnvironmentOutlined />
            <Text>
              {institution.location?.city}, {institution.location?.county}
            </Text>
          </Space>

          <Paragraph
            className="text-gray-500 mb-4 flex-grow"
            ellipsis={{ rows: 3 }}
          >
            {institution.description ||
              'A leading educational institution offering quality programs.'}
          </Paragraph>

          <div className="mb-3">
            <Text strong>Programs:</Text>
            <div className="flex flex-wrap gap-1 mt-1">
              {institution.programs?.slice(0, 3).map((program, index) => (
                <Tag key={index}>{program.name}</Tag>
              ))}
              {institution.programs?.length > 3 && (
                <Tag>+{institution.programs.length - 3} more</Tag>
              )}
            </div>
          </div>

          {institution.rating && (
            <div className="mb-3">
              <Space>
                <Text strong>Rating:</Text>
                <Space>
                  {[...Array(Math.floor(institution.rating))].map((_, i) => (
                    <StarFilled key={i} className="text-yellow-500" />
                  ))}
                  {institution.rating % 1 !== 0 && (
                    <StarOutlined className="text-yellow-500" />
                  )}
                  <Text>{institution.rating.toFixed(1)}</Text>
                </Space>
              </Space>
            </div>
          )}

          <Divider className="my-3" />

          <div className="flex justify-between">
            <Link to={`/institutions/${institution._id}`}>
              <Button type="primary">View Details</Button>
            </Link>
            <Space>
              {institution.contact?.phone && (
                <Tooltip title={institution.contact.phone}>
                  <Button icon={<PhoneOutlined />} />
                </Tooltip>
              )}
              {institution.contact?.email && (
                <Tooltip title={institution.contact.email}>
                  <Button icon={<MailOutlined />} />
                </Tooltip>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Resources</Breadcrumb.Item>
        <Breadcrumb.Item>Institutions</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-12">
        <Title>Universities & Colleges</Title>
        <Paragraph className="text-lg text-gray-500 max-w-3xl mx-auto">
          Explore universities, colleges, and other educational institutions
          offering programs in your desired field. Find the perfect institution
          to pursue your career goals.
        </Paragraph>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Search
              placeholder="Search institutions..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              placeholder="Institution Type"
              style={{ minWidth: 150 }}
              onChange={handleTypeChange}
              value={type || undefined}
              allowClear
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
            >
              {locations.map((location) => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Sort By"
              style={{ minWidth: 120 }}
              onChange={handleSortChange}
              value={sortBy}
              defaultValue="name"
            >
              <Option value="name">Name (A-Z)</Option>
              <Option value="-name">Name (Z-A)</Option>
              <Option value="-views">Most Viewed</Option>
              <Option value="-rating">Highest Rated</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card hoverable className="text-center h-full">
              <GlobalOutlined className="text-3xl text-blue-500 mb-2" />
              <Title level={4}>Top Universities</Title>
              <Text type="secondary">Explore Kenya's leading universities</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable className="text-center h-full">
              <BookOutlined className="text-3xl text-green-500 mb-2" />
              <Title level={4}>Program Search</Title>
              <Text type="secondary">
                Find institutions by specific programs
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable className="text-center h-full">
              <TeamOutlined className="text-3xl text-purple-500 mb-2" />
              <Title level={4}>Virtual Tours</Title>
              <Text type="secondary">Take virtual tours of campuses</Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Featured Institutions */}
      <div className="mb-8">
        <Title level={2} className="mb-6">
          <Space>
            <StarFilled className="text-yellow-500" />
            <span>Featured Institutions</span>
          </Space>
        </Title>
        <Row gutter={[16, 16]}>
          {featuredInstitutions.map(renderInstitutionCard)}
        </Row>
      </div>

      {/* All Institutions */}
      <div className="mb-8">
        <Divider>
          <Space>
            <BankOutlined />
            <span>All Institutions</span>
          </Space>
        </Divider>

        <Tabs defaultActiveKey="all">
          <TabPane tab="All Institutions" key="all" />
          <TabPane tab="Universities" key="university" />
          <TabPane tab="Colleges" key="college" />
          <TabPane tab="Technical Institutes" key="technical" />
          <TabPane tab="Vocational Schools" key="vocational" />
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Alert
            type="error"
            message="Error loading institutions"
            description="There was a problem fetching the institution data. Please try again later."
            className="mb-4"
          />
        ) : institutionsData?.data?.length === 0 ? (
          <Empty description="No institutions found matching your criteria" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {/* In a real app, this would use institutionsData?.data instead of featuredInstitutions */}
              {featuredInstitutions.map(renderInstitutionCard)}
            </Row>

            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={institutionsData?.total || 0}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} institutions`}
              />
            </div>
          </>
        )}
      </div>

      {/* Institution Categories */}
      <div className="mb-12">
        <Title level={2} className="mb-6 text-center">
          Institution Types
        </Title>
        <Row gutter={[16, 16]}>
          {institutionTypes.slice(0, 4).map((type) => (
            <Col xs={24} sm={12} md={6} key={type}>
              <Card
                hoverable
                className="text-center"
                onClick={() => {
                  setType(type);
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <BankOutlined className="text-3xl text-blue-500 mb-2" />
                <Title level={4}>{type}</Title>
                <Paragraph className="text-gray-500">
                  Explore {type.toLowerCase()} options
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
        <Title level={3}>Find the Right Institution for Your Career</Title>
        <Paragraph className="mb-4">
          Take our career assessment to get personalized recommendations for
          institutions that offer programs aligned with your career goals.
        </Paragraph>
        <Space size="large">
          <Link to="/input-results">
            <Button type="primary" size="large">
              Get Career Recommendations
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large">Contact an Advisor</Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default Institutions;
