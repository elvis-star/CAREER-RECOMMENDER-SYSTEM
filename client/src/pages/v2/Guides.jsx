'use client';

import { useState } from 'react';
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
  Divider,
  Space,
  Tabs,
  Avatar,
  Breadcrumb,
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  ReadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  RightOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

// Mock data for guides (in a real app, this would come from the API)
const guides = [
  {
    id: 1,
    title: 'How to Choose the Right Career Path',
    category: 'Career Planning',
    author: 'Dr. Jane Smith',
    date: '2023-10-15',
    readTime: '8 min read',
    excerpt:
      'Choosing the right career path can be challenging. This guide provides a step-by-step approach to help you make an informed decision based on your interests, skills, and values.',
    featured: true,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 2,
    title: 'Understanding Computer Science Careers',
    category: 'Technology',
    author: 'Prof. Michael Johnson',
    date: '2023-10-10',
    readTime: '12 min read',
    excerpt:
      'Explore the diverse career opportunities in computer science, from software development to artificial intelligence and cybersecurity.',
    featured: true,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 3,
    title: 'Healthcare Careers: A Comprehensive Guide',
    category: 'Healthcare',
    author: 'Dr. Sarah Williams',
    date: '2023-10-05',
    readTime: '15 min read',
    excerpt:
      'Discover the wide range of career options in the healthcare industry, including medical, nursing, and allied health professions.',
    featured: true,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 4,
    title: 'Engineering Careers and Specializations',
    category: 'Engineering',
    author: 'Eng. Robert Chen',
    date: '2023-09-28',
    readTime: '10 min read',
    excerpt:
      'Learn about the different engineering disciplines and how to choose the right specialization based on your interests and strengths.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 5,
    title: 'Business and Management Career Paths',
    category: 'Business',
    author: 'Prof. Emily Davis',
    date: '2023-09-22',
    readTime: '9 min read',
    excerpt:
      'Explore various career paths in business and management, from finance and marketing to entrepreneurship and consulting.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 6,
    title: 'Creative Careers in Arts and Design',
    category: 'Arts',
    author: 'Lisa Thompson',
    date: '2023-09-18',
    readTime: '7 min read',
    excerpt:
      'Discover creative career options in arts and design, including graphic design, animation, fashion design, and more.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 7,
    title: 'Careers in Education and Teaching',
    category: 'Education',
    author: 'Dr. Mark Wilson',
    date: '2023-09-15',
    readTime: '8 min read',
    excerpt:
      'Explore various career opportunities in education, from teaching and administration to educational technology and research.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 8,
    title: 'Legal Careers: Beyond Traditional Law Practice',
    category: 'Law',
    author: 'Atty. Rachel Green',
    date: '2023-09-10',
    readTime: '11 min read',
    excerpt:
      'Discover diverse career paths in the legal field, including traditional law practice, corporate law, legal technology, and more.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 9,
    title: 'Science Careers: Research and Beyond',
    category: 'Science',
    author: 'Dr. Alex Johnson',
    date: '2023-09-05',
    readTime: '13 min read',
    excerpt:
      'Explore career opportunities in various scientific fields, including research, industry applications, and science communication.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 10,
    title: 'Careers in Agriculture and Food Science',
    category: 'Agriculture',
    author: 'Dr. Maria Rodriguez',
    date: '2023-09-01',
    readTime: '9 min read',
    excerpt:
      'Discover career paths in agriculture and food science, from farming and agribusiness to food technology and sustainability.',
    featured: false,
    image: '/placeholder.svg?height=200&width=400',
  },
];

// Mock data for categories
const categories = [
  'Career Planning',
  'Technology',
  'Healthcare',
  'Engineering',
  'Business',
  'Arts',
  'Education',
  'Law',
  'Science',
  'Agriculture',
];

