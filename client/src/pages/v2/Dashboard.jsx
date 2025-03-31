import React from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Statistic,
  Progress,
  List,
  Tag,
  Space,
  Divider,
  Avatar,
} from 'antd';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  School,
  ClipboardList,
  BookOpen,
  LightbulbIcon,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  getCareerStatistics,
  getJobMarketInsights,
} from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const { user } = useAuth();

  // Fixed React Query v5 syntax - using object parameter
  const { data: statistics = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['careerStatistics'],
    queryFn: () => getCareerStatistics(),
    initialData: {
      profileCompletion: 65,
      recommendedCareers: 8,
      savedCareers: 3,
      assessmentsCompleted: 2,
    },
  });

  // Fixed React Query v5 syntax - using object parameter
  const { data: jobMarket = {}, isLoading: jobMarketLoading } = useQuery({
    queryKey: ['jobMarketInsights'],
    queryFn: () => getJobMarketInsights(),
    initialData: {
      trendingCareers: [
        { id: 1, name: 'Software Engineering', growth: '+15%' },
        { id: 2, name: 'Data Science', growth: '+12%' },
        { id: 3, name: 'Healthcare Administration', growth: '+10%' },
        { id: 4, name: 'Renewable Energy', growth: '+8%' },
      ],
      recentRecommendations: [
        {
          id: 1,
          name: 'Computer Science',
          match: '95%',
        },
        {
          id: 2,
          name: 'Electrical Engineering',
          match: '87%',
        },
        {
          id: 3,
          name: 'Business Administration',
          match: '82%',
        },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Career Fair 2023',
          date: 'Oct 15, 2023',
          location: 'Nairobi',
        },
        {
          id: 2,
          title: 'Tech Summit',
          date: 'Nov 5, 2023',
          location: 'Mombasa',
        },
      ],
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Welcome Section */}
      <Card className="mb-6 bg-[#0080ff] text-white">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Title level={3} className="text-white mb-2">
              Welcome back, {user?.name || 'Student'}!
            </Title>
            <Paragraph className="text-white opacity-90 mb-0">
              Continue exploring career paths that match your academic strengths
              and interests.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="mt-4 md:mt-0 text-right">
            <Button
              type="default"
              size="large"
              className="bg-white text-[#0080ff] border-white hover:bg-gray-100"
            >
              <ClipboardList size={16} style={{ marginRight: 8 }} />
              <Link to="/input-results">
                {statistics?.recommendedCareers > 0
                  ? 'Update Results'
                  : 'Input KCSE Results'}
              </Link>
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Profile Completion"
            value={`${statistics?.profileCompletion || 0}%`}
            icon={<User size={24} />}
            color="#1890ff"
            showProgress
            progressValue={statistics?.profileCompletion || 0}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Recommended Careers"
            value={statistics?.recommendedCareers || 0}
            icon={<Briefcase size={24} />}
            color="#52c41a"
            link="/recommendations"
            linkText="View all"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Saved Careers"
            value={statistics?.savedCareers || 0}
            icon={<BookOpen size={24} />}
            color="#722ed1"
            link="/saved-careers"
            linkText="View saved"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Assessments"
            value={statistics?.assessmentsCompleted || 0}
            icon={<ClipboardList size={24} />}
            color="#fa8c16"
            link="/assessments"
            linkText="Take more"
          />
        </Col>
      </Row>

      {/* Main Dashboard Content */}
      <Row gutter={[16, 16]}>
        {/* Trending Careers */}
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={4}>Trending Careers in Kenya</Title>}
            className="h-full"
            extra={
              <Button type="link">
                <TrendingUp size={16} style={{ marginRight: 4 }} />
                <Link to="/trends">View All Trends</Link>
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {jobMarket?.trendingCareers?.map((career) => (
                <Col xs={24} sm={12} key={career.id}>
                  <Card
                    className="h-full hover:shadow-md transition-shadow"
                    bordered
                  >
                    <div className="flex justify-between items-start">
                      <Title level={5} className="mb-1">
                        {career.name}
                      </Title>
                      <Tag color="green">{career.growth}</Tag>
                    </div>
                    <Text type="secondary">High demand in job market</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Recent Recommendations */}
        <Col xs={24} lg={8}>
          <Card
            title={<Title level={4}>Your Top Matches</Title>}
            className="h-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={jobMarket?.recentRecommendations || []}
              renderItem={(rec) => (
                <List.Item
                  key={rec.id}
                  actions={[
                    <Button type="link" size="small" key="view-action">
                      <Link to={`/career/${rec.id}`}>View</Link>
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#0080ff] text-white">
                        <GraduationCap size={20} />
                      </div>
                    }
                    title={<Text strong>{rec.name}</Text>}
                    description={
                      <Text type="secondary">Match: {rec.match}</Text>
                    }
                  />
                </List.Item>
              )}
            />
            <Divider />
            <Button type="primary" block>
              <Link to="/recommendations">See All Recommendations</Link>
            </Button>
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24}>
          <Card title={<Title level={4}>Upcoming Career Events</Title>}>
            <Row gutter={[16, 16]}>
              {jobMarket?.upcomingEvents?.map((event) => (
                <Col xs={24} sm={12} md={8} key={event.id}>
                  <Card
                    className="h-full hover:shadow-md transition-shadow"
                    bordered
                  >
                    <Title level={5} className="mb-2">
                      {event.title}
                    </Title>
                    <Space className="mb-4">
                      <CalendarOutlined />
                      <Text type="secondary">{event.date}</Text>
                      <EnvironmentOutlined />
                      <Text type="secondary">{event.location}</Text>
                    </Space>
                    <Button block>Register</Button>
                  </Card>
                </Col>
              ))}
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="h-full flex flex-col items-center justify-center text-center bg-gray-50 hover:shadow-md transition-shadow"
                  bordered
                >
                  <LightbulbIcon size={40} className="text-gray-400 mb-4" />
                  <Title level={5}>Discover More Events</Title>
                  <Button type="link">
                    <Link to="/events">View All Events</Link>
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mt-6">
        <Title level={4} className="mb-4">
          Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <ActionButton
              icon={<ClipboardList size={24} />}
              text="Input KCSE Results"
              link="/input-results"
            />
          </Col>
          <Col xs={12} sm={6}>
            <ActionButton
              icon={<GraduationCap size={24} />}
              text="Explore Careers"
              link="/careers"
            />
          </Col>
          <Col xs={12} sm={6}>
            <ActionButton
              icon={<School size={24} />}
              text="Browse Institutions"
              link="/institutions"
            />
          </Col>
          <Col xs={12} sm={6}>
            <ActionButton
              icon={<TrendingUp size={24} />}
              text="Career Assessment"
              link="/assessment"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color,
  showProgress,
  progressValue,
  link,
  linkText,
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-start mb-2">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md mr-3"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        <div>
          <Text type="secondary">{title}</Text>
        </div>
      </div>

      <Statistic
        value={value}
        valueStyle={{ fontSize: '2rem', fontWeight: 'bold' }}
      />

      {showProgress && (
        <Progress
          percent={progressValue}
          status="active"
          strokeColor={color}
          className="mt-2"
        />
      )}

      {link && (
        <Button type="link" style={{ color: color, paddingLeft: 0 }}>
          <Link to={link}>{linkText}</Link>
        </Button>
      )}
    </Card>
  );
};

// Action Button Component
const ActionButton = ({ icon, text, link }) => {
  return (
    <Link to={link}>
      <Card
        hoverable
        className="h-full text-center py-4"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">{icon}</div>
          <Text>{text}</Text>
        </div>
      </Card>
    </Link>
  );
};

export default Dashboard;
