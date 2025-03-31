'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Card,
  Tabs,
  message,
  Select,
  InputNumber,
  Divider,
  Alert,
  Space,
} from 'antd';
import {
  SaveOutlined,
  MailOutlined,
  LockOutlined,
  CloudOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import api from '../../../services/api';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const AdminSettings = () => {
  const [generalForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [cloudinaryForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      return response.data.data;
    },
    onSuccess: (data) => {
      // Set form values when data is loaded
      generalForm.setFieldsValue({
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        allowRegistration: data.allowRegistration,
        maintenanceMode: data.maintenanceMode,
      });

      emailForm.setFieldsValue({
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword,
        emailFrom: data.emailFrom,
        emailFromName: data.emailFromName,
      });

      securityForm.setFieldsValue({
        requireEmailVerification: data.requireEmailVerification,
        maxLoginAttempts: data.maxLoginAttempts,
        lockDuration: data.lockDuration,
        passwordMinLength: data.passwordMinLength,
        passwordRequireSpecial: data.passwordRequireSpecial,
        sessionTimeout: data.sessionTimeout,
      });

      cloudinaryForm.setFieldsValue({
        cloudinaryCloudName: data.cloudinaryCloudName,
        cloudinaryApiKey: data.cloudinaryApiKey,
        cloudinaryApiSecret: data.cloudinaryApiSecret,
      });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settingsData) => api.put('/admin/settings', settingsData),
    onSuccess: () => {
      message.success('Settings updated successfully');
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to update settings'
      );
    },
  });

  const handleGeneralSubmit = (values) => {
    updateSettingsMutation.mutate({
      ...values,
      section: 'general',
    });
  };

  const handleEmailSubmit = (values) => {
    updateSettingsMutation.mutate({
      ...values,
      section: 'email',
    });
  };

  const handleSecuritySubmit = (values) => {
    updateSettingsMutation.mutate({
      ...values,
      section: 'security',
    });
  };

  const handleCloudinarySubmit = (values) => {
    updateSettingsMutation.mutate({
      ...values,
      section: 'cloudinary',
    });
  };

  const handleTestEmail = async () => {
    try {
      await api.post('/admin/settings/test-email');
      message.success('Test email sent successfully');
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Failed to send test email'
      );
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="System Settings"
        subtitle="Configure application settings and preferences"
      />

      <Card className="mb-6">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                General
              </span>
            }
            key="1"
          >
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={handleGeneralSubmit}
              initialValues={{
                allowRegistration: true,
                maintenanceMode: false,
              }}
            >
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true, message: 'Please enter site name' }]}
              >
                <Input placeholder="Career Recommender" />
              </Form.Item>

              <Form.Item name="siteDescription" label="Site Description">
                <TextArea
                  rows={3}
                  placeholder="A platform to help students find their ideal career path"
                />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                label="Contact Email"
                rules={[
                  { required: true, message: 'Please enter contact email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="contact@example.com" />
              </Form.Item>

              <Form.Item
                name="allowRegistration"
                valuePropName="checked"
                label="Allow User Registration"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maintenanceMode"
                valuePropName="checked"
                label="Maintenance Mode"
                extra="When enabled, only administrators can access the site"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updateSettingsMutation.isLoading}
                >
                  Save General Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <MailOutlined />
                Email
              </span>
            }
            key="2"
          >
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleEmailSubmit}
            >
              <Alert
                message="Email Configuration"
                description="These settings are required for sending emails from the system. Make sure to configure them correctly."
                type="info"
                showIcon
                className="mb-4"
              />

              <Form.Item
                name="smtpHost"
                label="SMTP Host"
                rules={[{ required: true, message: 'Please enter SMTP host' }]}
              >
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label="SMTP Port"
                rules={[{ required: true, message: 'Please enter SMTP port' }]}
              >
                <InputNumber
                  min={1}
                  max={65535}
                  placeholder="587"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="smtpUser"
                label="SMTP Username"
                rules={[
                  { required: true, message: 'Please enter SMTP username' },
                ]}
              >
                <Input placeholder="your-email@gmail.com" />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label="SMTP Password"
                rules={[
                  { required: true, message: 'Please enter SMTP password' },
                ]}
              >
                <Input.Password placeholder="Your SMTP password or app password" />
              </Form.Item>

              <Form.Item
                name="emailFrom"
                label="From Email"
                rules={[
                  { required: true, message: 'Please enter from email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="noreply@example.com" />
              </Form.Item>

              <Form.Item
                name="emailFromName"
                label="From Name"
                rules={[{ required: true, message: 'Please enter from name' }]}
              >
                <Input placeholder="Career Recommender" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={updateSettingsMutation.isLoading}
                  >
                    Save Email Settings
                  </Button>
                  <Button onClick={handleTestEmail}>Send Test Email</Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            }
            key="3"
          >
            <Form
              form={securityForm}
              layout="vertical"
              onFinish={handleSecuritySubmit}
              initialValues={{
                requireEmailVerification: true,
                maxLoginAttempts: 5,
                lockDuration: 30,
                passwordMinLength: 8,
                passwordRequireSpecial: true,
                sessionTimeout: 24,
              }}
            >
              <Form.Item
                name="requireEmailVerification"
                valuePropName="checked"
                label="Require Email Verification"
              >
                <Switch />
              </Form.Item>

              <Divider orientation="left">Account Security</Divider>

              <Form.Item
                name="maxLoginAttempts"
                label="Max Login Attempts"
                extra="Number of failed login attempts before account is locked"
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="lockDuration"
                label="Account Lock Duration (minutes)"
                extra="How long an account remains locked after too many failed attempts"
              >
                <InputNumber min={5} max={1440} style={{ width: '100%' }} />
              </Form.Item>

              <Divider orientation="left">Password Policy</Divider>

              <Form.Item
                name="passwordMinLength"
                label="Minimum Password Length"
              >
                <InputNumber min={6} max={30} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="passwordRequireSpecial"
                valuePropName="checked"
                label="Require Special Characters"
                extra="Passwords must contain at least one special character"
              >
                <Switch />
              </Form.Item>

              <Divider orientation="left">Session Settings</Divider>

              <Form.Item
                name="sessionTimeout"
                label="Session Timeout (hours)"
                extra="How long user sessions remain active"
              >
                <InputNumber min={1} max={168} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updateSettingsMutation.isLoading}
                >
                  Save Security Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <CloudOutlined />
                Cloudinary
              </span>
            }
            key="4"
          >
            <Form
              form={cloudinaryForm}
              layout="vertical"
              onFinish={handleCloudinarySubmit}
            >
              <Alert
                message="Cloudinary Configuration"
                description="These settings are required for image uploads. You can get these values from your Cloudinary dashboard."
                type="info"
                showIcon
                className="mb-4"
              />

              <Form.Item
                name="cloudinaryCloudName"
                label="Cloud Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Cloudinary cloud name',
                  },
                ]}
              >
                <Input placeholder="your-cloud-name" />
              </Form.Item>

              <Form.Item
                name="cloudinaryApiKey"
                label="API Key"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Cloudinary API key',
                  },
                ]}
              >
                <Input placeholder="your-api-key" />
              </Form.Item>

              <Form.Item
                name="cloudinaryApiSecret"
                label="API Secret"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Cloudinary API secret',
                  },
                ]}
              >
                <Input.Password placeholder="your-api-secret" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updateSettingsMutation.isLoading}
                >
                  Save Cloudinary Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
