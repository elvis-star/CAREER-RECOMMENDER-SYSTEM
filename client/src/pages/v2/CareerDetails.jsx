'use client';

import { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Tabs,
  Tag,
  Space,
  List,
  Progress,
  Statistic,
  Breadcrumb,
  Divider,
  Collapse,
  Badge,
  Tooltip,
  message,
} from 'antd';
import {
  BookOutlined,
  BookFilled,
  ShareAltOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  StarOutlined,
  TeamOutlined,
  LinkOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  School,
  CheckCircle,
  DollarSign,
  User,
} from 'lucide-react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCareerDetails } from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const CareerDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for saved status
  const [isSaved, setIsSaved] = useState(false);

  // Get career details from location state or fetch from API
  const {
    data: career,
    isLoading,
    error,
  } = useQuery(['careerDetails', id], () => getCareerDetails(id), {
    enabled: !location.state?.career,
    initialData: location.state?.career,
  });

  // Handle save career
  const handleSaveCareer = () => {
    setIsSaved(!isSaved);
    messageApi.success({
      content: isSaved
        ? 'Removed from saved careers'
        : 'Added to saved careers',
      duration: 2,
    });
  };

  // Handle share career
  const handleShareCareer = () => {
    messageApi.info(
      'This feature would allow sharing this career via email or social media.'
    );
  };

  // Handle print career
  const handlePrintCareer = () => {
    messageApi.info(
      'This feature would allow printing this career information.'
    );
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
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Text>Loading career details...</Text>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card className="text-center py-10">
          <Title level={3} className="mb-4">
            Career Not Found
          </Title>
          <Paragraph className="mb-6">
            We couldn't find the career you're looking for.
          </Paragraph>
          <Button type="primary">
            <Link to="/recommendations">Back to Recommendations</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {contextHolder}

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/recommendations">Recommendations</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{career.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Career Header */}
      <Card className="mb-6">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Space className="mb-2">
              <Tag color="blue">{career.category}</Tag>
              <Tag color={getMatchColor(career.match)}>
                {career.match}% Match
              </Tag>
            </Space>
            <Title level={2} className="mb-2">
              {career.title}
            </Title>
            <Paragraph className="text-gray-500">
              {career.description}
            </Paragraph>
          </Col>

          <Col xs={24} md={8} className="mt-4 md:mt-0 flex justify-end">
            <Space>
              <Tooltip title={isSaved ? 'Remove from saved' : 'Save career'}>
                <Button
                  icon={isSaved ? <BookFilled /> : <BookOutlined />}
                  onClick={handleSaveCareer}
                  type={isSaved ? 'primary' : 'default'}
                />
              </Tooltip>
              <Tooltip title="Share career">
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleShareCareer}
                />
              </Tooltip>
              <Tooltip title="Print information">
                <Button
                  icon={<PrinterOutlined />}
                  onClick={handlePrintCareer}
                />
              </Tooltip>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/recommendations')}
              >
                Back
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="overview">
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined /> Overview
                  </span>
                }
                key="overview"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Title level={4}>Key Subjects</Title>
                    <List
                      dataSource={career.keySubjects}
                      renderItem={(subject) => (
                        <List.Item>
                          <Space>
                            <CheckCircle size={16} className="text-green-500" />
                            <Text>{subject}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <Title level={4}>Job Prospects</Title>
                    <List
                      dataSource={career.jobProspects}
                      renderItem={(job) => (
                        <List.Item>
                          <Space>
                            <Briefcase size={16} className="text-blue-500" />
                            <Text>{job}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>

                <Divider />

                <Title level={4}>Salary Expectations</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24} md={8}>
                    <Card>
                      <Space>
                        <User size={24} className="text-green-500" />
                        <div>
                          <Text type="secondary">Entry Level</Text>
                          <div>
                            <Text strong>{career.salary.entry}</Text>
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Space>
                        <Briefcase size={24} className="text-blue-500" />
                        <div>
                          <Text type="secondary">Mid-Career</Text>
                          <div>
                            <Text strong>{career.salary.mid}</Text>
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Space>
                        <DollarSign size={24} className="text-orange-500" />
                        <div>
                          <Text type="secondary">Senior Level</Text>
                          <div>
                            <Text strong>{career.salary.senior}</Text>
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <Title level={4}>Market Demand</Title>
                <Card>
                  <Space align="start">
                    <div
                      className="p-3 rounded-full"
                      style={{
                        backgroundColor:
                          career.marketDemand === 'Very High'
                            ? '#f6ffed'
                            : career.marketDemand === 'High'
                            ? '#e6f7ff'
                            : career.marketDemand === 'Medium'
                            ? '#fff7e6'
                            : '#fff1f0',
                        color:
                          career.marketDemand === 'Very High'
                            ? '#52c41a'
                            : career.marketDemand === 'High'
                            ? '#1890ff'
                            : career.marketDemand === 'Medium'
                            ? '#fa8c16'
                            : '#f5222d',
                      }}
                    >
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <Title level={5} className="mb-0">
                        {career.marketDemand}
                      </Title>
                      <Text type="secondary">
                        Current market demand in Kenya
                      </Text>
                    </div>
                  </Space>
                  <Divider />
                  <Paragraph>
                    The job market for {career.title} in Kenya is currently
                    experiencing {career.marketDemand.toLowerCase()} demand.
                    Graduates in this field can expect good employment
                    opportunities in both the public and private sectors.
                  </Paragraph>
                </Card>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <GraduationCap size={16} /> Education
                  </span>
                }
                key="education"
              >
                <Title level={4}>Recommended Institutions</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  {career.institutions.map((institution, index) => (
                    <Col xs={24} md={12} key={index}>
                      <Card hoverable>
                        <Space>
                          <div className="p-2 rounded-md bg-blue-50 text-blue-500">
                            <School size={24} />
                          </div>
                          <div>
                            <Text strong>{institution}</Text>
                            <div>
                              <Space>
                                <EnvironmentOutlined className="text-gray-500" />
                                <Text type="secondary">Kenya</Text>
                              </Space>
                            </div>
                          </div>
                        </Space>
                        <Button
                          type="link"
                          icon={<LinkOutlined />}
                          className="mt-4 w-full"
                        >
                          Visit Website
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Title level={4}>Education Requirements</Title>
                <Collapse className="mb-6">
                  <Panel header="Minimum Entry Requirements" key="1">
                    <List
                      dataSource={[
                        'Mean grade of B+ and above in KCSE',
                        'B+ in Mathematics',
                        'B+ in English or Kiswahili',
                        'B+ in at least two relevant subjects',
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <CheckCircleOutlined className="text-green-500" />
                            <Text>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header="Program Duration" key="2">
                    <List
                      dataSource={[
                        "Bachelor's Degree: 4 years",
                        "Master's Degree: 2 years",
                        'Doctoral Degree: 3-5 years',
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <ClockCircleOutlined className="text-blue-500" />
                            <Text>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header="Alternative Pathways" key="3">
                    <Paragraph>
                      If you don't meet the direct entry requirements, consider
                      these alternative pathways:
                    </Paragraph>
                    <List
                      dataSource={[
                        'Diploma courses in related fields',
                        'Certificate courses with progression to diploma',
                        'Bridging courses for specific subjects',
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <RightOutlined className="text-blue-500" />
                            <Text>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>

                <Title level={4}>Scholarships & Funding</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card>
                      <Title level={5}>
                        Higher Education Loans Board (HELB)
                      </Title>
                      <Space className="mb-2">
                        <CalendarOutlined className="text-gray-500" />
                        <Text type="secondary">Applications open annually</Text>
                      </Space>
                      <Paragraph>
                        Government loans and bursaries for Kenyan students
                        pursuing higher education.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card>
                      <Title level={5}>University Scholarships</Title>
                      <Space className="mb-2">
                        <CalendarOutlined className="text-gray-500" />
                        <Text type="secondary">Varies by institution</Text>
                      </Space>
                      <Paragraph>
                        Merit-based scholarships offered by individual
                        universities for outstanding students.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <Briefcase size={16} /> Career Path
                  </span>
                }
                key="career"
              >
                <Title level={4}>Career Progression</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24}>
                    <Card
                      title="Entry Level"
                      extra={
                        <Badge
                          count="0-2 years"
                          style={{ backgroundColor: '#52c41a' }}
                        />
                      }
                    >
                      <div className="mb-3">
                        <Text strong>Typical Roles:</Text>
                        <div>
                          {[
                            'Junior Developer',
                            'Graduate Trainee',
                            'Research Assistant',
                          ].map((role, index) => (
                            <Tag key={index} className="mr-2 mb-2">
                              {role}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <Paragraph>
                        Focus on building technical skills and gaining practical
                        experience in the field.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card
                      title="Mid-Level"
                      extra={
                        <Badge
                          count="3-5 years"
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      }
                    >
                      <div className="mb-3">
                        <Text strong>Typical Roles:</Text>
                        <div>
                          {[
                            'Senior Developer',
                            'Team Lead',
                            'Project Manager',
                          ].map((role, index) => (
                            <Tag key={index} className="mr-2 mb-2">
                              {role}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <Paragraph>
                        Take on more responsibility and begin to specialize in
                        specific areas of expertise.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card
                      title="Senior Level"
                      extra={
                        <Badge
                          count="6-10 years"
                          style={{ backgroundColor: '#722ed1' }}
                        />
                      }
                    >
                      <div className="mb-3">
                        <Text strong>Typical Roles:</Text>
                        <div>
                          {[
                            'Technical Director',
                            'Department Head',
                            'Consultant',
                          ].map((role, index) => (
                            <Tag key={index} className="mr-2 mb-2">
                              {role}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <Paragraph>
                        Lead teams, make strategic decisions, and mentor junior
                        professionals.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card
                      title="Executive Level"
                      extra={
                        <Badge
                          count="10+ years"
                          style={{ backgroundColor: '#fa8c16' }}
                        />
                      }
                    >
                      <div className="mb-3">
                        <Text strong>Typical Roles:</Text>
                        <div>
                          {[
                            'Chief Technology Officer',
                            'VP of Engineering',
                            'Director',
                          ].map((role, index) => (
                            <Tag key={index} className="mr-2 mb-2">
                              {role}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <Paragraph>
                        Shape organizational strategy and drive innovation at
                        the highest levels.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>

                <Title level={4}>Required Skills</Title>
                <Row gutter={[24, 24]} className="mb-6">
                  <Col xs={24} md={12}>
                    <Card title="Technical Skills">
                      <List
                        dataSource={[
                          'Programming languages (Java, Python, etc.)',
                          'Database management',
                          'Software development methodologies',
                          'System architecture',
                          'Cloud computing',
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <Space>
                              <CheckCircleOutlined className="text-green-500" />
                              <Text>{item}</Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Soft Skills">
                      <List
                        dataSource={[
                          'Problem-solving',
                          'Communication',
                          'Teamwork',
                          'Time management',
                          'Adaptability',
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <Space>
                              <CheckCircleOutlined className="text-green-500" />
                              <Text>{item}</Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>

                <Title level={4}>Professional Certifications</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card>
                      <Title level={5}>AWS Certified Solutions Architect</Title>
                      <Text type="secondary">Amazon Web Services</Text>
                      <Paragraph className="mt-2">
                        Validates expertise in designing distributed systems on
                        AWS.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card>
                      <Title level={5}>
                        Certified Information Systems Security Professional
                      </Title>
                      <Text type="secondary">(ISC)²</Text>
                      <Paragraph className="mt-2">
                        Demonstrates expertise in information security.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <TrendingUp size={16} /> Job Market
                  </span>
                }
                key="market"
              >
                <Title level={4}>Industry Trends</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24}>
                    <Card title="Growing Demand in Kenya">
                      <Paragraph>
                        The demand for {career.title} professionals in Kenya has
                        been steadily increasing over the past 5 years, with a
                        projected growth rate of 15% annually for the next
                        decade.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="Digital Transformation">
                      <Paragraph>
                        As Kenyan businesses undergo digital transformation, the
                        need for skilled professionals in this field continues
                        to rise, creating numerous job opportunities.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="Remote Work Opportunities">
                      <Paragraph>
                        The global shift to remote work has opened up
                        international opportunities for Kenyan professionals in
                        this field, allowing them to work for companies
                        worldwide.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>

                <Title level={4}>Top Employers</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  {[
                    { name: 'Safaricom', industry: 'Telecommunications' },
                    { name: 'Kenya Commercial Bank', industry: 'Banking' },
                    { name: 'Microsoft Africa', industry: 'Technology' },
                    { name: 'IBM Kenya', industry: 'Technology' },
                    {
                      name: 'United Nations',
                      industry: 'International Organization',
                    },
                    { name: 'Equity Bank', industry: 'Banking' },
                  ].map((employer, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card>
                        <Title level={5}>{employer.name}</Title>
                        <Text type="secondary">{employer.industry}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Title level={4}>Job Market Statistics</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="Average Time to Employment"
                        value="3 months"
                        prefix={<ClockCircleOutlined />}
                      />
                      <Text type="secondary">
                        Average time for graduates to find employment
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="Job Satisfaction"
                        value="85%"
                        prefix={<StarOutlined />}
                      />
                      <Text type="secondary">
                        Professionals reporting high job satisfaction
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="Annual Job Growth"
                        value="15%"
                        prefix={<TrendingUp size={16} />}
                      />
                      <Text type="secondary">
                        Projected annual growth in job opportunities
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card>
                      <Statistic
                        title="Work-Life Balance"
                        value="Good"
                        prefix={<TeamOutlined />}
                      />
                      <Text type="secondary">
                        Reported work-life balance in the industry
                      </Text>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" className="w-full" size="large">
            <Card>
              <Title level={4}>Match Score</Title>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <Text>Overall Match</Text>
                  <Text
                    strong
                    style={{
                      color:
                        career.match >= 90
                          ? '#52c41a'
                          : career.match >= 75
                          ? '#1890ff'
                          : career.match >= 60
                          ? '#fa8c16'
                          : '#f5222d',
                    }}
                  >
                    {career.match}%
                  </Text>
                </div>
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

              <Divider />

              <Title level={5}>Why this is a good match:</Title>
              <List
                dataSource={[
                  'Aligns with your academic strengths',
                  'High market demand in Kenya',
                  'Good salary prospects',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleOutlined className="text-green-500" />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            <Card>
              <Title level={4}>Quick Facts</Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Education Level',
                    description: "Bachelor's Degree (4 years)",
                    icon: <GraduationCap size={20} className="text-blue-500" />,
                  },
                  {
                    title: 'Average Starting Salary',
                    description: career.salary.entry,
                    icon: <DollarSign size={20} className="text-green-500" />,
                  },
                  {
                    title: 'Market Demand',
                    description: career.marketDemand,
                    icon: <TrendingUp size={20} className="text-purple-500" />,
                  },
                  {
                    title: 'Top Institution',
                    description: career.institutions[0],
                    icon: <School size={20} className="text-orange-500" />,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card>
              <Title level={4}>Similar Careers</Title>
              <List
                dataSource={[
                  { title: 'Software Engineering', match: 92 },
                  { title: 'Information Technology', match: 90 },
                  { title: 'Data Science', match: 85 },
                  { title: 'Cybersecurity', match: 82 },
                ]}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    actions={[
                      <Button type="link" size="small">
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <Tag color={getMatchColor(item.match)}>
                          {item.match}% Match
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
              <Button type="primary" block className="mt-4">
                <Link to="/recommendations">View All Recommendations</Link>
              </Button>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default CareerDetails;
