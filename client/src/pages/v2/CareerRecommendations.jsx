'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Progress,
  Space,
  Badge,
  Empty,
  Spin,
  Tooltip,
  Divider,
  message,
} from 'antd';
import {
  DownloadOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  BookOutlined,
  BookFilled,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRecommendationsForUser } from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const CareerRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for recommendations
  const [recommendations, setRecommendations] = useState(null);
  const [recommendationsArray, setRecommendationsArray] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('match');

  // Fixed React Query v5 syntax
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => fetchRecommendationsForUser(),
    enabled: true, // Always fetch data when component mounts
    onSuccess: (data) => {
      console.log('Fetched recommendations:', data);
      // Only set recommendations from API if we don't have data from location state
      if (!recommendations) {
        setRecommendations(data);
      }
    },
    onError: (err) => {
      console.error('Error fetching recommendations:', err);
    },
  });

  // Process recommendations data to handle different formats
  const processRecommendationsData = (data) => {
    if (!data) return { recommendationsArray: [], studentInfo: null };

    try {
      // Check if data has a recommendations array property (API format)
      if (data.recommendations && Array.isArray(data.recommendations)) {
        return {
          recommendationsArray: data.recommendations,
          studentInfo: data.studentInfo || null,
        };
      }

      // Check if data itself is the recommendations array (location state format)
      if (Array.isArray(data)) {
        return {
          recommendationsArray: data,
          studentInfo: null,
        };
      }

      // Handle case where location state has a different structure
      if (data.recommendations && Array.isArray(data.recommendations)) {
        return {
          recommendationsArray: data.recommendations,
          studentInfo: data.studentInfo || null,
        };
      }

      console.warn('Unknown recommendations data format:', data);
      return { recommendationsArray: [], studentInfo: null };
    } catch (err) {
      console.error('Error processing recommendations data:', err);
      return { recommendationsArray: [], studentInfo: null };
    }
  };

  // Initialize recommendations from location state or API data
  useEffect(() => {
    try {
      if (location.state) {
        console.log('Location state:', location.state);

        // Handle different possible structures in location state
        if (location.state.recommendations) {
          console.log(
            'Using location state recommendations:',
            location.state.recommendations
          );
          setRecommendations(location.state.recommendations);

          // Process the data to extract the array and student info
          const { recommendationsArray: recArray, studentInfo: studInfo } =
            processRecommendationsData(location.state.recommendations);
          setRecommendationsArray(recArray);
          setStudentInfo(studInfo);
        } else if (location.state.career) {
          // Handle single career view if that's in the location state
          console.log(
            'Single career in location state:',
            location.state.career
          );
        } else {
          // Assume the entire location state is the recommendations object
          console.log('Using entire location state as recommendations');
          setRecommendations(location.state);

          // Process the data to extract the array and student info
          const { recommendationsArray: recArray, studentInfo: studInfo } =
            processRecommendationsData(location.state);
          setRecommendationsArray(recArray);
          setStudentInfo(studInfo);
        }
      } else if (data && !recommendations) {
        // If we have data from API and no recommendations set yet, use API data
        console.log('Using API data recommendations:', data);
        setRecommendations(data);

        // Process the data to extract the array and student info
        const { recommendationsArray: recArray, studentInfo: studInfo } =
          processRecommendationsData(data);
        setRecommendationsArray(recArray);
        setStudentInfo(studInfo);
      }
    } catch (err) {
      console.error('Error in recommendations initialization:', err);
    }
  }, [location.state, data, recommendations]);

  // Apply filters and sorting
  useEffect(() => {
    try {
      if (recommendationsArray.length === 0) {
        console.log('No recommendations to filter');
        setFilteredRecommendations([]);
        return;
      }

      let filtered = [...recommendationsArray];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (career) =>
            career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply category filter
      if (categoryFilter) {
        filtered = filtered.filter(
          (career) => career.category === categoryFilter
        );
      }

      // Apply sorting
      if (sortBy === 'match') {
        filtered.sort((a, b) => b.match - a.match);
      } else if (sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'demand') {
        const demandOrder = { 'Very High': 4, High: 3, Medium: 2, Low: 1 };
        filtered.sort(
          (a, b) => demandOrder[b.marketDemand] - demandOrder[a.marketDemand]
        );
      }

      setFilteredRecommendations(filtered);
    } catch (err) {
      console.error('Error filtering recommendations:', err);
      setFilteredRecommendations([]);
    }
  }, [recommendationsArray, searchQuery, categoryFilter, sortBy]);

  // Get unique categories for filter
  const getCategories = () => {
    try {
      if (recommendationsArray.length === 0) return [];

      const categories = [
        ...new Set(recommendationsArray.map((career) => career.category)),
      ];
      return categories.sort();
    } catch (err) {
      console.error('Error getting categories:', err);
      return [];
    }
  };

  // Handle saving a career
  const handleSaveCareer = (careerId) => {
    if (savedCareers.includes(careerId)) {
      setSavedCareers(savedCareers.filter((id) => id !== careerId));
      messageApi.info('Career removed from saved list');
    } else {
      setSavedCareers([...savedCareers, careerId]);
      messageApi.success('Career saved successfully');
    }
  };

  // Handle sharing recommendations
  const handleShareRecommendations = () => {
    messageApi.info(
      'This feature would allow sharing recommendations via email or social media.'
    );
  };

  // Handle downloading recommendations
  const handleDownloadRecommendations = () => {
    messageApi.info(
      'This feature would allow downloading recommendations as PDF.'
    );
  };

  // Handle printing recommendations
  const handlePrintRecommendations = () => {
    messageApi.info('This feature would allow printing recommendations.');
  };

  // Determine match color
  const getMatchColor = (match) => {
    if (match >= 90) return 'green';
    if (match >= 75) return 'blue';
    if (match >= 60) return 'orange';
    return 'red';
  };

  // Show loading state while we're fetching data and don't have any recommendations yet
  if (isLoading && !recommendations && recommendationsArray.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <Spin size="large" />
        <Text className="block mt-4">Loading recommendations...</Text>
      </div>
    );
  }

  // Show error state if there was an error fetching and we don't have any recommendations
  if (error && !recommendations && recommendationsArray.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card className="text-center py-10">
          <Title level={3} className="mb-4">
            Error Loading Recommendations
          </Title>
          <Paragraph className="mb-6">
            We encountered an error while loading your career recommendations.
            Please try again later.
          </Paragraph>
          <Button type="primary">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Show empty state if we have no recommendations from either source
  if (recommendationsArray.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card className="text-center py-10">
          <Title level={3} className="mb-4">
            No Recommendations Available
          </Title>
          <Paragraph className="mb-6">
            Please input your KCSE results to get personalized career
            recommendations.
          </Paragraph>
          <Button type="primary">
            <Link to="/input-results">Input KCSE Results</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {contextHolder}

      <div className="mb-8">
        <Title level={2}>Your Career Recommendations</Title>
        <Paragraph className="text-gray-500">
          Based on your KCSE results, here are the career paths that best match
          your academic strengths.
        </Paragraph>
      </div>

      {/* Student Summary */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card>
            <div>
              <Text type="secondary" className="block mb-2">
                Mean Grade
              </Text>
              <Space align="baseline">
                <Title level={3} className="mb-0">
                  {studentInfo?.meanGrade || 'N/A'}
                </Title>
                <Text>({studentInfo?.meanPoints || 0} points)</Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <div>
              <Text type="secondary" className="block mb-2">
                Academic Strengths
              </Text>
              <Space wrap>
                {Array.isArray(studentInfo?.strengths) ? (
                  studentInfo.strengths.map((strength, index) => (
                    <Tag color="green" key={index}>
                      {strength}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">No strengths data available</Text>
                )}
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <div>
              <Text type="secondary" className="block mb-2">
                Recommendations
              </Text>
              <Space align="baseline">
                <Title level={3} className="mb-0">
                  {recommendationsArray.length}
                </Title>
                <Text>career paths</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={16}>
          <Space wrap>
            <Search
              placeholder="Search careers..."
              allowClear
              onSearch={(value) => setSearchQuery(value)}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />

            <Select
              placeholder="All Categories"
              style={{ width: 180 }}
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              allowClear
            >
              {getCategories().map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Sort by"
              style={{ width: 150 }}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
            >
              <Option value="match">Sort by Match</Option>
              <Option value="title">Sort by Title</Option>
              <Option value="demand">Sort by Demand</Option>
            </Select>
          </Space>
        </Col>

        <Col xs={24} md={8} className="flex justify-end">
          <Space>
            <Tooltip title="Share recommendations">
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleShareRecommendations}
              />
            </Tooltip>
            <Tooltip title="Download as PDF">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadRecommendations}
              />
            </Tooltip>
            <Tooltip title="Print recommendations">
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrintRecommendations}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* Career Cards */}
      {filteredRecommendations.length === 0 ? (
        <Card className="text-center py-10">
          <Empty
            description="No careers found matching your criteria"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setSortBy('match');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredRecommendations.map((career) => (
            <Col xs={24} sm={12} lg={8} key={career.id}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button
                    key="save"
                    type="text"
                    icon={
                      savedCareers.includes(career.id) ? (
                        <BookFilled />
                      ) : (
                        <BookOutlined />
                      )
                    }
                    onClick={() => handleSaveCareer(career.id)}
                  />,
                  <Button
                    key="details"
                    type="primary"
                    onClick={() =>
                      navigate(`/career/${career.id}`, { state: { career } })
                    }
                  >
                    View Details
                  </Button>,
                ]}
              >
                <div className="mb-4 flex justify-between">
                  <Tag color="blue">{career.category}</Tag>
                  <Badge
                    count={`${career.match}%`}
                    style={{
                      backgroundColor:
                        career.match >= 90
                          ? '#52c41a'
                          : career.match >= 75
                          ? '#1890ff'
                          : career.match >= 60
                          ? '#fa8c16'
                          : '#f5222d',
                    }}
                  />
                </div>

                <Title level={4}>{career.title}</Title>

                <Paragraph ellipsis={{ rows: 3 }} className="mb-4">
                  {career.description}
                </Paragraph>

                <div className="mb-4">
                  <Text type="secondary" className="block mb-1">
                    Match Score
                  </Text>
                  <Progress
                    percent={career.match}
                    status="active"
                    strokeColor={
                      career.match >= 90
                        ? '#52c41a'
                        : career.match >= 75
                        ? '#1890ff'
                        : career.match >= 60
                        ? '#fa8c16'
                        : '#f5222d'
                    }
                  />
                </div>

                <div className="mb-4">
                  <Text type="secondary" className="block mb-1">
                    Key Subjects
                  </Text>
                  <div>
                    {Array.isArray(career.keySubjects) ? (
                      career.keySubjects.map((subject, index) => (
                        <Tag key={index} className="mb-1">
                          {subject}
                        </Tag>
                      ))
                    ) : (
                      <Text type="secondary">No key subjects available</Text>
                    )}
                  </div>
                </div>

                <Divider className="my-3" />

                <Row>
                  <Col span={12}>
                    <Text type="secondary" className="block">
                      Market Demand
                    </Text>
                    <Tag
                      color={
                        career.marketDemand === 'Very High'
                          ? 'green'
                          : career.marketDemand === 'High'
                          ? 'cyan'
                          : career.marketDemand === 'Medium'
                          ? 'blue'
                          : 'orange'
                      }
                    >
                      {career.marketDemand}
                    </Tag>
                  </Col>
                  <Col span={12} className="text-right">
                    <Text type="secondary" className="block">
                      Entry Salary
                    </Text>
                    <Text>{career.salary?.entry || 'N/A'}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CareerRecommendations;
