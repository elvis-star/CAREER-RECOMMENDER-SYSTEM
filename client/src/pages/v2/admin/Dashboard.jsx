'use client';

import { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Space,
  Spin,
  Alert,
  Tabs,
  DatePicker,
  Progress,
  Divider,
} from 'antd';
import {
  BookOutlined,
  BankOutlined,
  LineChartOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminOverview,
  fetchAdminStats,
  fetchUserGrowth,
  fetchCareerPopularity,
} from '../../../services/api';
import StatCard from '../../../components/v2/admin/StatCard';
import LineChart from '../../../components/v2/admin/LineChart';
import BarChart from '../../../components/v2/admin/BarChart';
import PieChart from '../../../components/v2/admin/PieChart';
import RecentActivityList from '../../../components/v2/admin/RecentActivityList';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);

  // Fetch admin overview data
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: fetchAdminOverview,
  });

  // Fetch admin statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
  });

  // Fetch user growth data
  const {
    data: userGrowthData,
    isLoading: userGrowthLoading,
    isError: userGrowthError,
  } = useQuery({
    queryKey: ['userGrowth'],
    queryFn: fetchUserGrowth,
  });

  // Fetch career popularity data
  const {
    data: careerPopularityData,
    isLoading: careerPopularityLoading,
    isError: careerPopularityError,
  } = useQuery({
    queryKey: ['careerPopularity'],
    queryFn: fetchCareerPopularity,
  });

  // Loading state
  if (
    overviewLoading ||
    statsLoading ||
    userGrowthLoading ||
    careerPopularityLoading
  ) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (overviewError || statsError || userGrowthError || careerPopularityError) {
    return (
      <Alert
        type="error"
        message="Error loading admin dashboard"
        description="There was a problem fetching the admin dashboard data. Please try again later."
        className="mb-4"
      />
    );
  }

  // Prepare data for charts
  const userGrowthChartData =
    userGrowthData?.data?.map((item) => ({
      date: item.date,
      users: item.count,
    })) || [];

  const careersByCategory =
    statsData?.data?.careers?.byCategory?.map((item) => ({
      category: item._id,
      count: item.count,
    })) || [];

  const usersByType =
    statsData?.data?.users?.byType?.map((item) => ({
      type: item._id,
      count: item.count,
    })) || [];

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>Admin Dashboard</Title>
        <Paragraph className="text-gray-500">
          Welcome to the admin dashboard. Here you can manage users, careers,
          institutions, and view system statistics.
        </Paragraph>
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Users"
            value={overviewData?.data?.counts?.users || 0}
            icon={<TeamOutlined />}
            color="blue"
            footer={
              <Text type="secondary">
                {statsData?.data?.users?.active || 0} active in last 30 days
              </Text>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Careers"
            value={overviewData?.data?.counts?.careers || 0}
            icon={<BookOutlined />}
            color="green"
            footer={
              <Text type="secondary">
                {statsData?.data?.careers?.featured || 0} featured careers
              </Text>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Institutions"
            value={overviewData?.data?.counts?.institutions || 0}
            icon={<BankOutlined />}
            color="purple"
            footer={
              <Text type="secondary">
                {statsData?.data?.institutions?.universities || 0} universities
              </Text>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Recommendations"
            value={overviewData?.data?.counts?.recommendations || 0}
            icon={<LineChartOutlined />}
            color="orange"
            footer={
              <Text type="secondary">
                {statsData?.data?.recommendations?.lastMonth || 0} in last 30
                days
              </Text>
            }
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-8">
        <Title level={4} className="mb-4">
          Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Button
              type="primary"
              block
              onClick={() => (window.location.href = '/admin/users')}
            >
              Manage Users
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button
              type="primary"
              block
              onClick={() => (window.location.href = '/admin/careers')}
            >
              Manage Careers
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button
              type="primary"
              block
              onClick={() => (window.location.href = '/admin/institutions')}
            >
              Manage Institutions
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button
              type="primary"
              block
              onClick={() => (window.location.href = '/admin/activity')}
            >
              View Activity Logs
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Charts and Analytics */}
      <Tabs defaultActiveKey="users" className="mb-8">
        <TabPane
          tab={
            <span>
              <TeamOutlined /> User Analytics
            </span>
          }
          key="users"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title="User Growth"
                extra={<RangePicker onChange={setDateRange} />}
              >
                <LineChart
                  data={userGrowthChartData}
                  xField="date"
                  yField="users"
                  seriesField="type"
                  title="User Growth Over Time"
                  height={300}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="User Types">
                <PieChart
                  data={usersByType}
                  angleField="count"
                  colorField="type"
                  title="Distribution by User Type"
                  height={300}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Recent Users">
                <Table
                  dataSource={overviewData?.data?.recentUsers || []}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  columns={[
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text) => <a>{text}</a>,
                    },
                    {
                      title: 'Email',
                      dataIndex: 'email',
                      key: 'email',
                    },
                    {
                      title: 'User Type',
                      dataIndex: 'userType',
                      key: 'userType',
                      render: (type) => {
                        let color = 'green';
                        if (type === 'admin') color = 'red';
                        else if (type === 'counselor') color = 'blue';
                        return <Tag color={color}>{type}</Tag>;
                      },
                    },
                    {
                      title: 'Registered',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      render: (date) => new Date(date).toLocaleDateString(),
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() =>
                              (window.location.href = `/admin/users/${record._id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() =>
                              (window.location.href = `/admin/users/${record._id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <BookOutlined /> Career Analytics
            </span>
          }
          key="careers"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Careers by Category">
                <BarChart
                  data={careersByCategory}
                  xField="count"
                  yField="category"
                  seriesField="category"
                  title="Distribution by Category"
                  height={300}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Most Viewed Careers">
                <Table
                  dataSource={statsData?.data?.careers?.mostViewed || []}
                  rowKey="_id"
                  pagination={false}
                  columns={[
                    {
                      title: 'Career',
                      dataIndex: 'title',
                      key: 'title',
                      render: (text) => <a>{text}</a>,
                    },
                    {
                      title: 'Category',
                      dataIndex: 'category',
                      key: 'category',
                      render: (category) => <Tag color="blue">{category}</Tag>,
                    },
                    {
                      title: 'Views',
                      dataIndex: 'views',
                      key: 'views',
                      sorter: (a, b) => a.views - b.views,
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Career Popularity">
                <Table
                  dataSource={careerPopularityData?.data?.popularCareers || []}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  columns={[
                    {
                      title: 'Career',
                      dataIndex: 'title',
                      key: 'title',
                      render: (text) => <a>{text}</a>,
                    },
                    {
                      title: 'Category',
                      dataIndex: 'category',
                      key: 'category',
                      render: (category) => <Tag color="blue">{category}</Tag>,
                    },
                    {
                      title: 'Views',
                      dataIndex: 'views',
                      key: 'views',
                    },
                    {
                      title: 'Saves',
                      dataIndex: 'saves',
                      key: 'saves',
                    },
                    {
                      title: 'Popularity',
                      key: 'popularity',
                      render: (_, record) => {
                        const popularity =
                          ((record.views + record.saves * 2) / 100) * 100;
                        return (
                          <Progress
                            percent={Math.min(100, popularity)}
                            size="small"
                            status="active"
                            strokeColor={{
                              from: '#108ee9',
                              to: '#87d068',
                            }}
                          />
                        );
                      },
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <DatabaseOutlined /> System Health
            </span>
          }
          key="system"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Database Status">
                <Statistic
                  title="Connection Status"
                  value={statsData?.data?.system?.database?.status || 'Unknown'}
                  valueStyle={{
                    color:
                      statsData?.data?.system?.database?.status === 'connected'
                        ? '#3f8600'
                        : '#cf1322',
                  }}
                  prefix={
                    statsData?.data?.system?.database?.status ===
                    'connected' ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ExclamationCircleOutlined />
                    )
                  }
                />
                <Divider />
                <Paragraph>
                  <Text strong>Database Name:</Text>{' '}
                  {statsData?.data?.system?.database?.name || 'Unknown'}
                </Paragraph>
                <Paragraph>
                  <Text strong>Last Backup:</Text>{' '}
                  {statsData?.data?.system?.lastBackup
                    ? new Date(
                        statsData?.data?.system?.lastBackup
                      ).toLocaleString()
                    : 'Never'}
                </Paragraph>
                <Button
                  type="primary"
                  icon={<SyncOutlined />}
                  onClick={() => (window.location.href = '/admin/backup')}
                >
                  Perform Backup
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Server Status">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Memory Usage"
                      value={
                        statsData?.data?.system?.server?.memoryUsage
                          ?.heapUsed || 'Unknown'
                      }
                      prefix={<DatabaseOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Uptime"
                      value={
                        statsData?.data?.system?.server?.uptime || 'Unknown'
                      }
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                </Row>
                <Divider />
                <Paragraph>
                  <Text strong>Environment:</Text>{' '}
                  {statsData?.data?.system?.server?.environment || 'Unknown'}
                </Paragraph>
                <Paragraph>
                  <Text strong>Node Version:</Text>{' '}
                  {statsData?.data?.system?.server?.nodeVersion || 'Unknown'}
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <RecentActivityList
          activities={overviewData?.data?.recentActivities || []}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
