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
  Avatar,
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
import { Link, useParams, useNavigate } from 'react-router-dom'; // Removed useLocation
import { useQuery } from '@tanstack/react-query';
import { getCareerDetails } from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const CareerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for saved status
  const [isSaved, setIsSaved] = useState(false);

  // Fetch career details from API. The backend will now include match/reasons if applicable.
  const {
    data: career,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['careerDetails', id],
    queryFn: () => getCareerDetails(id),
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
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <Text>Loading career details...</Text>
          </div>
        </Card>
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

  // Define tab items using the new recommended format
  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <InfoCircleOutlined /> Overview
        </span>
      ),
      children: (
        <>
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
                  <Avatar
                    icon={<User size={24} />}
                    style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
                  />
                  <div>
                    <Text type="secondary">Entry Level</Text>
                    <div>
                      <Text strong>{career.salary?.entry}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Space>
                  <Avatar
                    icon={<Briefcase size={24} />}
                    style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                  />
                  <div>
                    <Text type="secondary">Mid-Career</Text>
                    <div>
                      <Text strong>{career.salary?.mid}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Space>
                  <Avatar
                    icon={<DollarSign size={24} />}
                    style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}
                  />
                  <div>
                    <Text type="secondary">Senior Level</Text>
                    <div>
                      <Text strong>{career.salary?.senior}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Title level={4}>Market Demand</Title>
          <Card>
            <Space align="start">
              <Avatar
                icon={<TrendingUp size={24} />}
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
                size={48}
              />
              <div>
                <Title level={5} className="mb-0">
                  {career.marketDemand}
                </Title>
                <Text type="secondary">Current market demand in Kenya</Text>
              </div>
            </Space>
            <Divider />
            <Paragraph>
              The job market for {career.title} in Kenya is currently
              experiencing {career.marketDemand?.toLowerCase()} demand.
              Graduates in this field can expect good employment opportunities
              in both the public and private sectors.
            </Paragraph>
          </Card>
        </>
      ),
    },
    {
      key: 'education',
      label: (
        <span>
          <GraduationCap size={16} /> Education
        </span>
      ),
      children: (
        <>
          <Title level={4}>Recommended Institutions</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.institutions?.map((institution) => (
              <Col xs={24} md={12} key={institution.id}>
                <Card hoverable>
                  <Space>
                    <Avatar
                      src={
                        institution.logo && institution.logo !== ''
                          ? institution.logo
                          : undefined
                      } // Use institution logo if available and not empty
                      icon={
                        !institution.logo || institution.logo === '' ? (
                          <School size={24} />
                        ) : undefined
                      }
                      style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                      size={48}
                    />
                    <div>
                      <Text strong>{institution.name}</Text>
                      <div>
                        <Space>
                          <EnvironmentOutlined className="text-gray-500" />
                          <Text type="secondary">
                            {institution.location?.city},{' '}
                            {institution.location?.country}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  </Space>
                  {institution.website && (
                    <Button
                      type="link"
                      icon={<LinkOutlined />}
                      className="mt-4 w-full"
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={4}>Education Requirements</Title>
          <Collapse className="mb-6">
            <Panel header="Minimum Entry Requirements" key="1">
              <List
                dataSource={[
                  `Minimum mean grade of ${career.minimumMeanGrade} in KCSE`,
                  `Strong performance in key subjects like ${career.keySubjects?.join(
                    ', '
                  )}`,
                  'KCSE Certificate',
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
                  `Bachelor's Degree: ${career.programDuration}`,
                  // Add more specific program durations if available in career data
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
                If you don't meet the direct entry requirements, consider these
                alternative pathways:
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
                <Title level={5}>Higher Education Loans Board (HELB)</Title>
                <Space className="mb-2">
                  <CalendarOutlined className="text-gray-500" />
                  <Text type="secondary">Applications open annually</Text>
                </Space>
                <Paragraph>
                  Government loans and bursaries for Kenyan students pursuing
                  higher education.
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
                  Merit-based scholarships offered by individual universities
                  for outstanding students.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: 'career',
      label: (
        <span>
          <Briefcase size={16} /> Career Path
        </span>
      ),
      children: (
        <>
          <Title level={4}>Career Progression</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.careerPath?.entryLevel && (
              <Col xs={24}>
                <Card
                  title="Entry Level"
                  extra={
                    <Badge
                      count={career.careerPath.entryLevel.experience}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.entryLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.entryLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.midLevel && (
              <Col xs={24}>
                <Card
                  title="Mid-Level"
                  extra={
                    <Badge
                      count={career.careerPath.midLevel.experience}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.midLevel.roles?.map((role, index) => (
                        <Tag key={index} className="mr-2 mb-2">
                          {role}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.midLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.seniorLevel && (
              <Col xs={24}>
                <Card
                  title="Senior Level"
                  extra={
                    <Badge
                      count={career.careerPath.seniorLevel.experience}
                      style={{ backgroundColor: '#722ed1' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.seniorLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.seniorLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.executiveLevel && (
              <Col xs={24}>
                <Card
                  title="Executive Level"
                  extra={
                    <Badge
                      count={career.careerPath.executiveLevel.experience}
                      style={{ backgroundColor: '#fa8c16' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.executiveLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.executiveLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
          </Row>

          <Title level={4}>Required Skills</Title>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card title="Key Skills">
                <List
                  dataSource={career.skillsRequired}
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
            {career.certifications?.map((cert, index) => (
              <Col xs={24} md={12} key={index}>
                <Card>
                  <Title level={5}>{cert.name}</Title>
                  <Text type="secondary">{cert.provider}</Text>
                  <Paragraph className="mt-2">{cert.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ),
    },
    {
      key: 'market',
      label: (
        <span>
          <TrendingUp size={16} /> Job Market
        </span>
      ),
      children: (
        <>
          <Title level={4}>Industry Trends</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.industryTrends?.map((trend, index) => (
              <Col xs={24} key={index}>
                <Card>
                  <Paragraph>{trend}</Paragraph>
                </Card>
              </Col>
            ))}
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
        </>
      ),
    },
  ];

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
              {career.match !== undefined && ( // Conditionally display match tag
                <Tag color={getMatchColor(career.match)}>
                  {career.match}% Match
                </Tag>
              )}
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
            <Tabs defaultActiveKey="overview" items={tabItems} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" className="w-full" size="large">
            {career.match !== undefined ? ( // Conditionally display match score card
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
                  dataSource={career.reasons || []} // Use actual reasons from the career object, default to empty array
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
            ) : (
              <Card className="text-center py-6">
                <Title level={4} className="mb-4">
                  Get Your Personalized Match!
                </Title>
                <Paragraph className="mb-6">
                  Want to know how well this career matches your academic
                  strengths? Get your personalized recommendations now!
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => navigate('/input-results')}
                >
                  Get Recommendations
                </Button>
              </Card>
            )}

            <Card>
              <Title level={4}>Quick Facts</Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Education Level',
                    description: career.programDuration,
                    icon: (
                      <Avatar
                        icon={<GraduationCap size={16} />}
                        style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                      />
                    ),
                  },
                  {
                    title: 'Average Starting Salary',
                    description: career.salary?.entry,
                    icon: (
                      <Avatar
                        icon={<DollarSign size={16} />}
                        style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
                      />
                    ),
                  },
                  {
                    title: 'Market Demand',
                    description: career.marketDemand,
                    icon: (
                      <Avatar
                        icon={<TrendingUp size={16} />}
                        style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}
                      />
                    ),
                  },
                  {
                    title: 'Top Institution',
                    description:
                      career.institutions && career.institutions.length > 0
                        ? career.institutions[0].name
                        : 'N/A',
                    icon: (
                      <Avatar
                        icon={<School size={16} />}
                        style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}
                      />
                    ),
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
                      <Button type="link" size="small" key="view">
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
