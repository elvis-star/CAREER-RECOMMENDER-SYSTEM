'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const InviteAdminModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Call the API to send invitation
      await api.post('/api/admin/invite', {
        name: values.name,
        email: values.email,
        invitedBy: user.id,
      });

      message.success(`Invitation sent to ${values.email}`);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Failed to send invitation:', error);
      message.error(
        error.response?.data?.message || 'Failed to send invitation'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Invite New Admin"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: 'admin' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter email address" />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send Invitation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InviteAdminModal;
