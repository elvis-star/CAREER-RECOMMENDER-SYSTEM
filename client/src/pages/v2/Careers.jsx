'use client';

import { useState, useEffect } from 'react';
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
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  BookOutlined,
  RiseOutlined,
  BarChartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchCareers, saveCareer, unsaveCareer } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserProfile } from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const Careers = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [marketDemand, setMarketDemand] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [savedCareers, setSavedCareers] = useState([]);

  // Fetch careers with filters
  const {
    data: careersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'careers',
      searchTerm,
      category,
      marketDemand,
      sortBy,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      fetchCareers({
        search: searchTerm,
        category,
        marketDemand,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
      }),
  });

  // Fetch user's saved careers if authenticated
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => (isAuthenticated ? fetchUserProfile() : null),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (userProfile && userProfile.savedCareers) {
      setSavedCareers(
        userProfile.savedCareers.map((career) => career._id || career)
      );
    }
  }, [userProfile]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleDemandChange = (value) => {
    setMarketDemand(value);
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

  // Handle save/unsave career
  const handleSaveToggle = async (careerId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      if (savedCareers.includes(careerId)) {
        await unsaveCareer(careerId);
        setSavedCareers(savedCareers.filter((id) => id !== careerId));
      } else {
        await saveCareer(careerId);
        setSavedCareers([...savedCareers, careerId]);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  // Mock categories for filter
  const categories = [
    'Technology',
    'Engineering',
    'Healthcare',
    'Business',
    'Education',
    'Arts',
    'Science',
    'Law',
    'Agriculture',
    'Hospitality',
  ];

  // Render career card
  const renderCareerCard = (career) => {
    const isSaved = savedCareers.includes(career._id);

    return (
      <Col xs={24} sm={12} lg={8} key={career._id}>
        <Card
          hoverable
          className="h-full"
          actions={[
            <Tooltip title={`${career.views} views`} key="views">
              <Space>
                <EyeOutlined />
                <span>{career.views}</span>
              </Space>
            </Tooltip>,
            isAuthenticated && (
              <Tooltip
                title={isSaved ? 'Remove from saved' : 'Save career'}
                key="save"
              >
                <Button
                  type="text"
                  icon={
                    isSaved ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveToggle(career._id);
                  }}
                />
              </Tooltip>
            ),
            <Link to={`/career/${career._id}`} key="details">
              Details
            </Link>,
          ]}
        >
          <div className="flex flex-col h-full">
            <div className="mb-2 flex justify-between items-start">
              <Tag color="blue">{career.category}</Tag>
              {career.marketDemand && (
                <Tag
                  color={
                    career.marketDemand === 'Very High'
                      ? 'red'
                      : career.marketDemand === 'High'
                      ? 'orange'
                      : career.marketDemand === 'Medium'
                      ? 'green'
                      : 'default'
                  }
                >
                  {career.marketDemand}
                </Tag>
              )}
            </div>
            <Title level={4} className="mb-2">
              {career.title}
            </Title>
            <Paragraph
              className="text-gray-500 mb-4 flex-grow"
              ellipsis={{ rows: 3 }}
            >
              {career.description ||
                'Explore this exciting career path and discover opportunities in this field.'}
            </Paragraph>
            <div className="mt-auto">
              {career.keySubjects && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {career.keySubjects.slice(0, 3).map((subject, index) => (
                    <Tag key={index}>{subject}</Tag>
                  ))}
                  {career.keySubjects.length > 3 && (
                    <Tag>+{career.keySubjects.length - 3} more</Tag>
                  )}
                </div>
              )}
              {career.minimumMeanGrade && (
                <div className="mt-2">
                  <Text type="secondary">Minimum Grade: </Text>
                  <Tag color="purple">{career.minimumMeanGrade}</Tag>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Title>Explore Careers</Title>
        <Paragraph className="text-lg text-gray-500 max-w-3xl mx-auto">
          Discover various career paths, their requirements, and opportunities.
          Find the perfect career that matches your interests, skills, and
          academic performance.
        </Paragraph>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Search
              placeholder="Search careers..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              placeholder="Category"
              style={{ minWidth: 120 }}
              onChange={handleCategoryChange}
              value={category || undefined}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Market Demand"
              style={{ minWidth: 140 }}
              onChange={handleDemandChange}
              value={marketDemand || undefined}
              allowClear
            >
              <Option value="Very High">Very High</Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
            <Select
              placeholder="Sort By"
              style={{ minWidth: 120 }}
              onChange={handleSortChange}
              value={sortBy}
              defaultValue="title"
            >
              <Option value="title">Name (A-Z)</Option>
              <Option value="-title">Name (Z-A)</Option>
              <Option value="-views">Most Viewed</Option>
              <Option value="-saves">Most Saved</Option>
              <Option value="minimumMeanGrade">Min. Grade (Low-High)</Option>
              <Option value="-minimumMeanGrade">Min. Grade (High-Low)</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link to="/trends">
              <Card hoverable className="text-center h-full">
                <RiseOutlined className="text-3xl text-blue-500 mb-2" />
                <Title level={4}>Career Trends</Title>
                <Text type="secondary">
                  Explore emerging and high-demand careers
                </Text>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link to="/guides">
              <Card hoverable className="text-center h-full">
                <BookOutlined className="text-3xl text-green-500 mb-2" />
                <Title level={4}>Career Guides</Title>
                <Text type="secondary">
                  In-depth guides to help you make informed decisions
                </Text>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link to="/institutions">
              <Card hoverable className="text-center h-full">
                <BarChartOutlined className="text-3xl text-purple-500 mb-2" />
                <Title level={4}>Institutions</Title>
                <Text type="secondary">
                  Find universities and colleges offering your desired program
                </Text>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Career Listings */}
      <div className="mb-8">
        <Divider>
          <Space>
            <FilterOutlined />
            <span>Career Listings</span>
          </Space>
        </Divider>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Alert
            type="error"
            message="Error loading careers"
            description="There was a problem fetching the career data. Please try again later."
            className="mb-4"
          />
        ) : careersData?.data?.length === 0 ? (
          <Empty description="No careers found matching your criteria" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {careersData?.data?.map((career) => renderCareerCard(career))}
            </Row>

            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={careersData?.total || 0}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} careers`}
              />
            </div>
          </>
        )}
      </div>

      {/* Career Categories Section */}
      <div className="mb-12">
        <Title level={2} className="mb-6 text-center">
          Career Categories
        </Title>
        <Row gutter={[16, 16]}>
          {categories.slice(0, 8).map((category) => (
            <Col xs={24} sm={12} md={6} key={category}>
              <Card
                hoverable
                className="text-center"
                onClick={() => {
                  setCategory(category);
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Title level={4}>{category}</Title>
                <Paragraph className="text-gray-500">
                  Explore careers in the {category.toLowerCase()} sector
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Need Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
        <Title level={3}>Not Sure Where to Start?</Title>
        <Paragraph className="mb-4">
          Take our career assessment to get personalized recommendations based
          on your academic performance, interests, and skills.
        </Paragraph>
        <Link to="/input-results">
          <Button type="primary" size="large">
            Get Career Recommendations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Careers;