const Guides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter guides based on search term and category
  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? guide.category === selectedCategory
      : true;
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'featured'
        ? guide.featured
        : guide.category.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Render guide card
  const renderGuideCard = (guide) => (
    <Col xs={24} sm={12} lg={8} key={guide.id}>
      <Card
        hoverable
        cover={
          <img
            alt={guide.title}
            src={guide.image || '/placeholder.svg'}
            className="h-48 object-cover"
          />
        }
        className="h-full flex flex-col"
      >
        <div className="flex flex-col h-full">
          <div className="mb-2 flex justify-between items-start">
            <Tag color="blue">{guide.category}</Tag>
            {guide.featured && <Tag color="gold">Featured</Tag>}
          </div>
          <Title level={4} className="mb-2">
            {guide.title}
          </Title>
          <Paragraph
            className="text-gray-500 mb-4 flex-grow"
            ellipsis={{ rows: 3 }}
          >
            {guide.excerpt}
          </Paragraph>
          <div className="mt-auto">
            <Space className="mb-2">
              <Avatar icon={<UserOutlined />} />
              <Text type="secondary">{guide.author}</Text>
            </Space>
            <div className="flex justify-between items-center">
              <Space>
                <CalendarOutlined />
                <Text type="secondary">
                  {new Date(guide.date).toLocaleDateString()}
                </Text>
              </Space>
              <Text type="secondary">{guide.readTime}</Text>
            </div>
            <Divider className="my-3" />
            <Button type="primary" block>
              Read Guide
            </Button>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Resources</Breadcrumb.Item>
        <Breadcrumb.Item>Career Guides</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-12">
        <Title>Career Guides</Title>
        <Paragraph className="text-lg text-gray-500 max-w-3xl mx-auto">
          Explore our comprehensive career guides to help you make informed
          decisions about your future. From choosing the right career path to
          understanding specific industries, we've got you covered.
        </Paragraph>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Search
              placeholder="Search guides..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </div>
          <Select
            placeholder="Filter by Category"
            style={{ minWidth: 200 }}
            onChange={handleCategoryChange}
            value={selectedCategory || undefined}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Featured Guides */}
      <div className="mb-12">
        <Title level={2} className="mb-6">
          <Space>
            <BookOutlined />
            <span>Featured Guides</span>
          </Space>
        </Title>
        <Row gutter={[16, 16]}>
          {guides
            .filter((guide) => guide.featured)
            .slice(0, 3)
            .map(renderGuideCard)}
        </Row>
      </div>

      {/* All Guides */}
      <div className="mb-8">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ReadOutlined /> All Guides
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                <FileTextOutlined /> Featured
              </span>
            }
            key="featured"
          />
          {categories.slice(0, 5).map((category) => (
            <TabPane
              tab={<span>{category}</span>}
              key={category.toLowerCase()}
            />
          ))}
        </Tabs>

        {filteredGuides.length === 0 ? (
          <div className="text-center py-12">
            <Title level={4}>No guides found matching your criteria</Title>
            <Paragraph>Try adjusting your search or filters</Paragraph>
            <Button
              type="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setActiveTab('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <Row gutter={[16, 16]}>{filteredGuides.map(renderGuideCard)}</Row>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <Divider>
          <Title level={3}>Browse by Category</Title>
        </Divider>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={24} sm={12} md={8} lg={6} key={category}>
              <Card
                hoverable
                className="text-center"
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveTab('all');
                }}
              >
                <BookOutlined className="text-2xl text-blue-500 mb-2" />
                <Title level={4}>{category}</Title>
                <Paragraph className="text-gray-500">
                  Explore guides in {category.toLowerCase()}
                </Paragraph>
                <Button type="link" className="mt-2">
                  View Guides <RightOutlined />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Call to Action */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 text-center p-8">
        <Title level={3}>Need Personalized Career Guidance?</Title>
        <Paragraph className="text-lg mb-6">
          Take our career assessment to get personalized recommendations based
          on your academic performance, interests, and skills.
        </Paragraph>
        <Space size="large">
          <Link to="/input-results">
            <Button type="primary" size="large">
              Get Career Recommendations
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large">Contact a Career Counselor</Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default Guides;
