'use client';
import {
  Table,
  Space,
  Button,
  Tooltip,
  Dropdown,
  Menu,
  Tag,
  Badge,
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
  SortAscendingOutlined,
  SortDescendingOutlined,
  BuildOutlined,
  EnvironmentOutlined,
  BookOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const InstitutionTable = ({
  institutions,
  selectedRowKeys,
  onSelectionChange,
  onSort,
  sortField,
  sortOrder,
  onViewDetails,
  onEdit,
  onAddProgram,
  onDuplicate,
  onToggleFeature,
  onDelete,
  onPreview,
}) => {
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'ascend' ? (
      <SortAscendingOutlined className="ml-1 text-blue-500" />
    ) : (
      <SortDescendingOutlined className="ml-1 text-blue-500" />
    );
  };

  const columns = [
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('name')}
        >
          Institution {renderSortIcon('name')}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.logo ? (
            <div
              className="mr-3 cursor-pointer"
              onClick={() => onPreview(record.logo)}
            >
              <img
                src={record.logo || '/placeholder.svg'}
                alt={text}
                className="w-12 h-12 object-cover rounded-md border border-gray-200"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
              <BuildOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
            </div>
          )}
          <div>
            <div className="font-medium text-blue-600">{text}</div>
            <div className="text-xs text-gray-500 mt-1">
              <Tag color="default">{record.type}</Tag>
            </div>
          </div>
          {record.featured && (
            <Badge
              count={<StarFilled style={{ color: '#faad14' }} />}
              offset={[5, 5]}
            />
          )}
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('location.city')}
        >
          Location {renderSortIcon('location.city')}
        </div>
      ),
      key: 'location',
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            <EnvironmentOutlined className="mr-1 text-gray-500" />
            <span>{record.location?.city}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {record.location?.country || 'Kenya'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('programs')}
        >
          Programs {renderSortIcon('programs')}
        </div>
      ),
      key: 'programs',
      render: (_, record) => (
        <div className="flex items-center">
          <BookOutlined className="mr-1 text-gray-500" />
          <Badge
            count={record.programs?.length || 0}
            showZero
            color="#1890ff"
            overflowCount={99}
          />
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          {record.contact?.email && (
            <div className="flex items-center text-xs">
              <MailOutlined className="mr-1 text-gray-500" />
              <a
                href={`mailto:${record.contact.email}`}
                className="truncate max-w-32"
              >
                {record.contact.email}
              </a>
            </div>
          )}
          {record.contact?.phone && (
            <div className="flex items-center text-xs">
              <PhoneOutlined className="mr-1 text-gray-500" />
              <a href={`tel:${record.contact.phone}`}>{record.contact.phone}</a>
            </div>
          )}
        </div>
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
            className="flex items-center text-blue-600"
          >
            <GlobalOutlined className="mr-1" /> Visit
          </a>
        ) : (
          <span className="text-gray-400">Not available</span>
        ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('featured')}
        >
          Status {renderSortIcon('featured')}
        </div>
      ),
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) =>
        featured ? (
          <Tag color="gold" icon={<StarFilled />} className="px-2 py-1">
            FEATURED
          </Tag>
        ) : (
          <Tag color="default" className="px-2 py-1">
            STANDARD
          </Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Edit Institution">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="add-program"
                  icon={<PlusCircleOutlined />}
                  onClick={() => onAddProgram(record)}
                >
                  Add Program
                </Menu.Item>
                <Menu.Item
                  key="duplicate"
                  icon={<CopyOutlined />}
                  onClick={() => onDuplicate(record)}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  key="feature"
                  icon={<StarFilled />}
                  onClick={() => onToggleFeature(record)}
                >
                  {record.featured ? 'Unfeature' : 'Feature'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
  };

  return (
    <Table
      columns={columns}
      dataSource={institutions}
      rowKey="_id"
      rowSelection={rowSelection}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} institutions`,
      }}
      rowClassName="hover:bg-gray-50"
      scroll={{ x: 'max-content' }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No institutions found.</span>}
          />
        ),
      }}
    />
  );
};

export default InstitutionTable;
