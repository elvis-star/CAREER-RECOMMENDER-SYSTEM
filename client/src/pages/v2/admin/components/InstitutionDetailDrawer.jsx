'use client';

import {
  Drawer,
  Tabs,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  Badge,
  Divider,
  Row,
  Col,
  List,
  Avatar,
  Statistic,
  Progress,
  Empty,
  Collapse,
  Popconfirm,
  Skeleton,
} from 'antd';
import {
  InfoCircleOutlined,
  BookOutlined,
  BarChartOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarFilled,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  BuildOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Bar } from '@ant-design/charts';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const InstitutionDetailDrawer = ({
  visible,
  onClose,
  currentInstitution,
  activeTab,
  onTabChange,
  onEdit,
  onAddProgram,
  onEditProgram,
  deleteProgramMutation,
  institutions,
}) => {
  const renderInstitutionDetailContent = () => {
    if (!currentInstitution) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {currentInstitution.logo ? (
                  <img
                    src={currentInstitution.logo || '/placeholder.svg'}
                    alt={currentInstitution.name}
                    className="w-full rounded-lg shadow-md object-cover"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BuildOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Type:</Text>
                    <Tag color="default">{currentInstitution.type}</Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Location:</Text>
                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-1" />
                      <Text>{currentInstitution.location?.city}</Text>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Programs:</Text>
                    <Badge
                      count={currentInstitution.programs?.length || 0}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </div>

                  {currentInstitution.establishedYear && (
                    <div className="flex justify-between items-center">
                      <Text type="secondary">Established:</Text>
                      <Text>{currentInstitution.establishedYear}</Text>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Status:</Text>
                    {currentInstitution.featured ? (
                      <Tag color="gold" icon={<StarFilled />}>
                        FEATURED
                      </Tag>
                    ) : (
                      <Tag color="default">STANDARD</Tag>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <Title level={4}>{currentInstitution.name}</Title>
                <div className="mb-4">
                  <Paragraph>{currentInstitution.description}</Paragraph>
                </div>

                <Divider orientation="left">Contact Information</Divider>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title="Contact Details">
                      <div className="space-y-2">
                        {currentInstitution.contact?.email && (
                          <div className="flex items-center">
                            <MailOutlined className="mr-2 text-gray-500" />
                            <a
                              href={`mailto:${currentInstitution.contact.email}`}
                            >
                              {currentInstitution.contact.email}
                            </a>
                          </div>
                        )}
                        {currentInstitution.contact?.phone && (
                          <div className="flex items-center">
                            <PhoneOutlined className="mr-2 text-gray-500" />
                            <a href={`tel:${currentInstitution.contact.phone}`}>
                              {currentInstitution.contact.phone}
                            </a>
                          </div>
                        )}
                        {currentInstitution.website && (
                          <div className="flex items-center">
                            <GlobalOutlined className="mr-2 text-gray-500" />
                            <a
                              href={currentInstitution.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card size="small" title="Location">
                      <div className="space-y-1">
                        {currentInstitution.location?.address && (
                          <div>{currentInstitution.location.address}</div>
                        )}
                        <div>
                          {currentInstitution.location?.city},{' '}
                          {currentInstitution.location?.country || 'Kenya'}
                        </div>
                        {currentInstitution.location?.county && (
                          <div className="text-gray-500">
                            {currentInstitution.location.county}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {currentInstitution.facilities &&
                  currentInstitution.facilities.length > 0 && (
                    <>
                      <Divider orientation="left">Facilities</Divider>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentInstitution.facilities.map(
                          (facility, index) => (
                            <Tag key={index} color="blue">
                              {facility}
                            </Tag>
                          )
                        )}
                      </div>
                    </>
                  )}

                {currentInstitution.accreditation &&
                  currentInstitution.accreditation.length > 0 && (
                    <>
                      <Divider orientation="left">Accreditation</Divider>
                      <div className="flex flex-wrap gap-2">
                        {currentInstitution.accreditation.map(
                          (accred, index) => (
                            <Tag key={index} color="purple">
                              {accred}
                            </Tag>
                          )
                        )}
                      </div>
                    </>
                  )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  onClose();
                  onEdit(currentInstitution);
                }}
              >
                Edit Institution
              </Button>
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Title level={4}>Programs Offered</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => onAddProgram(currentInstitution)}
              >
                Add Program
              </Button>
            </div>

            {currentInstitution.programs &&
            currentInstitution.programs.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={currentInstitution.programs}
                renderItem={(program) => (
                  <List.Item
                    key={program._id}
                    actions={[
                      <Button
                        key="edit"
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() =>
                          onEditProgram(currentInstitution, program)
                        }
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        key="delete"
                        title="Delete this program?"
                        description="Are you sure you want to delete this program?"
                        onConfirm={() => {
                          deleteProgramMutation.mutate({
                            institutionId: currentInstitution._id,
                            programId: program._id,
                          });
                        }}
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
                            <ClockCircleOutlined className="mr-1" />
                            {program.duration}
                          </div>
                          {program.tuitionFees && (
                            <div>
                              <DollarOutlined className="mr-1" />
                              {program.tuitionFees}
                            </div>
                          )}
                        </div>
                      }
                    />
                    <div className="mt-2">{program.description}</div>

                    {(program.entryRequirements?.minimumGrade ||
                      program.entryRequirements?.specificSubjects?.length > 0 ||
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

                          {program.entryRequirements?.specificSubjects?.length >
                            0 && (
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
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Views"
                    value={currentInstitution.views || 0}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Programs"
                    value={currentInstitution.programs?.length || 0}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Popularity Rank"
                    value={
                      institutions
                        ? institutions
                            .sort((a, b) => (b.views || 0) - (a.views || 0))
                            .findIndex(
                              (i) => i._id === currentInstitution._id
                            ) + 1
                        : 'N/A'
                    }
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Institution Metrics">
              <div className="h-64">
                <Bar
                  data={[
                    { type: 'Views', value: currentInstitution.views || 0 },
                    {
                      type: 'Programs',
                      value: currentInstitution.programs?.length || 0,
                    },
                  ]}
                  xField="type"
                  yField="value"
                  color={['#1890ff', '#52c41a']}
                  label={{
                    position: 'top',
                    style: {
                      fill: '#000000',
                      opacity: 0.8,
                    },
                  }}
                />
              </div>
            </Card>

            <Card title="Comparison with Type Average">
              {institutions ? (
                <div className="space-y-4">
                  {(() => {
                    // Calculate type averages
                    const sameTypeInstitutions = institutions.filter(
                      (i) => i.type === currentInstitution.type
                    );

                    const avgViews =
                      sameTypeInstitutions.reduce(
                        (sum, i) => sum + (i.views || 0),
                        0
                      ) / sameTypeInstitutions.length;

                    const avgPrograms =
                      sameTypeInstitutions.reduce(
                        (sum, i) => sum + (i.programs?.length || 0),
                        0
                      ) / sameTypeInstitutions.length;

                    return (
                      <>
                        <div>
                          <Text>Views compared to type average:</Text>
                          <div className="flex items-center mt-1">
                            <Progress
                              percent={
                                avgViews
                                  ? Math.round(
                                      ((currentInstitution.views || 0) /
                                        avgViews) *
                                        100
                                    )
                                  : 0
                              }
                              status={
                                (currentInstitution.views || 0) >= avgViews
                                  ? 'success'
                                  : 'exception'
                              }
                            />
                            {(currentInstitution.views || 0) >= avgViews ? (
                              <ArrowUpOutlined className="ml-2 text-green-500" />
                            ) : (
                              <ArrowDownOutlined className="ml-2 text-red-500" />
                            )}
                          </div>
                        </div>

                        <div>
                          <Text>Programs compared to type average:</Text>
                          <div className="flex items-center mt-1">
                            <Progress
                              percent={
                                avgPrograms
                                  ? Math.round(
                                      ((currentInstitution.programs?.length ||
                                        0) /
                                        avgPrograms) *
                                        100
                                    )
                                  : 0
                              }
                              status={
                                (currentInstitution.programs?.length || 0) >=
                                avgPrograms
                                  ? 'success'
                                  : 'exception'
                              }
                            />
                            {(currentInstitution.programs?.length || 0) >=
                            avgPrograms ? (
                              <ArrowUpOutlined className="ml-2 text-green-500" />
                            ) : (
                              <ArrowDownOutlined className="ml-2 text-red-500" />
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <Skeleton active />
              )}
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center">
          <div className="mr-2">
            {currentInstitution?.featured && (
              <StarFilled style={{ color: '#faad14', marginRight: 8 }} />
            )}
            {currentInstitution?.name}
          </div>
        </div>
      }
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            onClick={() => {
              onClose();
              onEdit(currentInstitution);
            }}
          >
            Edit
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        className="institution-detail-tabs"
      >
        <TabPane
          tab={
            <span>
              <InfoCircleOutlined /> Overview
            </span>
          }
          key="overview"
        />
        <TabPane
          tab={
            <span>
              <BookOutlined /> Programs
            </span>
          }
          key="programs"
        />
        <TabPane
          tab={
            <span>
              <BarChartOutlined /> Statistics
            </span>
          }
          key="stats"
        />
      </Tabs>

      {renderInstitutionDetailContent()}
    </Drawer>
  );
};

export default InstitutionDetailDrawer;
