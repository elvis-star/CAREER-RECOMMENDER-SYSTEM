'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  message,
  Progress,
  Alert,
  Tooltip,
  Typography,
  Select,
} from 'antd';
import {
  DatabaseOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import api from '../../../services/api';

const { confirm } = Modal;
const { Title, Text } = Typography;
const { Option } = Select;

const BackupRestore = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [backupType, setBackupType] = useState('full');

  const queryClient = useQueryClient();

  // Fetch backups
  const { data: backups, isLoading } = useQuery({
    queryKey: ['admin-backups'],
    queryFn: async () => {
      const response = await api.get('/admin/backups');
      return response.data.data;
    },
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: (type) => {
      setBackupInProgress(true);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      return api.post('/admin/backups', { type }).finally(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setBackupInProgress(false);
          setProgress(0);
        }, 1000);
      });
    },
    onSuccess: () => {
      message.success('Backup created successfully');
      queryClient.invalidateQueries(['admin-backups']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create backup');
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: (backupId) => api.delete(`/admin/backups/${backupId}`),
    onSuccess: () => {
      message.success('Backup deleted successfully');
      queryClient.invalidateQueries(['admin-backups']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete backup');
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: (backupId) => {
      setRestoreInProgress(true);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      return api.post(`/admin/backups/${backupId}/restore`).finally(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setRestoreInProgress(false);
          setProgress(0);
        }, 1000);
      });
    },
    onSuccess: () => {
      message.success('Backup restored successfully');
      setRestoreModalVisible(false);
      queryClient.invalidateQueries(['admin-backups']);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to restore backup'
      );
    },
  });

  const showDeleteConfirm = (backup) => {
    confirm({
      title: 'Are you sure you want to delete this backup?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteBackupMutation.mutate(backup._id);
      },
    });
  };

  const showRestoreConfirm = (backup) => {
    setSelectedBackup(backup);
    setRestoreModalVisible(true);
  };

  const handleCreateBackup = () => {
    createBackupMutation.mutate(backupType);
  };

  const handleRestoreBackup = () => {
    if (selectedBackup) {
      restoreBackupMutation.mutate(selectedBackup._id);
    }
  };

  const handleDownloadBackup = async (backup) => {
    try {
      const response = await api.get(`/admin/backups/${backup._id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `backup_${backup.createdAt.substring(0, 10)}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('Failed to download backup');
    }
  };

  const columns = [
    {
      title: 'Backup Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <span className="capitalize">{type}</span>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / (1024 * 1024)).toFixed(2)} MB`,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (user) => user?.name || 'System',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Download Backup">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadBackup(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Restore Backup">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => showRestoreConfirm(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Delete Backup">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminHeader
        title="Backup & Restore"
        subtitle="Manage database backups and system restoration"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-2">
          <Title level={4}>Create Backup</Title>
          <Text className="block mb-4">
            Create a backup of your database to protect against data loss. You
            can restore from these backups at any time.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Select
              value={backupType}
              onChange={setBackupType}
              style={{ width: 200 }}
            >
              <Option value="full">Full Backup</Option>
              <Option value="users">Users Only</Option>
              <Option value="careers">Careers Only</Option>
              <Option value="institutions">Institutions Only</Option>
            </Select>

            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={handleCreateBackup}
              loading={backupInProgress}
              disabled={backupInProgress || restoreInProgress}
            >
              Create Backup
            </Button>
          </div>

          {backupInProgress && (
            <div className="mt-4">
              <Progress percent={progress} status="active" />
              <Text className="text-gray-500">
                Creating backup... Please wait
              </Text>
            </div>
          )}
        </Card>

        <Card>
          <Title level={4}>Cloud Sync</Title>
          <Text className="block mb-4">
            Sync your backups with cloud storage for additional protection.
          </Text>

          <Space direction="vertical" className="w-full">
            <Button icon={<CloudUploadOutlined />} block>
              Upload to Cloud
            </Button>

            <Button icon={<CloudDownloadOutlined />} block>
              Fetch from Cloud
            </Button>
          </Space>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">
            Backup History
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries(['admin-backups'])}
          >
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={backups}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Restore Backup"
        open={restoreModalVisible}
        onCancel={() => setRestoreModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRestoreModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="restore"
            type="primary"
            danger
            loading={restoreInProgress}
            onClick={handleRestoreBackup}
          >
            Restore
          </Button>,
        ]}
      >
        <Alert
          message="Warning: Data Loss Risk"
          description="Restoring a backup will replace all current data with the data from the backup. This action cannot be undone."
          type="warning"
          showIcon
          className="mb-4"
        />

        {selectedBackup && (
          <div>
            <p>
              <strong>Backup Date:</strong>{' '}
              {new Date(selectedBackup.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong>{' '}
              <span className="capitalize">{selectedBackup.type}</span>
            </p>
            <p>
              <strong>Size:</strong>{' '}
              {(selectedBackup.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        {restoreInProgress && (
          <div className="mt-4">
            <Progress percent={progress} status="active" />
            <Text className="text-gray-500">
              Restoring backup... Please wait
            </Text>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default BackupRestore;
