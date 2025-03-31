import React, { useState, useEffect } from 'react';
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
import { getRecommendations } from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const CareerRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for recommendations
  const [recommendations, setRecommendations] = useState(
    location.state?.recommendations || null
  );
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('match');

  // Fixed React Query v5 syntax
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(),
    enabled: !recommendations,
    onSuccess: (data) => {
      setRecommendations(data);
    },
    // Mock data for demonstration
    initialData: location.state?.recommendations || {
      studentInfo: {
        meanGrade: 'B+',
        meanPoints: 10.2,
        strengths: ['Sciences', 'Mathematics', 'Languages'],
      },
      recommendations: [
        {
          id: 1,
          title: 'Computer Science',
          match: 95,
          category: 'Technology',
          description:
            'Computer Science involves the study of computers and computational systems, including theory, design, development, and application.',
          keySubjects: ['Mathematics', 'Physics', 'Computer Studies'],
          institutions: [
            'University of Nairobi',
            'Strathmore University',
            'Jomo Kenyatta University',
          ],
          jobProspects: [
            'Software Developer',
            'Systems Analyst',
            'Data Scientist',
          ],
          marketDemand: 'High',
          salary: {
            entry: 'KES 60,000 - 80,000',
            mid: 'KES 120,000 - 180,000',
            senior: 'KES 250,000+',
          },
        },
        {
          id: 2,
          title: 'Electrical Engineering',
          match: 87,
          category: 'Engineering',
          description:
            'Electrical Engineering focuses on the study and application of electricity, electronics, and electromagnetism.',
          keySubjects: ['Mathematics', 'Physics', 'Chemistry'],
          institutions: [
            'University of Nairobi',
            'Moi University',
            'Technical University of Kenya',
          ],
          jobProspects: [
            'Electrical Engineer',
            'Power Systems Engineer',
            'Control Systems Engineer',
          ],
          marketDemand: 'High',
          salary: {
            entry: 'KES 55,000 - 75,000',
            mid: 'KES 100,000 - 150,000',
            senior: 'KES 200,000+',
          },
        },
        {
          id: 3,
          title: 'Medicine',
          match: 82,
          category: 'Healthcare',
          description:
            'Medicine involves the study, diagnosis, treatment, and prevention of disease and injury in humans.',
          keySubjects: ['Biology', 'Chemistry', 'Mathematics'],
          institutions: [
            'University of Nairobi',
            'Kenyatta University',
            'Moi University',
          ],
          jobProspects: ['Medical Doctor', 'Surgeon', 'Medical Researcher'],
          marketDemand: 'Very High',
          salary: {
            entry: 'KES 80,000 - 100,000',
            mid: 'KES 150,000 - 250,000',
            senior: 'KES 300,000+',
          },
        },
        {
          id: 4,
          title: 'Business Administration',
          match: 78,
          category: 'Business',
          description:
            'Business Administration involves managing business operations and making organizational decisions.',
          keySubjects: ['Mathematics', 'English', 'Business Studies'],
          institutions: [
            'Strathmore University',
            'KCA University',
            'University of Nairobi',
          ],
          jobProspects: [
            'Business Manager',
            'Management Consultant',
            'Entrepreneur',
          ],
          marketDemand: 'Medium',
          salary: {
            entry: 'KES 45,000 - 65,000',
            mid: 'KES 90,000 - 130,000',
            senior: 'KES 180,000+',
          },
        },
        {
          id: 5,
          title: 'Actuarial Science',
          match: 75,
          category: 'Finance',
          description:
            'Actuarial Science applies mathematical and statistical methods to assess risk in insurance, finance, and other industries.',
          keySubjects: ['Mathematics', 'Economics', 'Statistics'],
          institutions: [
            'University of Nairobi',
            'JKUAT',
            'Strathmore University',
          ],
          jobProspects: ['Actuary', 'Risk Analyst', 'Insurance Underwriter'],
          marketDemand: 'High',
          salary: {
            entry: 'KES 70,000 - 90,000',
            mid: 'KES 130,000 - 180,000',
            senior: 'KES 250,000+',
          },
        },
        {
          id: 6,
          title: 'Architecture',
          match: 72,
          category: 'Design',
          description:
            'Architecture involves the planning, designing, and construction of buildings and other physical structures.',
          keySubjects: ['Mathematics', 'Physics', 'Art & Design'],
          institutions: [
            'University of Nairobi',
            'JKUAT',
            'Technical University of Kenya',
          ],
          jobProspects: ['Architect', 'Urban Planner', 'Interior Designer'],
          marketDemand: 'Medium',
          salary: {
            entry: 'KES 50,000 - 70,000',
            mid: 'KES 100,000 - 150,000',
            senior: 'KES 200,000+',
          },
        },
        {
          id: 7,
          title: 'Law',
          match: 68,
          category: 'Legal',
          description:
            'Law involves the study of legal systems, regulations, and the practice of interpreting and enforcing laws.',
          keySubjects: ['English', 'History', 'Kiswahili'],
          institutions: [
            'University of Nairobi',
            'Strathmore University',
            'Moi University',
          ],
          jobProspects: ['Lawyer', 'Legal Consultant', 'Judge'],
          marketDemand: 'Medium',
          salary: {
            entry: 'KES 60,000 - 80,000',
            mid: 'KES 120,000 - 200,000',
            senior: 'KES 300,000+',
          },
        },
        {
          id: 8,
          title: 'Pharmacy',
          match: 65,
          category: 'Healthcare',
          description:
            'Pharmacy involves the science and practice of discovering, producing, and dispensing medications.',
          keySubjects: ['Chemistry', 'Biology', 'Mathematics'],
          institutions: [
            'University of Nairobi',
            'Kenyatta University',
            'JKUAT',
          ],
          jobProspects: [
            'Pharmacist',
            'Pharmaceutical Researcher',
            'Clinical Pharmacist',
          ],
          marketDemand: 'High',
          salary: {
            entry: 'KES 65,000 - 85,000',
            mid: 'KES 110,000 - 160,000',
            senior: 'KES 200,000+',
          },
        },
      ],
    },
  });

  // Apply filters and sorting
  useEffect(() => {
    if (!recommendations) return;

    let filtered = [...recommendations.recommendations];

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
  }, [recommendations, searchQuery, categoryFilter, sortBy]);

  // Get unique categories for filter
  const getCategories = () => {
    if (!recommendations) return [];
    const categories = [
      ...new Set(
        recommendations.recommendations.map((career) => career.category)
      ),
    ];
    return categories.sort();
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <Spin size="large" />
        <Text className="block mt-4">Loading recommendations...</Text>
      </div>
    );
  }

  if (error) {
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

  if (!recommendations) {
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
                  {recommendations.studentInfo.meanGrade}
                </Title>
                <Text>({recommendations.studentInfo.meanPoints} points)</Text>
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
                {recommendations.studentInfo.strengths.map(
                  (strength, index) => (
                    <Tag color="green" key={index}>
                      {strength}
                    </Tag>
                  )
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
                  {recommendations.recommendations.length}
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
                    {career.keySubjects.map((subject, index) => (
                      <Tag key={index} className="mb-1">
                        {subject}
                      </Tag>
                    ))}
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
                    <Text>{career.salary.entry}</Text>
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
