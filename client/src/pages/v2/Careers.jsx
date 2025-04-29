'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  Divider,
  Space,
  Alert,
  Tooltip,
  Drawer,
  Slider,
  Badge,
  Progress,
  Tabs,
  Skeleton,
  Modal,
  Collapse,
  Switch,
  Radio,
  Popover,
  notification,
  List,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  BookOutlined,
  RiseOutlined,
  BarChartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  CloseOutlined,
  PushpinOutlined,
  PushpinFilled,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCareers,
  saveCareer,
  unsaveCareer,
  rateCareer,
  viewCareer,
  fetchRelatedCareers,
  fetchCareerStats,
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserProfile, updateUserPreferences } from '../../services/api';
import { debounce } from 'lodash';
import { useInView } from 'react-intersection-observer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Utility function to combine Tailwind classes
const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Custom hook for persisting filters to URL
const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const getParam = (key, defaultValue) => {
    return searchParams.get(key) || defaultValue;
  };

  const setParam = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setMultipleParams = useCallback(
    (paramsObject) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(paramsObject).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return { getParam, setParam, setMultipleParams };
};

// Custom hook for viewport detection
const useElementOnScreen = (options) => {
  const [ref, inView] = useInView(options);
  return [ref, inView];
};

// Career card component
const CareerCard = ({
  career,
  savedCareers,
  pinnedCareers,
  handleSaveToggle,
  handlePinToggle,
  handleRateCareer,
  isAuthenticated,
  handleShare,
  handleViewDetails,
  userRatings,
  viewMode,
}) => {
  const isSaved = savedCareers.includes(career._id);
  const isPinned = pinnedCareers.includes(career._id);
  const userRating = userRatings[career._id] || 0;
  const [cardRef, isVisible] = useElementOnScreen({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Calculate salary range display
  const salaryDisplay = career.salaryRange ? (
    <div className="flex items-center gap-1">
      <DollarOutlined className="text-green-600" />
      <Text>
        {career.salaryRange.min
          ? `${career.salaryRange.min.toLocaleString()} - ${career.salaryRange.max.toLocaleString()}`
          : 'Varies'}
      </Text>
    </div>
  ) : null;

  // Calculate demand indicator
  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High':
        return 'red';
      case 'High':
        return 'orange';
      case 'Medium':
        return 'green';
      case 'Low':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getDemandPercentage = (demand) => {
    switch (demand) {
      case 'Very High':
        return 90;
      case 'High':
        return 75;
      case 'Medium':
        return 50;
      case 'Low':
        return 25;
      default:
        return 0;
    }
  };

  // Compact view for list mode
  if (viewMode === 'list') {
    return (
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={cardVariants}
        className="w-full"
      >
        <List.Item
          actions={[
            isAuthenticated && (
              <Tooltip
                title={isSaved ? 'Remove from saved' : 'Save career'}
                key="save"
              >
                <Button
                  type="text"
                  icon={
                    isSaved ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveToggle(career._id);
                  }}
                />
              </Tooltip>
            ),
            <Button
              key="details"
              type="link"
              onClick={() => handleViewDetails(career._id)}
            >
              View Details
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <div className="flex items-center gap-2">
                {career.title}
                {isPinned && <PushpinFilled className="text-blue-500" />}
              </div>
            }
            description={
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 flex-wrap">
                  <Tag color="blue">{career.category}</Tag>
                  {career.marketDemand && (
                    <Tag color={getDemandColor(career.marketDemand)}>
                      {career.marketDemand}
                    </Tag>
                  )}
                </div>
                {career.minimumMeanGrade && (
                  <Text type="secondary">
                    Min Grade: {career.minimumMeanGrade}
                  </Text>
                )}
              </div>
            }
          />
        </List.Item>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={cardVariants}
      className="h-full"
    >
      <Badge.Ribbon
        text={career.marketDemand}
        color={getDemandColor(career.marketDemand)}
        style={{ display: career.marketDemand ? 'block' : 'none' }}
      >
        <Card
          hoverable
          className={cn(
            'h-full transition-all duration-300 overflow-hidden',
            isPinned && 'border-blue-500 border-2'
          )}
          actions={[
            <Tooltip title={`${career.views || 0} views`} key="views">
              <Space>
                <EyeOutlined />
                <span>{career.views || 0}</span>
              </Space>
            </Tooltip>,
            isAuthenticated && (
              <Tooltip
                title={isSaved ? 'Remove from saved' : 'Save career'}
                key="save"
              >
                <Button
                  type="text"
                  icon={
                    isSaved ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveToggle(career._id);
                  }}
                />
              </Tooltip>
            ),
            isAuthenticated && (
              <Tooltip
                title={isPinned ? 'Unpin career' : 'Pin to top'}
                key="pin"
              >
                <Button
                  type="text"
                  icon={
                    isPinned ? (
                      <PushpinFilled className="text-blue-500" />
                    ) : (
                      <PushpinOutlined />
                    )
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePinToggle(career._id);
                  }}
                />
              </Tooltip>
            ),
            <Tooltip title="Share" key="share">
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare(career);
                }}
              />
            </Tooltip>,
          ]}
          onClick={() => handleViewDetails(career._id)}
        >
          <div className="flex flex-col h-full">
            <div className="mb-2 flex justify-between items-start">
              <Tag color="blue">{career.category}</Tag>
              {isAuthenticated && (
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="text"
                      size="small"
                      className="p-0 m-0"
                      icon={
                        star <= userRating ? (
                          <StarFilled className="text-yellow-400" />
                        ) : (
                          <StarOutlined />
                        )
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRateCareer(career._id, star);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <Title level={4} className="mb-2">
              {career.title}
            </Title>

            <Paragraph
              className="text-gray-500 mb-4 flex-grow"
              ellipsis={{ rows: 3 }}
            >
              {career.description ||
                'Explore this exciting career path and discover opportunities in this field.'}
            </Paragraph>

            <div className="mt-auto space-y-3">
              {/* Market demand indicator */}
              {career.marketDemand && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <Text type="secondary">Market Demand</Text>
                    <Text strong>{career.marketDemand}</Text>
                  </div>
                  <Progress
                    percent={getDemandPercentage(career.marketDemand)}
                    showInfo={false}
                    strokeColor={getDemandColor(career.marketDemand)}
                    size="small"
                  />
                </div>
              )}

              {/* Salary range if available */}
              {salaryDisplay}

              {/* Key subjects */}
              {career.keySubjects && career.keySubjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {career.keySubjects.slice(0, 3).map((subject, index) => (
                    <Tag key={index}>{subject}</Tag>
                  ))}
                  {career.keySubjects.length > 3 && (
                    <Tag>+{career.keySubjects.length - 3} more</Tag>
                  )}
                </div>
              )}

              {/* Minimum grade */}
              {career.minimumMeanGrade && (
                <div className="mt-2">
                  <Text type="secondary">Minimum Grade: </Text>
                  <Tag color="purple">{career.minimumMeanGrade}</Tag>
                </div>
              )}

              {/* Years of education */}
              {career.yearsOfEducation && (
                <div className="flex items-center gap-1">
                  <ClockCircleOutlined className="text-blue-500" />
                  <Text type="secondary">
                    {career.yearsOfEducation} years of education
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Badge.Ribbon>
    </motion.div>
  );
};

// Main Careers component
const Careers = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { getParam, setParam, setMultipleParams } = useFilterParams();

  // State from URL parameters
  const [searchTerm, setSearchTerm] = useState(getParam('search', ''));
  const [category, setCategory] = useState(getParam('category', ''));
  const [marketDemand, setMarketDemand] = useState(getParam('demand', ''));
  const [sortBy, setSortBy] = useState(getParam('sort', 'title'));
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(getParam('page', '1'))
  );
  const [pageSize, setPageSize] = useState(
    Number.parseInt(getParam('limit', '9'))
  );

  // Additional state
  const [savedCareers, setSavedCareers] = useState([]);
  const [pinnedCareers, setPinnedCareers] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  const [salaryRange, setSalaryRange] = useState([0, 500000]);
  const [yearsOfEducation, setYearsOfEducation] = useState([0, 10]);
  const [viewMode, setViewMode] = useState(getParam('view', 'grid'));
  const [compareList, setCompareList] = useState([]);
  const [compareDrawerVisible, setCompareDrawerVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentShareCareer, setCurrentShareCareer] = useState(null);
  const [careerDetailsDrawerVisible, setCareerDetailsDrawerVisible] =
    useState(false);
  const [currentCareerDetails, setCurrentCareerDetails] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    preferredCategories: [],
    preferredLocations: [],
    skillsInterests: [],
  });
  const [showRecommended, setShowRecommended] = useState(
    getParam('recommended', '') === 'true'
  );
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Refs
  const careerListRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch careers with filters
  const {
    data: careersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'careers',
      searchTerm,
      category,
      marketDemand,
      sortBy,
      currentPage,
      pageSize,
      salaryRange,
      yearsOfEducation,
      showRecommended,
    ],
    queryFn: () =>
      fetchCareers({
        search: searchTerm,
        category,
        marketDemand,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
        salaryMin: salaryRange[0],
        salaryMax: salaryRange[1],
        yearsOfEducationMin: yearsOfEducation[0],
        yearsOfEducationMax: yearsOfEducation[1],
        recommended: showRecommended,
      }),
  });

  // Fetch user's profile if authenticated
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => (isAuthenticated ? fetchUserProfile() : null),
    enabled: isAuthenticated,
  });

  // Fetch career statistics
  const { data: careerStats } = useQuery({
    queryKey: ['careerStats'],
    queryFn: fetchCareerStats,
    enabled: isAuthenticated,
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (careerId) => saveCareer(careerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (careerId) => unsaveCareer(careerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({ careerId, rating }) => rateCareer(careerId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const viewMutation = useMutation({
    mutationFn: (careerId) => viewCareer(careerId),
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences) => updateUserPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      notification.success({
        message: 'Preferences Updated',
        description: 'Your career preferences have been updated successfully.',
      });
    },
  });

  // Fetch related careers for the current career details
  const { data: relatedCareers } = useQuery({
    queryKey: ['relatedCareers', currentCareerDetails?._id],
    queryFn: () => fetchRelatedCareers(currentCareerDetails?._id),
    enabled: !!currentCareerDetails,
  });

  // Effect to update state from user profile
  useEffect(() => {
    if (userProfile) {
      // Update saved careers
      if (userProfile.savedCareers) {
        setSavedCareers(
          userProfile.savedCareers.map((career) => career._id || career)
        );
      }

      // Update pinned careers
      if (userProfile.pinnedCareers) {
        setPinnedCareers(
          userProfile.pinnedCareers.map((career) => career._id || career)
        );
      }

      // Update user ratings
      if (userProfile.careerRatings) {
        const ratings = {};
        userProfile.careerRatings.forEach((rating) => {
          ratings[rating.careerId] = rating.rating;
        });
        setUserRatings(ratings);
      }

      // Update user preferences
      if (userProfile.preferences) {
        setUserPreferences(userProfile.preferences);
      }
    }
  }, [userProfile]);

  // Effect to sync URL params with state
  useEffect(() => {
    setMultipleParams({
      search: searchTerm,
      category,
      demand: marketDemand,
      sort: sortBy,
      page: currentPage.toString(),
      limit: pageSize.toString(),
      view: viewMode,
      recommended: showRecommended ? 'true' : '',
    });
  }, [
    searchTerm,
    category,
    marketDemand,
    sortBy,
    currentPage,
    pageSize,
    viewMode,
    showRecommended,
    setMultipleParams,
  ]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search
  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleDemandChange = (value) => {
    setMarketDemand(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    // Scroll to top of career list
    if (careerListRef.current) {
      careerListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle save/unsave career
  const handleSaveToggle = async (careerId) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to save careers.',
      });
      return;
    }

    try {
      if (savedCareers.includes(careerId)) {
        await unsaveMutation.mutateAsync(careerId);
        setSavedCareers(savedCareers.filter((id) => id !== careerId));
      } else {
        await saveMutation.mutateAsync(careerId);
        setSavedCareers([...savedCareers, careerId]);
        notification.success({
          message: 'Career Saved',
          description: 'This career has been added to your saved list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update saved careers.',
      });
    }
  };

  // Handle pin/unpin career
  const handlePinToggle = async (careerId) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to pin careers.',
      });
      return;
    }

    try {
      // This would be a real API call in a production app
      if (pinnedCareers.includes(careerId)) {
        setPinnedCareers(pinnedCareers.filter((id) => id !== careerId));
      } else {
        setPinnedCareers([...pinnedCareers, careerId]);
        notification.success({
          message: 'Career Pinned',
          description: 'This career will now appear at the top of your list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update pinned careers.',
      });
    }
  };

  // Handle rating a career
  const handleRateCareer = async (careerId, rating) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to rate careers.',
      });
      return;
    }

    try {
      await rateMutation.mutateAsync({ careerId, rating });
      setUserRatings({
        ...userRatings,
        [careerId]: rating,
      });
      notification.success({
        message: 'Rating Submitted',
        description: 'Thank you for rating this career!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to submit rating.',
      });
    }
  };

  // Handle sharing a career
  const handleShare = (career) => {
    setCurrentShareCareer(career);
    setShareModalVisible(true);
  };

  // Handle view career details
  const handleViewDetails = (careerId) => {
    // Record view
    viewMutation.mutate(careerId);

    // Find career details
    const career = careersData?.data?.find((c) => c._id === careerId);
    if (career) {
      setCurrentCareerDetails(career);
      setCareerDetailsDrawerVisible(true);
    }
  };

  // Handle adding/removing from compare list
  const handleCompareToggle = (career) => {
    if (compareList.some((c) => c._id === career._id)) {
      setCompareList(compareList.filter((c) => c._id !== career._id));
    } else {
      if (compareList.length >= 3) {
        notification.warning({
          message: 'Compare Limit Reached',
          description: 'You can compare up to 3 careers at once.',
        });
        return;
      }
      setCompareList([...compareList, career]);
      notification.success({
        message: 'Added to Compare',
        description: `${career.title} added to comparison list.`,
      });
    }
  };

  // Handle export careers list
  const handleExport = async () => {
    if (!careersData?.data?.length) {
      notification.warning({
        message: 'No Data',
        description: 'There are no careers to export.',
      });
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === 'pdf') {
        const element = careerListRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('careers-list.pdf');
      }
      // CSV export is handled by the CSVLink component

      notification.success({
        message: 'Export Successful',
        description: `Careers list exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Export Failed',
        description: 'There was an error exporting the careers list.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle updating user preferences
  const handleUpdatePreferences = (newPreferences) => {
    updatePreferencesMutation.mutate({
      ...userPreferences,
      ...newPreferences,
    });
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => {
    if (!careersData?.data) return [];

    return [
      ['Title', 'Category', 'Market Demand', 'Minimum Grade', 'Description'],
      ...careersData.data.map((career) => [
        career.title,
        career.category,
        career.marketDemand || 'N/A',
        career.minimumMeanGrade || 'N/A',
        career.description || 'No description available',
      ]),
    ];
  }, [careersData?.data]);

  // Prepare sorted careers with pinned items first
  const sortedCareers = useMemo(() => {
    if (!careersData?.data) return [];

    return [...careersData.data].sort((a, b) => {
      const aIsPinned = pinnedCareers.includes(a._id);
      const bIsPinned = pinnedCareers.includes(b._id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [careersData?.data, pinnedCareers]);

  // Categories for filter
  const categories = [
    'Technology',
    'Engineering',
    'Healthcare',
    'Business',
    'Education',
    'Arts',
    'Science',
    'Law',
    'Agriculture',
    'Hospitality',
  ];

  // Prepare stats data for chart
  const statsData = useMemo(() => {
    if (!careerStats) return [];

    return [
      { name: 'Technology', value: careerStats.technologyCount || 0 },
      { name: 'Healthcare', value: careerStats.healthcareCount || 0 },
      { name: 'Business', value: careerStats.businessCount || 0 },
      { name: 'Engineering', value: careerStats.engineeringCount || 0 },
      { name: 'Education', value: careerStats.educationCount || 0 },
    ];
  }, [careerStats]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Title>Explore Careers</Title>
        <Paragraph className="text-lg text-gray-500 max-w-3xl mx-auto">
          Discover various career paths, their requirements, and opportunities.
          Find the perfect career that matches your interests, skills, and
          academic performance.
        </Paragraph>

        {isAuthenticated && (
          <div className="mt-4 flex justify-center">
            <Switch
              checked={showRecommended}
              onChange={(checked) => {
                setShowRecommended(checked);
                setCurrentPage(1);
              }}
              className="mr-2"
            />
            <Text>Show personalized recommendations based on your profile</Text>
          </div>
        )}
      </motion.div>

      {/* Search and Filters */}
      <Card className="mb-8 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Search
                placeholder="Search careers by title, skills, or keywords..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                placeholder="Category"
                style={{ minWidth: 120 }}
                onChange={handleCategoryChange}
                value={category || undefined}
                allowClear
              >
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Market Demand"
                style={{ minWidth: 140 }}
                onChange={handleDemandChange}
                value={marketDemand || undefined}
                allowClear
              >
                <Option value="Very High">Very High</Option>
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
              <Select
                placeholder="Sort By"
                style={{ minWidth: 120 }}
                onChange={handleSortChange}
                value={sortBy}
                defaultValue="title"
              >
                <Option value="title">Name (A-Z)</Option>
                <Option value="-title">Name (Z-A)</Option>
                <Option value="-views">Most Viewed</Option>
                <Option value="-saves">Most Saved</Option>
                <Option value="minimumMeanGrade">Min. Grade (Low-High)</Option>
                <Option value="-minimumMeanGrade">Min. Grade (High-Low)</Option>
                <Option value="-rating">Highest Rated</Option>
                <Option value="salaryRange.min">Salary (Low-High)</Option>
                <Option value="-salaryRange.max">Salary (High-Low)</Option>
              </Select>
              <Button
                type={advancedFiltersVisible ? 'primary' : 'default'}
                icon={<FilterOutlined />}
                onClick={() =>
                  setAdvancedFiltersVisible(!advancedFiltersVisible)
                }
              >
                Advanced
              </Button>
            </div>
          </div>

          {/* Advanced filters */}
          {advancedFiltersVisible && (
            <div className="pt-4 border-t">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Salary Range</Text>
                    <Slider
                      range
                      min={0}
                      max={500000}
                      step={10000}
                      value={salaryRange}
                      onChange={(value) => setSalaryRange(value)}
                      tipFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <div className="flex justify-between">
                      <Text type="secondary">
                        ${salaryRange[0].toLocaleString()}
                      </Text>
                      <Text type="secondary">
                        ${salaryRange[1].toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Years of Education</Text>
                    <Slider
                      range
                      min={0}
                      max={10}
                      value={yearsOfEducation}
                      onChange={(value) => setYearsOfEducation(value)}
                      marks={{
                        0: '0',
                        4: '4',
                        8: '8',
                        10: '10+',
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <div className="mt-4 flex justify-between">
                <div>
                  <Text strong className="mr-2">
                    View:
                  </Text>
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="grid">
                      <div className="flex items-center">
                        <i className="grid-icon mr-1"></i> Grid
                      </div>
                    </Radio.Button>
                    <Radio.Button value="list">
                      <div className="flex items-center">
                        <i className="list-icon mr-1"></i> List
                      </div>
                    </Radio.Button>
                  </Radio.Group>
                </div>

                <div>
                  <Popover
                    content={
                      <div className="flex flex-col gap-2">
                        <Radio.Group
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                        >
                          <Radio value="pdf">PDF</Radio>
                          <Radio value="csv">CSV</Radio>
                        </Radio.Group>
                        {exportFormat === 'pdf' ? (
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            loading={isExporting}
                          >
                            Export as PDF
                          </Button>
                        ) : (
                          <CSVLink
                            data={csvData}
                            filename="careers-list.csv"
                            className="ant-btn ant-btn-primary"
                          >
                            <DownloadOutlined /> Export as CSV
                          </CSVLink>
                        )}
                      </div>
                    }
                    title="Export Options"
                    trigger="click"
                  >
                    <Button icon={<DownloadOutlined />}>Export</Button>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Links */}
      <div className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link to="/trends">
              <Card
                hoverable
                className="text-center h-full transition-all hover:shadow-lg"
              >
                <RiseOutlined className="text-3xl text-blue-500 mb-2" />
                <Title level={4}>Career Trends</Title>
                <Text type="secondary">
                  Explore emerging and high-demand careers
                </Text>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link to="/guides">
              <Card
                hoverable
                className="text-center h-full transition-all hover:shadow-lg"
              >
                <BookOutlined className="text-3xl text-green-500 mb-2" />
                <Title level={4}>Career Guides</Title>
                <Text type="secondary">
                  In-depth guides to help you make informed decisions
                </Text>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link to="/institutions">
              <Card
                hoverable
                className="text-center h-full transition-all hover:shadow-lg"
              >
                <BarChartOutlined className="text-3xl text-purple-500 mb-2" />
                <Title level={4}>Institutions</Title>
                <Text type="secondary">
                  Find universities and colleges offering your desired program
                </Text>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Career Stats */}
      {careerStats && (
        <Card className="mb-8">
          <Title level={4}>Career Distribution by Category</Title>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Career Listings */}
      <div className="mb-8" ref={careerListRef}>
        <Divider>
          <Space>
            <FilterOutlined />
            <span>Career Listings</span>
            {careersData?.total > 0 && (
              <Badge count={careersData.total} overflowCount={999} />
            )}
          </Space>
        </Divider>

        {isLoading ? (
          <div className="py-12">
            {viewMode === 'grid' ? (
              <Row gutter={[16, 16]}>
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Card>
                        <Skeleton active avatar paragraph={{ rows: 4 }} />
                      </Card>
                    </Col>
                  ))}
              </Row>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={Array(6).fill(null)}
                renderItem={(_, index) => (
                  <List.Item>
                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                  </List.Item>
                )}
              />
            )}
          </div>
        ) : isError ? (
          <Alert
            type="error"
            message="Error loading careers"
            description="There was a problem fetching the career data. Please try again later."
            className="mb-4"
          />
        ) : sortedCareers.length === 0 ? (
          <Empty
            description={
              <div>
                <p>No careers found matching your criteria</p>
                <Button
                  type="primary"
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('');
                    setMarketDemand('');
                    setSalaryRange([0, 500000]);
                    setYearsOfEducation([0, 10]);
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            }
          />
        ) : (
          <>
            {compareList.length > 0 && (
              <div className="mb-4 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <Text strong>
                    {compareList.length} careers selected for comparison
                  </Text>
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() => setCompareDrawerVisible(true)}
                    disabled={compareList.length < 2}
                  >
                    Compare Careers
                  </Button>
                  <Button className="ml-2" onClick={() => setCompareList([])}>
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {viewMode === 'grid' ? (
              <Row gutter={[16, 16]}>
                {sortedCareers.map((career) => (
                  <Col xs={24} sm={12} lg={8} key={career._id}>
                    <CareerCard
                      career={career}
                      savedCareers={savedCareers}
                      pinnedCareers={pinnedCareers}
                      handleSaveToggle={handleSaveToggle}
                      handlePinToggle={handlePinToggle}
                      handleRateCareer={handleRateCareer}
                      isAuthenticated={isAuthenticated}
                      handleShare={handleShare}
                      handleViewDetails={handleViewDetails}
                      userRatings={userRatings}
                      viewMode={viewMode}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={sortedCareers}
                renderItem={(career) => (
                  <CareerCard
                    career={career}
                    savedCareers={savedCareers}
                    pinnedCareers={pinnedCareers}
                    handleSaveToggle={handleSaveToggle}
                    handlePinToggle={handlePinToggle}
                    handleRateCareer={handleRateCareer}
                    isAuthenticated={isAuthenticated}
                    handleShare={handleShare}
                    handleViewDetails={handleViewDetails}
                    userRatings={userRatings}
                    viewMode={viewMode}
                  />
                )}
              />
            )}

            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={careersData?.total || 0}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} careers`}
              />
            </div>
          </>
        )}
      </div>

      {/* Career Categories Section */}
      <div className="mb-12">
        <Title level={2} className="mb-6 text-center">
          Career Categories
        </Title>
        <Row gutter={[16, 16]}>
          {categories.slice(0, 8).map((category) => (
            <Col xs={24} sm={12} md={6} key={category}>
              <Card
                hoverable
                className="text-center transition-all hover:shadow-lg"
                onClick={() => {
                  setCategory(category);
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Title level={4}>{category}</Title>
                <Paragraph className="text-gray-500">
                  Explore careers in the {category.toLowerCase()} sector
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Need Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
        <Title level={3}>Not Sure Where to Start?</Title>
        <Paragraph className="mb-4">
          Take our career assessment to get personalized recommendations based
          on your academic performance, interests, and skills.
        </Paragraph>
        <Space>
          <Link to="/input-results">
            <Button type="primary" size="large">
              Get Career Recommendations
            </Button>
          </Link>
          <Link to="/career-quiz">
            <Button size="large">Take Career Quiz</Button>
          </Link>
        </Space>
      </div>

      {/* Career Details Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>{currentCareerDetails?.title}</span>
            {isAuthenticated && currentCareerDetails && (
              <Button
                type="text"
                icon={
                  compareList.some(
                    (c) => c._id === currentCareerDetails._id
                  ) ? (
                    <CheckCircleOutlined className="text-green-500" />
                  ) : (
                    <PlusOutlined />
                  )
                }
                onClick={() => handleCompareToggle(currentCareerDetails)}
              >
                {compareList.some((c) => c._id === currentCareerDetails._id)
                  ? 'Added to Compare'
                  : 'Add to Compare'}
              </Button>
            )}
          </div>
        }
        placement="right"
        width={600}
        onClose={() => setCareerDetailsDrawerVisible(false)}
        open={careerDetailsDrawerVisible}
        extra={
          <Space>
            {isAuthenticated && currentCareerDetails && (
              <Button
                type="text"
                icon={
                  savedCareers.includes(currentCareerDetails._id) ? (
                    <HeartFilled className="text-red-500" />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={() => handleSaveToggle(currentCareerDetails._id)}
              >
                {savedCareers.includes(currentCareerDetails._id)
                  ? 'Saved'
                  : 'Save'}
              </Button>
            )}
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={() => {
                if (currentCareerDetails) {
                  handleShare(currentCareerDetails);
                }
              }}
            >
              Share
            </Button>
          </Space>
        }
      >
        {currentCareerDetails ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <Tag color="blue">{currentCareerDetails.category}</Tag>
              {currentCareerDetails.marketDemand && (
                <Tag
                  color={
                    currentCareerDetails.marketDemand === 'Very High'
                      ? 'red'
                      : currentCareerDetails.marketDemand === 'High'
                      ? 'orange'
                      : currentCareerDetails.marketDemand === 'Medium'
                      ? 'green'
                      : 'default'
                  }
                >
                  {currentCareerDetails.marketDemand} Demand
                </Tag>
              )}
            </div>

            <Paragraph>{currentCareerDetails.description}</Paragraph>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <div className="space-y-4">
                  {currentCareerDetails.minimumMeanGrade && (
                    <div>
                      <Text strong>Minimum Grade Required:</Text>
                      <div className="mt-1">
                        <Tag color="purple">
                          {currentCareerDetails.minimumMeanGrade}
                        </Tag>
                      </div>
                    </div>
                  )}

                  {currentCareerDetails.salaryRange && (
                    <div>
                      <Text strong>Salary Range:</Text>
                      <div className="mt-1">
                        <Tag color="green">
                          $
                          {currentCareerDetails.salaryRange.min?.toLocaleString()}{' '}
                          - $
                          {currentCareerDetails.salaryRange.max?.toLocaleString()}
                        </Tag>
                      </div>
                    </div>
                  )}

                  {currentCareerDetails.yearsOfEducation && (
                    <div>
                      <Text strong>Years of Education:</Text>
                      <div className="mt-1">
                        <Tag color="blue">
                          {currentCareerDetails.yearsOfEducation} years
                        </Tag>
                      </div>
                    </div>
                  )}

                  {currentCareerDetails.keySubjects &&
                    currentCareerDetails.keySubjects.length > 0 && (
                      <div>
                        <Text strong>Key Subjects:</Text>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {currentCareerDetails.keySubjects.map(
                            (subject, index) => (
                              <Tag key={index}>{subject}</Tag>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </TabPane>

              <TabPane tab="Requirements" key="2">
                <Collapse defaultActiveKey={['1']}>
                  <Panel header="Education Requirements" key="1">
                    <ul className="list-disc pl-5">
                      <li>
                        Minimum Grade:{' '}
                        {currentCareerDetails.minimumMeanGrade ||
                          'Not specified'}
                      </li>
                      <li>
                        Years of Education:{' '}
                        {currentCareerDetails.yearsOfEducation ||
                          'Not specified'}
                      </li>
                      <li>
                        Degree Level:{' '}
                        {currentCareerDetails.degreeLevel ||
                          "Bachelor's degree or equivalent"}
                      </li>
                    </ul>
                  </Panel>
                  <Panel header="Skills Required" key="2">
                    <ul className="list-disc pl-5">
                      {currentCareerDetails.skills ? (
                        currentCareerDetails.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))
                      ) : (
                        <li>Skills information not available</li>
                      )}
                    </ul>
                  </Panel>
                  <Panel header="Certifications" key="3">
                    <ul className="list-disc pl-5">
                      {currentCareerDetails.certifications ? (
                        currentCareerDetails.certifications.map(
                          (cert, index) => <li key={index}>{cert}</li>
                        )
                      ) : (
                        <li>Certification information not available</li>
                      )}
                    </ul>
                  </Panel>
                </Collapse>
              </TabPane>

              <TabPane tab="Job Outlook" key="3">
                <div className="space-y-4">
                  <div>
                    <Text strong>Market Demand:</Text>
                    <Progress
                      percent={
                        currentCareerDetails.marketDemand === 'Very High'
                          ? 90
                          : currentCareerDetails.marketDemand === 'High'
                          ? 75
                          : currentCareerDetails.marketDemand === 'Medium'
                          ? 50
                          : currentCareerDetails.marketDemand === 'Low'
                          ? 25
                          : 0
                      }
                      status="active"
                    />
                  </div>

                  <div>
                    <Text strong>Growth Rate:</Text>
                    <div className="mt-1">
                      {currentCareerDetails.growthRate ? (
                        <Tag
                          color={
                            currentCareerDetails.growthRate > 10
                              ? 'green'
                              : currentCareerDetails.growthRate > 0
                              ? 'blue'
                              : 'red'
                          }
                        >
                          {currentCareerDetails.growthRate}% per year
                        </Tag>
                      ) : (
                        <Text type="secondary">
                          Growth rate information not available
                        </Text>
                      )}
                    </div>
                  </div>

                  <div>
                    <Text strong>Job Satisfaction:</Text>
                    <div className="mt-1">
                      {currentCareerDetails.jobSatisfaction ? (
                        <div className="flex">
                          {Array(5)
                            .fill(null)
                            .map((_, index) => (
                              <StarFilled
                                key={index}
                                className={
                                  index <
                                  Math.round(
                                    currentCareerDetails.jobSatisfaction
                                  )
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          <Text className="ml-2">
                            ({currentCareerDetails.jobSatisfaction}/5)
                          </Text>
                        </div>
                      ) : (
                        <Text type="secondary">
                          Job satisfaction information not available
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>

            {/* Related Careers */}
            {relatedCareers && relatedCareers.length > 0 && (
              <div className="mt-6">
                <Divider>Related Careers</Divider>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={relatedCareers}
                  renderItem={(career) => (
                    <List.Item>
                      <Card
                        hoverable
                        size="small"
                        onClick={() => {
                          setCurrentCareerDetails(career);
                          // Scroll to top of drawer
                          const drawerBody =
                            document.querySelector('.ant-drawer-body');
                          if (drawerBody) {
                            drawerBody.scrollTop = 0;
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <Text strong>{career.title}</Text>
                          <Tag color="blue">{career.category}</Tag>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        ) : (
          <Skeleton active avatar paragraph={{ rows: 10 }} />
        )}
      </Drawer>

      {/* Compare Drawer */}
      <Drawer
        title="Compare Careers"
        placement="bottom"
        height={600}
        onClose={() => setCompareDrawerVisible(false)}
        open={compareDrawerVisible}
      >
        {compareList.length >= 2 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100">Feature</th>
                  {compareList.map((career) => (
                    <th key={career._id} className="border p-2 bg-gray-100">
                      <div className="flex flex-col items-center">
                        <Text strong>{career.title}</Text>
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() =>
                            setCompareList(
                              compareList.filter((c) => c._id !== career._id)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 bg-gray-50">Category</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2 text-center">
                      <Tag color="blue">{career.category}</Tag>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Market Demand</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2 text-center">
                      <Tag
                        color={
                          career.marketDemand === 'Very High'
                            ? 'red'
                            : career.marketDemand === 'High'
                            ? 'orange'
                            : career.marketDemand === 'Medium'
                            ? 'green'
                            : 'default'
                        }
                      >
                        {career.marketDemand || 'N/A'}
                      </Tag>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Minimum Grade</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2 text-center">
                      <Tag color="purple">
                        {career.minimumMeanGrade || 'N/A'}
                      </Tag>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Salary Range</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2 text-center">
                      {career.salaryRange ? (
                        <Text>
                          ${career.salaryRange.min?.toLocaleString()} - $
                          {career.salaryRange.max?.toLocaleString()}
                        </Text>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Years of Education</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2 text-center">
                      <Text>{career.yearsOfEducation || 'N/A'}</Text>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Key Subjects</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2">
                      {career.keySubjects && career.keySubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {career.keySubjects.map((subject, index) => (
                            <Tag key={index}>{subject}</Tag>
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary" className="text-center block">
                          N/A
                        </Text>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-50">Description</td>
                  {compareList.map((career) => (
                    <td key={career._id} className="border p-2">
                      <Paragraph ellipsis={{ rows: 3 }}>
                        {career.description || 'No description available'}
                      </Paragraph>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            description="Select at least 2 careers to compare"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Drawer>

      {/* Share Modal */}
      <Modal
        title="Share Career"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        {currentShareCareer && (
          <div className="space-y-4">
            <div>
              <Text strong>Share {currentShareCareer.title}</Text>
              <Paragraph type="secondary">
                Share this career opportunity with friends and colleagues
              </Paragraph>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                type="primary"
                shape="circle"
                icon={<i className="facebook-icon" />}
                size="large"
                onClick={() => {
                  // This would be a real share implementation in production
                  notification.success({
                    message: 'Shared on Facebook',
                    description: `${currentShareCareer.title} has been shared on Facebook.`,
                  });
                  setShareModalVisible(false);
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<i className="twitter-icon" />}
                size="large"
                onClick={() => {
                  notification.success({
                    message: 'Shared on Twitter',
                    description: `${currentShareCareer.title} has been shared on Twitter.`,
                  });
                  setShareModalVisible(false);
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<i className="linkedin-icon" />}
                size="large"
                onClick={() => {
                  notification.success({
                    message: 'Shared on LinkedIn',
                    description: `${currentShareCareer.title} has been shared on LinkedIn.`,
                  });
                  setShareModalVisible(false);
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<i className="email-icon" />}
                size="small"
                onClick={() => {
                  notification.success({
                    message: 'Email Share',
                    description: `${currentShareCareer.title} has been shared via email.`,
                  });
                  setShareModalVisible(false);
                }}
              />
            </div>

            <Divider />

            <div>
              <Text strong>Share Link</Text>
              <div className="flex mt-2">
                <Input
                  value={`https://yourwebsite.com/career/${currentShareCareer._id}`}
                  readOnly
                />
                <Button
                  type="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://yourwebsite.com/career/${currentShareCareer._id}`
                    );
                    notification.success({
                      message: 'Link Copied',
                      description: 'Career link has been copied to clipboard.',
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Careers;
