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
  Form,
  Select,
  Tooltip,
  Switch,
  Divider,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import UploadWidget from '../../../components/v2/common/UploadWidget';
import api from '../../../services/api';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const CareerManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [careerModalVisible, setCareerModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();

  // Fetch careers
  const { data: careers, isLoading } = useQuery({
    queryKey: ['admin-careers'],
    queryFn: async () => {
      const response = await api.get('/careers');
      return response.data.data;
    },
  });

  // Handle image upload success
  const handleImageUpload = (url) => {
    setImageUrl(url);
    form.setFieldsValue({ image: url });
  };

  // Create career mutation
  const createCareerMutation = useMutation({
    mutationFn: (careerData) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        title: careerData.title,
        category: careerData.category,
        description: careerData.description,
        keySubjects: careerData.keySubjects || [],
        requiredGrades: careerData.requiredGrades || {},
        minimumMeanGrade: careerData.minimumMeanGrade,
        marketDemand: careerData.marketDemand,
        jobProspects: careerData.jobProspects || [],
        salary: {
          entry: careerData.entryLevelSalary,
          mid: careerData.midLevelSalary,
          senior: careerData.seniorLevelSalary,
        },
        programDuration: careerData.programDuration,
        skillsRequired: careerData.skillsRequired || [],
        careerPath: {
          entryLevel: {
            roles: careerData.entryLevelRoles || [],
            experience: careerData.entryLevelExperience || '',
            description: careerData.entryLevelDescription || '',
          },
          midLevel: {
            roles: careerData.midLevelRoles || [],
            experience: careerData.midLevelExperience || '',
            description: careerData.midLevelDescription || '',
          },
          seniorLevel: {
            roles: careerData.seniorLevelRoles || [],
            experience: careerData.seniorLevelExperience || '',
            description: careerData.seniorLevelDescription || '',
          },
          executiveLevel: {
            roles: careerData.executiveLevelRoles || [],
            experience: careerData.executiveLevelExperience || '',
            description: careerData.executiveLevelDescription || '',
          },
        },
        certifications: careerData.certifications || [],
        industryTrends: careerData.industryTrends || [],
        featured: careerData.featured || false,
        image: careerData.image, // Now this will be a Cloudinary URL
      };

      return api.post('/careers', transformedData);
    },
    onSuccess: () => {
      message.success('Career created successfully');
      setCareerModalVisible(false);
      form.resetFields();
      setImageUrl('');
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create career');
    },
  });

  // Update career mutation
  const updateCareerMutation = useMutation({
    mutationFn: ({ id, careerData }) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        title: careerData.title,
        category: careerData.category,
        description: careerData.description,
        keySubjects: careerData.keySubjects || [],
        requiredGrades: careerData.requiredGrades || {},
        minimumMeanGrade: careerData.minimumMeanGrade,
        marketDemand: careerData.marketDemand,
        jobProspects: careerData.jobProspects || [],
        salary: {
          entry: careerData.entryLevelSalary,
          mid: careerData.midLevelSalary,
          senior: careerData.seniorLevelSalary,
        },
        programDuration: careerData.programDuration,
        skillsRequired: careerData.skillsRequired || [],
        careerPath: {
          entryLevel: {
            roles: careerData.entryLevelRoles || [],
            experience: careerData.entryLevelExperience || '',
            description: careerData.entryLevelDescription || '',
          },
          midLevel: {
            roles: careerData.midLevelRoles || [],
            experience: careerData.midLevelExperience || '',
            description: careerData.midLevelDescription || '',
          },
          seniorLevel: {
            roles: careerData.seniorLevelRoles || [],
            experience: careerData.seniorLevelExperience || '',
            description: careerData.seniorLevelDescription || '',
          },
          executiveLevel: {
            roles: careerData.executiveLevelRoles || [],
            experience: careerData.executiveLevelExperience || '',
            description: careerData.executiveLevelDescription || '',
          },
        },
        certifications: careerData.certifications || [],
        industryTrends: careerData.industryTrends || [],
        featured: careerData.featured || false,
        image: careerData.image, // Now this will be a Cloudinary URL
      };

      return api.put(`/careers/${id}`, transformedData);
    },
    onSuccess: () => {
      message.success('Career updated successfully');
      setCareerModalVisible(false);
      form.resetFields();
      setImageUrl('');
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update career');
    },
  });

  // Delete career mutation
  const deleteCareerMutation = useMutation({
    mutationFn: (careerId) => api.delete(`/careers/${careerId}`),
    onSuccess: () => {
      message.success('Career deleted successfully');
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete career');
    },
  });

  const showDeleteConfirm = (career) => {
    confirm({
      title: `Are you sure you want to delete ${career.title}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteCareerMutation.mutate(career._id);
      },
    });
  };

  const handleAddCareer = () => {
    setEditMode(false);
    setCurrentCareer(null);
    form.resetFields();
    setImageUrl('');
    setCareerModalVisible(true);
  };

  const handleEditCareer = (career) => {
    setEditMode(true);
    setCurrentCareer(career);
    setImageUrl(career.image || '');

    // Format the data for the form
    form.setFieldsValue({
      title: career.title,
      category: career.category,
      description: career.description,
      keySubjects: career.keySubjects || [],
      minimumMeanGrade: career.minimumMeanGrade,
      marketDemand: career.marketDemand,
      jobProspects: career.jobProspects || [],
      entryLevelSalary: career.salary?.entry,
      midLevelSalary: career.salary?.mid,
      seniorLevelSalary: career.salary?.senior,
      programDuration: career.programDuration,
      skillsRequired: career.skillsRequired || [],
      entryLevelRoles: career.careerPath?.entryLevel?.roles || [],
      entryLevelExperience: career.careerPath?.entryLevel?.experience,
      entryLevelDescription: career.careerPath?.entryLevel?.description,
      midLevelRoles: career.careerPath?.midLevel?.roles || [],
      midLevelExperience: career.careerPath?.midLevel?.experience,
      midLevelDescription: career.careerPath?.midLevel?.description,
      seniorLevelRoles: career.careerPath?.seniorLevel?.roles || [],
      seniorLevelExperience: career.careerPath?.seniorLevel?.experience,
      seniorLevelDescription: career.careerPath?.seniorLevel?.description,
      executiveLevelRoles: career.careerPath?.executiveLevel?.roles || [],
      executiveLevelExperience: career.careerPath?.executiveLevel?.experience,
      executiveLevelDescription: career.careerPath?.executiveLevel?.description,
      industryTrends: career.industryTrends || [],
      featured: career.featured || false,
      image: career.image,
    });

    setCareerModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (editMode) {
      updateCareerMutation.mutate({
        id: currentCareer._id,
        careerData: values,
      });
    } else {
      createCareerMutation.mutate(values);
    }
  };

  const filteredCareers = careers?.filter(
    (career) =>
      career.title.toLowerCase().includes(searchText.toLowerCase()) ||
      career.description.toLowerCase().includes(searchText.toLowerCase()) ||
      career.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center">
          {record.image && (
            <img
              src={record.image || '/placeholder.svg'}
              alt={text}
              className="w-10 h-10 object-cover rounded mr-2"
            />
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Salary Range',
      key: 'salary',
      render: (_, record) => (
        <span>
          {record.salary?.entry} - {record.salary?.senior}
        </span>
      ),
    },
    {
      title: 'Market Demand',
      dataIndex: 'marketDemand',
      key: 'marketDemand',
      render: (demand) => {
        let color = 'green';
        if (demand === 'Low') color = 'red';
        else if (demand === 'Medium') color = 'orange';

        return <Tag color={color}>{demand}</Tag>;
      },
    },
    {
      title: 'Min. Grade',
      dataIndex: 'minimumMeanGrade',
      key: 'minimumMeanGrade',
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) =>
        featured ? (
          <Tag color="blue">FEATURED</Tag>
        ) : (
          <Tag color="default">STANDARD</Tag>
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
              onClick={() => window.open(`/career/${record._id}`, '_blank')}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Edit Career">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditCareer(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Delete Career">
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
        title="Career Management"
        subtitle="Manage career information and recommendations"
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCareer}
          >
            Add Career
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <Input
            placeholder="Search careers..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCareers}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editMode ? 'Edit Career' : 'Add New Career'}
        open={careerModalVisible}
        onCancel={() => setCareerModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            marketDemand: 'Medium',
            minimumMeanGrade: 'C+',
            featured: false,
            keySubjects: [],
            skillsRequired: [],
            jobProspects: [],
            industryTrends: [],
          }}
        >
          <Collapse defaultActiveKey={['1']} className="mb-4">
            <Panel header="Basic Information" key="1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="title"
                  label="Career Title"
                  rules={[
                    { required: true, message: 'Please enter career title' },
                  ]}
                >
                  <Input placeholder="e.g. Software Engineer" />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: 'Please select a category' },
                  ]}
                >
                  <Select placeholder="Select category">
                    <Option value="Technology">Technology</Option>
                    <Option value="Engineering">Engineering</Option>
                    <Option value="Healthcare">Healthcare</Option>
                    <Option value="Business">Business</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Education">Education</Option>
                    <Option value="Arts">Arts</Option>
                    <Option value="Science">Science</Option>
                    <Option value="Legal">Legal</Option>
                    <Option value="Social Sciences">Social Sciences</Option>
                    <Option value="Agriculture">Agriculture</Option>
                    <Option value="Hospitality">Hospitality</Option>
                    <Option value="Media">Media</Option>
                    <Option value="Construction">Construction</Option>
                    <Option value="Manufacturing">Manufacturing</Option>
                    <Option value="Transportation">Transportation</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter a description' },
                ]}
              >
                <TextArea rows={4} placeholder="Describe the career..." />
              </Form.Item>

              <Form.Item
                name="programDuration"
                label="Program Duration"
                rules={[
                  { required: true, message: 'Please enter program duration' },
                ]}
              >
                <Input placeholder="e.g. 4 years" />
              </Form.Item>

              <Form.Item
                name="featured"
                valuePropName="checked"
                label="Featured Career"
              >
                <Switch />
              </Form.Item>
            </Panel>

            <Panel header="Education Requirements" key="2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="minimumMeanGrade"
                  label="Minimum Mean Grade"
                  rules={[
                    { required: true, message: 'Please select minimum grade' },
                  ]}
                >
                  <Select placeholder="Select minimum grade">
                    <Option value="A">A</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B">B</Option>
                    <Option value="B-">B-</Option>
                    <Option value="C+">C+</Option>
                    <Option value="C">C</Option>
                    <Option value="C-">C-</Option>
                    <Option value="D+">D+</Option>
                    <Option value="D">D</Option>
                    <Option value="D-">D-</Option>
                    <Option value="E">E</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="keySubjects"
                  label="Key Subjects"
                  rules={[
                    { required: true, message: 'Please add key subjects' },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Add subjects"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>
            </Panel>

            <Panel header="Market Information" key="3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="marketDemand"
                  label="Market Demand"
                  rules={[
                    { required: true, message: 'Please select market demand' },
                  ]}
                >
                  <Select placeholder="Select market demand">
                    <Option value="Very High">Very High</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="jobProspects"
                  label="Job Prospects"
                  rules={[
                    { required: true, message: 'Please add job prospects' },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Add job prospects"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="entryLevelSalary"
                  label="Entry Level Salary"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter entry level salary',
                    },
                  ]}
                >
                  <Input placeholder="e.g. $50,000 - $60,000" />
                </Form.Item>

                <Form.Item
                  name="midLevelSalary"
                  label="Mid-Career Salary"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter mid-career salary',
                    },
                  ]}
                >
                  <Input placeholder="e.g. $70,000 - $90,000" />
                </Form.Item>

                <Form.Item
                  name="seniorLevelSalary"
                  label="Senior Level Salary"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter senior level salary',
                    },
                  ]}
                >
                  <Input placeholder="e.g. $100,000 - $130,000" />
                </Form.Item>
              </div>

              <Form.Item name="industryTrends" label="Industry Trends">
                <Select
                  mode="tags"
                  placeholder="Add industry trends"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Panel>

            <Panel header="Skills & Career Path" key="4">
              <Form.Item
                name="skillsRequired"
                label="Skills Required"
                rules={[
                  { required: true, message: 'Please add required skills' },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Add skills"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Divider orientation="left">Entry Level</Divider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="entryLevelRoles" label="Entry Level Roles">
                  <Select
                    mode="tags"
                    placeholder="Add roles"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="entryLevelExperience"
                  label="Required Experience"
                >
                  <Input placeholder="e.g. 0-2 years" />
                </Form.Item>
              </div>
              <Form.Item name="entryLevelDescription" label="Description">
                <TextArea
                  rows={2}
                  placeholder="Describe entry level positions..."
                />
              </Form.Item>

              <Divider orientation="left">Mid Level</Divider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="midLevelRoles" label="Mid Level Roles">
                  <Select
                    mode="tags"
                    placeholder="Add roles"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="midLevelExperience"
                  label="Required Experience"
                >
                  <Input placeholder="e.g. 3-5 years" />
                </Form.Item>
              </div>
              <Form.Item name="midLevelDescription" label="Description">
                <TextArea
                  rows={2}
                  placeholder="Describe mid level positions..."
                />
              </Form.Item>

              <Divider orientation="left">Senior Level</Divider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="seniorLevelRoles" label="Senior Level Roles">
                  <Select
                    mode="tags"
                    placeholder="Add roles"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="seniorLevelExperience"
                  label="Required Experience"
                >
                  <Input placeholder="e.g. 6-10 years" />
                </Form.Item>
              </div>
              <Form.Item name="seniorLevelDescription" label="Description">
                <TextArea
                  rows={2}
                  placeholder="Describe senior level positions..."
                />
              </Form.Item>

              <Divider orientation="left">Executive Level</Divider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="executiveLevelRoles"
                  label="Executive Level Roles"
                >
                  <Select
                    mode="tags"
                    placeholder="Add roles"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="executiveLevelExperience"
                  label="Required Experience"
                >
                  <Input placeholder="e.g. 10+ years" />
                </Form.Item>
              </div>
              <Form.Item name="executiveLevelDescription" label="Description">
                <TextArea
                  rows={2}
                  placeholder="Describe executive level positions..."
                />
              </Form.Item>
            </Panel>

            <Panel header="Media" key="5">
              <Form.Item name="image" label="Career Image" className="mb-2">
                <Input hidden />
                {imageUrl && (
                  <div className="mb-3">
                    <img
                      src={imageUrl || '/placeholder.svg'}
                      alt="Career"
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
                    folder: 'careers',
                  }}
                  onUploadSuccess={handleImageUpload}
                  setLoading={setLoading}
                  buttonText="Upload Image"
                />
                {loading && <div className="mt-2">Uploading image...</div>}
              </Form.Item>
            </Panel>
          </Collapse>

          <div className="flex justify-end">
            <Button
              onClick={() => setCareerModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                createCareerMutation.isLoading || updateCareerMutation.isLoading
              }
              disabled={loading}
            >
              {editMode ? 'Update Career' : 'Create Career'}
            </Button>
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default CareerManagement;
