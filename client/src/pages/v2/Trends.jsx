'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
  Spin,
  Alert,
  Statistic,
  List,
  Space,
  Button,
  Divider,
  Progress,
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  FireOutlined,
  DollarOutlined,
  LineChartOutlined,
  BarChartOutlined,
  BookOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchCareerTrends, fetchJobMarketInsights } from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Trends = () => {
  const [activeTab, setActiveTab] = useState('trending');

  // Fetch career trends
  const {
    data: trendsData,
    isLoading: trendsLoading,
    isError: trendsError,
  } = useQuery({
    queryKey: ['careerTrends'],
    queryFn: fetchCareerTrends,
  });

  // Fetch job market insights
  const {
    data: jobMarketData,
    isLoading: jobMarketLoading,
    isError: jobMarketError,
  } = useQuery({
    queryKey: ['jobMarketInsights'],
    queryFn: fetchJobMarketInsights,
  });

  // Trending careers table columns
  const trendingColumns = [
    {
      title: 'Career',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/career/${record._id}`} className="font-medium">
          {text}
        </Link>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Market Demand',
      dataIndex: 'marketDemand',
      key: 'marketDemand',
      render: (demand) => {
        let color = 'default';
        if (demand === 'Very High') color = 'red';
        else if (demand === 'High') color = 'orange';
        else if (demand === 'Medium') color = 'green';
        else if (demand === 'Low') color = 'gray';

        return <Tag color={color}>{demand}</Tag>;
      },
    },
    {
      title: 'Popularity',
      dataIndex: 'views',
      key: 'views',
      render: (views) => (
        <Space>
          <span>{views}</span>
          <Text type="secondary">views</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link to={`/career/${record._id}`}>
          <Button type="link" size="small">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  // Salary data table columns
  const salaryColumns = [
    {
      title: 'Career',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Entry Level',
      dataIndex: 'entrySalary',
      key: 'entrySalary',
      render: (salary) => <Text>KES {salary?.toLocaleString() || 'N/A'}</Text>,
    },
    {
      title: 'Mid-Career',
      dataIndex: 'midSalary',
      key: 'midSalary',
      render: (salary) => <Text>KES {salary?.toLocaleString() || 'N/A'}</Text>,
    },
    {
      title: 'Senior Level',
      dataIndex: 'seniorSalary',
      key: 'seniorSalary',
      render: (salary) => <Text>KES {salary?.toLocaleString() || 'N/A'}</Text>,
    },
  ];

  // Mock data for industry growth (in a real app, this would come from the API)
  const industryGrowthData = [
    { industry: 'Technology', growth: 14.5, trend: 'up' },
    { industry: 'Healthcare', growth: 12.8, trend: 'up' },
    { industry: 'Renewable Energy', growth: 10.2, trend: 'up' },
    { industry: 'E-commerce', growth: 9.7, trend: 'up' },
    { industry: 'Education Technology', growth: 8.5, trend: 'up' },
    { industry: 'Manufacturing', growth: 3.2, trend: 'up' },
    { industry: 'Retail (Traditional)', growth: -2.1, trend: 'down' },
    { industry: 'Print Media', growth: -5.4, trend: 'down' },
  ];

  // Mock data for skills in demand (in a real app, this would come from the API)
  const skillsInDemand = [
    { skill: 'Data Analysis', demand: 95, category: 'Technology' },
    { skill: 'Artificial Intelligence', demand: 92, category: 'Technology' },
    { skill: 'Digital Marketing', demand: 88, category: 'Marketing' },
    { skill: 'Cloud Computing', demand: 87, category: 'Technology' },
    { skill: 'UX/UI Design', demand: 85, category: 'Design' },
    { skill: 'Project Management', demand: 82, category: 'Business' },
    { skill: 'Cybersecurity', demand: 90, category: 'Technology' },
    { skill: 'Content Creation', demand: 80, category: 'Marketing' },
  ];

  // Loading state
  if (trendsLoading || jobMarketLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (trendsError || jobMarketError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Alert
          type="error"
          message="Error loading career trends"
          description="There was a problem fetching the career trends data. Please try again later."
          className="mb-4"
        />
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Title>Career Trends & Insights</Title>
        <Paragraph className="text-lg text-gray-500 max-w-3xl mx-auto">
          Stay informed about the latest career trends, emerging fields, and job
          market insights to make better career decisions.
        </Paragraph>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Trending Careers"
              value={trendsData?.data?.trendingCareers?.length || 0}
              prefix={<FireOutlined className="text-red-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">High demand careers</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Emerging Fields"
              value={trendsData?.data?.emergingCareers?.length || 0}
              prefix={<RiseOutlined className="text-green-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">New career opportunities</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Industry Growth"
              value="8.3%"
              prefix={<LineChartOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">Average annual growth</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Skills in Demand"
              value={skillsInDemand.length}
              prefix={<BarChartOutlined className="text-purple-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">Top skills for 2023</Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="mb-8">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <FireOutlined /> Trending Careers
              </span>
            }
            key="trending"
          >
            <Paragraph className="mb-4">
              These careers are currently in high demand in the job market,
              offering excellent opportunities for growth and employment.
            </Paragraph>
            <Table
              columns={trendingColumns}
              dataSource={trendsData?.data?.trendingCareers || []}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <RiseOutlined /> Emerging Careers
              </span>
            }
            key="emerging"
          >
            <Paragraph className="mb-4">
              These are newer career fields that are showing significant growth
              potential and are expected to become more important in the future
              job market.
            </Paragraph>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
              dataSource={trendsData?.data?.emergingCareers || []}
              renderItem={(item) => (
                <List.Item>
                  <Card hoverable>
                    <Link to={`/career/${item._id}`}>
                      <Title level={4}>{item.title}</Title>
                      <Tag color="blue" className="mb-2">
                        {item.category}
                      </Tag>
                      <Paragraph className="text-gray-500">
                        An emerging field with growing opportunities and future
                        potential.
                      </Paragraph>
                      <div className="flex justify-between items-center">
                        <Tag color="green">Emerging</Tag>
                        <Text type="secondary">
                          Added {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </Link>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <DollarOutlined /> Salary Insights
              </span>
            }
            key="salary"
          >
            <Paragraph className="mb-4">
              Compare salary ranges across different careers to help you
              understand the financial prospects of various career paths.
            </Paragraph>
            <Table
              columns={salaryColumns}
              dataSource={jobMarketData?.data?.careersBySalary || []}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <GlobalOutlined /> Industry Growth
              </span>
            }
            key="industry"
          >
            <Paragraph className="mb-4">
              See which industries are growing and which are declining to help
              you make informed career decisions.
            </Paragraph>
            <List
              itemLayout="horizontal"
              dataSource={industryGrowthData}
              renderItem={(item) => (
                <List.Item>
                  <Card className="w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <Title level={4}>{item.industry}</Title>
                        <Space>
                          <Text>Annual Growth:</Text>
                          <Text
                            strong
                            className={
                              item.trend === 'up'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >{`${item.growth}%`}</Text>
                          {item.trend === 'up' ? (
                            <RiseOutlined className="text-green-500" />
                          ) : (
                            <FallOutlined className="text-red-500" />
                          )}
                        </Space>
                      </div>
                      <Progress
                        type="circle"
                        percent={Math.abs(item.growth) * 5}
                        status={item.trend === 'up' ? 'success' : 'exception'}
                        width={60}
                        format={() => `${item.growth}%`}
                      />
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BookOutlined /> Skills in Demand
              </span>
            }
            key="skills"
          >
            <Paragraph className="mb-4">
              These are the most in-demand skills in today's job market.
              Consider developing these skills to enhance your career prospects.
            </Paragraph>
            <Row gutter={[16, 16]}>
              {skillsInDemand.map((skill) => (
                <Col xs={24} sm={12} md={8} key={skill.skill}>
                  <Card hoverable>
                    <Title level={4}>{skill.skill}</Title>
                    <Tag color="blue" className="mb-2">
                      {skill.category}
                    </Tag>
                    <Paragraph className="text-gray-500">
                      Demand Level:
                    </Paragraph>
                    <Progress
                      percent={skill.demand}
                      status="active"
                      strokeColor="#1890ff"
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Career Recommendations */}
      <div className="mb-8">
        <Divider>
          <Title level={3}>Make Informed Career Decisions</Title>
        </Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <Title level={4}>Get Personalized Recommendations</Title>
              <Paragraph className="mb-4">
                Not sure which career path to choose? Take our assessment to get
                personalized career recommendations based on your academic
                performance, interests, and skills.
              </Paragraph>
              <Link to="/input-results">
                <Button type="primary">Take Career Assessment</Button>
              </Link>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <Title level={4}>Explore Career Guides</Title>
              <Paragraph className="mb-4">
                Our comprehensive career guides provide in-depth information
                about various career paths, including required education,
                skills, and job prospects.
              </Paragraph>
              <Link to="/guides">
                <Button type="primary">View Career Guides</Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Additional Resources */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <Title level={3} className="text-center mb-4">
          Additional Resources
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="text-center h-full">
              <BookOutlined className="text-3xl text-blue-500 mb-2" />
              <Title level={4}>Career Guides</Title>
              <Paragraph>In-depth guides for various career paths</Paragraph>
              <Link to="/guides">
                <Button type="link">Explore Guides</Button>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center h-full">
              <BarChartOutlined className="text-3xl text-green-500 mb-2" />
              <Title level={4}>Institutions</Title>
              <Paragraph>
                Find universities and colleges for your chosen career
              </Paragraph>
              <Link to="/institutions">
                <Button type="link">View Institutions</Button>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center h-full">
              <GlobalOutlined className="text-3xl text-purple-500 mb-2" />
              <Title level={4}>Job Market</Title>
              <Paragraph>
                Stay updated with the latest job market trends
              </Paragraph>
              <Link to="/trends">
                <Button type="link">View Trends</Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Trends;
