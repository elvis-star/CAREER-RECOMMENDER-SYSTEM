import { Typography, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="mb-6">
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-2">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.link ? (
                <Link to={item.link}>{item.label}</Link>
              ) : (
                item.label
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <Title level={2} className="!mb-0 !text-gray-800 dark:!text-gray-100">
            {title}
          </Title>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {actions && <div className="mt-4 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
