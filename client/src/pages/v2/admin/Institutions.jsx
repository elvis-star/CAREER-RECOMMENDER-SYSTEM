'use client';

import { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Input,
  Form,
  Select,
  Tooltip,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import UploadWidget from '../../../components/v2/common/UploadWidget';
import api from '../../../services/api';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

const InstitutionManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [institutionModalVisible, setInstitutionModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const queryClient = useQueryClient();

  // Fetch institutions
  const { data: institutions, isLoading } = useQuery({
    queryKey: ['admin-institutions'],
    queryFn: async () => {
      const response = await api.get('/institutions');
      return response.data.data;
    },
  });

  // Handle logo upload success
  const handleLogoUpload = (url) => {
    setLogoUrl(url);
    form.setFieldsValue({ logo: url });
  };

  // Create institution mutation
  const createInstitutionMutation = useMutation({
    mutationFn: (institutionData) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        name: institutionData.name,
        type: institutionData.type,
        location: {
          city: institutionData.city,
          country: institutionData.country,
        },
        description: institutionData.description,
        website: institutionData.website,
        programs: institutionData.programs || [],
        accreditation: institutionData.accreditation,
        facilities: institutionData.facilities || [],
        admissionRequirements: institutionData.admissionRequirements || [],
        contactInfo: {
          email: institutionData.email,
          phone: institutionData.phone,
          address: institutionData.address,
        },
        logo: institutionData.logo, // Now this will be a Cloudinary URL
      };

      return api.post('/institutions', transformedData);
    },
    onSuccess: () => {
      message.success('Institution created successfully');
      setInstitutionModalVisible(false);
      form.resetFields();
      setLogoUrl('');
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to create institution'
      );
    },
  });

  // Update institution mutation
  const updateInstitutionMutation = useMutation({
    mutationFn: ({ id, institutionData }) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        name: institutionData.name,
        type: institutionData.type,
        location: {
          city: institutionData.city,
          country: institutionData.country,
        },
        description: institutionData.description,
        website: institutionData.website,
        programs: institutionData.programs || [],
        accreditation: institutionData.accreditation,
        facilities: institutionData.facilities || [],
        admissionRequirements: institutionData.admissionRequirements || [],
        contactInfo: {
          email: institutionData.email,
          phone: institutionData.phone,
          address: institutionData.address,
        },
        logo: institutionData.logo, // Now this will be a Cloudinary URL
      };

      return api.put(`/institutions/${id}`, transformedData);
    },
    onSuccess: () => {
      message.success('Institution updated successfully');
      setInstitutionModalVisible(false);
      form.resetFields();
      setLogoUrl('');
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to update institution'
      );
    },
  });

  // Delete institution mutation
  const deleteInstitutionMutation = useMutation({
    mutationFn: (institutionId) => api.delete(`/institutions/${institutionId}`),
    onSuccess: () => {
      message.success('Institution deleted successfully');
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Failed to delete institution'
      );
    },
  });

  const showDeleteConfirm = (institution) => {
    confirm({
      title: `Are you sure you want to delete ${institution.name}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteInstitutionMutation.mutate(institution._id);
      },
    });
  };

  const handleAddInstitution = () => {
    setEditMode(false);
    setCurrentInstitution(null);
    form.resetFields();
    setLogoUrl('');
    setInstitutionModalVisible(true);
  };

  const handleEditInstitution = (institution) => {
    setEditMode(true);
    setCurrentInstitution(institution);
    setLogoUrl(institution.logo || '');

    // Format the data for the form
    form.setFieldsValue({
      name: institution.name,
      type: institution.type,
      city: institution.location?.city,
      country: institution.location?.country,
      description: institution.description,
      website: institution.website,
      programs: institution.programs || [],
      accreditation: institution.accreditation,
      facilities: institution.facilities || [],
      admissionRequirements: institution.admissionRequirements || [],
      email: institution.contactInfo?.email,
      phone: institution.contactInfo?.phone,
      address: institution.contactInfo?.address,
      logo: institution.logo,
    });

    setInstitutionModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (editMode) {
      updateInstitutionMutation.mutate({
        id: currentInstitution._id,
        institutionData: values,
      });
    } else {
      createInstitutionMutation.mutate(values);
    }
  };

  const filteredInstitutions = institutions?.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchText.toLowerCase()) ||
      institution.description
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      institution.location?.city
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.logo && (
            <img
              src={record.logo || '/placeholder.svg'}
              alt={text}
              className="w-10 h-10 object-cover rounded mr-2"
            />
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <span>
          <EnvironmentOutlined className="mr-1" />
          {record.location?.city}, {record.location?.country}
        </span>
      ),
    },
    {
      title: 'Programs',
      key: 'programs',
      render: (_, record) => (
        <span>{record.programs?.length || 0} programs</span>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website) => (
        <a href={website} target="_blank" rel="noopener noreferrer">
          <GlobalOutlined /> Visit
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() =>
                window.open(`/institution/${record._id}`, '_blank')
              }
              size="small"
            />
          </Tooltip>

          <Tooltip title="Edit Institution">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditInstitution(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Delete Institution">
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
        title="Institution Management"
        subtitle="Manage educational institutions and their programs"
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddInstitution}
          >
            Add Institution
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <Input
            placeholder="Search institutions..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredInstitutions}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editMode ? 'Edit Institution' : 'Add New Institution'}
        open={institutionModalVisible}
        onCancel={() => setInstitutionModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            type: 'University',
            country: 'Kenya',
            programs: [],
            facilities: [],
            admissionRequirements: [],
          }}
        >
          <Divider orientation="left">Basic Information</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Institution Name"
              rules={[
                { required: true, message: 'Please enter institution name' },
              ]}
            >
              <Input placeholder="e.g. University of Nairobi" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Institution Type"
              rules={[
                { required: true, message: 'Please select institution type' },
              ]}
            >
              <Select placeholder="Select type">
                <Option value="University">University</Option>
                <Option value="College">College</Option>
                <Option value="Technical Institute">Technical Institute</Option>
                <Option value="Vocational School">Vocational School</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe the institution..." />
          </Form.Item>

          <Divider orientation="left">Location</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="e.g. Nairobi" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="e.g. Kenya" />
            </Form.Item>
          </div>

          <Divider orientation="left">Programs & Requirements</Divider>
          <Form.Item
            name="programs"
            label="Programs Offered"
            rules={[
              { required: true, message: 'Please add at least one program' },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Add programs"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="admissionRequirements"
            label="Admission Requirements"
          >
            <Select
              mode="tags"
              placeholder="Add admission requirements"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="accreditation" label="Accreditation">
            <Input placeholder="e.g. Commission for University Education (CUE)" />
          </Form.Item>

          <Form.Item name="facilities" label="Facilities">
            <Select
              mode="tags"
              placeholder="Add facilities"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider orientation="left">Contact Information</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="website"
              label="Website"
              rules={[
                { required: true, message: 'Please enter website URL' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
            >
              <Input placeholder="e.g. https://www.uonbi.ac.ke" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="e.g. info@uonbi.ac.ke" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="e.g. +254 20 4910000" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input placeholder="e.g. University Way, Nairobi" />
            </Form.Item>
          </div>

          <Divider orientation="left">Media</Divider>
          <Form.Item name="logo" label="Institution Logo" className="mb-2">
            <Input hidden />
            {logoUrl && (
              <div className="mb-3">
                <img
                  src={logoUrl || '/placeholder.svg'}
                  alt="Institution Logo"
                  className="w-40 h-40 object-cover rounded border"
                />
              </div>
            )}
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'career-recommender',
                multiple: false,
                maxImageFileSize: 2000000,
                folder: 'institutions',
              }}
              onUploadSuccess={handleLogoUpload}
              setLoading={setLoading}
              buttonText="Upload Logo"
            />
            {loading && <div className="mt-2">Uploading logo...</div>}
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setInstitutionModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                createInstitutionMutation.isLoading ||
                updateInstitutionMutation.isLoading
              }
              disabled={loading}
            >
              {editMode ? 'Update Institution' : 'Create Institution'}
            </Button>
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default InstitutionManagement;
