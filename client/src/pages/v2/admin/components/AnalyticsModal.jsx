'use client';

import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Statistic,
  List,
  Avatar,
  Tag,
  Empty,
} from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  BuildOutlined,
  StarFilled,
  AppstoreOutlined,
  BookOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import { jsPDF } from 'jspdf';

const AnalyticsModal = ({
  visible,
  onClose,
  institutionStats,
  onViewInstitutionDetails,
}) => {
  const renderAnalyticsContent = () => {
    return (
      <div className="space-y-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Institutions"
                value={institutionStats.totalInstitutions}
                prefix={<BuildOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Featured Institutions"
                value={institutionStats.featuredInstitutions}
                prefix={<StarFilled style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Institution Types"
                value={Object.keys(institutionStats.typeCounts).length}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Programs"
                value={institutionStats.averagePrograms}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Institution Type Distribution">
              <div className="h-80">
                {Object.keys(institutionStats.typeCounts).length > 0 ? (
                  <Pie
                    data={Object.entries(institutionStats.typeCounts).map(
                      ([type, count]) => ({
                        type: type,
                        value: count,
                      })
                    )}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} ({value})',
                    }}
                    interactions={[{ type: 'element-active' }]}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Location Distribution">
              <div className="h-80">
                {Object.keys(institutionStats.locationDistribution).length >
                0 ? (
                  <Pie
                    data={Object.entries(
                      institutionStats.locationDistribution
                    ).map(([location, count]) => ({
                      type: location,
                      value: count,
                    }))}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} ({value})',
                    }}
                    interactions={[{ type: 'element-active' }]}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Top Institutions by Programs">
              <div className="h-80 overflow-auto">
                {institutionStats.topInstitutions.length > 0 ? (
                  <List
                    dataSource={institutionStats.topInstitutions}
                    renderItem={(institution, index) => (
                      <List.Item
                        key={institution._id}
                        actions={[
                          <Button
                            key="view"
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() =>
                              onViewInstitutionDetails(institution)
                            }
                          >
                            View
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={institution.logo}
                              icon={!institution.logo && <BuildOutlined />}
                            />
                          }
                          title={
                            <div className="flex items-center">
                              <span className="mr-2">{institution.name}</span>
                              {institution.featured && (
                                <StarFilled style={{ color: '#faad14' }} />
                              )}
                            </div>
                          }
                          description={
                            <div className="flex items-center">
                              <Tag color="default">{institution.type}</Tag>
                              <div className="ml-2 flex items-center">
                                <BookOutlined className="mr-1 text-gray-500" />
                                <span>
                                  {institution.programs?.length || 0} programs
                                </span>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Recently Added Institutions">
              <div className="h-80 overflow-auto">
                {institutionStats.recentlyAdded.length > 0 ? (
                  <List
                    dataSource={institutionStats.recentlyAdded}
                    renderItem={(institution, index) => (
                      <List.Item
                        key={institution._id}
                        actions={[
                          <Button
                            key="view"
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() =>
                              onViewInstitutionDetails(institution)
                            }
                          >
                            View
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={institution.logo}
                              icon={!institution.logo && <BuildOutlined />}
                            />
                          }
                          title={
                            <div className="flex items-center">
                              <span className="mr-2">{institution.name}</span>
                              {institution.featured && (
                                <StarFilled style={{ color: '#faad14' }} />
                              )}
                            </div>
                          }
                          description={
                            <div className="flex items-center">
                              <Tag color="default">{institution.type}</Tag>
                              <div className="ml-2 flex items-center">
                                <CalendarOutlined className="mr-1 text-gray-500" />
                                <span>
                                  {new Date(
                                    institution.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <BarChartOutlined className="mr-2 text-blue-500" />
          <span>Institution Analytics Dashboard</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => {
            // Export analytics as PDF
            const doc = new jsPDF('landscape');
            doc.text('Institution Analytics Report', 14, 22);
            doc.save('institution_analytics_report.pdf');
          }}
        >
          Export Report
        </Button>,
      ]}
      width={1000}
      centered
    >
      {renderAnalyticsContent()}
    </Modal>
  );
};

export default AnalyticsModal;
