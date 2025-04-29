'use client';

import { useState, useRef } from 'react';
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
  Card,
  Tabs,
  Tag,
  Typography,
  Badge,
  Drawer,
  Empty,
  Skeleton,
  Collapse,
  Avatar,
  Popconfirm,
  Alert,
  Switch,
  DatePicker,
  List,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  BuildOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import UploadWidget from '../../../components/v2/common/UploadWidget';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'react-feather';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const InstitutionManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [institutionModalVisible, setInstitutionModalVisible] = useState(false);
  const [programModalVisible, setProgramModalVisible] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form] = Form.useForm();
  const [programForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    city: [],
    featured: null,
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ascend');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  // Fetch institutions with pagination, filtering, and sorting
  const {
    data: institutionsData,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: [
      'admin-institutions',
      pagination.current,
      pagination.pageSize,
      searchText,
      filters,
      sortField,
      sortOrder,
    ],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.current.toString());
      params.append('limit', pagination.pageSize.toString());

      if (searchText) {
        params.append('search', searchText);
      }

      if (filters.type.length > 0) {
        params.append('type', filters.type.join(','));
      }

      if (filters.city.length > 0) {
        params.append('location.city', filters.city.join(','));
      }

      if (filters.featured !== null) {
        params.append('featured', filters.featured.toString());
      }

      params.append(
        'sort',
        `${sortOrder === 'descend' ? '-' : ''}${sortField}`
      );

      const response = await api.get(`/institutions?${params.toString()}`);

      // Update pagination with total from response
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
      }));

      return response.data;
    },
    keepPreviousData: true,
  });

  // Handle logo upload success
  const handleLogoUpload = (url) => {
    setLogoUrl(url);
    form.setFieldsValue({ logo: url });
  };

  // Handle institution images upload
  const handleImagesUpload = (url) => {
    setImageUrls((prev) => [...prev, url]);
    form.setFieldsValue({ images: [...imageUrls, url] });
  };

  // Create institution mutation
  const createInstitutionMutation = useMutation({
    mutationFn: (institutionData) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        name: institutionData.name,
        type: institutionData.type,
        location: {
          address: institutionData.address,
          city: institutionData.city,
          county: institutionData.county,
          country: institutionData.country,
          coordinates: {
            latitude: institutionData.latitude,
            longitude: institutionData.longitude,
          },
        },
        description: institutionData.description,
        website: institutionData.website,
        contact: {
          email: institutionData.email,
          phone: institutionData.phone,
          socialMedia: {
            facebook: institutionData.facebook,
            twitter: institutionData.twitter,
            instagram: institutionData.instagram,
            linkedin: institutionData.linkedin,
          },
        },
        programs: institutionData.programs || [],
        rankings: {
          national: institutionData.nationalRanking,
          international: institutionData.internationalRanking,
          year: institutionData.rankingYear,
        },
        facilities: institutionData.facilities || [],
        accreditation: institutionData.accreditation
          ? [institutionData.accreditation]
          : [],
        establishedYear: institutionData.establishedYear,
        logo: institutionData.logo,
        images: institutionData.images || [],
        featured: institutionData.featured || false,
      };

      return api.post('/institutions', transformedData);
    },
    onSuccess: () => {
      message.success({
        content: 'Institution created successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setInstitutionModalVisible(false);
      form.resetFields();
      setLogoUrl('');
      setImageUrls([]);
      setActiveTabKey('1');
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error({
        content:
          error.response?.data?.message || 'Failed to create institution',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
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
          address: institutionData.address,
          city: institutionData.city,
          county: institutionData.county,
          country: institutionData.country,
          coordinates: {
            latitude: institutionData.latitude,
            longitude: institutionData.longitude,
          },
        },
        description: institutionData.description,
        website: institutionData.website,
        contact: {
          email: institutionData.email,
          phone: institutionData.phone,
          socialMedia: {
            facebook: institutionData.facebook,
            twitter: institutionData.twitter,
            instagram: institutionData.instagram,
            linkedin: institutionData.linkedin,
          },
        },
        programs: institutionData.programs || [],
        rankings: {
          national: institutionData.nationalRanking,
          international: institutionData.internationalRanking,
          year: institutionData.rankingYear,
        },
        facilities: institutionData.facilities || [],
        accreditation: institutionData.accreditation
          ? [institutionData.accreditation]
          : [],
        establishedYear: institutionData.establishedYear,
        logo: institutionData.logo,
        images: institutionData.images || [],
        featured: institutionData.featured || false,
      };

      return api.put(`/institutions/${id}`, transformedData);
    },
    onSuccess: () => {
      message.success({
        content: 'Institution updated successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setInstitutionModalVisible(false);
      form.resetFields();
      setLogoUrl('');
      setImageUrls([]);
      setActiveTabKey('1');
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error({
        content:
          error.response?.data?.message || 'Failed to update institution',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Delete institution mutation
  const deleteInstitutionMutation = useMutation({
    mutationFn: (institutionId) => api.delete(`/institutions/${institutionId}`),
    onSuccess: () => {
      message.success({
        content: 'Institution deleted successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      message.error({
        content:
          error.response?.data?.message || 'Failed to delete institution',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Add program mutation
  const addProgramMutation = useMutation({
    mutationFn: ({ id, programData }) => {
      return api.post(`/institutions/${id}/programs`, programData);
    },
    onSuccess: () => {
      message.success({
        content: 'Program added successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setProgramModalVisible(false);
      programForm.resetFields();
      queryClient.invalidateQueries(['admin-institutions']);

      // Refresh the current institution details if drawer is open
      if (detailsDrawerVisible && currentInstitution) {
        queryClient.invalidateQueries(['institution', currentInstitution._id]);
      }
    },
    onError: (error) => {
      message.error({
        content: error.response?.data?.message || 'Failed to add program',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: ({ institutionId, programId, programData }) => {
      return api.put(
        `/institutions/${institutionId}/programs/${programId}`,
        programData
      );
    },
    onSuccess: () => {
      message.success({
        content: 'Program updated successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setProgramModalVisible(false);
      programForm.resetFields();
      queryClient.invalidateQueries(['admin-institutions']);

      // Refresh the current institution details if drawer is open
      if (detailsDrawerVisible && currentInstitution) {
        queryClient.invalidateQueries(['institution', currentInstitution._id]);
      }
    },
    onError: (error) => {
      message.error({
        content: error.response?.data?.message || 'Failed to update program',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: ({ institutionId, programId }) => {
      return api.delete(`/institutions/${institutionId}/programs/${programId}`);
    },
    onSuccess: () => {
      message.success({
        content: 'Program deleted successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      queryClient.invalidateQueries(['admin-institutions']);

      // Refresh the current institution details if drawer is open
      if (detailsDrawerVisible && currentInstitution) {
        queryClient.invalidateQueries(['institution', currentInstitution._id]);
      }
    },
    onError: (error) => {
      message.error({
        content: error.response?.data?.message || 'Failed to delete program',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Fetch single institution details
  const { data: institutionDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['institution', currentInstitution?._id],
    queryFn: async () => {
      if (!currentInstitution?._id) return null;
      const response = await api.get(`/institutions/${currentInstitution._id}`);
      return response.data.data;
    },
    enabled: !!currentInstitution?._id && detailsDrawerVisible,
  });

  const showDeleteConfirm = (institution) => {
    confirm({
      title: `Delete Institution: ${institution.name}`,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>
            Are you sure you want to delete this institution? This action cannot
            be undone.
          </p>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <WarningOutlined
                style={{ color: '#ff4d4f', marginRight: '8px' }}
              />
              <Text strong>Warning:</Text>
            </div>
            <Text>
              Deleting this institution will remove it from all recommendations
              and search results. Any data associated with this institution will
              be permanently lost.
            </Text>
          </div>
        </div>
      ),
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      width: 500,
      okButtonProps: {
        danger: true,
        icon: <DeleteOutlined />,
      },
      onOk() {
        deleteInstitutionMutation.mutate(institution._id);
      },
    });
  };

  const showDeleteProgramConfirm = (institutionId, programId, programName) => {
    confirm({
      title: `Delete Program: ${programName}`,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content:
        'Are you sure you want to delete this program? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteProgramMutation.mutate({ institutionId, programId });
      },
    });
  };

  const handleAddInstitution = () => {
    setEditMode(false);
    setCurrentInstitution(null);
    form.resetFields();
    setLogoUrl('');
    setImageUrls([]);
    setInstitutionModalVisible(true);
    setActiveTabKey('1');
  };

  const handleEditInstitution = (institution) => {
    setEditMode(true);
    setCurrentInstitution(institution);
    setLogoUrl(institution.logo || '');
    setImageUrls(institution.images || []);
    setActiveTabKey('1');

    // Format the data for the form
    form.setFieldsValue({
      name: institution.name,
      type: institution.type,
      address: institution.location?.address,
      city: institution.location?.city,
      county: institution.location?.county,
      country: institution.location?.country || 'Kenya',
      latitude: institution.location?.coordinates?.latitude,
      longitude: institution.location?.coordinates?.longitude,
      description: institution.description,
      website: institution.website,
      email: institution.contact?.email,
      phone: institution.contact?.phone,
      facebook: institution.contact?.socialMedia?.facebook,
      twitter: institution.contact?.socialMedia?.twitter,
      instagram: institution.contact?.socialMedia?.instagram,
      linkedin: institution.contact?.socialMedia?.linkedin,
      nationalRanking: institution.rankings?.national,
      internationalRanking: institution.rankings?.international,
      rankingYear: institution.rankings?.year,
      facilities: institution.facilities || [],
      accreditation: institution.accreditation?.[0] || '',
      establishedYear: institution.establishedYear,
      logo: institution.logo,
      images: institution.images || [],
      featured: institution.featured || false,
    });

    setInstitutionModalVisible(true);
  };

  const handleViewInstitution = (institution) => {
    setCurrentInstitution(institution);
    setDetailsDrawerVisible(true);
  };

  const handleAddProgram = (institution) => {
    setCurrentInstitution(institution);
    setCurrentProgram(null);
    programForm.resetFields();
    setProgramModalVisible(true);
  };

  const handleEditProgram = (institution, program) => {
    setCurrentInstitution(institution);
    setCurrentProgram(program);

    // Format the data for the form
    programForm.setFieldsValue({
      name: program.name,
      level: program.level,
      duration: program.duration,
      description: program.description,
      tuitionFees: program.tuitionFees,
      minimumGrade: program.entryRequirements?.minimumGrade,
      specificSubjects: program.entryRequirements?.specificSubjects || [],
      additionalRequirements:
        program.entryRequirements?.additionalRequirements || [],
    });

    setProgramModalVisible(true);
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

  const handleProgramFormSubmit = (values) => {
    // Transform the data to match the backend model structure
    const programData = {
      name: values.name,
      level: values.level,
      duration: values.duration,
      description: values.description,
      tuitionFees: values.tuitionFees,
      entryRequirements: {
        minimumGrade: values.minimumGrade,
        specificSubjects: values.specificSubjects || [],
        additionalRequirements: values.additionalRequirements || [],
      },
    };

    if (currentProgram) {
      // Update existing program
      updateProgramMutation.mutate({
        institutionId: currentInstitution._id,
        programId: currentProgram._id,
        programData,
      });
    } else {
      // Add new program
      addProgramMutation.mutate({
        id: currentInstitution._id,
        programData,
      });
    }
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const validateForm = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      const firstErrorField = error.errorFields[0]?.name[0];

      // Map field names to tab keys
      const fieldToTabMap = {
        name: '1',
        type: '1',
        description: '1',
        city: '1',
        country: '1',
        website: '2',
        email: '2',
        phone: '2',
        facilities: '3',
        accreditation: '3',
        nationalRanking: '3',
        logo: '4',
      };

      // Switch to the tab containing the first error
      if (firstErrorField && fieldToTabMap[firstErrorField]) {
        setActiveTabKey(fieldToTabMap[firstErrorField]);
      }

      return false;
    }
  };

  const handleNextTab = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const nextTab = String(Number(activeTabKey) + 1);
      if (Number(nextTab) <= 4) {
        setActiveTabKey(nextTab);
      }
    }
  };

  const handlePrevTab = () => {
    const prevTab = String(Number(activeTabKey) - 1);
    if (Number(prevTab) >= 1) {
      setActiveTabKey(prevTab);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('ascend');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return sortOrder === 'ascend' ? (
      <SortAscendingOutlined className="ml-1 text-blue-500" />
    ) : (
      <SortDescendingOutlined className="ml-1 text-blue-500" />
    );
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
    });
  };

  const columns = [
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('name')}
        >
          Institution {renderSortIcon('name')}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.logo ? (
            <Avatar
              src={record.logo || null}
              alt={text}
              size={40}
              className="mr-3"
              shape="square"
            />
          ) : (
            <Avatar
              icon={<BuildOutlined />}
              size={40}
              className="mr-3"
              shape="square"
              style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }}
            />
          )}
          <div>
            <div className="font-medium text-blue-600">{text}</div>
            <div className="text-xs text-gray-500 mt-1">
              <Tag color="default">{record.type}</Tag>
              {record.featured && (
                <Tag color="gold" icon={<StarOutlined />}>
                  Featured
                </Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('location.city')}
        >
          Location {renderSortIcon('location.city')}
        </div>
      ),
      key: 'location',
      render: (_, record) => (
        <span>
          <EnvironmentOutlined className="mr-1" />
          {record.location?.city}, {record.location?.country || 'Kenya'}
        </span>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('programs')}
        >
          Programs {renderSortIcon('programs')}
        </div>
      ),
      key: 'programs',
      render: (_, record) => (
        <Badge
          count={record.programs?.length || 0}
          showZero
          color="#1890ff"
          overflowCount={99}
        />
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.contact?.email && (
            <div>
              <MailOutlined className="mr-1" />
              <a href={`mailto:${record.contact.email}`}>
                {record.contact.email}
              </a>
            </div>
          )}
          {record.contact?.phone && (
            <div>
              <PhoneOutlined className="mr-1" />
              <a href={`tel:${record.contact.phone}`}>{record.contact.phone}</a>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website) =>
        website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <GlobalOutlined className="mr-1" /> Visit Site
          </a>
        ) : (
          <span className="text-gray-400">Not available</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => handleViewInstitution(record)}
              size="small"
              aria-label={`View details for ${record.name}`}
            />
          </Tooltip>

          <Tooltip title="Edit Institution">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditInstitution(record)}
              size="small"
              aria-label={`Edit ${record.name}`}
            />
          </Tooltip>

          <Tooltip title="Add Program">
            <Button
              type="default"
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddProgram(record)}
              size="small"
              aria-label={`Add program to ${record.name}`}
            />
          </Tooltip>

          <Tooltip title="Delete Institution">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
              size="small"
              aria-label={`Delete ${record.name}`}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filter panel component
  const FilterPanel = () => (
    <Card className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Text strong>Institution Type</Text>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%', marginTop: '8px' }}
            placeholder="Filter by type"
            value={filters.type}
            onChange={(values) => setFilters({ ...filters, type: values })}
            maxTagCount={2}
          >
            {[
              'University',
              'College',
              'Technical Institute',
              'Vocational Center',
              'Other',
            ].map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>City</Text>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%', marginTop: '8px' }}
            placeholder="Filter by city"
            value={filters.city}
            onChange={(values) => setFilters({ ...filters, city: values })}
            maxTagCount={2}
          >
            {Array.from(
              new Set(
                institutionsData?.data?.map((i) => i.location?.city) || []
              )
            )
              .filter(Boolean)
              .map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
          </Select>
        </div>

        <div>
          <Text strong>Status</Text>
          <Select
            allowClear
            style={{ width: '100%', marginTop: '8px' }}
            placeholder="Filter by status"
            value={filters.featured}
            onChange={(value) => setFilters({ ...filters, featured: value })}
          >
            <Option value={true}>Featured</Option>
            <Option value={false}>Standard</Option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            setFilters({
              type: [],
              city: [],
              featured: null,
            });
          }}
          className="mr-2"
        >
          Reset Filters
        </Button>
        <Button type="primary" onClick={() => setFilterVisible(false)}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );

  // Form tabs for better organization
  const formTabs = [
    {
      key: '1',
      tab: 'Basic Information',
      content: (
        <>
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
                <Option value="Vocational Center">Vocational Center</Option>
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

          <Form.Item name="establishedYear" label="Established Year">
            <DatePicker picker="year" placeholder="Select year" />
          </Form.Item>

          <Form.Item
            name="featured"
            valuePropName="checked"
            label="Featured Institution"
            extra="Featured institutions will be highlighted in search results and recommendations"
          >
            <Switch />
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

            <Form.Item name="county" label="County">
              <Input placeholder="e.g. Nairobi County" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="country"
              label="Country"
              initialValue="Kenya"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="e.g. Kenya" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input placeholder="e.g. University Way, Nairobi" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="latitude" label="Latitude">
              <Input placeholder="e.g. -1.2833" />
            </Form.Item>

            <Form.Item name="longitude" label="Longitude">
              <Input placeholder="e.g. 36.8167" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '2',
      tab: 'Contact Information',
      content: (
        <>
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
          </div>

          <Divider orientation="left">Social Media</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="facebook" label="Facebook">
              <Input placeholder="e.g. https://facebook.com/uonbi" />
            </Form.Item>

            <Form.Item name="twitter" label="Twitter">
              <Input placeholder="e.g. https://twitter.com/uonbi" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="instagram" label="Instagram">
              <Input placeholder="e.g. https://instagram.com/uonbi" />
            </Form.Item>

            <Form.Item name="linkedin" label="LinkedIn">
              <Input placeholder="e.g. https://linkedin.com/school/uonbi" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '3',
      tab: 'Facilities & Accreditation',
      content: (
        <>
          <Form.Item
            name="facilities"
            label="Facilities"
            extra="Press Enter after each facility"
          >
            <Select
              mode="tags"
              placeholder="Add facilities (e.g. Library, Computer Labs, Sports Complex)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="accreditation" label="Accreditation">
            <Input placeholder="e.g. Commission for University Education (CUE)" />
          </Form.Item>

          <Divider orientation="left">Rankings</Divider>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="nationalRanking" label="National Ranking">
              <Input type="number" placeholder="e.g. 1" min={1} />
            </Form.Item>

            <Form.Item
              name="internationalRanking"
              label="International Ranking"
            >
              <Input type="number" placeholder="e.g. 500" min={1} />
            </Form.Item>

            <Form.Item name="rankingYear" label="Ranking Year">
              <DatePicker picker="year" placeholder="Select year" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '4',
      tab: 'Media',
      content: (
        <>
          <Form.Item name="logo" label="Institution Logo" className="mb-6">
            <Input hidden />
            {logoUrl && (
              <div className="mb-3">
                <img
                  src={logoUrl || null}
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

          <Divider />

          <Form.Item name="images" label="Institution Images" className="mb-2">
            <Input hidden />
            {imageUrls.length > 0 && (
              <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || null}
                      alt={`Institution Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="absolute top-1 right-1"
                      onClick={() => {
                        const newUrls = [...imageUrls];
                        newUrls.splice(index, 1);
                        setImageUrls(newUrls);
                        form.setFieldsValue({ images: newUrls });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'career-recommender',
                multiple: false,
                maxImageFileSize: 5000000,
                folder: 'institutions',
              }}
              onUploadSuccess={handleImagesUpload}
              setLoading={setLoading}
              buttonText="Upload Image"
            />
            {loading && <div className="mt-2">Uploading image...</div>}
          </Form.Item>

          <Alert
            message="Image Guidelines"
            description={
              <ul className="list-disc pl-5 mt-2">
                <li>Use high-quality images that represent the institution</li>
                <li>Logo: Recommended size 400x400 pixels</li>
                <li>Images: Recommended size 1200x800 pixels</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported formats: JPG, PNG, GIF</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </>
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

      {fetchError && (
        <Alert
          message="Error Loading Institutions"
          description={
            fetchError.message ||
            'Failed to load institutions. Please try refreshing the page.'
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          className="mb-4"
        />
      )}

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search institutions by name, description, or location..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-md"
              allowClear
              size="large"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterVisible(!filterVisible)}
              type={
                Object.values(filters).some((v) =>
                  Array.isArray(v) ? v.length > 0 : v !== null
                )
                  ? 'primary'
                  : 'default'
              }
            >
              Filters
            </Button>

            <Tooltip title="Refresh data">
              <Button icon={<SyncOutlined />} onClick={() => refetch()} />
            </Tooltip>
          </div>
        </div>

        {filterVisible && <FilterPanel />}

        {isLoading ? (
          <div className="py-8">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <>
            <div className="mb-2 text-gray-500 text-sm">
              {institutionsData?.count || 0} institutions found
              {institutionsData?.total > 0 &&
                ` (${institutionsData.total} total)`}
            </div>

            <Table
              columns={columns}
              dataSource={institutionsData?.data || []}
              rowKey="_id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} institutions`,
              }}
              onChange={handleTableChange}
              rowClassName="hover:bg-gray-50"
              scroll={{ x: 'max-content' }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>
                        No institutions found.{' '}
                        {searchText && 'Try adjusting your search.'}
                      </span>
                    }
                  />
                ),
              }}
            />
          </>
        )}
      </Card>

      {/* Institution Form Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {editMode ? (
              <>
                <EditOutlined className="mr-2 text-blue-500" />
                <span>Edit Institution: {currentInstitution?.name}</span>
              </>
            ) : (
              <>
                <PlusOutlined className="mr-2 text-green-500" />
                <span>Add New Institution</span>
              </>
            )}
          </div>
        }
        open={institutionModalVisible}
        onCancel={() => setInstitutionModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            type: 'University',
            country: 'Kenya',
            featured: false,
            facilities: [],
          }}
          ref={formRef}
        >
          <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
            {formTabs.map((tab) => (
              <TabPane tab={tab.tab} key={tab.key}>
                {tab.content}
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-between mt-6">
            <div>
              {activeTabKey !== '1' && (
                <Button onClick={handlePrevTab}>Previous</Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setInstitutionModalVisible(false)}>
                Cancel
              </Button>

              {activeTabKey !== '4' ? (
                <Button type="primary" onClick={handleNextTab}>
                  Next
                </Button>
              ) : (
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
              )}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Program Form Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {currentProgram ? (
              <>
                <EditOutlined className="mr-2 text-blue-500" />
                <span>Edit Program: {currentProgram?.name}</span>
              </>
            ) : (
              <>
                <PlusOutlined className="mr-2 text-green-500" />
                <span>Add New Program to {currentInstitution?.name}</span>
              </>
            )}
          </div>
        }
        open={programModalVisible}
        onCancel={() => setProgramModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={programForm}
          layout="vertical"
          onFinish={handleProgramFormSubmit}
          initialValues={{
            level: 'Bachelors',
            specificSubjects: [],
            additionalRequirements: [],
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Program Name"
              rules={[{ required: true, message: 'Please enter program name' }]}
            >
              <Input placeholder="e.g. Bachelor of Science in Computer Science" />
            </Form.Item>

            <Form.Item
              name="level"
              label="Program Level"
              rules={[
                { required: true, message: 'Please select program level' },
              ]}
            >
              <Select placeholder="Select level">
                <Option value="Certificate">Certificate</Option>
                <Option value="Diploma">Diploma</Option>
                <Option value="Bachelors">Bachelors</Option>
                <Option value="Masters">Masters</Option>
                <Option value="Doctorate">Doctorate</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                { required: true, message: 'Please enter program duration' },
              ]}
            >
              <Input placeholder="e.g. 4 years" />
            </Form.Item>

            <Form.Item name="tuitionFees" label="Tuition Fees">
              <Input placeholder="e.g. KES 120,000 per semester" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={3} placeholder="Describe the program..." />
          </Form.Item>

          <Divider orientation="left">Entry Requirements</Divider>

          <Form.Item name="minimumGrade" label="Minimum Grade">
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
            </Select>
          </Form.Item>

          <Form.List name="specificSubjects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'subject']}
                      rules={[
                        { required: true, message: 'Please enter subject' },
                      ]}
                    >
                      <Input placeholder="Subject (e.g. Mathematics)" />
                    </Form.Item>
                    <div className="flex items-center gap-2">
                      <Form.Item
                        {...restField}
                        name={[name, 'grade']}
                        className="flex-1"
                        rules={[
                          { required: true, message: 'Please enter grade' },
                        ]}
                      >
                        <Select placeholder="Grade">
                          <Option value="A">A</Option>
                          <Option value="A-">A-</Option>
                          <Option value="B+">B+</Option>
                          <Option value="B">B</Option>
                          <Option value="B-">B-</Option>
                          <Option value="C+">C+</Option>
                          <Option value="C">C</Option>
                        </Select>
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Subject Requirement
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="additionalRequirements"
            label="Additional Requirements"
            extra="Press Enter after each requirement"
          >
            <Select
              mode="tags"
              placeholder="Add additional requirements"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setProgramModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                addProgramMutation.isLoading || updateProgramMutation.isLoading
              }
            >
              {currentProgram ? 'Update Program' : 'Add Program'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Institution Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <BuildOutlined className="mr-2 text-blue-500" />
            <span>{currentInstitution?.name}</span>
            {currentInstitution?.featured && (
              <Tag color="gold" icon={<StarOutlined />} className="ml-2">
                Featured
              </Tag>
            )}
          </div>
        }
        width={700}
        placement="right"
        onClose={() => setDetailsDrawerVisible(false)}
        open={detailsDrawerVisible}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddProgram(currentInstitution)}
            >
              Add Program
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setDetailsDrawerVisible(false);
                handleEditInstitution(institutionDetails || currentInstitution);
              }}
            >
              Edit
            </Button>
          </Space>
        }
      >
        {isLoadingDetails ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <>
            <div className="mb-6">
              {institutionDetails?.logo && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={institutionDetails.logo || null}
                    alt={institutionDetails.name}
                    className="h-32 object-contain"
                  />
                </div>
              )}

              <div className="mb-4">
                <Text type="secondary">Type</Text>
                <div>
                  <Tag color="blue">{institutionDetails?.type}</Tag>
                </div>
              </div>

              <div className="mb-4">
                <Text type="secondary">Description</Text>
                <Paragraph>{institutionDetails?.description}</Paragraph>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Text type="secondary">Location</Text>
                  <div className="flex items-start mt-1">
                    <EnvironmentOutlined className="mt-1 mr-2 text-gray-500" />
                    <div>
                      {institutionDetails?.location?.address && (
                        <div>{institutionDetails.location.address}</div>
                      )}
                      <div>
                        {institutionDetails?.location?.city},{' '}
                        {institutionDetails?.location?.country}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Text type="secondary">Contact</Text>
                  <div className="mt-1">
                    {institutionDetails?.contact?.email && (
                      <div className="flex items-center mb-1">
                        <MailOutlined className="mr-2 text-gray-500" />
                        <a href={`mailto:${institutionDetails.contact.email}`}>
                          {institutionDetails.contact.email}
                        </a>
                      </div>
                    )}
                    {institutionDetails?.contact?.phone && (
                      <div className="flex items-center mb-1">
                        <PhoneOutlined className="mr-2 text-gray-500" />
                        <a href={`tel:${institutionDetails.contact.phone}`}>
                          {institutionDetails.contact.phone}
                        </a>
                      </div>
                    )}
                    {institutionDetails?.website && (
                      <div className="flex items-center">
                        <GlobalOutlined className="mr-2 text-gray-500" />
                        <a
                          href={institutionDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {institutionDetails.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {institutionDetails?.establishedYear && (
                <div className="mb-4">
                  <Text type="secondary">Established</Text>
                  <div className="flex items-center mt-1">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <span>{institutionDetails.establishedYear}</span>
                  </div>
                </div>
              )}

              {(institutionDetails?.rankings?.national ||
                institutionDetails?.rankings?.international) && (
                <div className="mb-4">
                  <Text type="secondary">Rankings</Text>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {institutionDetails?.rankings?.national && (
                      <Tag color="green">
                        National: #{institutionDetails.rankings.national}
                      </Tag>
                    )}
                    {institutionDetails?.rankings?.international && (
                      <Tag color="blue">
                        International: #
                        {institutionDetails.rankings.international}
                      </Tag>
                    )}
                    {institutionDetails?.rankings?.year && (
                      <Tag color="default">
                        {institutionDetails.rankings.year}
                      </Tag>
                    )}
                  </div>
                </div>
              )}

              {institutionDetails?.facilities?.length > 0 && (
                <div className="mb-4">
                  <Text type="secondary">Facilities</Text>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {institutionDetails.facilities.map((facility, index) => (
                      <Tag key={index} color="default">
                        {facility}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {institutionDetails?.accreditation?.length > 0 && (
                <div className="mb-4">
                  <Text type="secondary">Accreditation</Text>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {institutionDetails.accreditation.map((item, index) => (
                      <Tag key={index} color="purple">
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <Divider orientation="left">Programs</Divider>

              {institutionDetails?.programs?.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={institutionDetails.programs}
                  renderItem={(program) => (
                    <List.Item
                      key={program._id}
                      actions={[
                        <Button
                          key="edit"
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() =>
                            handleEditProgram(institutionDetails, program)
                          }
                        >
                          Edit
                        </Button>,
                        <Popconfirm
                          key="delete"
                          title="Delete this program?"
                          description="Are you sure you want to delete this program?"
                          onConfirm={() =>
                            showDeleteProgramConfirm(
                              institutionDetails._id,
                              program._id,
                              program.name
                            )
                          }
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<BookOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        }
                        title={
                          <div className="flex items-center">
                            <span className="mr-2">{program.name}</span>
                            <Tag color="blue">{program.level}</Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div className="mb-1">
                              <ClockCircleOutlined className="mr-1" />{' '}
                              {program.duration}
                            </div>
                            {program.tuitionFees && (
                              <div>
                                <DollarSign size={14} className="mr-1" />{' '}
                                {program.tuitionFees}
                              </div>
                            )}
                          </div>
                        }
                      />
                      <div className="mt-2">{program.description}</div>

                      {(program.entryRequirements?.minimumGrade ||
                        program.entryRequirements?.specificSubjects?.length >
                          0 ||
                        program.entryRequirements?.additionalRequirements
                          ?.length > 0) && (
                        <Collapse ghost className="mt-2">
                          <Panel header="Entry Requirements" key="1">
                            {program.entryRequirements?.minimumGrade && (
                              <div className="mb-2">
                                <Text strong>Minimum Grade:</Text>{' '}
                                {program.entryRequirements.minimumGrade}
                              </div>
                            )}

                            {program.entryRequirements?.specificSubjects
                              ?.length > 0 && (
                              <div className="mb-2">
                                <Text strong>Subject Requirements:</Text>
                                <ul className="list-disc pl-5 mt-1">
                                  {program.entryRequirements.specificSubjects.map(
                                    (subject, index) => (
                                      <li key={index}>
                                        {subject.subject}: {subject.grade}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {program.entryRequirements?.additionalRequirements
                              ?.length > 0 && (
                              <div className="mb-2">
                                <Text strong>Additional Requirements:</Text>
                                <ul className="list-disc pl-5 mt-1">
                                  {program.entryRequirements.additionalRequirements.map(
                                    (req, index) => (
                                      <li key={index}>{req}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </Panel>
                        </Collapse>
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="No programs found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}

              {institutionDetails?.images?.length > 0 && (
                <>
                  <Divider orientation="left">Images</Divider>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {institutionDetails.images.map((image, index) => (
                      <div key={index} className="aspect-video">
                        <img
                          src={image || null}
                          alt={`${institutionDetails.name} - Image ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Drawer>
    </AdminLayout>
  );
};

export default InstitutionManagement;
