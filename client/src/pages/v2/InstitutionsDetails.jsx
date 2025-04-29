'use client';

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Spin,
  Divider,
  Alert,
  Tabs,
  Tag,
  Avatar,
  Breadcrumb,
  Badge,
  Rate,
  Descriptions,
  Image,
  List,
  Modal,
  Empty,
  Input,
  ConfigProvider,
} from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  BookOutlined,
  DollarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PrinterOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  BuildOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitution } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Fetch institution details
  const {
    data: institutionData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['institution', id],
    queryFn: () => fetchInstitution(id),
  });

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to user preferences
  };

  // Show share modal
  const showShareModal = () => {
    setShareModalVisible(true);
  };

  // Hide share modal
  const handleShareModalCancel = () => {
    setShareModalVisible(false);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Get institution data or fallback
  const institution = institutionData?.data || {
    name: 'University Not Found',
    type: 'Unknown',
    location: { address: 'N/A', city: 'N/A', county: 'N/A' },
    description: 'Institution details could not be loaded.',
  };

  // Render social media links
  const renderSocialLinks = () => {
    const socialMedia = institution.contact?.socialMedia || {};

    return (
      <div className="flex gap-3 mt-2">
        {socialMedia.facebook && (
          <a
            href={socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            <FacebookOutlined />
          </a>
        )}
        {socialMedia.twitter && (
          <a
            href={socialMedia.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors duration-300 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-blue-400 dark:hover:text-white"
          >
            <TwitterOutlined />
          </a>
        )}
        {socialMedia.instagram && (
          <a
            href={socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-colors duration-300 dark:bg-gray-700 dark:text-pink-400 dark:hover:from-pink-500 dark:hover:to-purple-500 dark:hover:text-white"
          >
            <InstagramOutlined />
          </a>
        )}
        {socialMedia.linkedin && (
          <a
            href={socialMedia.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors duration-300 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
          >
            <LinkedinOutlined />
          </a>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spin size="large" />
        <Text className="mt-4 dark:text-gray-300">
          Loading institution details...
        </Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Alert
          type="error"
          message="Error loading institution"
          description="There was a problem fetching the institution details. Please try again later."
          className="w-full max-w-2xl mb-6"
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/institutions')}
        >
          Back to Institutions
        </Button>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? ConfigProvider.darkAlgorithm
          : ConfigProvider.defaultAlgorithm,
      }}
    >
      <div className="transition-colors duration-300">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <Breadcrumb className="mb-2 md:mb-0">
            <Breadcrumb.Item>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to="/institutions"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Institutions
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="dark:text-gray-300">
              {institution.name}
            </Breadcrumb.Item>
          </Breadcrumb>

          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/institutions')}
            className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Back to Institutions
          </Button>
        </div>

        {/* Institution Header */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mb-4 md:mb-0 md:mr-6">
              <Avatar
                src={institution.logo}
                size={100}
                icon={<BankOutlined />}
                className="border-2 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <Title level={2} className="mb-2 dark:text-white">
                  {institution.name}
                </Title>

                <div className="flex justify-center md:justify-end gap-2 mb-4 md:mb-0">
                  <Button
                    type="text"
                    icon={
                      isFavorite ? (
                        <HeartFilled className="text-red-500" />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={toggleFavorite}
                    title={
                      isFavorite ? 'Remove from favorites' : 'Add to favorites'
                    }
                    className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  />
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    onClick={showShareModal}
                    title="Share"
                    className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  />
                  <Button
                    type="text"
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    title="Print"
                    className="print-button dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Tag color="blue">{institution.type}</Tag>
                {institution.featured && (
                  <Badge
                    status="success"
                    text={<span className="dark:text-gray-300">Featured</span>}
                  />
                )}
                {institution.rating && (
                  <div className="flex items-center">
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={institution.rating}
                      className="text-sm"
                    />
                    <Text className="ml-1 dark:text-gray-300">
                      {institution.rating.toFixed(1)}
                    </Text>
                  </div>
                )}
                <Text className="dark:text-gray-400">
                  <EnvironmentOutlined className="mr-1" />{' '}
                  {institution.location?.city}, {institution.location?.county}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Main Information */}
          <Col xs={24} lg={16}>
            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <InfoCircleOutlined className="mr-1" /> Overview
                    </span>
                  }
                  key="overview"
                >
                  <div className="py-4">
                    <Title level={4} className="dark:text-white">
                      About
                    </Title>
                    <Paragraph className="dark:text-gray-300">
                      {institution.description}
                    </Paragraph>

                    <Divider className="dark:border-gray-700" />

                    <Descriptions
                      title={
                        <span className="dark:text-white">
                          Institution Details
                        </span>
                      }
                      bordered
                      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                      className="mb-6 dark:text-gray-300"
                      labelStyle={{
                        color: isDarkMode
                          ? 'rgba(255, 255, 255, 0.85)'
                          : undefined,
                      }}
                      contentStyle={{
                        color: isDarkMode
                          ? 'rgba(255, 255, 255, 0.65)'
                          : undefined,
                      }}
                    >
                      {institution.establishedYear && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <CalendarOutlined className="mr-1" /> Established
                            </span>
                          }
                        >
                          {institution.establishedYear}
                        </Descriptions.Item>
                      )}

                      {institution.website && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <GlobalOutlined className="mr-1" /> Website
                            </span>
                          }
                        >
                          <a
                            href={institution.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {institution.website.replace(/^https?:\/\//, '')}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.location?.address && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <EnvironmentOutlined className="mr-1" /> Address
                            </span>
                          }
                        >
                          {institution.location.address},{' '}
                          {institution.location.city},{' '}
                          {institution.location.county}
                        </Descriptions.Item>
                      )}

                      {institution.contact?.email && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <MailOutlined className="mr-1" /> Email
                            </span>
                          }
                        >
                          <a
                            href={`mailto:${institution.contact.email}`}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {institution.contact.email}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.contact?.phone && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <PhoneOutlined className="mr-1" /> Phone
                            </span>
                          }
                        >
                          <a
                            href={`tel:${institution.contact.phone}`}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {institution.contact.phone}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.rankings && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <TrophyOutlined className="mr-1" /> Rankings
                            </span>
                          }
                          span={2}
                        >
                          {institution.rankings.national && (
                            <div>
                              National: #{institution.rankings.national}
                            </div>
                          )}
                          {institution.rankings.international && (
                            <div>
                              International: #
                              {institution.rankings.international}
                            </div>
                          )}
                          {institution.rankings.year && (
                            <div>Year: {institution.rankings.year}</div>
                          )}
                        </Descriptions.Item>
                      )}
                    </Descriptions>

                    {institution.accreditation &&
                      institution.accreditation.length > 0 && (
                        <div>
                          <Title level={4} className="dark:text-white">
                            Accreditation
                          </Title>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {institution.accreditation.map((item, index) => (
                              <Tag
                                key={index}
                                icon={<CheckCircleOutlined />}
                                color="green"
                                className="mb-2 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                              >
                                {item}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center">
                      <BookOutlined className="mr-1" /> Programs
                    </span>
                  }
                  key="programs"
                >
                  <div className="py-4">
                    <Title level={4} className="dark:text-white">
                      Programs Offered
                    </Title>

                    {institution.programs && institution.programs.length > 0 ? (
                      <List
                        itemLayout="vertical"
                        dataSource={institution.programs}
                        renderItem={(program) => (
                          <List.Item
                            key={program._id || program.name}
                            className="border-b dark:border-gray-700 py-4"
                          >
                            <div>
                              <Title level={4} className="mb-2 dark:text-white">
                                {program.name}
                              </Title>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Tag color="blue">{program.level}</Tag>
                                {program.duration && (
                                  <Tag
                                    icon={<ClockCircleOutlined />}
                                    className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                  >
                                    {program.duration}
                                  </Tag>
                                )}
                              </div>
                            </div>

                            {program.description && (
                              <Paragraph className="mt-3 dark:text-gray-300">
                                {program.description}
                              </Paragraph>
                            )}

                            <div className="mt-4 space-y-4">
                              {program.entryRequirements && (
                                <div>
                                  <Title level={5} className="dark:text-white">
                                    Entry Requirements
                                  </Title>
                                  <ul className="list-disc pl-5 dark:text-gray-300">
                                    {program.entryRequirements.minimumGrade && (
                                      <li>
                                        Minimum Grade:{' '}
                                        {program.entryRequirements.minimumGrade}
                                      </li>
                                    )}

                                    {program.entryRequirements
                                      .specificSubjects &&
                                      program.entryRequirements.specificSubjects
                                        .length > 0 && (
                                        <li>
                                          <div>Required Subjects:</div>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {program.entryRequirements.specificSubjects.map(
                                              (subject, idx) => (
                                                <Tag
                                                  key={idx}
                                                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                                >
                                                  {subject.subject}{' '}
                                                  {subject.grade &&
                                                    `(${subject.grade})`}
                                                </Tag>
                                              )
                                            )}
                                          </div>
                                        </li>
                                      )}

                                    {program.entryRequirements
                                      .additionalRequirements &&
                                      program.entryRequirements
                                        .additionalRequirements.length > 0 && (
                                        <li>
                                          <div>Additional Requirements:</div>
                                          <ul className="list-disc pl-5">
                                            {program.entryRequirements.additionalRequirements.map(
                                              (req, idx) => (
                                                <li key={idx}>{req}</li>
                                              )
                                            )}
                                          </ul>
                                        </li>
                                      )}
                                  </ul>
                                </div>
                              )}

                              {program.tuitionFees && (
                                <div>
                                  <Title
                                    level={5}
                                    className="flex items-center dark:text-white"
                                  >
                                    <DollarOutlined className="mr-1" /> Tuition
                                    Fees
                                  </Title>
                                  <Paragraph className="dark:text-gray-300">
                                    {program.tuitionFees}
                                  </Paragraph>
                                </div>
                              )}

                              {program.careers &&
                                program.careers.length > 0 && (
                                  <div>
                                    <Title
                                      level={5}
                                      className="flex items-center dark:text-white"
                                    >
                                      <TeamOutlined className="mr-1" /> Career
                                      Opportunities
                                    </Title>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {program.careers.map((career, idx) => (
                                        <Tag
                                          key={idx}
                                          className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                        >
                                          {typeof career === 'string'
                                            ? career
                                            : career.name || 'Career Option'}
                                        </Tag>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                              <Button type="primary">Apply Now</Button>
                              <Button className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                Request Information
                              </Button>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty
                        description={
                          <span className="dark:text-gray-300">
                            No program information available
                          </span>
                        }
                      />
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center">
                      <BuildOutlined className="mr-1" /> Facilities
                    </span>
                  }
                  key="facilities"
                >
                  <div className="py-4">
                    <Title level={4} className="dark:text-white">
                      Campus Facilities
                    </Title>

                    {institution.facilities &&
                    institution.facilities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {institution.facilities.map((facility, index) => (
                          <Card
                            key={index}
                            className="text-center dark:bg-gray-700 dark:border-gray-600"
                          >
                            <BuildOutlined className="text-3xl text-blue-500 mb-3" />
                            <div className="font-medium dark:text-gray-200">
                              {facility}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        description={
                          <span className="dark:text-gray-300">
                            No facility information available
                          </span>
                        }
                      />
                    )}

                    {institution.images && institution.images.length > 0 && (
                      <div className="mt-8">
                        <Title level={4} className="dark:text-white">
                          Campus Images
                        </Title>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {institution.images.map((image, index) => (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden h-48 shadow-md"
                            >
                              <Image
                                src={image || '/placeholder.svg'}
                                alt={`${institution.name} campus - ${
                                  index + 1
                                }`}
                                className="w-full h-full object-cover"
                                fallback="/placeholder.svg?height=200&width=300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}>
            {/* Contact Information */}
            <Card
              title={
                <span className="flex items-center dark:text-white">
                  <PhoneOutlined className="mr-2" /> Contact Information
                </span>
              }
              className="mb-6 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="space-y-4">
                {institution.contact?.email && (
                  <div className="flex">
                    <MailOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Email
                      </div>
                      <a
                        href={`mailto:${institution.contact.email}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {institution.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {institution.contact?.phone && (
                  <div className="flex">
                    <PhoneOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Phone
                      </div>
                      <a
                        href={`tel:${institution.contact.phone}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {institution.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {institution.website && (
                  <div className="flex">
                    <GlobalOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Website
                      </div>
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {institution.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {institution.location?.address && (
                  <div className="flex">
                    <EnvironmentOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Address
                      </div>
                      <div className="dark:text-gray-300">
                        {institution.location.address},{' '}
                        {institution.location.city},{' '}
                        {institution.location.county}
                      </div>
                    </div>
                  </div>
                )}

                {institution.contact?.socialMedia && (
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Social Media
                    </div>
                    {renderSocialLinks()}
                  </div>
                )}
              </div>

              <Divider className="dark:border-gray-700" />

              <div className="space-y-3">
                <Button type="primary" block size="large">
                  Apply Now
                </Button>
                <Button
                  block
                  size="large"
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Request Information
                </Button>
              </div>
            </Card>

            {/* Key Statistics */}
            <Card
              title={
                <span className="flex items-center dark:text-white">
                  <InfoCircleOutlined className="mr-2" /> Key Statistics
                </span>
              }
              className="mb-6 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="space-y-4">
                {institution.establishedYear && (
                  <div className="flex">
                    <CalendarOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Established
                      </div>
                      <div className="font-medium dark:text-gray-300">
                        {institution.establishedYear}
                      </div>
                    </div>
                  </div>
                )}

                {institution.programs && (
                  <div className="flex">
                    <BookOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Programs
                      </div>
                      <div className="font-medium dark:text-gray-300">
                        {institution.programs.length}
                      </div>
                    </div>
                  </div>
                )}

                {institution.rating && (
                  <div className="flex">
                    <StarFilled className="text-lg text-yellow-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Rating
                      </div>
                      <div className="flex items-center">
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={institution.rating}
                          className="text-sm"
                        />
                        <Text className="ml-2 dark:text-gray-300">
                          {institution.rating.toFixed(1)}/5
                        </Text>
                      </div>
                    </div>
                  </div>
                )}

                {institution.views && (
                  <div className="flex">
                    <EyeOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Views
                      </div>
                      <div className="font-medium dark:text-gray-300">
                        {institution.views}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Popular Programs */}
            {institution.programs && institution.programs.length > 0 && (
              <Card
                title={
                  <span className="flex items-center dark:text-white">
                    <BookOutlined className="mr-2" /> Popular Programs
                  </span>
                }
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <List
                  dataSource={institution.programs.slice(0, 5)}
                  renderItem={(program) => (
                    <List.Item
                      key={program._id || program.name}
                      className="border-b dark:border-gray-700"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="font-medium dark:text-gray-300">
                          {program.name}
                        </div>
                        <Tag color="blue">{program.level}</Tag>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Col>
        </Row>

        {/* Share Modal */}
        <Modal
          title="Share Institution"
          open={shareModalVisible}
          onCancel={handleShareModalCancel}
          footer={null}
          className="dark:bg-gray-800 dark:text-white"
        >
          <div className="space-y-3 py-4">
            <Button
              icon={<FacebookOutlined />}
              type="primary"
              className="w-full bg-[#1877F2] hover:bg-[#166FE5]"
            >
              Share on Facebook
            </Button>
            <Button
              icon={<TwitterOutlined />}
              type="primary"
              className="w-full bg-[#1DA1F2] hover:bg-[#1A94DA]"
            >
              Share on Twitter
            </Button>
            <Button
              icon={<LinkedinOutlined />}
              type="primary"
              className="w-full bg-[#0A66C2] hover:bg-[#0958A7]"
            >
              Share on LinkedIn
            </Button>
            <Divider className="dark:border-gray-700" />
            <div>
              <Input
                value={window.location.href}
                readOnly
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                addonAfter={
                  <Button
                    type="text"
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      // In a real app, you would show a notification here
                    }}
                    className="dark:text-gray-300"
                  >
                    Copy
                  </Button>
                }
              />
            </div>
          </div>
        </Modal>

        {/* Add Tailwind CSS */}
        <style jsx>{`
          /* Print styles */
          @media print {
            .fixed,
            .institution-actions,
            .breadcrumb-container,
            .print-button {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default InstitutionDetails;
