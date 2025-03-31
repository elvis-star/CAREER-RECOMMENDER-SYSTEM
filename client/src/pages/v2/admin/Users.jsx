'use client';

import { useState } from 'react';
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
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import InviteAdminModal from '../../../components/v2/admin/InviteAdminModal';
import api from '../../../services/api';

const { confirm } = Modal;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data;
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  // Toggle user account lock mutation
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
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to update user status'
      );
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (userData) => api.put(`/admin/users/${userData.id}`, userData),
    onSuccess: () => {
      message.success('User updated successfully');
      setEditModalVisible(false);
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  // Resend verification email mutation
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

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditModalVisible(true);
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

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase()) ||
      user.userType.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
            {text.charAt(0).toUpperCase()}
          </div>
          <div>
            <div>{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
      render: (_, record) => (
        <Space>
          {!record.emailVerified && <Tag color="orange">UNVERIFIED</Tag>}
          {record.accountLocked && <Tag color="red">LOCKED</Tag>}
          {record.emailVerified && !record.accountLocked && (
            <Tag color="green">ACTIVE</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (date) => (date ? new Date(date).toLocaleString() : 'Never'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              size="small"
            />
          </Tooltip>

          {!record.emailVerified && (
            <Tooltip title="Resend Verification">
              <Button
                icon={<MailOutlined />}
                onClick={() => handleResendVerification(record._id)}
                size="small"
              />
            </Tooltip>
          )}

          {record.accountLocked ? (
            <Tooltip title="Unlock Account">
              <Button
                icon={<UnlockOutlined />}
                onClick={() => showLockConfirm(record, 'unlock')}
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip title="Lock Account">
              <Button
                icon={<LockOutlined />}
                onClick={() => showLockConfirm(record, 'lock')}
                size="small"
              />
            </Tooltip>
          )}

          {record.role !== 'admin' && (
            <Tooltip title="Delete User">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record)}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminHeader
        title="User Management"
        subtitle="Manage system users and their permissions"
        actions={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteModalVisible(true)}
          >
            Invite Admin
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <InviteAdminModal
        visible={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        onSuccess={() => setInviteModalVisible(false)}
      />

      {currentUser && (
        <Modal
          title="Edit User"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateUser({
                name: formData.get('name'),
                role: formData.get('role'),
                userType: formData.get('userType'),
              });
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input name="name" defaultValue={currentUser.name} required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={currentUser.email} disabled />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select
                name="role"
                defaultValue={currentUser.role}
                style={{ width: '100%' }}
              >
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                User Type
              </label>
              <Select
                name="userType"
                defaultValue={currentUser.userType}
                style={{ width: '100%' }}
              >
                <Option value="student">Student</Option>
                <Option value="professional">Professional</Option>
                <Option value="institution">Institution</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </div>

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
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
