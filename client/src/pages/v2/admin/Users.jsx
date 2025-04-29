import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Input,
  Select,
  Tooltip,
  Dropdown,
  Menu,
  Checkbox,
  Tabs,
  Card,
  Statistic,
  Row,
  Col,
  DatePicker,
  Form,
  Drawer,
  Badge,
  Avatar,
  Progress,
  Popconfirm,
  Typography,
  Divider,
  Spin,
  Empty,
  Radio,
  Pagination,
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  MailOutlined,
  DownloadOutlined,
  FilterOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  PieChartOutlined,
  LineChartOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CSVLink } from 'react-csv';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import { Line, Pie } from '@ant-design/charts';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import InviteAdminModal from '../../../components/v2/admin/InviteAdminModal';
import api from '../../../services/api';

const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const UserManagement = () => {
  // State management
  const [searchText, setSearchText] = useState('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userDetailDrawer, setUserDetailDrawer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `Total ${total} users`,
  });
  const [filters, setFilters] = useState({
    role: [],
    userType: [],
    status: [],
    dateRange: null,
  });
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [tableView, setTableView] = useState('list'); // 'list', 'card', 'analytics'
  const [exportLoading, setExportLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [userActivityData, setUserActivityData] = useState([]);
  const [userTypeDistribution, setUserTypeDistribution] = useState([]);
  const [bulkActionMenuVisible, setBulkActionMenuVisible] = useState(false);

  const queryClient = useQueryClient();

  // Fetch users with pagination, filtering and sorting
  const {
    data: usersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin-users', pagination, filters, sortedInfo, searchText],
    queryFn: async () => {
      // Build query parameters
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      // Add search parameter if present
      if (searchText) params.search = searchText;

      // Add filters
      if (filters.role.length) params.role = filters.role.join(',');
      if (filters.userType.length) params.userType = filters.userType.join(',');
      if (filters.status.length) params.status = filters.status.join(',');

      // Add date range if present
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        params.startDate = filters.dateRange[0].toISOString();
        params.endDate = filters.dateRange[1].toISOString();
      }

      // Add sorting
      if (sortedInfo.columnKey && sortedInfo.order) {
        params.sortBy = sortedInfo.columnKey;
        params.sortOrder = sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      const response = await api.get('/users', { params });
      return response.data;
    },
    keepPreviousData: true,
  });

  // Fetch user analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/user-growth');
      return response.data;
    },
    onSuccess: (data) => {
      // Process data for charts
      if (data.activityOverTime) {
        setUserActivityData(
          data.activityOverTime.map((item) => ({
            date: new Date(item.date).toLocaleDateString(),
            logins: item.logins,
            registrations: item.registrations,
          }))
        );
      }

      if (data.userTypeDistribution) {
        setUserTypeDistribution(
          Object.entries(data.userTypeDistribution || {}).map(
            ([type, count]) => ({
              type: type.charAt(0).toUpperCase() + type.slice(1),
              value: count,
            })
          )
        );
      }
    },
  });

  // Fetch user details
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ['user-details', currentUser?._id],
    queryFn: async () => {
      if (!currentUser?._id) return null;
      const response = await api.get(`/users/${currentUser._id}`);
      return response.data;
    },
    enabled: !!currentUser?._id && userDetailDrawer,
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['user-analytics']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (userIds) => api.post('/admin/users/bulk-delete', { userIds }),
    onSuccess: () => {
      message.success(`${selectedRowKeys.length} users deleted successfully`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['user-analytics']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete users');
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ userId, action }) =>
      api.put(
        `/admin/users/${userId}/${action === 'lock' ? 'lock' : 'unlock'}`
      ),
    onSuccess: (_, variables) => {
      message.success(
        `User ${
          variables.action === 'lock' ? 'locked' : 'unlocked'
        } successfully`
      );
      queryClient.invalidateQueries(['admin-users']);
      if (currentUser?._id === variables.userId) {
        queryClient.invalidateQueries(['user-details', variables.userId]);
      }
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to update user status'
      );
    },
  });

  const bulkToggleLockMutation = useMutation({
    mutationFn: ({ userIds, action }) =>
      api.post(`/admin/users/bulk-${action}`, { userIds }),
    onSuccess: (_, variables) => {
      message.success(
        `${selectedRowKeys.length} users ${
          variables.action === 'lock' ? 'locked' : 'unlocked'
        } successfully`
      );
      setSelectedRowKeys([]);
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || `Failed to ${variables.action} users`
      );
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData) => api.put(`/users/${userData.id}`, userData),
    onSuccess: (_, variables) => {
      message.success('User updated successfully');
      setEditModalVisible(false);
      queryClient.invalidateQueries(['admin-users']);
      if (currentUser?._id === variables.id) {
        queryClient.invalidateQueries(['user-details', variables.id]);
      }
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (userId) =>
      api.post(`/admin/users/${userId}/resend-verification`),
    onSuccess: () => {
      message.success('Verification email sent successfully');
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to send verification email'
      );
    },
  });

  const bulkResendVerificationMutation = useMutation({
    mutationFn: (userIds) =>
      api.post('/admin/users/bulk-resend-verification', { userIds }),
    onSuccess: () => {
      message.success(
        `Verification emails sent to ${selectedRowKeys.length} users`
      );
      setSelectedRowKeys([]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to send verification emails'
      );
    },
  });

  const importUsersMutation = useMutation({
    mutationFn: (userData) => api.post('/admin/users/import', userData),
    onSuccess: (response) => {
      const { success, failed } = response.data;
      message.success(`Successfully imported ${success} users`);
      if (failed > 0) {
        message.warning(
          `Failed to import ${failed} users. Check the error log.`
        );
      }
      setImportModalVisible(false);
      setImportFile(null);
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['user-analytics']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to import users');
    },
    onSettled: () => {
      setImportLoading(false);
    },
  });

  // Derived state
  const users = useMemo(() => usersResponse?.data || [], [usersResponse]);
  const totalUsers = useMemo(
    () => usersResponse?.meta?.total || 0,
    [usersResponse]
  );

  // Update pagination when total changes
  useEffect(() => {
    if (usersResponse?.meta) {
      setPagination((prev) => ({
        ...prev,
        total: usersResponse.meta.total,
      }));
    }
  }, [usersResponse]);

  // Handlers
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      ...newPagination,
      current: newPagination.current,
    });

    setSortedInfo(sorter);
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on new search
  }, 500);

  const handleFilterChange = (filterType, values) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on new filter
  };

  const handleDateRangeChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: dates,
    }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on new date range
  };

  const resetFilters = () => {
    setFilters({
      role: [],
      userType: [],
      status: [],
      dateRange: null,
    });
    setSortedInfo({});
    setSearchText('');
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showDeleteConfirm = (user) => {
    confirm({
      title: `Are you sure you want to delete ${user.name}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteUserMutation.mutate(user._id);
      },
    });
  };

  const showBulkDeleteConfirm = () => {
    confirm({
      title: `Are you sure you want to delete ${selectedRowKeys.length} users?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        bulkDeleteMutation.mutate(selectedRowKeys);
      },
    });
  };

  const showLockConfirm = (user, action) => {
    confirm({
      title: `Are you sure you want to ${action} ${user.name}'s account?`,
      content:
        action === 'lock'
          ? 'The user will not be able to log in until the account is unlocked.'
          : 'The user will be able to log in again.',
      okText: `Yes, ${action === 'lock' ? 'Lock' : 'Unlock'}`,
      okType: action === 'lock' ? 'danger' : 'primary',
      cancelText: 'Cancel',
      onOk() {
        toggleLockMutation.mutate({ userId: user._id, action });
      },
    });
  };

  const showBulkLockConfirm = (action) => {
    confirm({
      title: `Are you sure you want to ${action} ${selectedRowKeys.length} user accounts?`,
      content:
        action === 'lock'
          ? 'These users will not be able to log in until their accounts are unlocked.'
          : 'These users will be able to log in again.',
      okText: `Yes, ${action === 'lock' ? 'Lock All' : 'Unlock All'}`,
      okType: action === 'lock' ? 'danger' : 'primary',
      cancelText: 'Cancel',
      onOk() {
        bulkToggleLockMutation.mutate({ userIds: selectedRowKeys, action });
      },
    });
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditModalVisible(true);
  };

  const handleViewUserDetails = (user) => {
    setCurrentUser(user);
    setUserDetailDrawer(true);
  };

  const handleUpdateUser = (values) => {
    updateUserMutation.mutate({
      id: currentUser._id,
      ...values,
    });
  };

  const handleResendVerification = (userId) => {
    resendVerificationMutation.mutate(userId);
  };

  const handleBulkResendVerification = () => {
    bulkResendVerificationMutation.mutate(selectedRowKeys);
  };

  const handleExportUsers = async (format) => {
    try {
      setExportLoading(true);

      // Fetch all users for export
      const response = await api.get('/admin/users/export');
      const exportData = response.data.data || [];

      if (format === 'csv') {
        // CSV export is handled by CSVLink component
        // Just prepare the data
        setTimeout(() => {
          document.getElementById('csvLink').click();
          setExportLoading(false);
        }, 500);
      } else if (format === 'excel') {
        // Excel export
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, 'users_export.xlsx');
        setExportLoading(false);
      }
    } catch (error) {
      message.error('Failed to export users');
      setExportLoading(false);
    }
  };

  const handleImportUsers = () => {
    if (!importFile) {
      message.error('Please select a file to import');
      return;
    }

    setImportLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        importUsersMutation.mutate({ users: jsonData });
      } catch (error) {
        message.error('Failed to parse import file');
        setImportLoading(false);
      }
    };

    reader.readAsArrayBuffer(importFile);
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleBulkAction = (action) => {
    setBulkActionMenuVisible(false);

    switch (action) {
      case 'delete':
        showBulkDeleteConfirm();
        break;
      case 'lock':
        showBulkLockConfirm('lock');
        break;
      case 'unlock':
        showBulkLockConfirm('unlock');
        break;
      case 'verify':
        handleBulkResendVerification();
        break;
      default:
        break;
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.role === 'admin' && record._id !== currentUser?._id, // Prevent selecting other admins
    }),
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            size="large"
            style={{
              backgroundColor: record.avatarColor || '#1890ff',
              marginRight: 12,
            }}
          >
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'role' && sortedInfo.order,
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'userType' && sortedInfo.order,
      filters: [
        { text: 'Student', value: 'student' },
        { text: 'Professional', value: 'professional' },
        { text: 'Institution', value: 'institution' },
      ],
      render: (type) => (
        <Tag
          color={
            type === 'student'
              ? 'green'
              : type === 'professional'
              ? 'purple'
              : type === 'institution'
              ? 'orange'
              : 'default'
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Unverified', value: 'unverified' },
        { text: 'Locked', value: 'locked' },
      ],
      render: (_, record) => {
        let status = 'active';
        if (!record.emailVerified) status = 'unverified';
        if (record.accountLocked) status = 'locked';

        return (
          <Space>
            {status === 'unverified' && (
              <Badge
                status="warning"
                text={<Tag color="orange">UNVERIFIED</Tag>}
              />
            )}
            {status === 'locked' && (
              <Badge status="error" text={<Tag color="red">LOCKED</Tag>} />
            )}
            {status === 'active' && (
              <Badge status="success" text={<Tag color="green">ACTIVE</Tag>} />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'lastActive' && sortedInfo.order,
      render: (date) => {
        if (!date) return <Text type="secondary">Never</Text>;

        const lastActiveDate = new Date(date);
        const now = new Date();
        const diffDays = Math.floor(
          (now - lastActiveDate) / (1000 * 60 * 60 * 24)
        );

        let color = 'green';
        if (diffDays > 30) color = 'red';
        else if (diffDays > 7) color = 'orange';

        return (
          <Tooltip title={lastActiveDate.toLocaleString()}>
            <Tag color={color}>
              {diffDays === 0
                ? 'Today'
                : diffDays === 1
                ? 'Yesterday'
                : `${diffDays} days ago`}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewUserDetails(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              size="small"
            />
          </Tooltip>

          <Dropdown
            menu={
              <Menu>
                {!record.emailVerified && (
                  <Menu.Item
                    key="verify"
                    icon={<MailOutlined />}
                    onClick={() => handleResendVerification(record._id)}
                  >
                    Resend Verification
                  </Menu.Item>
                )}

                {record.accountLocked ? (
                  <Menu.Item
                    key="unlock"
                    icon={<UnlockOutlined />}
                    onClick={() => showLockConfirm(record, 'unlock')}
                  >
                    Unlock Account
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="lock"
                    icon={<LockOutlined />}
                    onClick={() => showLockConfirm(record, 'lock')}
                  >
                    Lock Account
                  </Menu.Item>
                )}

                {record.role !== 'admin' && (
                  <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => showDeleteConfirm(record)}
                  >
                    Delete User
                  </Menu.Item>
                )}
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Card view rendering
  const renderUserCard = (user) => (
    <Col xs={24} sm={12} md={8} lg={6} key={user._id}>
      <Card
        hoverable
        className="user-card"
        actions={[
          <Tooltip title="View Details" key="view">
            <EyeOutlined onClick={() => handleViewUserDetails(user)} />
          </Tooltip>,
          <Tooltip title="Edit User" key="edit">
            <EditOutlined onClick={() => handleEditUser(user)} />
          </Tooltip>,
          <Dropdown
            key="more"
            menu={
              <Menu>
                {!user.emailVerified && (
                  <Menu.Item
                    key="verify"
                    icon={<MailOutlined />}
                    onClick={() => handleResendVerification(user._id)}
                  >
                    Resend Verification
                  </Menu.Item>
                )}

                {user.accountLocked ? (
                  <Menu.Item
                    key="unlock"
                    icon={<UnlockOutlined />}
                    onClick={() => showLockConfirm(user, 'unlock')}
                  >
                    Unlock Account
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="lock"
                    icon={<LockOutlined />}
                    onClick={() => showLockConfirm(user, 'lock')}
                  >
                    Lock Account
                  </Menu.Item>
                )}

                {user.role !== 'admin' && (
                  <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => showDeleteConfirm(user)}
                  >
                    Delete User
                  </Menu.Item>
                )}
              </Menu>
            }
            trigger={['click']}
          >
            <MoreOutlined />
          </Dropdown>,
        ]}
      >
        <div className="text-center mb-4">
          <Avatar
            size={64}
            style={{ backgroundColor: user.avatarColor || '#1890ff' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="mt-2 font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>

        <div className="flex justify-between mb-2">
          <span>Role:</span>
          <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
            {user.role.toUpperCase()}
          </Tag>
        </div>

        <div className="flex justify-between mb-2">
          <span>Type:</span>
          <Tag
            color={
              user.userType === 'student'
                ? 'green'
                : user.userType === 'professional'
                ? 'purple'
                : user.userType === 'institution'
                ? 'orange'
                : 'default'
            }
          >
            {user.userType.toUpperCase()}
          </Tag>
        </div>

        <div className="flex justify-between mb-2">
          <span>Status:</span>
          {!user.emailVerified && <Tag color="orange">UNVERIFIED</Tag>}
          {user.accountLocked && <Tag color="red">LOCKED</Tag>}
          {user.emailVerified && !user.accountLocked && (
            <Tag color="green">ACTIVE</Tag>
          )}
        </div>

        <div className="flex justify-between">
          <span>Last Active:</span>
          <span>
            {user.lastActive
              ? new Date(user.lastActive).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
      </Card>
    </Col>
  );

  // Analytics view rendering
  const renderAnalyticsView = () => {
    // Default data if analytics is not available
    const defaultUserActivity = [
      { date: '2023-01-01', logins: 0, registrations: 0 },
      { date: '2023-01-02', logins: 0, registrations: 0 },
    ];

    const defaultUserTypes = [
      { type: 'Student', value: 0 },
      { type: 'Professional', value: 0 },
      { type: 'Institution', value: 0 },
    ];

    return (
      <div className="analytics-container">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={analytics?.totalUsers || totalUsers || 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={analytics?.activeUsers || 0}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Unverified Users"
                value={analytics?.unverifiedUsers || 0}
                prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Locked Accounts"
                value={analytics?.lockedUsers || 0}
                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={12}>
            <Card title="User Activity">
              {analyticsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin />
                </div>
              ) : (
                <Line
                  data={
                    userActivityData.length
                      ? userActivityData
                      : defaultUserActivity
                  }
                  xField="date"
                  yField="value"
                  seriesField="category"
                  legend={{
                    position: 'top',
                  }}
                  smooth
                  animation={{
                    appear: {
                      animation: 'path-in',
                      duration: 1000,
                    },
                  }}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="User Type Distribution">
              {analyticsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin />
                </div>
              ) : (
                <Pie
                  data={
                    userTypeDistribution.length
                      ? userTypeDistribution
                      : defaultUserTypes
                  }
                  angleField="value"
                  colorField="type"
                  radius={0.8}
                  label={{
                    type: 'outer',
                    content: '{name} {percentage}',
                  }}
                  interactions={[
                    {
                      type: 'element-active',
                    },
                  ]}
                />
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24}>
            <Card title="User Registration Trend">
              {analyticsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin />
                </div>
              ) : (
                <Line
                  data={analytics?.registrationTrend || []}
                  xField="date"
                  yField="count"
                  smooth
                  animation={{
                    appear: {
                      animation: 'path-in',
                      duration: 1000,
                    },
                  }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="User Management"
        subtitle="Manage system users and their permissions"
        actions={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isFetching && !isLoading}
            >
              Refresh
            </Button>
            <Dropdown
              menu={
                <Menu>
                  <Menu.Item key="csv" onClick={() => handleExportUsers('csv')}>
                    Export as CSV
                  </Menu.Item>
                  <Menu.Item
                    key="excel"
                    onClick={() => handleExportUsers('excel')}
                  >
                    Export as Excel
                  </Menu.Item>
                  <Menu.Item
                    key="import"
                    onClick={() => setImportModalVisible(true)}
                  >
                    Import Users
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<DownloadOutlined />}>Import/Export</Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setInviteModalVisible(true)}
            >
              Invite Admin
            </Button>
          </Space>
        }
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
            >
              Filters
            </Button>
            {(filters.role.length > 0 ||
              filters.userType.length > 0 ||
              filters.status.length > 0 ||
              filters.dateRange) && (
              <Button type="link" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Radio.Group
              value={tableView}
              onChange={(e) => setTableView(e.target.value)}
            >
              <Radio.Button value="list">List</Radio.Button>
              <Radio.Button value="card">Cards</Radio.Button>
              <Radio.Button value="analytics">Analytics</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <span>Selected {selectedRowKeys.length} users</span>
            <Space>
              <Button onClick={() => setSelectedRowKeys([])}>Clear</Button>
              <Dropdown
                visible={bulkActionMenuVisible}
                onVisibleChange={setBulkActionMenuVisible}
                menu={
                  <Menu>
                    <Menu.Item
                      key="delete"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleBulkAction('delete')}
                    >
                      Delete Selected
                    </Menu.Item>
                    <Menu.Item
                      key="lock"
                      icon={<LockOutlined />}
                      onClick={() => handleBulkAction('lock')}
                    >
                      Lock Selected
                    </Menu.Item>
                    <Menu.Item
                      key="unlock"
                      icon={<UnlockOutlined />}
                      onClick={() => handleBulkAction('unlock')}
                    >
                      Unlock Selected
                    </Menu.Item>
                    <Menu.Item
                      key="verify"
                      icon={<MailOutlined />}
                      onClick={() => handleBulkAction('verify')}
                    >
                      Resend Verification
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button type="primary">
                  Bulk Actions <DownloadOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>
        )}

        {tableView === 'list' && (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={isLoading}
            pagination={pagination}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            scroll={{ x: 1200 }}
            size="middle"
          />
        )}

        {tableView === 'card' && (
          <div>
            <Row gutter={[16, 16]}>
              {isLoading ? (
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <Card loading />
                    </Col>
                  ))
              ) : users.length > 0 ? (
                users.map(renderUserCard)
              ) : (
                <Col span={24}>
                  <Empty description="No users found" />
                </Col>
              )}
            </Row>
            <div className="mt-4 flex justify-end">
              <Pagination
                {...pagination}
                onChange={(page, pageSize) =>
                  setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize,
                  }))
                }
              />
            </div>
          </div>
        )}

        {tableView === 'analytics' && renderAnalyticsView()}

        {/* Hidden CSV link for export */}
        <CSVLink
          id="csvLink"
          data={users}
          filename="users_export.csv"
          className="hidden"
        />
      </div>

      {/* Invite Admin Modal */}
      <InviteAdminModal
        visible={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        onSuccess={() => {
          setInviteModalVisible(false);
          queryClient.invalidateQueries(['admin-users']);
          queryClient.invalidateQueries(['user-analytics']);
        }}
      />

      {/* Edit User Modal */}
      {currentUser && (
        <Modal
          title="Edit User"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            layout="vertical"
            initialValues={{
              name: currentUser.name,
              role: currentUser.role,
              userType: currentUser.userType,
              notes: currentUser.notes || '',
            }}
            onFinish={handleUpdateUser}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: 'Please enter user name' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  <Input value={currentUser.email} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select>
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="userType"
                  label="User Type"
                  rules={[
                    { required: true, message: 'Please select a user type' },
                  ]}
                >
                  <Select>
                    <Option value="student">Student</Option>
                    <Option value="professional">Professional</Option>
                    <Option value="institution">Institution</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="notes" label="Admin Notes">
              <Input.TextArea
                rows={4}
                placeholder="Add private notes about this user"
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                onClick={() => setEditModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateUserMutation.isLoading}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {/* User Details Drawer */}
      <Drawer
        title="User Details"
        placement="right"
        width={600}
        onClose={() => setUserDetailDrawer(false)}
        open={userDetailDrawer}
        extra={
          <Space>
            <Button onClick={() => setUserDetailDrawer(false)}>Close</Button>
            <Button
              type="primary"
              onClick={() => {
                setUserDetailDrawer(false);
                handleEditUser(currentUser);
              }}
            >
              Edit
            </Button>
          </Space>
        }
      >
        {userDetailsLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : userDetails ? (
          <div>
            <div className="text-center mb-6">
              <Avatar
                size={80}
                style={{
                  backgroundColor: currentUser?.avatarColor || '#1890ff',
                }}
              >
                {currentUser?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Title level={4} className="mt-2 mb-0">
                {currentUser?.name}
              </Title>
              <Text type="secondary">{currentUser?.email}</Text>

              <div className="mt-2">
                <Space>
                  <Tag color={currentUser?.role === 'admin' ? 'red' : 'blue'}>
                    {currentUser?.role.toUpperCase()}
                  </Tag>
                  <Tag
                    color={
                      currentUser?.userType === 'student'
                        ? 'green'
                        : currentUser?.userType === 'professional'
                        ? 'purple'
                        : currentUser?.userType === 'institution'
                        ? 'orange'
                        : 'default'
                    }
                  >
                    {currentUser?.userType.toUpperCase()}
                  </Tag>
                </Space>
              </div>
            </div>

            <Divider />

            <Tabs defaultActiveKey="overview">
              <TabPane tab="Overview" key="overview">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Account Created"
                      value={new Date(
                        userDetails.createdAt
                      ).toLocaleDateString()}
                      prefix={<CalendarOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Last Login"
                      value={
                        userDetails.lastLogin
                          ? new Date(userDetails.lastLogin).toLocaleString()
                          : 'Never'
                      }
                      prefix={<UserOutlined />}
                    />
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>Account Status</Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size="small">
                      <div className="text-center">
                        <div>Email Verified</div>
                        {userDetails.emailVerified ? (
                          <CheckCircleOutlined
                            style={{ fontSize: 24, color: '#52c41a' }}
                          />
                        ) : (
                          <CloseCircleOutlined
                            style={{ fontSize: 24, color: '#f5222d' }}
                          />
                        )}
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <div className="text-center">
                        <div>Account Locked</div>
                        {userDetails.accountLocked ? (
                          <LockOutlined
                            style={{ fontSize: 24, color: '#f5222d' }}
                          />
                        ) : (
                          <UnlockOutlined
                            style={{ fontSize: 24, color: '#52c41a' }}
                          />
                        )}
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <div className="text-center">
                        <div>Profile Complete</div>
                        <Progress
                          type="circle"
                          percent={userDetails.profileCompleteness || 0}
                          width={50}
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Activity" key="activity">
                {userDetails.activityLog &&
                userDetails.activityLog.length > 0 ? (
                  <Timeline>
                    {userDetails.activityLog.map((activity, index) => (
                      <Timeline.Item key={index}>
                        <p>{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <Empty description="No activity recorded" />
                )}
              </TabPane>

              <TabPane tab="Notes" key="notes">
                <Form.Item>
                  <Input.TextArea
                    rows={6}
                    placeholder="Add admin notes about this user"
                    value={userDetails.adminNotes || ''}
                    onChange={(e) => {
                      // Update notes locally
                      const updatedDetails = {
                        ...userDetails,
                        adminNotes: e.target.value,
                      };
                      queryClient.setQueryData(
                        ['user-details', currentUser?._id],
                        updatedDetails
                      );
                    }}
                    onBlur={(e) => {
                      // Save notes on blur
                      updateUserMutation.mutate({
                        id: currentUser?._id,
                        notes: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <Empty description="User details not available" />
        )}
      </Drawer>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Users"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetFilters}>Reset</Button>
            <Button
              type="primary"
              onClick={() => setFilterDrawerVisible(false)}
            >
              Apply
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <Title level={5}>Role</Title>
            <Select
              mode="multiple"
              placeholder="Select roles"
              style={{ width: '100%' }}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ]}
            />
          </div>

          <div>
            <Title level={5}>User Type</Title>
            <Select
              mode="multiple"
              placeholder="Select user types"
              style={{ width: '100%' }}
              value={filters.userType}
              onChange={(value) => handleFilterChange('userType', value)}
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Professional', value: 'professional' },
                { label: 'Institution', value: 'institution' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </div>

          <div>
            <Title level={5}>Status</Title>
            <Select
              mode="multiple"
              placeholder="Select status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Unverified', value: 'unverified' },
                { label: 'Locked', value: 'locked' },
              ]}
            />
          </div>

          <div>
            <Title level={5}>Registration Date</Title>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>
      </Drawer>

      {/* Import Users Modal */}
      <Modal
        title="Import Users"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportFile(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setImportModalVisible(false);
              setImportFile(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="import"
            type="primary"
            onClick={handleImportUsers}
            loading={importLoading}
            disabled={!importFile}
          >
            Import
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <p>
            Upload an Excel or CSV file with user data. The file should have the
            following columns: name, email, role, userType.
          </p>

          <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-md">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportFileChange}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file">
              <div className="cursor-pointer">
                <p className="text-blue-500">Click to upload</p>
                <p className="text-gray-500 text-sm">
                  Support for Excel or CSV
                </p>
              </div>
            </label>

            {importFile && (
              <div className="mt-2">
                <Tag color="blue">{importFile.name}</Tag>
              </div>
            )}
          </div>

          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Download template logic would go here
                message.info(
                  'Template download functionality would be implemented here'
                );
              }}
            >
              Download template
            </a>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default UserManagement;
