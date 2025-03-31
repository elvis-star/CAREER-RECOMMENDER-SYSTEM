'use client';

import { useState } from 'react';
import {
  Typography,
  Input,
  Button,
  Row,
  Col,
  Card,
  Collapse,
  Space,
  Tag,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  GraduationCap,
  Briefcase,
  School,
  User,
  HelpCircle,
  Lock,
  PenToolIcon as Tool,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // FAQ categories
  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle size={16} /> },
    { id: 'general', name: 'General', icon: <HelpCircle size={16} /> },
    { id: 'account', name: 'Account & Privacy', icon: <Lock size={16} /> },
    {
      id: 'recommendations',
      name: 'Recommendations',
      icon: <GraduationCap size={16} />,
    },
    { id: 'careers', name: 'Careers', icon: <Briefcase size={16} /> },
    { id: 'institutions', name: 'Institutions', icon: <School size={16} /> },
    { id: 'technical', name: 'Technical', icon: <Tool size={16} /> },
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'What is Career Recommender?',
      answer:
        'Career Recommender is an AI-powered platform that helps Kenyan students make informed career decisions based on their KCSE results. Our system analyzes your academic strengths and matches them with suitable career paths, taking into account current job market trends and requirements.',
      category: 'general',
    },
    {
      question: 'Is Career Recommender free to use?',
      answer:
        'Yes, our basic career recommendation service is completely free for all Kenyan students. We also offer premium features for more detailed guidance and personalized counseling at affordable rates.',
      category: 'general',
    },
    {
      question: 'How accurate are the career recommendations?',
      answer:
        'Our recommendations are based on academic performance, current job market trends, and established career path requirements. While we strive for high accuracy, we always recommend consulting with a career counselor for personalized advice.',
      category: 'recommendations',
    },
    {
      question: 'How do I input my KCSE results?',
      answer:
        "After creating an account, navigate to the 'Input Results' page from your dashboard. Enter your grades for each subject, and our system will automatically calculate your mean grade and generate personalized career recommendations.",
      category: 'recommendations',
    },
    {
      question: 'Can I update my KCSE results after submitting them?',
      answer:
        "Yes, you can update your KCSE results at any time from your dashboard. Simply go to the 'Input Results' page and make the necessary changes. Your career recommendations will be updated accordingly.",
      category: 'recommendations',
    },
    {
      question: 'How do I create an account?',
      answer:
        "Click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details, verify your email address, and you're ready to start using Career Recommender.",
      category: 'account',
    },
    {
      question: 'Is my personal information secure?',
      answer:
        'Yes, we take data privacy very seriously. All personal information is encrypted and stored securely. We do not share your data with third parties without your explicit consent. You can review our privacy policy for more details.',
      category: 'account',
    },
    {
      question: 'How do I reset my password?',
      answer:
        "Click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password. If you're still having trouble, please contact our support team.",
      category: 'account',
    },
    {
      question: 'What factors are considered in the career recommendations?',
      answer:
        'Our recommendations consider your subject grades, overall performance, subject combinations, current job market trends in Kenya, future growth projections, and the requirements of various educational institutions.',
      category: 'careers',
    },
    {
      question: 'Can I save careers for later reference?',
      answer:
        'Yes, you can save any career recommendation to your profile for later reference. Simply click the bookmark icon on any career card, and it will be added to your saved careers list, accessible from your dashboard.',
      category: 'careers',
    },
    {
      question: 'How often is the career information updated?',
      answer:
        'We update our career database quarterly to ensure that all information regarding job market trends, salary expectations, and institutional requirements is current and accurate.',
      category: 'careers',
    },
    {
      question: 'Which institutions are included in your database?',
      answer:
        'Our database includes all major universities and colleges in Kenya, as well as selected international institutions that are popular among Kenyan students. Each career profile includes a list of recommended institutions offering relevant programs.',
      category: 'institutions',
    },
    {
      question: 'How can I find specific information about an institution?',
      answer:
        'Each career recommendation includes a list of institutions offering relevant programs. Click on any institution name to view detailed information about admission requirements, program duration, fees, and contact details.',
      category: 'institutions',
    },
    {
      question: 'The website is not loading properly. What should I do?',
      answer:
        "Try clearing your browser cache and cookies, then reload the page. If the issue persists, try using a different browser or device. If you're still experiencing problems, please contact our technical support team.",
      category: 'technical',
    },
    {
      question: 'How do I report a bug or technical issue?',
      answer:
        "You can report bugs or technical issues through the 'Contact Us' page or by sending an email to support@careerrecommender.co.ke. Please include as much detail as possible, including screenshots if applicable.",
      category: 'technical',
    },
  ];

  // Filter FAQ items based on search query and active category
  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Title level={1}>Frequently Asked Questions</Title>
        <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about Career Recommender and how it
          can help you make informed career decisions.
        </Paragraph>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <Input
          size="large"
          placeholder="Search for questions..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <Space wrap className="justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              type={activeCategory === category.id ? 'primary' : 'default'}
              icon={category.icon}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </Space>
      </div>

      {/* FAQ Accordion */}
      {filteredFAQs.length > 0 ? (
        <Collapse className="mb-12" expandIconPosition="end">
          {filteredFAQs.map((faq, index) => {
            const categoryInfo = categories.find(
              (cat) => cat.id === faq.category
            );

            return (
              <Panel
                key={index}
                header={
                  <div className="flex items-center justify-between">
                    <span>{faq.question}</span>
                    <Tag color="blue" className="ml-2">
                      {categoryInfo?.name}
                    </Tag>
                  </div>
                }
              >
                <Paragraph>{faq.answer}</Paragraph>
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <Card className="text-center py-10 mb-12">
          <HelpCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <Title level={4} className="mb-2">
            No Questions Found
          </Title>
          <Paragraph className="mb-6">
            We couldn't find any questions matching your search criteria.
          </Paragraph>
          <Button
            type="primary"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      )}

      {/* Still Have Questions Section */}
      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24} md={8}>
          <Card className="h-full text-center">
            <HelpCircle size={48} className="text-blue-500 mx-auto mb-4" />
            <Title level={4}>Still Have Questions?</Title>
            <Paragraph>
              If you couldn't find the answer you were looking for, feel free to
              contact our support team.
            </Paragraph>
            <Button type="primary" block>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="h-full text-center">
            <User size={48} className="text-green-500 mx-auto mb-4" />
            <Title level={4}>Career Counseling</Title>
            <Paragraph>
              Book a one-on-one session with our career counselors for
              personalized guidance.
            </Paragraph>
            <Button
              type="primary"
              block
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Book a Session
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="h-full text-center">
            <GraduationCap size={48} className="text-purple-500 mx-auto mb-4" />
            <Title level={4}>Resource Center</Title>
            <Paragraph>
              Explore our resource center for guides, articles, and videos about
              career planning.
            </Paragraph>
            <Button
              type="primary"
              block
              style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
            >
              Browse Resources
            </Button>
          </Card>
        </Col>
      </Row>

      {/* CTA Section */}
      <Card className="bg-[#0080ff] text-white text-center">
        <Title level={2} className="text-white">
          Ready to Discover Your Ideal Career?
        </Title>
        <Paragraph className="text-white text-lg mb-6 max-w-3xl mx-auto">
          Input your KCSE results and get personalized career recommendations
          based on your academic strengths.
        </Paragraph>
        <Space>
          <Button
            size="large"
            className="bg-white text-[#0080ff] border-white hover:bg-gray-100"
          >
            <Link to="/register">Get Started</Link>
          </Button>
          <Button size="large" ghost>
            <Link to="/about">Learn More</Link>
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default FAQ;
