'use client';

import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message,
  Alert,
  Tooltip,
  Badge,
  Collapse,
  List,
  Card,
  theme,
} from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import {
  Mail,
  User,
  Send,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const MotionDiv = motion.div;

const InviteAdminModal = ({ visible, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  // Get theme tokens for color-aware styling
  const { token } = theme.useToken();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Call the API to send invitation
      await api.post('/admin/invite', {
        name: data.name,
        email: data.email,
        invitedBy: user.id,
      });

      messageApi.open({
        type: 'success',
        content: (
          <Space>
            <CheckCircle size={16} />
            <span>
              Invitation sent to <strong>{data.email}</strong> successfully
            </span>
          </Space>
        ),
        duration: 5,
      });

      reset();
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Failed to send invitation:', error);

      messageApi.open({
        type: 'error',
        content: (
          <Space>
            <AlertCircle size={16} />
            <span>
              {error.response?.data?.message ||
                'Failed to send invitation. Please try again.'}
            </span>
          </Space>
        ),
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermissions = () => {
    setShowPermissions(!showPermissions);
  };

  // Theme-aware styles
  const permissionsCardStyle = {
    marginTop: 12,
    backgroundColor: token.colorBgElevated,
    borderColor: token.colorPrimary,
    borderWidth: '1px',
    borderStyle: 'solid',
  };

  const permissionsTextStyle = {
    color: token.colorTextSecondary,
    fontSize: 13,
  };

  const permissionsTitleStyle = {
    color: token.colorPrimary,
    marginBottom: 8,
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Space direction="vertical" size={1} className="w-full">
            <div className="flex justify-between items-center">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Invite New Admin
                </Title>
                <Text type="secondary">
                  Send an invitation email to add a new administrator
                </Text>
              </div>
              <Badge
                count={
                  <Space size={4}>
                    <Shield size={14} />
                    <span>Admin</span>
                  </Space>
                }
              />
            </div>
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
        width={500}
        closeIcon={<X />}
        centered
        className="admin-invite-modal"
      >
        <Divider style={{ margin: '12px 0 24px' }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Please enter the admin name',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field }) => (
                <Form.Item
                  label="Full Name"
                  validateStatus={errors.name ? 'error' : ''}
                  help={errors.name?.message}
                >
                  <Input
                    {...field}
                    prefix={<User className="text-gray-400" size={18} />}
                    placeholder="Enter full name"
                    size="large"
                    autoFocus
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Please enter an email address',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <Form.Item
                  label="Email Address"
                  validateStatus={errors.email ? 'error' : ''}
                  help={errors.email?.message}
                >
                  <Input
                    {...field}
                    prefix={<Mail className="text-gray-400" size={18} />}
                    placeholder="Enter email address"
                    size="large"
                  />
                </Form.Item>
              )}
            />

            <div>
              <Button
                type="link"
                onClick={togglePermissions}
                icon={
                  showPermissions ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )
                }
                style={{ padding: '4px 0' }}
              >
                {showPermissions
                  ? 'Hide admin permissions'
                  : 'View admin permissions'}
              </Button>

              <AnimatePresence>
                {showPermissions && (
                  <MotionDiv
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Card size="small" style={permissionsCardStyle}>
                      <Paragraph strong style={permissionsTitleStyle}>
                        Administrators will have access to:
                      </Paragraph>
                      <List
                        size="small"
                        dataSource={[
                          'Manage users, careers, and institutions',
                          'Access system analytics and reports',
                          'Configure system settings',
                          'Invite other administrators',
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            style={{ padding: '4px 0', borderBottom: 'none' }}
                          >
                            <Space>
                              <CheckCircle
                                size={14}
                                color={token.colorSuccess}
                              />
                              <Text style={permissionsTextStyle}>{item}</Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            <Alert
              message="Important Note"
              description="The invitation link will be valid for 7 days. The invited user will need to set their password when accepting the invitation."
              type="info"
              showIcon
              icon={<Info size={16} />}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: 12,
              }}
            >
              <Button onClick={onCancel} size="large" icon={<X size={18} />}>
                Cancel
              </Button>
              <Tooltip title="Send invitation email">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={<Send size={18} />}
                >
                  Send Invitation
                </Button>
              </Tooltip>
            </div>
          </Space>
        </form>
      </Modal>
    </>
  );
};

export default InviteAdminModal;
