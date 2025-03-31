'use client';

import { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  DatePicker,
  Input,
  Select,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import api from '../../../services/api';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ActivityLog = () => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [actionFilter, setActionFilter] = useState(null);

  // Fetch activity logs
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: async () => {
      const response = await api.get('/admin/activity');
      return response.data.data;
    },
  });

  // Fetch activity stats
  const { data: activityStats } = useQuery({
    queryKey: ['admin-activity-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/activity/stats');
      return response.data.data;
    },
  });

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleActionFilterChange = (value) => {
    setActionFilter(value);
  };

  const handleExportData = () => {
    // Implement CSV export functionality
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Date,User,Action,IP Address,User Agent\n' +
      filteredLogs
        .map((log) => {
          return `${new Date(log.createdAt).toLocaleString()},${
            log.user?.name || 'Unknown'
          },${log.action},${log.ip || 'Unknown'},${log.userAgent || 'Unknown'}`;
        })
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'activity_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs based on search, date range, and action type
  const filteredLogs = activityLogs?.filter((log) => {
    // Search filter
    const searchMatch =
      !searchText ||
      (log.user?.name &&
        log.user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (log.user?.email &&
        log.user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.ip?.toLowerCase().includes(searchText.toLowerCase());

    // Date range filter
    let dateMatch = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const logDate = new Date(log.createdAt);
      dateMatch =
        logDate >= dateRange[0].startOf('day').toDate() &&
        logDate <= dateRange[1].endOf('day').toDate();
    }

    // Action filter
    const actionMatch = !actionFilter || log.action === actionFilter;

    return searchMatch && dateMatch && actionMatch;
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'login':
        return <LoginOutlined style={{ color: '#52c41a' }} />;
      case 'logout':
        return <LogoutOutlined style={{ color: '#faad14' }} />;
      case 'register':
        return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'update_profile':
        return <EditOutlined style={{ color: '#722ed1' }} />;
      case 'delete_account':
        return <DeleteOutlined style={{ color: '#f5222d' }} />;
      default:
        return <EyeOutlined style={{ color: '#13c2c2' }} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'login':
        return 'green';
      case 'logout':
        return 'orange';
      case 'register':
        return 'blue';
      case 'update_profile':
        return 'purple';
      case 'delete_account':
        return 'red';
      case 'password_reset':
        return 'magenta';
      case 'email_verification':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          {record.user ? (
            <>
              <div className="font-medium">{record.user.name}</div>
              <div className="text-xs text-gray-500">{record.user.email}</div>
            </>
          ) : (
            <span className="text-gray-500">Unknown User</span>
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag icon={getActionIcon(action)} color={getActionColor(action)}>
          {action.toUpperCase().replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'Device',
      dataIndex: 'userAgent',
      key: 'userAgent',
      render: (userAgent) => {
        if (!userAgent) return 'Unknown';

        // Simple device detection
        const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
        const isTablet = /tablet|ipad/i.test(userAgent);
        const isWindows = /windows/i.test(userAgent);
        const isMac = /macintosh|mac os/i.test(userAgent);
        const isLinux = /linux/i.test(userAgent);

        let device = 'Unknown';
        if (isMobile && !isTablet) device = 'Mobile';
        else if (isTablet) device = 'Tablet';
        else if (isWindows) device = 'Windows';
        else if (isMac) device = 'Mac';
        else if (isLinux) device = 'Linux';

        return device;
      },
    },
  ];

  return (
    <AdminLayout>
      <AdminHeader
        title="Activity Log"
        subtitle="Monitor user activity and system events"
        actions={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportData}
          >
            Export Data
          </Button>
        }
      />

      {activityStats && (
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Activities"
                value={activityStats.totalActivities}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Logins Today"
                value={activityStats.loginsToday}
                prefix={<LoginOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="New Users (30 days)"
                value={activityStats.newUsers30Days}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Users Today"
                value={activityStats.activeUsersToday}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search by user or action..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />

          <RangePicker onChange={handleDateRangeChange} className="max-w-md" />

          <Select
            placeholder="Filter by action"
            style={{ width: 200 }}
            onChange={handleActionFilterChange}
            allowClear
          >
            <Option value="login">Login</Option>
            <Option value="logout">Logout</Option>
            <Option value="register">Register</Option>
            <Option value="update_profile">Update Profile</Option>
            <Option value="password_reset">Password Reset</Option>
            <Option value="email_verification">Email Verification</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </AdminLayout>
  );
};

export default ActivityLog;
