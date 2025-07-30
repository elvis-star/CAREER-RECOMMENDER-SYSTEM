import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  Form,
  Input,
  Avatar,
  Typography,
  Row,
  Col,
  Divider,
  List,
  Tag,
  Switch,
  Modal,
  Space,
  Badge,
  Alert,
  Skeleton,
  Empty,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  BookOutlined,
  HistoryOutlined,
  LockOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  SecurityScanOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, {
  updateUserProfile,
  getUserSessions,
  terminateSession,
  terminateAllSessions,
} from '../../services/api';
import UploadWidget from '../../components/v2/common/UploadWidget';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Profile = () => {
  const { user, updateProfile, logout, resendVerification, updateUser } =
    useAuth();
  const { theme } = useTheme || { theme: 'light' }; // Fallback if ThemeContext is not available
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        school: user.school || '',
        graduationYear: user.graduationYear || '',
        bio: user.bio || '',
      });
      setProfileImageUrl(user.profileImage || user.avatar || '');
    }
  }, [user, profileForm]);

  // Fetch user's saved careers
  const { data: savedCareers, isLoading: loadingSavedCareers } = useQuery({
    queryKey: ['saved-careers'],
    queryFn: async () => {
      try {
        const response = await api.get('/users/saved-careers');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching saved careers:', error);
        return [];
      }
    },
    enabled: !!user,
    initialData: [],
  });

  // Fetch user's sessions
  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: getUserSessions,
    enabled: !!user,
    initialData: [],
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      setIsEditing(false);
      updateUser(data.data);
      queryClient.invalidateQueries(['user']);
      Modal.success({
        title: 'Success',
        content: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      Modal.error({
        title: 'Error',
        content: error.response?.data?.message || 'Failed to update profile',
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (passwordData) =>
      api.put('/users/update-password', passwordData),
    onSuccess: () => {
      passwordForm.resetFields();
      Modal.success({
        title: 'Success',
        content: 'Password updated successfully',
      });
    },
    onError: (error) => {
      Modal.error({
        title: 'Error',
        content: error.response?.data?.message || 'Failed to update password',
      });
    },
  });

  // Terminate session mutation
  const terminateSessionMutation = useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      Modal.success({
        title: 'Success',
        content: 'Session terminated successfully',
      });
      queryClient.invalidateQueries(['user-sessions']);
    },
    onError: (error) => {
      Modal.error({
        title: 'Error',
        content: error.response?.data?.message || 'Failed to terminate session',
      });
    },
  });

  // Terminate all sessions mutation
  const terminateAllSessionsMutation = useMutation({
    mutationFn: terminateAllSessions,
    onSuccess: () => {
      Modal.success({
        title: 'Success',
        content: 'All sessions terminated successfully',
      });
      queryClient.invalidateQueries(['user-sessions']);
      // Logout the user since all sessions are terminated
      logout();
      navigate('/login');
    },
    onError: (error) => {
      Modal.error({
        title: 'Error',
        content:
          error.response?.data?.message || 'Failed to terminate all sessions',
      });
    },
  });

  // Remove saved career mutation
  const removeSavedCareerMutation = useMutation({
    mutationFn: (careerId) => api.delete(`/users/saved-careers/${careerId}`),
    onSuccess: () => {
      Modal.success({
        title: 'Success',
        content: 'Career removed from saved list',
      });
      queryClient.invalidateQueries(['saved-careers']);
    },
    onError: (error) => {
      Modal.error({
        title: 'Error',
        content:
          error.response?.data?.message || 'Failed to remove saved career',
      });
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      profileForm.resetFields();
    } else {
      profileForm.setFieldsValue({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        school: user?.school || '',
        graduationYear: user?.graduationYear || '',
        bio: user?.bio || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const onFinish = async (values) => {
    const profileData = {
      ...values,
      avatar: profileImageUrl,
    };
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (values) => {
    updatePasswordMutation.mutate(values);
  };

  const handleProfileImageUpload = (url) => {
    setProfileImageUrl(url);
  };

  const handleAvatarChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload the file to your server here
      console.log('File selected:', file);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete your account?',
      icon: <ExclamationCircleOutlined />,
      content:
        'This action cannot be undone. All your data will be permanently deleted.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        console.log('OK');
        // In a real app, you would delete the user's account here
      },
    });
  };

  const confirmTerminateAllSessions = () => {
    Modal.confirm({
      title: 'Terminate All Sessions',
      content:
        'This will log you out from all devices. Are you sure you want to continue?',
      okText: 'Yes, Terminate All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        terminateAllSessionsMutation.mutate();
      },
    });
  };

  const confirmRemoveSavedCareer = (careerId) => {
    Modal.confirm({
      title: 'Remove Saved Career',
      content:
        'Are you sure you want to remove this career from your saved list?',
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        removeSavedCareerMutation.mutate(careerId);
      },
    });
  };

  const handleResendVerification = async () => {
    try {
      setVerificationLoading(true);
      await resendVerification(user.email);
      setVerificationSuccess(true);
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  // Profile Information Tab Content
  const renderProfileTab = () => (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Personal Information</Title>
        <Button
          type={isEditing ? 'default' : 'primary'}
          icon={isEditing ? null : <EditOutlined />}
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {!user?.emailVerified && (
        <Alert
          message="Email Not Verified"
          description={
            verificationSuccess ? (
              'Verification email sent! Please check your inbox and click the verification link.'
            ) : (
              <span>
                Your email is not verified. Please verify your email to access
                all features.{' '}
                <Button
                  type="link"
                  onClick={handleResendVerification}
                  loading={verificationLoading}
                  style={{ padding: 0 }}
                >
                  Resend verification email
                </Button>
              </span>
            )
          }
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      <Row gutter={[32, 24]}>
        <Col xs={24} md={8}>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar
                size={120}
                src={profileImageUrl || null}
                icon={!profileImageUrl && <UserOutlined />}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              {isEditing && (
                <>
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<EditOutlined />}
                    className="absolute bottom-0 right-0"
                    onClick={handleAvatarChange}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
            {isEditing && (
              <div className="mb-4">
                {/* Use UploadWidget if available */}
                {typeof UploadWidget !== 'undefined' && (
                  <UploadWidget
                    uwConfig={{
                      cloudName: 'elvistk',
                      uploadPreset: 'career-recommender',
                      multiple: false,
                      maxImageFileSize: 2000000,
                      folder: 'cms/profiles',
                    }}
                    onUploadSuccess={handleProfileImageUpload}
                    setLoading={setLoading}
                    buttonText="Change Profile Picture"
                  />
                )}
              </div>
            )}
            <Title level={4} className="mb-1">
              {user?.name || 'User Name'}
            </Title>
            <Space>
              <Tag color="green">{user?.userType || 'Student'}</Tag>
              {user?.emailVerified ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Verified
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  Not Verified
                </Tag>
              )}
            </Space>
          </div>
        </Col>

        <Col xs={24} md={16}>
          {isEditing ? (
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                school: user?.school || '',
                graduationYear: user?.graduationYear || '',
                bio: user?.bio || '',
              }}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Name is required' },
                  {
                    min: 2,
                    message: 'Name must be at least 2 characters',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Invalid email address' },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    pattern: /^[0-9+\-\s()]*$/,
                    message: 'Invalid phone number',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="school" label="School/Institution">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="graduationYear"
                    label="Graduation Year"
                    rules={[
                      {
                        type: 'number',
                        min: 1990,
                        max: new Date().getFullYear() + 10,
                        message: `Year must be between 1990 and ${
                          new Date().getFullYear() + 10
                        }`,
                        transform: (value) => Number(value),
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="bio"
                label="Bio"
                rules={[
                  {
                    max: 500,
                    message: 'Bio cannot exceed 500 characters',
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <List
              itemLayout="horizontal"
              split={true}
              dataSource={[
                {
                  label: 'Email',
                  value: user?.email || 'user@example.com',
                },
                {
                  label: 'Phone Number',
                  value: user?.phone || 'Not provided',
                },
                {
                  label: 'School/Institution',
                  value: user?.school || 'Not provided',
                },
                {
                  label: 'Graduation Year',
                  value: user?.graduationYear || 'Not provided',
                },
                { label: 'Bio', value: user?.bio || 'No bio provided' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text type="secondary">{item.label}</Text>}
                    description={<Text>{item.value}</Text>}
                  />
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </Card>
  );

  // Password Change Tab Content
  const renderPasswordTab = () => (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
      <Title level={4} className="mb-6">
        Change Password
      </Title>
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordSubmit}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            {
              required: true,
              message: 'Please enter your current password',
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your current password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password
            placeholder="Enter your new password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: 'Please confirm your new password',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords do not match')
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your new password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updatePasswordMutation.isPending}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // Saved Careers Tab Content
  const renderSavedCareersTab = () => (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
      <Title level={4} className="mb-4">
        Saved Careers
      </Title>

      {loadingSavedCareers ? (
        <Skeleton active />
      ) : savedCareers?.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={savedCareers}
          renderItem={(career) => (
            <List.Item
              key={career._id || career.id}
              actions={[
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    confirmRemoveSavedCareer(career._id || career.id)
                  }
                >
                  Remove
                </Button>,
                <Button
                  key="view"
                  type="primary"
                  onClick={() => navigate(`/career/${career._id || career.id}`)}
                >
                  View Details
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={career.image || null} />}
                title={
                  <Space>
                    <Text strong>{career.title}</Text>
                    <Tag color="blue">{career.category}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    <Text>
                      {career.description?.substring(0, 100) ||
                        'No description available'}
                      ...
                    </Text>
                    <Badge
                      count={`${career.match || 0}% Match`}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <Text type="secondary">
                      Saved on {career.date || 'Unknown date'}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="You haven't saved any careers yet">
          <Button type="primary" onClick={() => navigate('/careers')}>
            Explore Careers
          </Button>
        </Empty>
      )}
    </Card>
  );

  // Activity History Tab Content
  const renderActivityHistoryTab = () => (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
      <Title level={4} className="mb-4">
        Recent Activity
      </Title>

      <List
        itemLayout="horizontal"
        dataSource={[
          {
            id: 1,
            action: 'Completed KCSE Results Input',
            date: '2023-10-15 14:30',
          },
          {
            id: 2,
            action: 'Viewed Computer Science career details',
            date: '2023-10-15 14:45',
          },
          {
            id: 3,
            action: 'Saved Electrical Engineering to favorites',
            date: '2023-10-15 15:10',
          },
          {
            id: 4,
            action: 'Updated profile information',
            date: '2023-10-14 09:22',
          },
          {
            id: 5,
            action: 'Completed career assessment',
            date: '2023-10-12 11:05',
          },
        ]}
        renderItem={(activity) => (
          <List.Item key={activity.id}>
            <List.Item.Meta
              title={activity.action}
              description={<Text type="secondary">{activity.date}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );

  // Sessions Tab Content
  const renderSessionsTab = () => (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
      <Title level={4} className="mb-4">
        Active Sessions
      </Title>

      {loadingSessions ? (
        <Skeleton active />
      ) : sessions?.length > 0 ? (
        <>
          <div className="mb-4 flex justify-end">
            <Button danger onClick={confirmTerminateAllSessions}>
              Terminate All Sessions
            </Button>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={sessions}
            renderItem={(session) => (
              <List.Item
                key={session._id}
                actions={[
                  session.current ? (
                    <Tag color="green" key="current">
                      Current Session
                    </Tag>
                  ) : (
                    <Button
                      key="terminate"
                      danger
                      onClick={() =>
                        terminateSessionMutation.mutate(session._id)
                      }
                    >
                      Terminate
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={`Device: ${session.userAgent || 'Unknown Device'}`}
                  description={
                    <div>
                      <p>
                        <strong>IP Address:</strong> {session.ip || 'Unknown'}
                      </p>
                      <p>
                        <strong>Last Active:</strong>{' '}
                        {session.lastActive
                          ? new Date(session.lastActive).toLocaleString()
                          : 'Unknown'}
                      </p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </>
      ) : (
        <Empty description="No active sessions found" />
      )}
    </Card>
  );

  // Account Settings Tab Content
  const renderAccountSettingsTab = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card
          title="Security Settings"
          className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                key: 'password',
                title: 'Change Password',
                action: (
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() =>
                      document
                        .querySelector('[data-tab-key="password"]')
                        .click()
                    }
                  >
                    Change Password
                  </Button>
                ),
              },
              {
                key: 'email',
                title: 'Email Verification',
                description: user?.emailVerified
                  ? 'Your email is verified'
                  : 'Your email is not verified',
                action: user?.emailVerified ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Verified
                  </Tag>
                ) : (
                  <Button
                    type="primary"
                    icon={<MailOutlined />}
                    onClick={handleResendVerification}
                    loading={verificationLoading}
                  >
                    Verify Email
                  </Button>
                ),
              },
              {
                key: 'sessions',
                title: 'Session Management',
                description: 'Manage your active sessions and devices',
                action: (
                  <Button
                    type="primary"
                    icon={<SecurityScanOutlined />}
                    onClick={() =>
                      document
                        .querySelector('[data-tab-key="sessions"]')
                        .click()
                    }
                  >
                    Manage Sessions
                  </Button>
                ),
              },
              {
                key: 'delete',
                title: 'Delete Account',
                action: (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={showDeleteConfirm}
                  >
                    Delete Account
                  </Button>
                ),
              },
            ]}
            renderItem={(item) => (
              <List.Item key={item.key} actions={[item.action]}>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          title="Notification Settings"
          className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                key: 'email-notif',
                title: 'Email Notifications',
                action: <Switch defaultChecked />,
              },
              {
                key: 'career-rec',
                title: 'New Career Recommendations',
                action: <Switch defaultChecked />,
              },
              {
                key: 'events',
                title: 'Career Events',
                action: <Switch defaultChecked />,
              },
              {
                key: 'updates',
                title: 'System Updates',
                action: <Switch />,
              },
            ]}
            renderItem={(item) => (
              <List.Item key={item.key} actions={[item.action]}>
                <List.Item.Meta title={item.title} />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24}>
        <Card
          title="Session Management"
          className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}
        >
          <div className="mb-4">
            <Text strong>Current Session</Text>
            <div>
              <Text type="secondary">
                Started: Today at 10:30 AM • Chrome on Windows
              </Text>
            </div>
          </div>
          <Divider />
          <div className="flex justify-between">
            <Button danger icon={<LogoutOutlined />} onClick={logout}>
              Sign Out
            </Button>
            <Button
              danger
              type="primary"
              icon={<LogoutOutlined />}
              onClick={confirmTerminateAllSessions}
            >
              Sign Out of All Devices
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Define tab items using the new recommended format
  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> Profile Information
        </span>
      ),
      children: renderProfileTab(),
    },
    {
      key: 'password',
      label: (
        <span>
          <LockOutlined /> Change Password
        </span>
      ),
      children: renderPasswordTab(),
      'data-tab-key': 'password',
    },
    {
      key: 'saved',
      label: (
        <span>
          <BookOutlined /> Saved Careers
        </span>
      ),
      children: renderSavedCareersTab(),
    },
    {
      key: 'activity',
      label: (
        <span>
          <HistoryOutlined /> Activity History
        </span>
      ),
      children: renderActivityHistoryTab(),
    },
    {
      key: 'sessions',
      label: (
        <span>
          <SecurityScanOutlined /> Active Sessions
        </span>
      ),
      children: renderSessionsTab(),
      'data-tab-key': 'sessions',
    },
    {
      key: 'settings',
      label: (
        <span>
          <LockOutlined /> Account Settings
        </span>
      ),
      children: renderAccountSettingsTab(),
    },
  ];

  return (
    <div
      className={`max-w-6xl mx-auto py-8 px-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : ''
      }`}
    >
      <Title level={2} className="mb-6">
        My Profile
      </Title>

      {/* Using the items prop instead of TabPane children */}
      <Tabs defaultActiveKey="profile" items={tabItems} />
    </div>
  );
};

export default Profile;
