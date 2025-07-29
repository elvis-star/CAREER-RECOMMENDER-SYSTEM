'use client';

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Button,
  Pagination,
  Empty,
  Spin,
  Space,
  Alert,
  Tooltip,
  Tabs,
  Breadcrumb,
  Badge,
  ConfigProvider,
  Statistic,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BookOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  FilterOutlined,
  EyeOutlined,
  StarFilled,
  TrophyOutlined,
  BuildOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitutions } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const Institutions = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [activeTab, setActiveTab] = useState('all');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch institutions with filters
  const {
    data: institutionsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'institutions',
      searchTerm,
      type,
      location,
      sortBy,
      currentPage,
      pageSize,
    ],
    queryFn: () => {
      const params = {
        search: searchTerm,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
      };

      // Only add type filter if it's not empty (for "All Institutions" tab)
      if (type) {
        params.type = type;
      }

      // Only add location filter if it's not empty
      if (location) {
        params['location.city'] = location;
      }

      return fetchInstitutions(params);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleTypeChange = (value) => {
    setType(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setLocation(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'all') {
      setType(''); // Clear type filter to show all institutions
    } else {
      setType(key); // Set specific type filter
    }
    setCurrentPage(1);
  };

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setType('');
    setLocation('');
    setSortBy('name');
    setCurrentPage(1);
    setActiveTab('all'); // Ensure we go back to "all" tab
  };

  // Institution types - matching backend enum
  const institutionTypes = [
    'University',
    'College',
    'Technical Institute',
    'Vocational Center',
    'Other',
  ];

  // Get institutions data
  const institutions = institutionsData?.data || [];
  const totalInstitutions = institutionsData?.total || 0;

  // Calculate statistics
  const institutionStats = useMemo(() => {
    if (!institutions.length) return null;

    const typeDistribution = institutions.reduce((acc, inst) => {
      acc[inst.type] = (acc[inst.type] || 0) + 1;
      return acc;
    }, {});

    const locationDistribution = institutions.reduce((acc, inst) => {
      const city = inst.location?.city;
      if (city) {
        acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
    }, {});

    const totalPrograms = institutions.reduce(
      (sum, inst) => sum + (inst.programs?.length || 0),
      0
    );
    const featuredCount = institutions.filter((inst) => inst.featured).length;
    const averagePrograms =
      institutions.length > 0
        ? Math.round(totalPrograms / institutions.length)
        : 0;

    return {
      typeDistribution,
      locationDistribution,
      totalPrograms,
      featuredCount,
      averagePrograms,
      oldestYear: Math.min(
        ...institutions
          .filter((i) => i.establishedYear)
          .map((i) => i.establishedYear)
      ),
      newestYear: Math.max(
        ...institutions
          .filter((i) => i.establishedYear)
          .map((i) => i.establishedYear)
      ),
    };
  }, [institutions]);

  // Get unique locations from data
  const getUniqueLocations = () => {
    if (!institutions.length) return [];
    const locations = institutions
      .map((inst) => inst.location?.city)
      .filter(Boolean);
    return [...new Set(locations)].sort();
  };

  // Get featured institutions
  const getFeaturedInstitutions = () => {
    return institutions.filter((inst) => inst.featured).slice(0, 3);
  };

  // Get sort icon
  const getSortIcon = () => {
    if (sortBy.startsWith('-')) {
      return <SortDescendingOutlined className="text-blue-500" />;
    }
    return <SortAscendingOutlined className="text-blue-500" />;
  };

  // Render institution card (grid view)
  const renderInstitutionCard = (institution) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={institution._id} className="mb-6">
      <Card
        hoverable
        className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 group"
        cover={
          <div className="relative h-48 overflow-hidden">
            <img
              src={
                institution.logo ||
                '/placeholder.svg?height=200&width=400&text=Institution'
              }
              alt={institution.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src =
                  '/placeholder.svg?height=200&width=400&text=Institution';
              }}
            />
            <div className="absolute top-3 right-3 flex gap-2">
              {institution.featured && (
                <Badge
                  count={<StarFilled style={{ color: '#faad14' }} />}
                  offset={[0, 0]}
                />
              )}
              {institution.establishedYear && (
                <Tag color="blue" className="text-xs">
                  Est. {institution.establishedYear}
                </Tag>
              )}
            </div>
          </div>
        }
      >
        <div className="p-2">
          <div className="mb-3">
            <Title
              level={4}
              className="mb-2 dark:text-gray-100 line-clamp-2"
              style={{ minHeight: '3.5rem' }}
            >
              {institution.name}
            </Title>
            <div className="flex items-center justify-between mb-2">
              <Tag color="blue" className="text-xs">
                {institution.type}
              </Tag>
              {institution.programs?.length > 0 && (
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {institution.programs.length} programs
                </Text>
              )}
            </div>
          </div>

          <div className="flex items-center mb-3 text-sm dark:text-gray-400">
            <EnvironmentOutlined className="mr-1 text-blue-500" />
            <span className="truncate">
              {institution.location?.city}
              {institution.location?.county &&
                `, ${institution.location.county}`}
            </span>
          </div>

          <Paragraph
            ellipsis={{ rows: 2 }}
            className="mb-4 dark:text-gray-300 text-sm"
            style={{ minHeight: '2.5rem' }}
          >
            {institution.description ||
              'A leading educational institution offering quality programs.'}
          </Paragraph>

          {institution.programs?.length > 0 && (
            <div className="mb-4">
              <Text strong className="block mb-2 dark:text-gray-200 text-xs">
                Popular Programs:
              </Text>
              <div className="flex flex-wrap gap-1">
                {institution.programs.slice(0, 2).map((program, index) => (
                  <Tag
                    key={index}
                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 text-xs"
                  >
                    {program.name}
                  </Tag>
                ))}
                {institution.programs.length > 2 && (
                  <Tag className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 text-xs">
                    +{institution.programs.length - 2} more
                  </Tag>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
            <Link to={`/institutions/${institution._id}`}>
              <Button type="primary" size="small" icon={<EyeOutlined />}>
                View Details
              </Button>
            </Link>
            <Space size="small">
              {institution.contact?.phone && (
                <Tooltip title="Call">
                  <Button
                    size="small"
                    icon={<PhoneOutlined />}
                    href={`tel:${institution.contact.phone}`}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </Tooltip>
              )}
              {institution.website && (
                <Tooltip title="Visit Website">
                  <Button
                    size="small"
                    icon={<GlobalOutlined />}
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </Col>
  );

  // Render institution list item (list view)
  const renderInstitutionListItem = (institution) => (
    <Col xs={24} key={institution._id} className="mb-4">
      <Card
        hoverable
        className="transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 md:h-32 mb-4 md:mb-0 md:mr-6">
            <img
              src={
                institution.logo ||
                '/placeholder.svg?height=128&width=192&text=Institution'
              }
              alt={institution.name}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  '/placeholder.svg?height=128&width=192&text=Institution';
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
              <div>
                <Title level={4} className="mb-2 dark:text-gray-100">
                  {institution.name}
                </Title>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Tag color="blue">{institution.type}</Tag>
                  {institution.featured && (
                    <Badge
                      count={<StarFilled style={{ color: '#faad14' }} />}
                      offset={[0, 0]}
                    />
                  )}
                  {institution.establishedYear && (
                    <Tag color="green">Est. {institution.establishedYear}</Tag>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <Link to={`/institutions/${institution._id}`}>
                  <Button type="primary" icon={<EyeOutlined />}>
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center mb-3 text-sm dark:text-gray-400">
              <EnvironmentOutlined className="mr-1 text-blue-500" />
              <span>
                {institution.location?.city}
                {institution.location?.county &&
                  `, ${institution.location.county}`}
              </span>
            </div>

            <Paragraph
              ellipsis={{ rows: 2 }}
              className="mb-3 dark:text-gray-300"
            >
              {institution.description ||
                'A leading educational institution offering quality programs.'}
            </Paragraph>

            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-4 text-sm dark:text-gray-400">
                {institution.programs?.length > 0 && (
                  <div className="flex items-center">
                    <BookOutlined className="mr-1 text-blue-500" />
                    <span>{institution.programs.length} programs</span>
                  </div>
                )}
                {institution.facilities?.length > 0 && (
                  <div className="flex items-center">
                    <BuildOutlined className="mr-1 text-green-500" />
                    <span>{institution.facilities.length} facilities</span>
                  </div>
                )}
                {institution.views && (
                  <div className="flex items-center">
                    <EyeOutlined className="mr-1 text-purple-500" />
                    <span>{institution.views.toLocaleString()} views</span>
                  </div>
                )}
              </div>

              <Space size="small">
                {institution.contact?.phone && (
                  <Tooltip title="Call">
                    <Button
                      size="small"
                      icon={<PhoneOutlined />}
                      href={`tel:${institution.contact.phone}`}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </Tooltip>
                )}
                {institution.contact?.email && (
                  <Tooltip title="Email">
                    <Button
                      size="small"
                      icon={<MailOutlined />}
                      href={`mailto:${institution.contact.email}`}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </Tooltip>
                )}
                {institution.website && (
                  <Tooltip title="Visit Website">
                    <Button
                      size="small"
                      icon={<GlobalOutlined />}
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );

  // Calculate tab counts
  const getTabCounts = () => {
    const allCount = totalInstitutions;
    const typeCounts = institutionTypes.reduce((acc, type) => {
      acc[type] = institutions.filter((i) => i.type === type).length;
      return acc;
    }, {});

    return { allCount, typeCounts };
  };

  const { allCount, typeCounts } = getTabCounts();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? ConfigProvider.darkAlgorithm
          : ConfigProvider.defaultAlgorithm,
      }}
    >
      <div className="max-w-7xl mx-auto transition-colors duration-300">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="dark:text-gray-400">
            Resources
          </Breadcrumb.Item>
          <Breadcrumb.Item className="dark:text-gray-300">
            Institutions
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="text-center mb-12">
          <Title className="dark:text-white">Universities & Colleges</Title>
          <Paragraph className="max-w-3xl mx-auto dark:text-gray-300">
            Explore universities, colleges, and other educational institutions
            offering programs in your desired field. Find the perfect
            institution to pursue your career goals.
          </Paragraph>
        </div>

        {/* Statistics Overview */}
        {institutionStats && (
          <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="Total Institutions"
                  value={totalInstitutions}
                  prefix={<BankOutlined className="text-blue-500" />}
                  valueStyle={{ color: isDarkMode ? '#fff' : undefined }}
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="Featured"
                  value={institutionStats.featuredCount}
                  prefix={<StarFilled className="text-yellow-500" />}
                  valueStyle={{ color: isDarkMode ? '#fff' : undefined }}
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="Total Programs"
                  value={institutionStats.totalPrograms}
                  prefix={<BookOutlined className="text-green-500" />}
                  valueStyle={{ color: isDarkMode ? '#fff' : undefined }}
                />
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="Avg Programs"
                  value={institutionStats.averagePrograms}
                  prefix={<TrophyOutlined className="text-purple-500" />}
                  valueStyle={{ color: isDarkMode ? '#fff' : undefined }}
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Search
                placeholder="Search institutions by name, type, location, or programs..."
                allowClear
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                }
                size="large"
                onSearch={handleSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700"
              />
            </div>

            <div className="md:hidden">
              <Button
                icon={<FilterOutlined />}
                onClick={toggleFilters}
                type={filtersVisible ? 'primary' : 'default'}
                className="w-full"
              >
                Filters{' '}
                {Object.values({ type, location }).filter(Boolean).length > 0 &&
                  `(${
                    Object.values({ type, location }).filter(Boolean).length
                  })`}
              </Button>
            </div>

            <div
              className={`flex flex-wrap gap-3 ${
                filtersVisible ? 'block' : 'hidden md:flex'
              }`}
            >
              <Select
                placeholder="Institution Type"
                style={{ minWidth: 150 }}
                onChange={handleTypeChange}
                value={type || undefined}
                allowClear
                className="dark:bg-gray-700"
              >
                {institutionTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Location"
                style={{ minWidth: 150 }}
                onChange={handleLocationChange}
                value={location || undefined}
                allowClear
                className="dark:bg-gray-700"
              >
                {getUniqueLocations().map((location) => (
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Sort By"
                style={{ minWidth: 180 }}
                onChange={handleSortChange}
                value={sortBy}
                defaultValue="name"
                className="dark:bg-gray-700"
                suffixIcon={getSortIcon()}
              >
                <Option value="name">Name (A-Z)</Option>
                <Option value="-name">Name (Z-A)</Option>
                <Option value="-views">Most Viewed</Option>
                <Option value="-createdAt">Recently Added</Option>
                <Option value="establishedYear">Oldest First</Option>
                <Option value="-establishedYear">Newest First</Option>
                <Option value="-featured">Featured First</Option>
              </Select>

              <Button
                onClick={clearFilters}
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Featured Institutions */}
        {getFeaturedInstitutions().length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <StarFilled className="text-xl text-yellow-500 mr-2" />
                <Title level={2} className="mb-0 dark:text-white">
                  Featured Institutions
                </Title>
              </div>
              <Text className="text-gray-500 dark:text-gray-400">
                {getFeaturedInstitutions().length} featured
              </Text>
            </div>
            <Row gutter={[16, 16]}>
              {getFeaturedInstitutions().map(renderInstitutionCard)}
            </Row>
          </div>
        )}

        {/* All Institutions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BankOutlined className="text-xl text-blue-500 mr-2" />
              <Title level={2} className="mb-0 dark:text-white">
                All Institutions
              </Title>
            </div>
            <div className="flex items-center gap-3">
              <Text className="text-gray-500 dark:text-gray-400 hidden sm:block">
                {institutions.length} of {totalInstitutions} institutions
              </Text>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'text'}
                  size="small"
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode('grid')}
                  className={viewMode !== 'grid' ? 'dark:text-gray-300' : ''}
                />
                <Button
                  type={viewMode === 'list' ? 'primary' : 'text'}
                  size="small"
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode('list')}
                  className={viewMode !== 'list' ? 'dark:text-gray-300' : ''}
                />
              </div>
            </div>
          </div>

          <Tabs
            defaultActiveKey="all"
            activeKey={activeTab}
            onChange={handleTabChange}
            className="mb-6 institution-tabs"
            items={[
              {
                key: 'all',
                label: `All Institutions (${allCount})`,
              },
              ...institutionTypes.map((type) => ({
                key: type,
                label: `${type} (${typeCounts[type] || 0})`,
              })),
            ]}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spin size="large" />
              <Text className="mt-4 dark:text-gray-300">
                Loading institutions...
              </Text>
            </div>
          ) : isError ? (
            <Alert
              type="error"
              message="Error loading institutions"
              description="There was a problem fetching the institution data. Please try again later."
              className="mb-4"
              action={
                <Button size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          ) : institutions.length === 0 ? (
            <div className="text-center py-16">
              <Empty
                description={
                  <div>
                    <Text className="dark:text-gray-300 text-lg">
                      No institutions found
                    </Text>
                    <br />
                    <Text className="dark:text-gray-400">
                      Try adjusting your search criteria or clearing filters
                    </Text>
                  </div>
                }
                className="py-8"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              {(searchTerm || type || location) && (
                <Button type="primary" onClick={clearFilters} className="mt-4">
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <Text className="text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, totalInstitutions)} of{' '}
                  {totalInstitutions} institutions
                </Text>
                {searchTerm && (
                  <Text className="text-blue-500 dark:text-blue-400">
                    Search results for "{searchTerm}"
                  </Text>
                )}
              </div>

              <Row gutter={[16, 16]} className="mb-6">
                {viewMode === 'grid'
                  ? institutions.map(renderInstitutionCard)
                  : institutions.map(renderInstitutionListItem)}
              </Row>

              {totalInstitutions > pageSize && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalInstitutions}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} institutions`
                    }
                    className="dark:text-gray-300"
                    pageSizeOptions={['12', '24', '48', '96']}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Institution Categories */}
        {institutionStats && (
          <div className="mb-12">
            <Title level={2} className="text-center mb-6 dark:text-white">
              Browse by Category
            </Title>
            <Row gutter={[16, 16]}>
              {Object.entries(institutionStats.typeDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={type}>
                    <Card
                      hoverable
                      className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
                      onClick={() => {
                        setType(type);
                        setCurrentPage(1);
                        setActiveTab(type);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <BankOutlined className="text-4xl text-blue-500 mb-3" />
                      <Title level={4} className="dark:text-gray-100 mb-2">
                        {type}
                      </Title>
                      <Text className="dark:text-gray-400 block mb-2">
                        {count} institutions
                      </Text>
                      <Progress
                        percent={Math.round((count / totalInstitutions) * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        )}

        {/* Call to Action */}
        <div className="rounded-lg p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <Title level={3} className="dark:text-white">
            Find the Right Institution for Your Career
          </Title>
          <Paragraph className="max-w-2xl mx-auto mb-6 dark:text-gray-300">
            Take our career assessment to get personalized recommendations for
            institutions that offer programs aligned with your career goals.
          </Paragraph>
          <Space size="large" className="flex flex-wrap justify-center gap-4">
            <Link to="/input-results">
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0"
              >
                Get Career Recommendations
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="large"
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Contact an Advisor
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Institutions;
