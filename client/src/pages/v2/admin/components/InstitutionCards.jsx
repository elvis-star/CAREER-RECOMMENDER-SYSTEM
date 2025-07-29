'use client';
import {
  Row,
  Col,
  Card,
  Tag,
  Badge,
  Tooltip,
  Dropdown,
  Menu,
  Empty,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  StarFilled,
  BuildOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

const InstitutionCards = ({
  institutions,
  onViewDetails,
  onEdit,
  onAddProgram,
  onDuplicate,
  onToggleFeature,
  onDelete,
  onPreview,
}) => {
  const renderInstitutionCard = (institution) => (
    <Col xs={24} sm={12} md={8} lg={6} key={institution._id}>
      <Card
        hoverable
        cover={
          institution.logo ? (
            <img
              alt={institution.name}
              src={institution.logo || '/placeholder.svg'}
              className="h-48 object-cover"
              onClick={() => onPreview(institution.logo)}
            />
          ) : (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <BuildOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
            </div>
          )
        }
        actions={[
          <Tooltip title="View Details" key="view-details">
            <EyeOutlined
              key="view"
              onClick={() => onViewDetails(institution)}
            />
          </Tooltip>,
          <Tooltip title="Edit" key="edit-institution">
            <EditOutlined key="edit" onClick={() => onEdit(institution)} />
          </Tooltip>,
          <Dropdown
            key="more"
            overlay={
              <Menu>
                <Menu.Item
                  key="add-program"
                  icon={<PlusCircleOutlined />}
                  onClick={() => onAddProgram(institution)}
                >
                  Add Program
                </Menu.Item>
                <Menu.Item
                  key="duplicate"
                  icon={<CopyOutlined />}
                  onClick={() => onDuplicate(institution)}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  key="feature"
                  icon={<StarFilled />}
                  onClick={() => onToggleFeature(institution)}
                >
                  {institution.featured ? 'Unfeature' : 'Feature'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(institution)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <EllipsisOutlined />
          </Dropdown>,
        ]}
        className="institution-card"
        extra={
          institution.featured && <StarFilled style={{ color: '#faad14' }} />
        }
      >
        <div className="mb-2">
          <div className="font-medium text-lg mb-1 truncate">
            {institution.name}
          </div>
          <Tag color="default">{institution.type}</Tag>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div>
            <Text type="secondary">Location:</Text>
            <div className="flex items-center">
              <EnvironmentOutlined className="mr-1 text-gray-500" />
              <span className="text-sm">{institution.location?.city}</span>
            </div>
          </div>
          <div>
            <Text type="secondary">Programs:</Text>
            <Badge
              count={institution.programs?.length || 0}
              className="ml-1"
              style={{ backgroundColor: '#1890ff' }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-blue-600">
            {institution.establishedYear &&
              `Est. ${institution.establishedYear}`}
          </div>
          <div className="flex items-center">
            <Tooltip title="Views">
              <div className="flex items-center">
                <EyeOutlined className="mr-1 text-gray-500" />
                <span>{institution.views || 0}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <Row gutter={[16, 16]}>
      {institutions.length > 0 ? (
        institutions.map((institution) => renderInstitutionCard(institution))
      ) : (
        <Col span={24}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No institutions found.</span>}
          />
        </Col>
      )}
    </Row>
  );
};

export default InstitutionCards;
