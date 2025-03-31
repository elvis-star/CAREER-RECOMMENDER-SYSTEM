import { Button, Typography, Space, Row, Col } from 'antd';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const NotFound = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '70vh' }}>
      <Col
        xs={22}
        sm={20}
        md={16}
        lg={12}
        xl={10}
        xxl={8}
        style={{ textAlign: 'center' }}
      >
        <img
          src="/placeholder.svg?height=200&width=200"
          alt="404 Not Found"
          style={{ marginBottom: '2rem' }}
        />

        <Title level={1} style={{ fontSize: '4rem', margin: '0' }}>
          404
        </Title>
        <Title level={2} style={{ color: '#0080ff', marginTop: '0.5rem' }}>
          Page Not Found
        </Title>

        <Text
          style={{
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '2rem',
            color: 'rgba(0, 0, 0, 0.65)',
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </Text>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            icon={<Home size={18} />}
            style={{ width: '200px' }}
          >
            <Link to="/">Go to Home</Link>
          </Button>

          <Button
            size="large"
            icon={<ArrowLeft size={18} />}
            style={{ width: '200px' }}
          >
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default NotFound;
